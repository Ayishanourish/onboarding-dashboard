import { OnboardingData, Property, PropertyStatus, RawProperty, Step, StepDefinition, StepStatus } from "./types";

const KNOWN_STATUSES: StepStatus[] = [
    "complete",
    "in_progress",
    "action_required",
    "not_started",
    "on_hold",
];

function normaliseStatus(raw: string): StepStatus {
    return (KNOWN_STATUSES as string[]).includes(raw)
        ? (raw as StepStatus)
        : "unknown";
}

function deriveStatus(steps: Step[]): PropertyStatus {
    if (steps.length === 0) return "not_started";
    if (steps.some((s) => s.status === "action_required" || s.status === "on_hold" || s.status === "unknown")) return "attention";
    if (steps.every((s) => s.status === "complete")) return "live";
    if (steps.every((s) => s.status === "not_started")) return "not_started";
    return "in_progress";
}

function readableStepLabel(stepId: string) {
    return stepId.replaceAll("-", " ");
}

function buildSteps(
    rawProperty: RawProperty,
    definitions: StepDefinition[],
): Step[] {
    const byId = new Map(rawProperty.steps.map((s) => [s.id, s]));

    // Fill in any step the property is missing as "not_started"
    if (definitions.length > 0) {
        return [...definitions]
            .sort((a, b) => a.order - b.order)
            .map((def) => {
                const match = byId.get(def.id);
                return {
                    id: def.id,
                    label: def.label,
                    order: def.order,
                    status: match ? normaliseStatus(match.status) : "not_started",
                    note: match?.note?.trim() || undefined,
                };
            });
    }

    // No definitions: fall back to whatever the property provides
    return rawProperty.steps.map((s, i) => ({
        id: s.id,
        label: readableStepLabel(s.id),
        order: i + 1,
        status: normaliseStatus(s.status),
        note: s.note?.trim() || undefined,
    }));
}

export function normaliseProperty(
    rawProperty: RawProperty,
    definitions: StepDefinition[],
): Property {
    const steps = buildSteps(rawProperty, definitions);

    return {
        id: rawProperty.id,
        name: rawProperty.name,
        location: rawProperty.location,
        bedrooms: rawProperty.bedrooms,
        image: rawProperty.image?.trim() || "",
        targetGoLiveDate: rawProperty.targetGoLiveDate,
        steps,
        derivedStatus: deriveStatus(steps),
        completedCount: steps.filter((s) => s.status === 'complete').length
    };
}

export function normaliseData(data: OnboardingData): Property[] {
    return data.properties.map((p) =>
        normaliseProperty(p, data.onboardingStepDefinitions),
    );
}
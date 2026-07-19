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
    const rawSteps = Array.isArray(rawProperty.steps) ? rawProperty.steps : [];
    const byId = new Map(rawSteps.map((s) => [s.id, s]));

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
    return rawSteps.map((s, i) => ({
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
        id: rawProperty.id || "",
        name: rawProperty.name?.trim() || "Unnamed property",
        location: rawProperty.location?.trim() || "Unknown location",
        bedrooms: Number.isFinite(rawProperty.bedrooms) && rawProperty.bedrooms >= 0
            ? rawProperty.bedrooms
            : 0,
        image: rawProperty.image?.trim() || "",
        targetGoLiveDate: rawProperty.targetGoLiveDate || "",
        steps,
        derivedStatus: deriveStatus(steps),
        completedCount: steps.filter((s) => s.status === "complete").length,
    };
}

export function normaliseData(data: OnboardingData): Property[] {
    if (!Array.isArray(data?.properties)) return [];
    if (!Array.isArray(data?.onboardingStepDefinitions)) return [];
    return data.properties
        .filter((p) => p && typeof p === "object")
        .map((p) => normaliseProperty(p, data.onboardingStepDefinitions));
}
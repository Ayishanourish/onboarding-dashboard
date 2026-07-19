// Raw data shapes
// Note: `status` is typed as string because the dataset contains
// values outside the documented statusLegend (e.g. "on_hold")

export interface Owner {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  accountManager: string;
}

export interface StepDefinition {
  id: string;
  label: string;
  order: number;
}

export interface RawStep {
  id: string;
  status: string;
  note?: string;
}

export interface RawProperty {
  id: string;
  name: string;
  location: string;
  bedrooms: number;
  image: string;
  targetGoLiveDate: string;
  steps: RawStep[];
}

export interface OnboardingData {
  owner: Owner;
  onboardingStepDefinitions: StepDefinition[];
  statusLegend: Record<string, string>;
  properties: RawProperty[];
}

// Types for UI

export type StepStatus =
  | "complete"
  | "in_progress"
  | "action_required"
  | "not_started"
  | "on_hold"
  | "unknown";

export interface Step {
  id: string;
  label: string; // fallback to human readable
  order: number;
  status: StepStatus;
  note?: string;
}

export type PropertyStatus =
  | "live"
  | "attention"
  | "in_progress"
  | "not_started";

export interface Property {
  id: string;
  name: string;
  location: string;
  bedrooms: number;
  image: string;
  targetGoLiveDate: string;
  steps: Step[];
  derivedStatus: PropertyStatus;
  completedCount: number;
}

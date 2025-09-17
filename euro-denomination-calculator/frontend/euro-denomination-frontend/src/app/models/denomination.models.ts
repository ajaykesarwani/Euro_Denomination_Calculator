export interface DenominationResult {
  amount: number;
  breakdown: { [key: string]: number };
  previousAmount?: number;
  changes?: { [key: string]: number };
}

export interface CalculationRequest {
  amount: number;
  previousAmount?: number | null;
}

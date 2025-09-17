import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DenominationResult, CalculationRequest } from '../models/denomination.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DenominationService {
  //private readonly apiUrl = 'http://localhost:8080/api/calculate';
  private readonly apiUrl = `${environment.apiUrl}/calculate`;

  constructor(private http: HttpClient) {}

  //Sends calculation request to backend API
  calculateBackend(request: CalculationRequest): Observable<DenominationResult> {
    return this.http.post<DenominationResult>(this.apiUrl, request);
  }

  //Performs calculation on the frontend
  calculateFrontend(amount: number, previousAmount: number | null): DenominationResult {
    const breakdown = this.calculateDenominations(amount);
    const changes = previousAmount !== null ?
      this.calculateChanges(breakdown, this.calculateDenominations(previousAmount)) : undefined;

    return { amount, breakdown, changes };
  }

  //Calculates the denomination breakdown for a given amount
  public calculateDenominations(amount: number): { [key: string]: number } {
    // Convert to cents to avoid floating point issues
    let remaining = Math.round(amount * 100);
    const result: { [key: string]: number } = {};
    const denominations = [200, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01];

    // Initialize all denominations with zero count
    denominations.forEach(denom => {
      result[denom.toFixed(2)] = 0;
    });

    // Calculate counts for each denomination
    for (const denom of denominations) {
      const value = Math.round(denom * 100);
      if (remaining >= value) {
        const count = Math.floor(remaining / value);
        result[denom.toFixed(2)] = count;
        remaining -= count * value;
      }
    }

    return result;
  }

  //Calculates the differences between new and old denomination breakdowns
  private calculateChanges(current: { [key: string]: number }, previous: { [key: string]: number }): { [key: string]: number } {
    const changes: { [key: string]: number } = {};
    const allKeys = new Set([...Object.keys(current), ...Object.keys(previous)]);

    // Calculate difference for each denomination
    for (const key of allKeys) {
      changes[key] = (current[key] || 0) - (previous[key] || 0);
    }

    return changes;
  }
}

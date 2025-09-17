import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DenominationResult } from '../../models/denomination.models';
import { DenominationService } from '../../services/denomination.service';

@Component({
  selector: 'app-denomination-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './denomination-calculator.component.html',
  styleUrls: ['./denomination-calculator.component.css']
})
export class DenominationCalculatorComponent {
  @Input() loading: boolean = false;
  @Input() result: DenominationResult | null = null;
  @Input() oldAmount: number | null = null;

  @Output() calculate = new EventEmitter<{ amount: number, useBackend: boolean }>();

  amount: number = 0;
  useBackend: boolean = false;

  readonly denominations = [200, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01];

  constructor(private denominationService: DenominationService) {}

  //calculate event if amount is valid
  onCalculate() {
    if (this.amount > 0) {
      this.calculate.emit({ amount: this.amount, useBackend: this.useBackend });
    }
  }

  //Formats change value with sign for display
  formatChange(change: number): string {
    if (change > 0) return `+${change}`;
    if (change < 0) return change.toString();
    return '0';
  }

  //Gets denomination keys from result, sorted in descending order
  getDenominationKeys(includeZeros: boolean = false): string[] {
    if (!this.result || !this.result.breakdown) return [];

    let keys = Object.keys(this.result.breakdown);
    if (!includeZeros) {
      keys = keys.filter(denom => this.result!.breakdown[denom] !== 0);
    }

    return keys.sort((a, b) => parseFloat(b) - parseFloat(a));
  }

  //Gets denomination keys that have changes compared to previous amount
  getChangedDenominationKeys(): string[] {
    // Return empty array if no result, changes, or breakdown
    if (!this.result || !this.result.breakdown) return [];

    // If changes is undefined or empty, return empty array
    if (!this.result.changes || Object.keys(this.result.changes).length === 0) {
      return [];
    }

    const previousBreakdown = this.calculatePreviousBreakdown();

    return Object.keys(this.result.changes)
      .filter(denom => {
        const currentCount = this.result!.breakdown[denom] || 0;
        const previousCount = previousBreakdown[denom] || 0;

        return currentCount > 0 || previousCount > 0;
      })
      .sort((a, b) => parseFloat(b) - parseFloat(a));
  }

  //Calculates the breakdown for the previous amount
  private calculatePreviousBreakdown(): { [key: string]: number } {
    if (!this.oldAmount) return {};

    return this.denominationService.calculateDenominations(this.oldAmount);
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DenominationCalculatorComponent } from './components/denomination-calculator/denomination-calculator.component';
import { DenominationService } from './services/denomination.service';
import { DenominationResult } from './models/denomination.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DenominationCalculatorComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'euro-denomination-frontend';
  result: DenominationResult | null = null;
  oldAmount: number | null = null;
  previousAmount: number | null = null;
  loading: boolean = false;

  constructor(private denominationService: DenominationService) {}

  //Handles calculate event from child component
  onCalculate(event: { amount: number, useBackend: boolean }) {
    this.loading = true;
    this.oldAmount = this.previousAmount;

    if (event.useBackend) {
      // Use backend API for calculation
      this.denominationService.calculateBackend({
        amount: event.amount,
        previousAmount: this.previousAmount
      }).subscribe({
        next: (result: DenominationResult) => {
          this.handleResult(result, event.amount);
        },
        error: () => {
          this.loading = false;
          alert('Backend calculation failed. Check if server is running.');
        }
      });
    } else {
      // Use frontend calculation with delay
      setTimeout(() => {
        const result = this.denominationService.calculateFrontend(event.amount, this.previousAmount);
        this.handleResult(result, event.amount);
      }, 100);
    }
  }

  //Handles calculation result
  private handleResult(result: DenominationResult, amount: number) {
    this.result = result;
    this.previousAmount = amount;
    this.loading = false;
  }
}

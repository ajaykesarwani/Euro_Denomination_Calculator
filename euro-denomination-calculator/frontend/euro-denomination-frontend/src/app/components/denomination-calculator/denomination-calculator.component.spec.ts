import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DenominationCalculatorComponent } from './denomination-calculator.component';
import { DenominationService } from '../../services/denomination.service';
import { DenominationResult } from '../../models/denomination.models';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

/**
 * Unit tests for DenominationCalculatorComponent
 * Tests the currency denomination display and calculation component
 */
describe('DenominationCalculatorComponent', () => {
  let component: DenominationCalculatorComponent;
  let fixture: ComponentFixture<DenominationCalculatorComponent>;
  let mockDenominationService: jasmine.SpyObj<DenominationService>;

  beforeEach(async () => {
    mockDenominationService = jasmine.createSpyObj('DenominationService', ['calculateDenominations']);

    await TestBed.configureTestingModule({
      imports: [DenominationCalculatorComponent],
      providers: [
        { provide: DenominationService, useValue: mockDenominationService },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DenominationCalculatorComponent);
    component = fixture.componentInstance;
  });

  // Tests for core component functionality
  describe('Basic Component Functionality', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  // Tests for real-world currency calculation scenarios
  describe('Real-world Currency Calculations', () => {
    it('should show relevant denominations for 234.23€ vs 45.32€', () => {
      // Mock the previous amount breakdown (45.32€)
      mockDenominationService.calculateDenominations.and.returnValue({
        '200.00': 0, '100.00': 0, '50.00': 0, '20.00': 2, '10.00': 0,
        '5.00': 1, '2.00': 0, '1.00': 0, '0.50': 0, '0.20': 1,
        '0.10': 1, '0.05': 0, '0.02': 1, '0.01': 0
      });

      component.result = {
        amount: 234.23,
        breakdown: {
          '200.00': 1, '100.00': 0, '50.00': 0, '20.00': 1, '10.00': 1,
          '5.00': 0, '2.00': 2, '1.00': 0, '0.50': 0, '0.20': 1,
          '0.10': 0, '0.05': 0, '0.02': 1, '0.01': 1
        },
        changes: {
          '200.00': 1, '100.00': 0, '50.00': 0, '20.00': -1, '10.00': 1,
          '5.00': -1, '2.00': 2, '1.00': 0, '0.50': 0, '0.20': 0,
          '0.10': -1, '0.05': 0, '0.02': 0, '0.01': 1
        }
      } as DenominationResult;

      component.oldAmount = 45.32;

      const result = component.getChangedDenominationKeys();

      // Should include all denominations that were used in either calculation
      expect(result).toContain('200.00'); // Used in current
      expect(result).toContain('20.00');  // Used in both
      expect(result).toContain('10.00');  // Used in current
      expect(result).toContain('5.00');   // Used in previous
      expect(result).toContain('2.00');   // Used in current
      expect(result).toContain('0.20');   // Used in both
      expect(result).toContain('0.10');   // Used in previous
      expect(result).toContain('0.02');   // Used in both
      expect(result).toContain('0.01');   // Used in current

      // Should NOT include denominations never used
      expect(result).not.toContain('100.00');
      expect(result).not.toContain('50.00');
      expect(result).not.toContain('1.00');
      expect(result).not.toContain('0.50');
      expect(result).not.toContain('0.05');

      // Should be sorted in descending order
      expect(result[0]).toBe('200.00');
      expect(result[result.length - 1]).toBe('0.01');
    });
  });

  // Tests for output formatting logic
  describe('Output Formatting', () => {
    describe('formatChange', () => {
      it('should format positive changes with + sign', () => {
        expect(component.formatChange(5)).toBe('+5');
      });

      it('should format negative changes normally', () => {
        expect(component.formatChange(-3)).toBe('-3');
      });

      it('should format zero as 0', () => {
        expect(component.formatChange(0)).toBe('0');
      });
    });
  });

  // Tests for user input handling
  describe('User Input Handling', () => {
    describe('onCalculate', () => {
      it('should emit calculate event when amount is positive', () => {
        const emitSpy = spyOn(component.calculate, 'emit');
        component.amount = 100;
        component.onCalculate();
        expect(emitSpy).toHaveBeenCalledWith({ amount: 100, useBackend: false });
      });

      it('should not emit calculate event when amount is zero', () => {
        const emitSpy = spyOn(component.calculate, 'emit');
        component.amount = 0;
        component.onCalculate();
        expect(emitSpy).not.toHaveBeenCalled();
      });

      it('should not emit calculate event when amount is negative', () => {
        const emitSpy = spyOn(component.calculate, 'emit');
        component.amount = -10;
        component.onCalculate();
        expect(emitSpy).not.toHaveBeenCalled();
      });
    });
  });

  // Tests for data retrieval methods
  describe('Data Retrieval Methods', () => {
    describe('getDenominationKeys', () => {
      it('should return empty array when no result', () => {
        component.result = null;
        expect(component.getDenominationKeys()).toEqual([]);
      });

      it('should return empty array when no breakdown', () => {
        component.result = { amount: 100, breakdown: {} } as DenominationResult;
        expect(component.getDenominationKeys()).toEqual([]);
      });

      it('should include zeros when includeZeros is true', () => {
        component.result = {
          amount: 100,
          breakdown: { '100.00': 1, '50.00': 0, '20.00': 0 }
        } as DenominationResult;
        const result = component.getDenominationKeys(true);
        expect(result).toContain('100.00');
        expect(result).toContain('50.00');
        expect(result).toContain('20.00');
        expect(result.length).toBe(3);
      });

      it('should exclude zeros when includeZeros is false', () => {
        component.result = {
          amount: 100,
          breakdown: { '100.00': 1, '50.00': 0, '20.00': 0 }
        } as DenominationResult;
        const result = component.getDenominationKeys();
        expect(result).toContain('100.00');
        expect(result).not.toContain('50.00');
        expect(result).not.toContain('20.00');
        expect(result.length).toBe(1);
      });
    });
  });

  // Tests for edge cases and error conditions
  describe('Edge Cases and Error Handling', () => {
    it('should handle case with no old amount', () => {
      component.result = {
        amount: 234.23,
        breakdown: { '200.00': 1, '20.00': 1, '10.00': 1, '2.00': 2, '0.20': 1, '0.02': 1, '0.01': 1 },
        changes: {} // Empty changes when no old amount
      } as DenominationResult;
      component.oldAmount = null;
      const result = component.getChangedDenominationKeys();
      expect(result).toEqual([]);
    });

    it('should handle case with old amount but no changes property', () => {
      component.result = {
        amount: 234.23,
        breakdown: { '200.00': 1, '20.00': 1, '10.00': 1, '2.00': 2, '0.20': 1, '0.02': 1, '0.01': 1 }
        // No changes property at all
      } as DenominationResult;
      component.oldAmount = 45.32;
      mockDenominationService.calculateDenominations.and.returnValue({
        '20.00': 2, '5.00': 1, '0.20': 1, '0.10': 1, '0.02': 1
      });
      const result = component.getChangedDenominationKeys();
      expect(result).toEqual([]);
    });

    it('should return empty array when result is null', () => {
      component.result = null;
      component.oldAmount = 100;
      const result = component.getChangedDenominationKeys();
      expect(result).toEqual([]);
    });

    it('should return empty array when changes object is empty', () => {
      mockDenominationService.calculateDenominations.and.returnValue({ '100.00': 1 });
      component.result = {
        amount: 200,
        breakdown: { '200.00': 1 },
        changes: {} // Empty changes object
      } as DenominationResult;
      component.oldAmount = 100;
      const result = component.getChangedDenominationKeys();
      expect(result).toEqual([]);
    });

    it('should return empty array when changes is null', () => {
      mockDenominationService.calculateDenominations.and.returnValue({ '100.00': 1 });
      component.result = {
        amount: 200,
        breakdown: { '200.00': 1 },
        changes: null // changes is null
      } as any;
      component.oldAmount = 100;
      const result = component.getChangedDenominationKeys();
      expect(result).toEqual([]);
    });
  });

  // Tests for private method functionality
  describe('Private Method Tests', () => {
    describe('calculatePreviousBreakdown', () => {
      it('should return empty object when oldAmount is null', () => {
        component.oldAmount = null;
        const result = (component as any).calculatePreviousBreakdown();
        expect(result).toEqual({});
      });

      it('should call service when oldAmount is positive', () => {
        component.oldAmount = 100;
        const serviceSpy = mockDenominationService.calculateDenominations.and.returnValue({ '100.00': 1 });
        const result = (component as any).calculatePreviousBreakdown();
        expect(serviceSpy).toHaveBeenCalledWith(100);
        expect(result).toEqual({ '100.00': 1 });
      });
    });
  });
});

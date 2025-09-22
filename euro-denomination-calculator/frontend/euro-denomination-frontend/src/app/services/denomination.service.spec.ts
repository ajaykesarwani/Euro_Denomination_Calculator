import { TestBed } from '@angular/core/testing';
import { DenominationService } from './denomination.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

// Unit tests for DenominationService
// Tests currency denomination calculations and edge cases

describe('DenominationService', () => {
  let service: DenominationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(DenominationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Based on provided sample test cases
  describe('calculate Denominations with real amounts', () => {
    it('should calculate denominations for 234.23€', () => {
      const result = service.calculateDenominations(234.23);

      // Expected breakdown for 234.23€
      expect(result['200.00']).toBe(1);  // 1 x 200
      expect(result['20.00']).toBe(1);   // 1 x 20
      expect(result['10.00']).toBe(1);   // 1 x 10
      expect(result['2.00']).toBe(2);    // 2 x 2
      expect(result['0.20']).toBe(1);    // 1 x 0.20
      expect(result['0.02']).toBe(1);    // 1 x 0.02
      expect(result['0.01']).toBe(1);    // 1 x 0.01

      // Rest values should be 0
      expect(result['100.00']).toBe(0);
      expect(result['50.00']).toBe(0);
      expect(result['5.00']).toBe(0);
      expect(result['1.00']).toBe(0);
      expect(result['0.50']).toBe(0);
      expect(result['0.10']).toBe(0);
      expect(result['0.05']).toBe(0);
    });

    it('should calculate denominations for 45.32€', () => {
      const result = service.calculateDenominations(45.32);

      // Expected breakdown for 45.32€
      expect(result['20.00']).toBe(2);   // 2 x 20
      expect(result['5.00']).toBe(1);    // 1 x 5
      expect(result['0.20']).toBe(1);    // 1 x 0.20
      expect(result['0.10']).toBe(1);    // 1 x 0.10
      expect(result['0.02']).toBe(1);    // 1 x 0.02

      // Rest values should be 0
      expect(result['200.00']).toBe(0);
      expect(result['100.00']).toBe(0);
      expect(result['50.00']).toBe(0);
      expect(result['10.00']).toBe(0);
      expect(result['2.00']).toBe(0);
      expect(result['1.00']).toBe(0);
      expect(result['0.50']).toBe(0);
      expect(result['0.05']).toBe(0);
      expect(result['0.01']).toBe(0);
    });
  });

  describe('calculate with sample test amounts', () => {
    it('should calculate changes between 234.23€ and 45.32€', () => {
      const result = service.calculateFrontend(234.23, 45.32);

      expect(result.amount).toBe(234.23);
      expect(result.changes).toBeDefined();

      // Test currencies changes
      expect(result.changes!['200.00']).toBe(1);
      expect(result.changes!['20.00']).toBe(-1);
      expect(result.changes!['10.00']).toBe(1);
      expect(result.changes!['5.00']).toBe(-1);
    });
  });

  // Case when previousAmount is null/0
   describe('calculate edge cases', () => {
     it('should not include changes when previousAmount is null', () => {
       // Tests that no change calculation is performed when there's no previous amount
       const result = service.calculateFrontend(100, null);

       expect(result.amount).toBe(100);
       expect(result.breakdown).toBeDefined();
       expect(result.changes).toBeUndefined(); // No changes object when no previous amount
     });

     it('should include changes when previousAmount is 0', () => {
       const result = service.calculateFrontend(100, 0);

       expect(result.amount).toBe(100);
       expect(result.breakdown).toBeDefined();
       expect(result.changes).toBeDefined(); // Changes should be calculated even for 0
     });
   });

});

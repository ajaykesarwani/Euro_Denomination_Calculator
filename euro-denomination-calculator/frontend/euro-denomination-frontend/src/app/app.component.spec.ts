import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { DenominationCalculatorComponent } from './components/denomination-calculator/denomination-calculator.component';
import { DenominationService } from './services/denomination.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { DenominationResult } from './models/denomination.models';

/**
 * Unit tests for AppComponent
 * Tests the main application component and its integration with services
 */
describe('AppComponent', () => {
  let httpTestingController: HttpTestingController;
  let denominationService: DenominationService;
  let component: AppComponent;
  let fixture: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, DenominationCalculatorComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    denominationService = TestBed.inject(DenominationService);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  // Tests for basic component setup and structure
  describe('Component Setup', () => {
    it('should create the app', () => {
      expect(component).toBeTruthy();
    });

    it('should contain the denomination calculator', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('app-denomination-calculator')).toBeTruthy();
    });
  });

  // Tests for backend API integration and HTTP handling
  describe('Backend Integration', () => {
    it('should handle backend calculation successfully', fakeAsync(() => {
      // Mock API response for backend calculation
      const mockResult: DenominationResult = {
        amount: 100,
        breakdown: { '100.00': 1 },
        changes: { '100.00': 1 }
      };

      component.onCalculate({ amount: 100, useBackend: true });

      const req = httpTestingController.expectOne('http://localhost:8080/api/calculate');
      expect(req.request.method).toEqual('POST');
      req.flush(mockResult);

      tick();

      expect(component.result).toEqual(mockResult);
      expect(component.previousAmount).toBe(100);
      expect(component.loading).toBeFalse();
    }));

    it('should handle backend calculation error', fakeAsync(() => {
      spyOn(window, 'alert');

      component.onCalculate({ amount: 100, useBackend: true });

      const req = httpTestingController.expectOne('http://localhost:8080/api/calculate');
      req.error(new ErrorEvent('Network error'));

      tick();

      expect(component.loading).toBeFalse();
      expect(window.alert).toHaveBeenCalledWith('Backend calculation failed. Check if server is running.');
    }));
  });

  // Tests for frontend calculation logic
  describe('Frontend Calculation', () => {
    it('should handle frontend calculation', fakeAsync(() => {
      spyOn(denominationService, 'calculateFrontend').and.returnValue({
        amount: 50,
        breakdown: { '50.00': 1 },
        changes: { '50.00': 1 }
      });

      component.onCalculate({ amount: 50, useBackend: false });

      tick(101); // Wait for the setTimeout

      expect(denominationService.calculateFrontend).toHaveBeenCalledWith(50, null);
      expect(component.result).toBeDefined();
      expect(component.previousAmount).toBe(50);
      expect(component.loading).toBeFalse();
    }));
  });

  // Tests for internal result handling
  describe('Result Handling', () => {
    it('should set result and update previousAmount', () => {
      const mockResult: DenominationResult = {
        amount: 75,
        breakdown: { '50.00': 1, '20.00': 1, '5.00': 1 }
      };

      component.loading = true;
      component['handleResult'](mockResult, 75);

      expect(component.result).toEqual(mockResult);
      expect(component.previousAmount).toBe(75);
      expect(component.loading).toBeFalse();
    });
  });
});

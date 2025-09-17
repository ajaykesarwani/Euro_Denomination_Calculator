package com.example.denomination.controller;

import com.example.denomination.model.CalculationRequest;
import com.example.denomination.model.DenominationResult;
import com.example.denomination.service.DenominationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DenominationControllerTest {

    @Mock
    private DenominationService denominationService;

    @InjectMocks
    private DenominationController denominationController;

    private DenominationResult mockResult;

    @BeforeEach
    void setUp() {
        // Setup an sample mock results for multiple tests
        mockResult = new DenominationResult(
                234.23,
                Map.of("200.00", 1, "20.00", 1, "10.00", 1, "2.00", 2, "0.20", 1, "0.02", 1, "0.01", 1),
                Map.of("200.00", 1, "20.00", 1, "10.00", 1, "5.00", -1, "2.00", 2)
        );
    }

    @Test
    void testCalculate_WithValidRequestAndPreviousAmount() {
        CalculationRequest request = new CalculationRequest(234.23, 45.32);

        when(denominationService.calculateDenominations(234.23, 45.32))
                .thenReturn(mockResult);

        ResponseEntity<?> response = denominationController.calculate(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockResult, response.getBody());
        verify(denominationService).calculateDenominations(234.23, 45.32);
    }

    @Test
    void testCalculate_WithValidRequestWithoutPreviousAmount() {
        CalculationRequest request = new CalculationRequest(100.0, null);
        DenominationResult resultWithoutChanges = new DenominationResult(100.0, Map.of("100.00", 1), null);

        when(denominationService.calculateDenominations(100.0, null))
                .thenReturn(resultWithoutChanges);

        ResponseEntity<?> response = denominationController.calculate(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNull(((DenominationResult) response.getBody()).changes());
        verify(denominationService).calculateDenominations(100.0, null);
    }

    @Test
    void testCalculate_WithZeroAmount() {
        CalculationRequest request = new CalculationRequest(0.0, null);

        ResponseEntity<?> response = denominationController.calculate(request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Amount must be positive", response.getBody());
        verify(denominationService, never()).calculateDenominations(anyDouble(), anyDouble());
    }

    @Test
    void testCalculate_WithNegativeAmount() {
        CalculationRequest request = new CalculationRequest(-50.0, null);

        ResponseEntity<?> response = denominationController.calculate(request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Amount must be positive", response.getBody());
        verify(denominationService, never()).calculateDenominations(anyDouble(), anyDouble());
    }

    @Test
    void testCalculate_WithIllegalArgumentException() {
        CalculationRequest request = new CalculationRequest(100.0, null);

        when(denominationService.calculateDenominations(100.0, null))
                .thenThrow(new IllegalArgumentException("Invalid amount"));

        ResponseEntity<?> response = denominationController.calculate(request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid amount", response.getBody());
        verify(denominationService).calculateDenominations(100.0, null);
    }

    @Test
    void testCalculate_WithUnexpectedException() {
        CalculationRequest request = new CalculationRequest(100.0, null);

        when(denominationService.calculateDenominations(100.0, null))
                .thenThrow(new RuntimeException("Database error"));

        ResponseEntity<?> response = denominationController.calculate(request);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Error calculating denominations"));
        verify(denominationService).calculateDenominations(100.0, null);
    }

    @Test
    void testHealthCheck() {
        ResponseEntity<String> response = denominationController.healthCheck();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Backend is running", response.getBody());
    }
}
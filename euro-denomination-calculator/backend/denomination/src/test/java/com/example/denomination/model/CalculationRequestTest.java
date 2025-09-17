package com.example.denomination.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CalculationRequestTest {

    @Test
    void testCalculationRequestRecord() {
        CalculationRequest request = new CalculationRequest(234.23, 45.32);

        assertEquals(234.23, request.amount());
        assertEquals(45.32, request.previousAmount());
        assertNotNull(request.toString());
    }

    @Test
    void testCalculationRequestWithNullPrevious() {
        CalculationRequest request = new CalculationRequest(100.0, null);

        assertEquals(100.0, request.amount());
        assertNull(request.previousAmount());
    }
}
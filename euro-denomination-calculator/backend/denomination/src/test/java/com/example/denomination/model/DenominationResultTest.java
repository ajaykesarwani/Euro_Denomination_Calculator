package com.example.denomination.model;

import org.junit.jupiter.api.Test;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

class DenominationResultTest {

    @Test
    void testDenominationResultRecord() {
        Map<String, Integer> breakdown = Map.of("200.00", 1, "20.00", 1);
        Map<String, Integer> changes = Map.of("200.00", 1, "20.00", 0);

        DenominationResult result = new DenominationResult(234.23, breakdown, changes);

        assertEquals(234.23, result.amount());
        assertEquals(breakdown, result.breakdown());
        assertEquals(changes, result.changes());
        assertNotNull(result.toString());
    }

    @Test
    void testDenominationResultWithNullChanges() {
        Map<String, Integer> breakdown = Map.of("200.00", 1);

        DenominationResult result = new DenominationResult(200.0, breakdown, null);

        assertEquals(200.0, result.amount());
        assertEquals(breakdown, result.breakdown());
        assertNull(result.changes());
    }

}
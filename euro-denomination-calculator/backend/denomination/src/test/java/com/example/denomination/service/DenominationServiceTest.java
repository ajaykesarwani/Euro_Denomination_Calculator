package com.example.denomination.service;

import com.example.denomination.model.DenominationResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class DenominationServiceTest {

    private DenominationService denominationService;

    @BeforeEach
    void setUp() {
        //Notes and Coins exist
        denominationService = new DenominationService(new double[]{200, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01});
    }

    @Test
    void testCalculateDenominations_WithValidAmount() {
        var result = denominationService.calculateDenominations(234.23, null);

        assertNotNull(result);
        assertEquals(234.23, result.amount(), 0.001);
        assertNotNull(result.breakdown());
        assertNull(result.changes());

        Map<String, Integer> breakdown = result.breakdown();
        assertEquals(1, breakdown.get("200.00"));
        assertEquals(1, breakdown.get("20.00"));
        assertEquals(1, breakdown.get("10.00"));
        assertEquals(2, breakdown.get("2.00"));
        assertEquals(1, breakdown.get("0.20"));
        assertEquals(1, breakdown.get("0.02"));
        assertEquals(1, breakdown.get("0.01"));
    }

    @Test
    void testCalculateDenominations_WithPreviousAmount() {
        var result = denominationService.calculateDenominations(234.23, 45.32);

        assertNotNull(result);
        assertEquals(234.23, result.amount(), 0.001);
        assertNotNull(result.breakdown());
        assertNotNull(result.changes());

        Map<String, Integer> changes = result.changes();

        assertTrue(changes.size() > 0, "Changes should not be empty");

        // The sum of (change * denomination) should equal the difference in amounts
        double totalChangeValue = changes.entrySet().stream()
                .mapToDouble(entry -> {
                    double denomination = Double.parseDouble(entry.getKey());
                    return denomination * entry.getValue();
                })
                .sum();

        double expectedDifference = 234.23 - 45.32;
        assertEquals(expectedDifference, totalChangeValue, 0.01,
                "Sum of changes should equal the difference between amounts");
    }

    @Test
    void testCalculateDenominations_ExampleFromRequirement() {
        var result = denominationService.calculateDenominations(234.23, 45.32);

        Map<String, Integer> breakdown = result.breakdown();
        Map<String, Integer> changes = result.changes();

        assertEquals(1, breakdown.get("200.00"));
        assertEquals(1, breakdown.get("20.00"));
        assertEquals(1, breakdown.get("10.00"));
        assertEquals(2, breakdown.get("2.00"));
        assertEquals(1, breakdown.get("0.20"));
        assertEquals(1, breakdown.get("0.02"));
        assertEquals(1, breakdown.get("0.01"));

        assertNotNull(changes);
        assertTrue(changes.size() > 0);
    }

    @Test
    void testCalculateChanges_WithEmptyPrevious() {
        Map<String, Integer> current = Map.of("200.00", 1, "20.00", 2);
        Map<String, Integer> previous = Map.of();

        Map<String, Integer> changes = (Map<String, Integer>) ReflectionTestUtils.invokeMethod(
                denominationService, "calculateChanges", current, previous
        );

        assertEquals(1, changes.getOrDefault("200.00", 0));
        assertEquals(2, changes.getOrDefault("20.00", 0));
    }

    @Test
    void testCalculateDenominations_WithSameAmount() {
        var result = denominationService.calculateDenominations(100.0, 100.0);

        assertNotNull(result);
        assertEquals(100.0, result.amount());
        assertNotNull(result.changes());

        // All changes should be zero when amounts are the same
        boolean allZero = result.changes().values().stream()
                .allMatch(change -> change == 0);
        assertTrue(allZero, "All changes should be zero when amounts are identical");
    }

    @Test
    void testCalculateDenominations_WithVerySmallAmount() {
        var result = denominationService.calculateDenominations(0.01, null);

        assertEquals(0.01, result.amount(), 0.001);
        assertEquals(1, result.breakdown().get("0.01"));
        assertNull(result.changes());
    }

    @Test
    void testCalculateDenominations_WithRoundingEdgeCase() {
        // Test amounts that might cause floating point issues
        var result = denominationService.calculateDenominations(0.03, null);

        assertEquals(0.03, result.amount(), 0.001);
        assertEquals(1, result.breakdown().get("0.02"));
        assertEquals(1, result.breakdown().get("0.01"));
    }

    @Test
    void testFormatDenominationKey() {
        String result = (String) ReflectionTestUtils.invokeMethod(
                denominationService, "formatDenominationKey", 50.0
        );

        assertEquals("50.00", result);
    }

}
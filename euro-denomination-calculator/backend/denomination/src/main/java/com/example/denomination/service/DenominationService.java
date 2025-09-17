package com.example.denomination.service;

import com.example.denomination.model.DenominationResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class DenominationService {

    private static final Logger logger = LoggerFactory.getLogger(DenominationService.class);
    private final double[] denominations;

    public DenominationService(@Value("${denomination.values}") double[] denominations) {
        this.denominations = denominations;
        logger.info("Loaded denominations: {}", Arrays.toString(this.denominations));
    }

    //Calculate denominations for the given amount and optionally compare with previous amount
    public DenominationResult calculateDenominations(double amount, Double previousAmount) {
        logger.debug("Calculating denominations for amount: {}, previous: {}", amount, previousAmount);

        Map<String, Integer> breakdown = calculateDenominations(amount);
        Map<String, Integer> changes = previousAmount != null
                ? calculateChanges(breakdown, calculateDenominations(previousAmount))
                : null;

        return new DenominationResult(amount, breakdown, changes);
    }

    //Calculate the denomination breakdown for a given amount
    private Map<String, Integer> calculateDenominations(double amount) {

        //Converting Eurros to cents to avoid floating point errors
        long remaining = Math.round(amount * 100);
        Map<String, Integer> result = new LinkedHashMap<>();

        logger.trace("Starting denomination calculation for amount: {} cents", remaining);

        // Processing each denomination from highest to lowest value
        for (double denomination : denominations) {
            long value = Math.round(denomination * 100);
            if (remaining >= value) {
                int count = (int) (remaining / value);
                result.put(formatDenominationKey(denomination), count);
                remaining -= count * value;
            }
        }

        logger.debug("Final denomination breakdown: {}", result);

        return result;
    }

    //Calculate the difference between current and previous denomination counts
    private Map<String, Integer> calculateChanges(Map<String, Integer> current, Map<String, Integer> previous) {
        Map<String, Integer> changes = new LinkedHashMap<>();
        logger.trace("Calculating changes between current {} and previous {}", current, previous);

        for (double denomination : denominations) {
            String key = formatDenominationKey(denomination);
            int currentCount = current.getOrDefault(key, 0);
            int previousCount = previous.getOrDefault(key, 0);

            // Only include denominations that have non zero values in either new amount or previous given amount
            if (currentCount > 0 || previousCount > 0) {
                changes.put(key, currentCount - previousCount);
            }
        }

        logger.debug("Calculated changes: {}", changes);

        return changes;
    }

    //Format denomination value as a string with two decimal places
    private String formatDenominationKey(double denomination) {
        return String.format("%.2f", denomination);
    }
}
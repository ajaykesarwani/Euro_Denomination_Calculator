    package com.example.denomination.model;

    import java.util.Map;

    public record DenominationResult(
            double amount,
            Map<String, Integer> breakdown,
            Map<String, Integer> changes
    ) {}
package com.example.denomination.model;

public record CalculationRequest(
        double amount,
        Double previousAmount
) {}
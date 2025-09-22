package com.example.denomination.controller;

import com.example.denomination.model.CalculationRequest;
import com.example.denomination.service.DenominationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "${spring.web.cors.allowed-origins}")
public class DenominationController {

    private static final Logger logger = LoggerFactory.getLogger(DenominationController.class);
    private final DenominationService denominationService;

    @Value("${denomination.values}")
    private List<Double> availableDenominations;

    //Calculate denominations for a given amount and optionally compare with previous amount
    @PostMapping("/calculate")
    public ResponseEntity<?> calculate(@RequestBody CalculationRequest request) {
        logger.info("Received calculation request: amount={}, previousAmount={}",
                request.amount(), request.previousAmount());

        try {
            // Validating the input amount given by user
            if (request.amount() <= 0) {
                logger.warn("Invalid amount provided: {}", request.amount());
                return ResponseEntity.badRequest().body("Amount must be positive");
            }

            // Calculating the denominations using the service layers
            var result = denominationService.calculateDenominations(
                    request.amount(),
                    request.previousAmount()
            );

            logger.info("Successfully calculated denominations for amount: {}", request.amount());
            return ResponseEntity.ok(result);

        } catch (IllegalArgumentException e) {
            logger.warn("Invalid request: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error calculating denominations for amount: {}",
                    request.amount(), e);
            return ResponseEntity.internalServerError()
                    .body("Error calculating denominations: " + e.getMessage());
        }
    }

    //Health check to verify that endpoint service is running properly
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {

        logger.debug("Health check endpoint called");
        return ResponseEntity.ok("Backend is running");
    }
    //Return supported denominations
    @GetMapping("/denominations")
    public ResponseEntity<List<String>> getAvailableDenominations() {
        logger.debug("Return supported denominations");

        List<String> formattedDenominations = availableDenominations.stream()
                .map(amount -> String.format("%.2f€", amount))
                .collect(Collectors.toList());

        return ResponseEntity.ok(formattedDenominations);
    }
}
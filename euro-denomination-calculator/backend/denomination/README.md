# Euro Denomination Calculator - Backend

A Spring Boot backend service that calculates Euro currency denominations for given amounts and provides difference calculations between amounts.

## Features

- Calculate denomination breakdown in currencies - Euro
- Compare denominations between new and old domination amounts
- RESTful API with Swagger documentation
- Docker container support
- Comprehensive test coverage

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- Docker (optional)
- Port 8080 should be available (no occupied by other other applications)

## How to Install

### Option 1: Manual Installation Steps

1. **Open terminal and navigate to backend directory:**
   ```bash
   cd dedalus/euro-denomination-calculator/backend/denomination
   ```
   
2. **Build the spring boot project:**

```bash
mvn clean package
```
3. **Run the springg boot application:**

```bash
java -jar target/denomination-0.0.1-SNAPSHOT.jar
```

3. **Verify the application is running:**

```bash
curl http://localhost:8080/api/health
# Should show in browser: {Backend is running}
```

### Option 2: Docker Installation
0. **Make sure docker desktop is running else start it**

1. **Open terminal and navigate to backend directory:**
   ```bash
   cd dedalus/euro-denomination-calculator/backend/denomination
   ```
   
2. **Build Docker image:**

```bash
docker build -t denomination .
```
3. **Run the container:**

```bash
docker run -d -p 8080:8080 --name denomination denomination
```
4. **Verify the container is running:**

```bash
docker ps
curl http://localhost:8080/api/health
```
## Test the spring boot prebuild test cases (Optional)
   
### Running Tests
```bash
# Run all tests
mvn test

# Run tests with coverage report
mvn test jacoco:report
```
### Code Coverage Report
- Location: target/site/jacoco/index.html
- Coverage Report: Open the HTML file in a browser to view detailed coverage
- Current Coverage: 98%

## Testing with Swagger UI
1. **Access Swagger UI:**
### Open your browser and navigate to:

```text
http://localhost:8080/swagger-ui.html
```
2. **Test the calculation endpoint:**

- Click on denomination-controller

- Click on POST /api/calculate

- Click "Try it out"

3. **Sample Test Data 1 - Single Amount:**

```json
{
"amount": 234.23
}
```
#### Expected Result:

```json
{
   "amount": 234.23,
   "breakdown": {
      "200.00": 1,
      "20.00": 1,
      "10.00": 1,
      "2.00": 2,
      "0.20": 1,
      "0.02": 1,
      "0.01": 1
   },
   "changes": null
}
```

4. **Sample Test Data 2 - With Comparison:**

```json
{
"amount": 234.23,
"previousAmount": 45.32
}
```

### Expected Result:

```json
{
   "amount": 234.23,
   "breakdown": {
      "200.00": 1,
      "20.00": 1,
      "10.00": 1,
      "2.00": 2,
      "0.20": 1,
      "0.02": 1,
      "0.01": 1
   },
   "changes": {
      "200.00": 1,
      "20.00": -1,
      "10.00": 1,
      "5.00": -1,
      "2.00": 2,
      "0.20": 0,
      "0.10": -1,
      "0.02": 0,
      "0.01": 1
   }
}
```


## API Endpoints
- POST /api/calculate - Calculate denominations

- GET /api/health - Health check

- GET /api/denominations - Get available denominations

## Supported Denominations
200€, 100€, 50€, 20€, 10€, 5€, 2€, 1€, 0.50€, 0.20€, 0.10€, 0.05€, 0.02€, 0.01€

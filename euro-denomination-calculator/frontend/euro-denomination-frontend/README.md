# Euro Denomination Calculator - Frontend

An Angular frontend application that provides a user interface for calculating Euro currency denominations with backend/frontend toggle functionality.

## Features

- Calculate Euro denominations with visual display
- Toggle between backend and frontend calculation
- View differences between current and previous amounts
- Docker container support
- Comprehensive test coverage

## Prerequisites

- Node.js 18+ 
- npm 8+
- Angular CLI 18+
- Docker (optional)
- Port 4200 available (not occupied by other applications)

## How to Install

### Option 1: Manual Installation Steps

1. **Open terminal and navigate to frontend directory:**
   ```bash
   cd euro-denomination-calculator/frontend/euro-denomination-frontend
   ```
   
2. **Install dependencies:**

```bash
npm install
```

3. **Run the development server:**

```bash
ng serve
```

4. **Access the application:**

Open any browser and navigate to:

```text
http://localhost:4200
```

### Option 2: Docker Installation
0. **Make sure docker desktop is running else start it**

1. **Open terminal and navigate to frontend directory:**
   ```bash
   cd euro-denomination-calculator/frontend/euro-denomination-frontend
   ```
   
2. **Build Docker image:**

```bash
docker build -t denomination-frontend .
```
3. **Run the container:**

```bash
docker run -d -p 4200:80 --name denomination-frontend denomination-frontend
```
4. **Access the application:**

Open browser and navigate to:

```text
http://localhost:4200
```

## Testing (Optional)

### Running Tests
```bash
# Run all tests
ng test
```

# Run tests with coverage report
```bash 
ng test --code-coverage --watch=false
```
### Code Coverage
- Location: coverage/index.html
- Coverage Report: Open the HTML file in a browser to view detailed coverage
- Current Coverage: 100% statements, 100% branches, 100% functions, 100% lines

## Testing the Application
### Sample Test Scenario 1: 234.23€
1. Open the application at http://localhost:4200
2. Enter test amount: 234.23
3. Toggle calculation mode:
   - Backend Mode: Uses Spring Boot API (ensure backend is running)
   - Frontend Mode: Uses Angular service calculation

4. Click "Calculate" button

#### Expected Results for 234.23€:

```text
200.00€: 1
20.00€: 1  
10.00€: 1
2.00€: 2
0.20€: 1
0.02€: 1
0.01€: 1
```

### Sample Test Scenario 2: Difference Calculation (234.23€ vs 45.32€)
1. First calculation: Enter 45.32 and calculate

2. Second calculation: Enter 234.23 and calculate

#### Expected Difference Display:

```text
200.00€: +1
20.00€: -1
10.00€: +1  
5.00€: -1
2.00€: +2
0.20€: 0
0.10€: -1
0.02€: 0
0.01€: +1
```

### Toggle Testing
1. Test Backend Mode:
   - Ensure backend is running on port 8080
   - Switch toggle to "Using Backend"
   - When hit "Calculate" button - internally it call Spring Boot API for calculation

2. Test Frontend Mode:
   - Switch toggle to "Using Frontend"
   - When hit "Calculate" button - internally it use Angular frontend code for calculation

## Supported Denominations
200€, 100€, 50€, 20€, 10€, 5€, 2€, 1€, 0.50€, 0.20€, 0.10€, 0.05€, 0.02€, 0.01€

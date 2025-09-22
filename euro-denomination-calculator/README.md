# Euro Denomination Calculator - Full Stack

A complete full-stack application for calculating Euro currency denominations with Spring Boot backend and Angular frontend.

## Architecture

- **Backend**: Spring Boot REST API (Port 8080)
- **Frontend**: Angular Web Application (Port 4200)
- **Communication**: REST API calls between frontend and backend
- **Test Coverage**: 100% for both backend and frontend

## Prerequisites

### For Manual Installation:
- Java 17+
- Maven 3.6+
- Node.js 18+
- npm 8+
- Angular CLI 18+

### For Docker Installation:
- Docker 20+
- Docker Compose 2+

## How to Install

### Option 1: Manual Installation

#### Backend Sprinb Boot Setup:

1. **Open a terminal and Navigate to backend directory:**
   ```bash
   cd dedalus/euro-denomination-calculator/backend/denomination
    ``` 
   
2. **Build and run backend:**

```bash
mvn clean package
java -jar target/denomination-0.0.1-SNAPSHOT.jar
```

3. **Verify backend:**

```bash
curl http://localhost:8080/api/health
# Should return: {Backend is running}
```

### Frontend Setup:
1. **Open new terminal and navigate to frontend directory:**

``` bash
 cd euro-denomination-calculator/frontend/euro-denomination-frontend
 ```

3. **Install dependencies and run:**

```bash
npm install
ng serve
```
4. **Verify frontend:**
```text
Open http://localhost:4200 in browser
```

### Option 2: Docker Installation
0. **Make sure docker desktop is running else start it**

1. **Open a terminal and Navigate to the project root directory:**
   ```bash
   cd dedalus/euro-denomination-calculator
    ``` 
   
2. Build and start all services:

```bash
docker-compose up -d
```

3. **Or build fresh images and start:**

```bash
docker-compose up -d --build
```

4. **Check running containers:**

```bash
docker-compose ps
```

5. **Access applications:**
    - Frontend: http://localhost:4200
    - Backend: http://localhost:8080
    - Swagger UI: http://localhost:8080/swagger-ui.html

## Testing (Optional)
### Running Tests
#### Backend Tests:
```bash
cd backend/denomination
mvn test

# Run tests with coverage report
mvn test jacoco:report
# Coverage report: target/site/jacoco/index.html

```


#### Frontend Tests:
```bash
cd frontend/euro-denomination-frontend
```
(if you are get Node packages may not be installed. Try installing with 'npm install'.)
Otherwise skip npm install

```bash
npm install 
```

```bash 
ng test --code-coverage --watch=false
# Coverage report: coverage/index.html
```


## Code Coverage
- Backend Coverage: backend/denomination/target/site/jacoco/index.html (98% coverage)
- Frontend Coverage: frontend/euro-denomination-frontend/coverage/index.html (100% coverage)
- Open HTML files in browser to view detailed coverage reports

## Testing the Full Application

### Test Scenario 1: 234.23€ vs 45.32€
1. Open frontend at http://localhost:4200
2. First calculation:
   - Enter: 45.32
   - Toggle: "Using Backend"
   - Click: "Calculate"

3. Second calculation:
   - Enter: 234.23
   - Click: "Calculate" again

### Expected Results
#### Breakdown for 234.23€:

```text
200.00€: 1
20.00€: 1
10.00€: 1  
2.00€: 2
0.20€: 1
0.02€: 1
0.01€: 1
```

#### Difference from 45.32€:

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

## Failed to install application by following above steps ?
### No Problem the application is deployed in render server which can be access via below url
   - Frontend https://euro-denomination-frontend.onrender.com/
   - backend https://euro-denomination-backend.onrender.com/api/health



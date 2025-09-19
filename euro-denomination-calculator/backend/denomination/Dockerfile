FROM openjdk:17-jdk-slim

WORKDIR /app

# First copy pom.xml to cache dependencies
COPY pom.xml .
# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application 
RUN mvn clean package -DskipTests

# Copy the built jar
COPY target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

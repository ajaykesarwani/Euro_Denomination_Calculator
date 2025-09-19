# Stage 1: Build with Maven
FROM maven:3.8-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run with JDK only
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/denomination-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]


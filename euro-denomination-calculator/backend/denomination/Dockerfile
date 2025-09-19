FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the built jar file
COPY target/*.jar app.jar

# Expose the port backend spring app runs on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

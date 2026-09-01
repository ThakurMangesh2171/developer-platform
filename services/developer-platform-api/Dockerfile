FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the application (skipping tests for faster build)
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the built jar file
COPY --from=build /app/target/*.jar app.jar

# Create a non-root user and group, and change ownership of the app directory
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app
# Switch to the non-root user
USER appuser

# Expose the application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY induo-house/.mvn .mvn
COPY induo-house/mvnw induo-house/pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -q
COPY induo-house/src ./src
RUN ./mvnw package -DskipTests -q

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/induo-house-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

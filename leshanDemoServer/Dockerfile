FROM openjdk:17-alpine

WORKDIR /app

RUN apk add --no-cache wget && \
    wget -O leshan-demo-server.jar "https://ci.eclipse.org/leshan/job/leshan-ci/job/master/lastSuccessfulBuild/artifact/leshan-demo-server.jar"

EXPOSE 5683 5684 5783 5784 8080 8081

CMD ["java", "-jar", "leshan-demo-server.jar"]
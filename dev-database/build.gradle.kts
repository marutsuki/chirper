plugins {
	java
	id("org.springframework.boot") version "3.1.4"
	id("io.spring.dependency-management") version "1.1.3"
}

group = "io.marutsuki.chirper.dev"
version = "0.0.1-SNAPSHOT"

java {
	sourceCompatibility = JavaVersion.VERSION_17
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.testcontainers:postgresql:1.17.3")
	implementation("org.postgresql:postgresql:42.6.0")
	compileOnly("org.projectlombok:lombok")
	annotationProcessor("org.projectlombok:lombok")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.withType<Test> {
	useJUnitPlatform()
}

tasks.register<Copy>("copyDatabaseBootstrapScripts") {
	from(rootProject.projectDir.toString() + "/model")
	into(projectDir.toString() + "/src/main/resources")
}
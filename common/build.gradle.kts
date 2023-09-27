plugins {
	java
	id("io.spring.dependency-management") version "1.1.3"
}

group = "io.marutsuki.chirper"
version = "0.0.1-SNAPSHOT"

java {
	sourceCompatibility = JavaVersion.VERSION_17
}

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

repositories {
	mavenCentral()
}

dependencies {
	compileOnly("org.projectlombok:lombok:1.18.30")
	annotationProcessor("org.projectlombok:lombok:1.18.30")
	implementation("org.springframework.security:spring-security-web")
	implementation("org.springframework.security:spring-security-config")

}

dependencyManagement {
	imports {
		mavenBom("org.springframework.security:spring-security-bom:6.1.4")
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}

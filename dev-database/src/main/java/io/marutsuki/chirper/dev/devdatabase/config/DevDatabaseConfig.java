package io.marutsuki.chirper.dev.devdatabase.config;

import com.github.dockerjava.api.model.ExposedPort;
import com.github.dockerjava.api.model.HostConfig;
import com.github.dockerjava.api.model.PortBinding;
import com.github.dockerjava.api.model.Ports;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

import java.util.Map;

@Slf4j
@Configuration
public class DevDatabaseConfig {

    @Value("${database.name}")
    private String databaseName;

    @Value("${database.username}")
    private String username;

    @Value("${database.password}")
    private String password;

    @Value("${database.docker.imageName}")
    private String imageName;

    @Value("${database.server.port}")
    private int PORT;

    @Bean
    public PostgreSQLContainer postgreSQLContainer() {
        final String userDir = System.getProperty("user.dir");
        final DockerImageName image = DockerImageName.parse(imageName);
        final PostgreSQLContainer postgreSQLContainer = new PostgreSQLContainer<>(image)
                .withEnv(Map.of("POSTGRES_PASSWORD", password, "POSTGRES_USER", username, "POSTGRES_DB", databaseName))
                .withDatabaseName(databaseName)
                .withUsername(username)
                .withPassword(password)
                .withReuse(true)
                .withExposedPorts(PORT)
                .withCreateContainerCmdModifier(cmd -> cmd.withHostConfig(
                        new HostConfig().withPortBindings(new PortBinding(Ports.Binding.bindPort(PORT), new ExposedPort(PORT)))
                ));
        try {
            postgreSQLContainer.withInitScript("schema/data.sql");
        } catch (NullPointerException e) {
            log.atError().log(() -> String.join(" :: ", "Failed to initialize PostgreSQL container", e.toString()));
            throw new IllegalStateException("Database container could not be initialized");
        }
        postgreSQLContainer.start();
        return postgreSQLContainer;
    }
}

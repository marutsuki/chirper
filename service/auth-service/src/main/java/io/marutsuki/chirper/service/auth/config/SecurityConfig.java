package io.marutsuki.chirper.service.auth.config;

import jakarta.servlet.Filter;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig
{
    private final JWTAuthFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    @Bean
    public SecurityFilterChain SecurityFilterChain(HttpSecurity http) throws Exception
    {
        http.authorizeHttpRequests((requests) -> requests
                .anyRequest()
                .authenticated());
        http.formLogin(withDefaults());
        http.httpBasic(withDefaults());
        http.authenticationProvider(authenticationProvider)
                .addFilterBefore((Filter) jwtAuthFilter, (Class<? extends Filter>) UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}

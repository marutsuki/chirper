package io.marutsuki.chirper.service.auth;

import io.marutsuki.chirper.common.user.Role;
import io.marutsuki.chirper.common.user.User;
import io.marutsuki.chirper.service.auth.config.JWTService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


/// Handles registering and authentication of users with the repository
@Service
@RequiredArgsConstructor
public class AuthenticationService
{
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;
    private final AuthenticationManager authenticationManager;

    //Creates and saves new user
    public AuthenticationResponse register(RegisterRequest request)
    {
        User user = User.builder()
                .userName(request.getUserName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();
        repository.save(user);
        String token = jwtService.GenerateToken(user);
        return AuthenticationResponse.builder()
                .token(token)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request)
    {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUserName(),request.getPassword()));
        //Find user in repository or throw error
        var user = repository.findByUsername(request.getUserName())
                .orElseThrow();
        String token = jwtService.GenerateToken(user);
        return AuthenticationResponse.builder()
                .token(token)
                .build();
    }
}

package io.marutsuki.chirper.service.auth.controller;

import io.marutsuki.chirper.service.auth.AuthenticationResponse;
import io.marutsuki.chirper.service.auth.AuthenticationService;
import io.marutsuki.chirper.service.auth.RegisterRequest;
import io.marutsuki.chirper.service.auth.AuthenticationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController
{
    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request)
    {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody AuthenticationRequest request)
    {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }
}

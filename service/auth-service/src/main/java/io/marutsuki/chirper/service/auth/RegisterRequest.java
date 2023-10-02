package io.marutsuki.chirper.service.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class RegisterRequest
{
    private String userName;
    private String email;
    private String password;
}

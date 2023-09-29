package io.marutsuki.chirper.service.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import io.marutsuki.chirper.common.user.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer>
{
    Optional<User> findByUsername(String username);
}

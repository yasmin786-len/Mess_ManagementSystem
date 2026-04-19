package com.example.backend.repository;

import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    // ✅ for login
    Optional<User> findByUserId(String userId);

    Optional<User> findByEmail(String email);

    List<User> findByRole(String role);

    Optional<User> findByUserIdOrEmail(String userId, String email);
}
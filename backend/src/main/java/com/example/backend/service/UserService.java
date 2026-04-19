package com.example.backend.service;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.backend.repository.NotificationRepository;

import java.util.Map;

@Service
public class UserService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    // ✅ UPDATE PROFILE
    public User updateUser(Long id, Map<String, String> body) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(body.get("fullName"));
        user.setEmail(body.get("email"));

        return userRepository.save(user);
    }



    public void changePassword(Long id, String password) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String encodedPassword = passwordEncoder.encode(password);

        user.setPassword(encodedPassword);

        userRepository.save(user);
    }

    // ✅ DELETE USER
    public void deleteUser(Long id) {
        notificationRepository.deleteByUserId(id);
        userRepository.deleteById(id);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
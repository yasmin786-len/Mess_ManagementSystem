package com.example.backend.controller;

import com.example.backend.entity.User;
import com.example.backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    @Autowired
    private UserService userService;
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUserById(id);
    }
    // ✅ UPDATE PROFILE
    @PutMapping("/update/{id}")
    public User updateUser(@PathVariable Long id,
                           @RequestBody Map<String, String> body) {
        return userService.updateUser(id, body);
    }

    // ✅ CHANGE PASSWORD
    @PutMapping("/change-password/{id}")
    public String changePassword(@PathVariable Long id,
                                 @RequestBody Map<String, String> body) {
        userService.changePassword(id, body.get("password"));
        return "Password updated";
    }

    // ✅ DELETE ACCOUNT
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return "User deleted";
    }
}
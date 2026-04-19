package com.example.backend.controller;

import com.example.backend.entity.Complaint;
import com.example.backend.entity.User;
import com.example.backend.repository.ComplaintRepository;
import com.example.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "http://localhost:5173")
public class ComplaintController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    // ============================
    // ✅ SUBMIT COMPLAINT
    // ============================
    @PostMapping("/submit/{userId}")
    public Complaint submitComplaint(
            @PathVariable Long userId,
            @RequestParam String category,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile image
    ) throws IOException {

        User user = userRepository.findById(userId).orElseThrow();

        Complaint complaint = new Complaint();
        complaint.setUser(user);
        complaint.setCategory(category);
        complaint.setDescription(description);
        complaint.setStatus("Pending");
        complaint.setDate(LocalDate.now());

        // ✅ IMAGE SAVE
        if (image != null && !image.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();

            File uploadDir = new File("uploads");
            if (!uploadDir.exists()) uploadDir.mkdir();

            Path path = Paths.get("uploads/" + fileName);
            Files.write(path, image.getBytes());

            complaint.setImageUrl(fileName);
        }

        return complaintRepository.save(complaint);
    }

    // ============================
    // ✅ STUDENT VIEW (OWN ONLY)
    // ============================
    @GetMapping("/user/{userId}")
    public List<Complaint> getUserComplaints(@PathVariable Long userId) {
        return complaintRepository.findByUser_Id(userId);
    }

    // ============================
    // ✅ ADMIN VIEW (ALL)
    // ============================
    @GetMapping("/all")
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    // ============================
    // ✅ UPDATE STATUS
    // ============================
    @PutMapping("/update/{id}")
    public Complaint updateStatus(@PathVariable Long id) {
        Complaint c = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        c.setStatus("Resolved");
        return complaintRepository.save(c);
    }
}
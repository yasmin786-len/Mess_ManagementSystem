package com.example.backend.controller;

import com.example.backend.entity.Complaint;
import com.example.backend.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminComplaintController {

    @Autowired
    private ComplaintRepository complaintRepo;

    @GetMapping("/complaints")
    public List<Map<String, Object>> getAllComplaints() {

        List<Complaint> complaints = complaintRepo.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Complaint c : complaints) {

            Map<String, Object> map = new HashMap<>();
            map.put("id", c.getId());
            map.put("student", c.getUser().getFullName());
            map.put("userId", c.getUser().getUserId());
            map.put("category", c.getCategory());
            map.put("description", c.getDescription());
            map.put("status", c.getStatus());
            map.put("date", c.getDate());

            result.add(map);
        }

        return result;
    }
}
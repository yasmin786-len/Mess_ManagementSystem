package com.example.backend.repository;

import com.example.backend.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    List<Complaint> findByUser_Id(Long userId);

    List<Complaint> findByAssignedTo(String assignedTo);

    // 🔥 CORRECT METHOD (USE THIS)
    List<Complaint> findByAssignedToAndAssignedMess(String assignedTo, String assignedMess);
}
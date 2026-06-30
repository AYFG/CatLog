package com.catlog.catlog_spring_back.medicallog;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicalLogRepository extends JpaRepository<MedicalLog, Long> {

    Optional<MedicalLog> findByCatId(Long catId);
}

package com.catlog.catlog_spring_back.medicallog;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.catlog.catlog_spring_back.medicallog.dto.CreateMedicalLogRequest;
import com.catlog.catlog_spring_back.medicallog.dto.MedicalLogResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/medicalLog")
public class MedicalLogController {

    private final MedicalLogService medicalLogService;

    @PostMapping("/{catId}")
    public ResponseEntity<MedicalLogResponse> upsert(
            @PathVariable Long catId,
            @Valid @RequestBody CreateMedicalLogRequest req,
            Authentication authentication) {
        return ResponseEntity.status(201).body(medicalLogService.upsert(catId, req, authentication));
    }
}

package com.catlog.catlog_spring_back.medicallog;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.catlog.catlog_spring_back.cat.Cat;
import com.catlog.catlog_spring_back.cat.CatService;
import com.catlog.catlog_spring_back.common.CurrentUser;
import com.catlog.catlog_spring_back.medicallog.dto.CreateMedicalLogRequest;
import com.catlog.catlog_spring_back.medicallog.dto.MedicalLogResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MedicalLogService {

    private final MedicalLogRepository medicalLogRepository;
    private final CatService catService;
    private final MedicalLogMapper medicalLogMapper;
    private final CurrentUser currentUser;

    @Transactional
    public MedicalLogResponse upsert(Long catId, CreateMedicalLogRequest req, Authentication authentication) {
        Long authenticatedUserId = currentUser.id(authentication);
        Cat cat = catService.findOwnedCat(catId, authenticatedUserId);
        String catName = req.cat().catName();

        MedicalLog medicalLog = medicalLogRepository.findByCatId(catId)
                .map(existing -> {
                    existing.update(catName, req.healthCheckupDate(), req.healthCycle(), req.heartWorm(),
                            req.heartWormCycle());
                    return existing;
                })
                .orElseGet(() -> medicalLogRepository.save(new MedicalLog(
                        cat,
                        catName,
                        req.healthCheckupDate(),
                        req.healthCycle(),
                        req.heartWorm(),
                        req.heartWormCycle())));

        return new MedicalLogResponse(1, "건강 관리 정보가 등록되었습니다.", medicalLogMapper.toDto(medicalLog));
    }
}

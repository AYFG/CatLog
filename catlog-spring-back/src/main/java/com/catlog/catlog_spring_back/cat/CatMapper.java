package com.catlog.catlog_spring_back.cat;

import java.util.List;

import org.springframework.stereotype.Component;

import com.catlog.catlog_spring_back.cat.dto.CatResponse;
import com.catlog.catlog_spring_back.medicallog.MedicalLogMapper;

@Component
public class CatMapper {

    private final MedicalLogMapper medicalLogMapper;

    public CatMapper(MedicalLogMapper medicalLogMapper) {
        this.medicalLogMapper = medicalLogMapper;
    }

    public CatResponse toDto(Cat cat) {
        List<String> dailyLogIds = cat.getDailyLogs().stream()
                .map(log -> log.getId().toString())
                .toList();
        Object medicalLog = cat.getMedicalLog() == null ? null : medicalLogMapper.toDto(cat.getMedicalLog());

        return new CatResponse(
                cat.getId().toString(),
                cat.getName(),
                cat.getBirthDate(),
                cat.getCatType(),
                cat.getOwner().getId().toString(),
                dailyLogIds,
                medicalLog);
    }
}

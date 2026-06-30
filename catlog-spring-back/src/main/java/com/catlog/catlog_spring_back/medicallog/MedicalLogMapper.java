package com.catlog.catlog_spring_back.medicallog;

import org.springframework.stereotype.Component;

import com.catlog.catlog_spring_back.common.CatRefDto;
import com.catlog.catlog_spring_back.medicallog.dto.MedicalLogDto;

@Component
public class MedicalLogMapper {

    public MedicalLogDto toDto(MedicalLog log) {
        return new MedicalLogDto(
                log.getId().toString(),
                new CatRefDto(log.getCat().getId().toString(), log.getCatNameSnapshot()),
                log.getHealthCheckupDate(),
                log.getHealthCycle().toString(),
                log.getHeartWorm(),
                log.getHeartWormCycle().toString());
    }
}

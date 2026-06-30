package com.catlog.catlog_spring_back.cat.dto;

import java.util.List;

import com.catlog.catlog_spring_back.medicallog.dto.MedicalLogDto;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record CatResponse(
        @JsonProperty("_id") String id,
        String name,
        String birthDate,
        String catType,
        String owner,
        List<String> dailyLogs,
        Object medicalLogs) {

    public CatResponse withMedicalLog(MedicalLogDto medicalLog) {
        return new CatResponse(id, name, birthDate, catType, owner, dailyLogs, medicalLog);
    }
}

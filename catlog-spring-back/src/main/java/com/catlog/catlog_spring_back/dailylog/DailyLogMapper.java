package com.catlog.catlog_spring_back.dailylog;

import org.springframework.stereotype.Component;

import com.catlog.catlog_spring_back.common.CatRefDto;
import com.catlog.catlog_spring_back.common.JsonValueMapper;
import com.catlog.catlog_spring_back.dailylog.dto.DailyLogDto;

@Component
public class DailyLogMapper {

    private final JsonValueMapper jsonValueMapper;

    public DailyLogMapper(JsonValueMapper jsonValueMapper) {
        this.jsonValueMapper = jsonValueMapper;
    }

    public DailyLogDto toDto(DailyLog log) {
        return new DailyLogDto(
                log.getId().toString(),
                new CatRefDto(log.getCat().getId().toString(), log.getCatNameSnapshot()),
                log.getDefecation(),
                log.getVitamin(),
                log.getWeight(),
                jsonValueMapper.toResponseValue(log.getEtc()),
                log.getLogDate());
    }
}

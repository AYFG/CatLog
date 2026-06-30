package com.catlog.catlog_spring_back.dailylog;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.catlog.catlog_spring_back.cat.Cat;
import com.catlog.catlog_spring_back.cat.CatService;
import com.catlog.catlog_spring_back.common.ApiException;
import com.catlog.catlog_spring_back.common.CurrentUser;
import com.catlog.catlog_spring_back.common.JsonValueMapper;
import com.catlog.catlog_spring_back.common.OkMessageResponse;
import com.catlog.catlog_spring_back.dailylog.dto.CreateDailyLogRequest;
import com.catlog.catlog_spring_back.dailylog.dto.DailyLogListResponse;
import com.catlog.catlog_spring_back.dailylog.dto.DailyLogResponse;
import com.catlog.catlog_spring_back.dailylog.dto.EveryLogDatesResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DailyLogService {

    private final DailyLogRepository dailyLogRepository;
    private final CatService catService;
    private final DailyLogMapper dailyLogMapper;
    private final CurrentUser currentUser;
    private final JsonValueMapper jsonValueMapper;

    @Transactional
    public DailyLogResponse upsert(Long catId, CreateDailyLogRequest req, Authentication authentication) {
        Long authenticatedUserId = currentUser.id(authentication);
        Cat cat = catService.findOwnedCat(catId, authenticatedUserId);
        String catName = req.cat().catName();
        String etc = jsonValueMapper.toStoredString(req.etc());

        DailyLog dailyLog = dailyLogRepository.findByCatIdAndLogDate(catId, req.logDate())
                .map(existing -> {
                    existing.update(catName, req.defecation(), req.vitamin(), req.weight(), etc, req.logDate());
                    return existing;
                })
                .orElseGet(() -> dailyLogRepository.save(new DailyLog(
                        cat,
                        catName,
                        req.defecation(),
                        req.vitamin(),
                        req.weight(),
                        etc,
                        req.logDate())));

        return new DailyLogResponse(1, "건강 관리 정보가 등록되었습니다.", dailyLogMapper.toDto(dailyLog));
    }

    @Transactional(readOnly = true)
    public DailyLogListResponse getByDate(String logDate, Authentication authentication) {
        if (logDate == null || logDate.isBlank()) {
            throw new ApiException(400, "날짜가 필요합니다.");
        }

        Long authenticatedUserId = currentUser.id(authentication);
        List<com.catlog.catlog_spring_back.dailylog.dto.DailyLogDto> dailyLogs = dailyLogRepository
                .findByCatOwnerIdAndLogDate(authenticatedUserId, logDate)
                .stream()
                .map(dailyLogMapper::toDto)
                .toList();

        return new DailyLogListResponse(1, "일일 건강기록을 성공적으로 가져왔습니다.", dailyLogs);
    }

    @Transactional(readOnly = true)
    public EveryLogDatesResponse getEveryLogDates(Authentication authentication) {
        Long authenticatedUserId = currentUser.id(authentication);
        List<String> everyLogDates = dailyLogRepository.findByCatOwnerId(authenticatedUserId).stream()
                .map(DailyLog::getLogDate)
                .toList();

        return new EveryLogDatesResponse(1, "모든 일일 기록 날짜를 성공적으로 가져왔습니다.", everyLogDates);
    }

    @Transactional
    public OkMessageResponse delete(Long dailyLogId, Authentication authentication) {
        Long authenticatedUserId = currentUser.id(authentication);
        DailyLog dailyLog = dailyLogRepository.findById(dailyLogId)
                .orElseThrow(() -> new ApiException(404, "삭제할 일일 기록을 찾을 수 없습니다."));
        if (!dailyLog.getCat().getOwner().getId().equals(authenticatedUserId)) {
            throw new ApiException(403, "삭제 권한이 없습니다.");
        }
        dailyLogRepository.delete(dailyLog);
        return new OkMessageResponse(1, "일일기록을 성공적으로 제거했습니다.");
    }
}

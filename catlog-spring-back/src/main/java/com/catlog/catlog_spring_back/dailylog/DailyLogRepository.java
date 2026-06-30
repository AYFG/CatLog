package com.catlog.catlog_spring_back.dailylog;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DailyLogRepository extends JpaRepository<DailyLog, Long> {

    Optional<DailyLog> findByCatIdAndLogDate(Long catId, String logDate);

    List<DailyLog> findByCatOwnerIdAndLogDate(Long ownerId, String logDate);

    List<DailyLog> findByCatOwnerId(Long ownerId);

    List<DailyLog> findByCatId(Long catId);
}

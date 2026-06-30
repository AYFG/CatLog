package com.catlog.catlog_spring_back.dailylog;

import com.catlog.catlog_spring_back.cat.Cat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "daily_logs", uniqueConstraints = {
        @UniqueConstraint(name = "uk_daily_logs_cat_log_date", columnNames = { "cat_id", "log_date" })
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DailyLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cat_id", nullable = false)
    private Cat cat;

    @Column(nullable = false, length = 255)
    private String catNameSnapshot;

    @Column(nullable = false)
    private Boolean defecation;

    @Column(nullable = false)
    private Boolean vitamin;

    @Column(nullable = false)
    private Double weight;

    @Column(columnDefinition = "TEXT")
    private String etc;

    @Column(name = "log_date", nullable = false, length = 50)
    private String logDate;

    public DailyLog(Cat cat, String catNameSnapshot, Boolean defecation, Boolean vitamin, Double weight, String etc,
            String logDate) {
        this.cat = cat;
        this.catNameSnapshot = catNameSnapshot;
        this.defecation = defecation;
        this.vitamin = vitamin;
        this.weight = weight;
        this.etc = etc;
        this.logDate = logDate;
    }

    public void update(String catNameSnapshot, Boolean defecation, Boolean vitamin, Double weight, String etc,
            String logDate) {
        this.catNameSnapshot = catNameSnapshot;
        this.defecation = defecation;
        this.vitamin = vitamin;
        this.weight = weight;
        this.etc = etc;
        this.logDate = logDate;
    }

    public void updateCatNameSnapshot(String catNameSnapshot) {
        this.catNameSnapshot = catNameSnapshot;
    }
}

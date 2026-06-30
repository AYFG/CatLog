package com.catlog.catlog_spring_back.medicallog;

import com.catlog.catlog_spring_back.cat.Cat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "medical_logs", uniqueConstraints = {
        @UniqueConstraint(name = "uk_medical_logs_cat", columnNames = "cat_id")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MedicalLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cat_id", nullable = false)
    private Cat cat;

    @Column(nullable = false, length = 255)
    private String catNameSnapshot;

    @Column(nullable = false, length = 50)
    private String healthCheckupDate;

    @Column(nullable = false)
    private Integer healthCycle;

    @Column(nullable = false, length = 50)
    private String heartWorm;

    @Column(nullable = false)
    private Integer heartWormCycle;

    public MedicalLog(Cat cat, String catNameSnapshot, String healthCheckupDate, Integer healthCycle, String heartWorm,
            Integer heartWormCycle) {
        this.cat = cat;
        this.catNameSnapshot = catNameSnapshot;
        this.healthCheckupDate = healthCheckupDate;
        this.healthCycle = healthCycle;
        this.heartWorm = heartWorm;
        this.heartWormCycle = heartWormCycle;
    }

    public void update(String catNameSnapshot, String healthCheckupDate, Integer healthCycle, String heartWorm,
            Integer heartWormCycle) {
        this.catNameSnapshot = catNameSnapshot;
        this.healthCheckupDate = healthCheckupDate;
        this.healthCycle = healthCycle;
        this.heartWorm = heartWorm;
        this.heartWormCycle = heartWormCycle;
    }

    public void updateCatNameSnapshot(String catNameSnapshot) {
        this.catNameSnapshot = catNameSnapshot;
    }
}

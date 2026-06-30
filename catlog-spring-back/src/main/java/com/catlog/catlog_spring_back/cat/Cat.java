package com.catlog.catlog_spring_back.cat;

import java.util.ArrayList;
import java.util.List;

import com.catlog.catlog_spring_back.dailylog.DailyLog;
import com.catlog.catlog_spring_back.medicallog.MedicalLog;
import com.catlog.catlog_spring_back.user.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cats")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Cat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, length = 50)
    private String birthDate;

    @Column(length = 100)
    private String catType;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @OneToMany(mappedBy = "cat", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<DailyLog> dailyLogs = new ArrayList<>();

    @OneToOne(mappedBy = "cat", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private MedicalLog medicalLog;

    public Cat(String name, String birthDate, String catType, User owner) {
        this.name = name;
        this.birthDate = birthDate;
        this.catType = catType;
        this.owner = owner;
    }

    public void update(String name, String birthDate, String catType) {
        this.name = name;
        this.birthDate = birthDate;
        this.catType = catType;
    }
}

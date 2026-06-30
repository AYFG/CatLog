package com.catlog.catlog_spring_back.cat;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CatRepository extends JpaRepository<Cat, Long> {

    List<Cat> findByOwnerId(Long ownerId);
}

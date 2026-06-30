package com.catlog.catlog_spring_back.cat;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.catlog.catlog_spring_back.cat.dto.CatCreateResponse;
import com.catlog.catlog_spring_back.cat.dto.CatListResponse;
import com.catlog.catlog_spring_back.cat.dto.CatResponse;
import com.catlog.catlog_spring_back.cat.dto.CreateCatRequest;
import com.catlog.catlog_spring_back.cat.dto.UpdateCatRequest;
import com.catlog.catlog_spring_back.common.ApiException;
import com.catlog.catlog_spring_back.common.CurrentUser;
import com.catlog.catlog_spring_back.common.OkMessageResponse;
import com.catlog.catlog_spring_back.dailylog.DailyLogRepository;
import com.catlog.catlog_spring_back.medicallog.MedicalLogRepository;
import com.catlog.catlog_spring_back.user.User;
import com.catlog.catlog_spring_back.user.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CatService {

    private final CatRepository catRepository;
    private final UserRepository userRepository;
    private final DailyLogRepository dailyLogRepository;
    private final MedicalLogRepository medicalLogRepository;
    private final CatMapper catMapper;
    private final CurrentUser currentUser;

    @Transactional
    public CatCreateResponse create(CreateCatRequest req, Authentication authentication) {
        Long authenticatedUserId = currentUser.id(authentication);
        Long ownerId = parseOwner(req.owner(), authenticatedUserId);
        if (!authenticatedUserId.equals(ownerId)) {
            throw new ApiException(403, "고양이 등록 권한이 없습니다.");
        }

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ApiException(404, "사용자를 찾을 수 없습니다."));

        Cat cat = catRepository.save(new Cat(req.name(), req.birthDate(), req.catType(), owner));
        return new CatCreateResponse(1, "고양이가 성공적으로 등록되었습니다.", catMapper.toDto(cat));
    }

    @Transactional(readOnly = true)
    public CatListResponse getByUser(Long userId, Authentication authentication) {
        Long authenticatedUserId = currentUser.id(authentication);
        if (!authenticatedUserId.equals(userId)) {
            throw new ApiException(403, "고양이 목록 조회 권한이 없습니다.");
        }

        List<CatResponse> cats = catRepository.findByOwnerId(userId).stream()
                .map(catMapper::toDto)
                .toList();
        return new CatListResponse(1, "고양이 목록을 성공적으로 가져왔습니다.", cats);
    }

    @Transactional
    public CatCreateResponse update(Long catId, UpdateCatRequest req, Authentication authentication) {
        Long authenticatedUserId = currentUser.id(authentication);
        Cat cat = findOwnedCat(catId, authenticatedUserId);
        cat.update(req.name(), req.birthDate(), req.catType());

        dailyLogRepository.findByCatId(catId)
                .forEach(log -> log.updateCatNameSnapshot(req.name()));
        medicalLogRepository.findByCatId(catId)
                .ifPresent(log -> log.updateCatNameSnapshot(req.name()));

        return new CatCreateResponse(1, "고양이의 정보를 성공적으로 수정했습니다.", catMapper.toDto(cat));
    }

    @Transactional
    public OkMessageResponse delete(Long catId, Authentication authentication) {
        Long authenticatedUserId = currentUser.id(authentication);
        Cat cat = findOwnedCat(catId, authenticatedUserId);
        catRepository.delete(cat);
        return new OkMessageResponse(1, "고양이가 성공적으로 삭제되었습니다.");
    }

    public Cat findOwnedCat(Long catId, Long ownerId) {
        Cat cat = catRepository.findById(catId)
                .orElseThrow(() -> new ApiException(404, "고양이를 찾을 수 없습니다."));
        if (!cat.getOwner().getId().equals(ownerId)) {
            throw new ApiException(403, "권한이 없습니다.");
        }
        return cat;
    }

    private Long parseOwner(String owner, Long authenticatedUserId) {
        if (owner == null || owner.isBlank()) {
            return authenticatedUserId;
        }
        try {
            return Long.parseLong(owner);
        } catch (NumberFormatException e) {
            throw new ApiException(400, "owner 값이 올바르지 않습니다.");
        }
    }
}

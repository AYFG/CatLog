package com.catlog.catlog_spring_back.cat;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.catlog.catlog_spring_back.cat.dto.CatCreateResponse;
import com.catlog.catlog_spring_back.cat.dto.CatListResponse;
import com.catlog.catlog_spring_back.cat.dto.CreateCatRequest;
import com.catlog.catlog_spring_back.cat.dto.UpdateCatRequest;
import com.catlog.catlog_spring_back.common.OkMessageResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/cat")
public class CatController {

    private final CatService catService;

    @PostMapping
    public ResponseEntity<CatCreateResponse> create(
            @Valid @RequestBody CreateCatRequest req,
            Authentication authentication) {
        return ResponseEntity.status(201).body(catService.create(req, authentication));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<CatListResponse> getByUser(
            @PathVariable Long userId,
            Authentication authentication) {
        return ResponseEntity.ok(catService.getByUser(userId, authentication));
    }

    @PutMapping("/{catId}")
    public ResponseEntity<CatCreateResponse> update(
            @PathVariable Long catId,
            @Valid @RequestBody UpdateCatRequest req,
            Authentication authentication) {
        return ResponseEntity.status(201).body(catService.update(catId, req, authentication));
    }

    @DeleteMapping("/{catId}")
    public ResponseEntity<OkMessageResponse> delete(
            @PathVariable Long catId,
            Authentication authentication) {
        return ResponseEntity.ok(catService.delete(catId, authentication));
    }
}

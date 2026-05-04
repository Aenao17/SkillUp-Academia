package com.stucanii.backend.controller;

import com.stucanii.backend.dto.LearningModuleDTO;
import com.stucanii.backend.service.LearningModuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modules")
@RequiredArgsConstructor
public class LearningModuleController {

    private final LearningModuleService moduleService;

    @GetMapping
    public List<LearningModuleDTO> getAllModules() {
        return moduleService.getAllModules();
    }
}
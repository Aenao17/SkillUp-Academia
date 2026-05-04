package com.stucanii.backend.util;

import com.stucanii.backend.model.*;
import com.stucanii.backend.repository.LearningModuleRepository;
import com.stucanii.backend.repository.LessonRepository;
import com.stucanii.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final LearningModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;

    @Override
    public void run(String @NonNull ... args) {
        createAdmin();
        createSampleModule();
    }

    // ================= ADMIN =================
    private void createAdmin() {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User user = new User();
            user.setUsername("admin");
            user.setPassword(Objects.requireNonNull(passwordEncoder.encode("admin")));
            user.setRole(Role.ADMIN);

            userRepository.save(user);
            System.out.println("✔ Admin created");
        }
    }

    // ================= MODULE DATA =================
    private void createSampleModule() {

        if (moduleRepository.count() > 0) return;

        // ===== LESSON 1 =====
        Lesson lesson1 = new Lesson();
        lesson1.setTitle("Communication Basics");
        lesson1.setDescription("Learn how to communicate effectively.");
        lesson1.setContent("Communication is the process of exchanging information...");

        LessonTest test1 = new LessonTest();
        test1.setTitle("Communication Test");
        test1.setPassingScore(75);

        lesson1.setTest(test1);

        // ===== LESSON 2 =====
        Lesson lesson2 = new Lesson();
        lesson2.setTitle("Active Listening");
        lesson2.setDescription("Improve your listening skills.");
        lesson2.setContent("Active listening means fully concentrating...");

        LessonTest test2 = new LessonTest();
        test2.setTitle("Listening Test");
        test2.setPassingScore(75);

        lesson2.setTest(test2);

        lessonRepository.saveAll(List.of(lesson1, lesson2));

        // ===== MODULE =====
        LearningModule module = new LearningModule();
        module.setTitle("Communication Skills");
        module.setDescription("Master essential communication skills.");

        module.setLessons(List.of(lesson1, lesson2));

        moduleRepository.save(module);

        System.out.println("✔ Sample module created");
    }
}
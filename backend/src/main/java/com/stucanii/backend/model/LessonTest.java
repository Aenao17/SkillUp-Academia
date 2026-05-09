package com.stucanii.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lesson_tests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Builder.Default
    private int passingScore = 75;

    @OneToOne
    @JoinColumn(name = "lesson_id", nullable = false, unique = true)
    private Lesson lesson;
}
package com.stucanii.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "lesson_tests")
public class LessonTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private int passingScore = 75;

    @OneToOne(mappedBy = "test")
    private Lesson lesson;
}
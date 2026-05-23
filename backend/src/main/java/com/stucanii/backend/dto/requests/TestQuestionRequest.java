package com.stucanii.backend.dto.requests;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TestQuestionRequest {
    private String questionText;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private Integer correctOption;
}
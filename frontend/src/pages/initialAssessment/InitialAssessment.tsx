import {
    IonButton,
    IonContent,
    IonIcon,
    IonInput,
    IonPage,
    useIonRouter,
    IonAlert,
} from "@ionic/react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    arrowBackOutline,
    chatbubbleOutline,
    arrowForwardOutline,
    starOutline,
    happyOutline,
    peopleOutline,
} from "ionicons/icons";

import SidebarNav from "../../components/SidebarNav/SidebarNav";
import MobileTabBar from "../../components/MobileTabBar/MobileTabBar";

import lumiMascot from "../../assets/lumi_fixed.svg";
import "./InitialAssessment.css";
import { assessmentData, ChoiceQuestion, InputQuestion } from "./assessmentData";

const InitialAssessment: React.FC = () => {
    const router = useIonRouter();
    const { t } = useTranslation();
    const contentRef = React.useRef<HTMLIonContentElement>(null);

    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [isComplete, setIsComplete] = useState(false);
    const [showExitWarning, setShowExitWarning] = useState(false);

    const currentSection = assessmentData[currentSectionIndex];
    const isInputSection = currentSection.type === "input-list";

    // Progress Calculation
    const totalQuestions = assessmentData.reduce((acc, sec) => acc + sec.questions.length, 0);
    let questionsProcessed = 0;
    for (let i = 0; i < currentSectionIndex; i++) {
        questionsProcessed += assessmentData[i].questions.length;
    }
    if (isInputSection) {
        // We consider all of them processed once they pass it, so for now just add 0 
        // to show starting of the section.
    } else {
        questionsProcessed += currentQuestionIndex;
    }
    const progressPercentage = Math.round((questionsProcessed / totalQuestions) * 100);

    const selectAnswer = (questionId: number, value: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleNext = () => {
        if (isInputSection) {
            if (currentSectionIndex < assessmentData.length - 1) {
                contentRef.current?.scrollToTop(300);
                setCurrentSectionIndex((prev) => prev + 1);
                setCurrentQuestionIndex(0);
            } else {
                contentRef.current?.scrollToTop(300);
                completeAssessment();
            }
        } else if (currentQuestionIndex < currentSection.questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else if (currentSectionIndex < assessmentData.length - 1) {
            contentRef.current?.scrollToTop(300);
            setCurrentSectionIndex((prev) => prev + 1);
            setCurrentQuestionIndex(0);
        } else {
            contentRef.current?.scrollToTop(300);
            completeAssessment();
        }
    };

    const handleBack = () => {
        if (isInputSection) {
            if (currentSectionIndex > 0) {
                contentRef.current?.scrollToTop(300);
                setCurrentSectionIndex((prev) => prev - 1);
                const prevSec = assessmentData[currentSectionIndex - 1];
                setCurrentQuestionIndex(prevSec.questions.length - 1);
            } else {
                setShowExitWarning(true);
            }
        } else if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        } else if (currentSectionIndex > 0) {
            contentRef.current?.scrollToTop(300);
            setCurrentSectionIndex((prev) => prev - 1);
            const prevSec = assessmentData[currentSectionIndex - 1];
            setCurrentQuestionIndex(prevSec.questions.length - 1);
        } else {
            setShowExitWarning(true);
        }
    };

    const completeAssessment = () => {
        localStorage.setItem("hasCompletedInitialAssessment", "true");
        setIsComplete(true);
    };

    const handleSkip = () => {
        completeAssessment();
    };

    const getAnswerNum = (id: number) => {
        return Number.parseInt(answers[id] || "0", 10);
    };

    const getCategoryScore = (categoryName: string) => {
        let totalPoints = 0;
        let questionsCount = 0;
        assessmentData.forEach(sec => {
            sec.questions.forEach((q) => {
                if ('category' in q && q.category === categoryName) {
                    totalPoints += getAnswerNum(q.id);
                    questionsCount++;
                }
            });
        });
        if (questionsCount === 0) return 0;
        return Math.round((totalPoints / (questionsCount * 5)) * 100);
    };

    let totalCommunicationScore = 0;
    
    let communicationStatusClass;
    let communicationStatusText;
    let communicationBarColor;

    let publicScore = 0;
    let meetingScore = 0;
    let groupScore = 0;
    let dyadScore = 0;
    let strangerScore = 0;
    let acquaintanceScore = 0;
    let friendScore = 0;

    let adaptabilityScore = 0;
    let eiScore = 0;
    let teamworkScore = 0;
    
    let lowestScoreCategory = "Communication";

    if (isComplete) {
        publicScore = Math.round((getAnswerNum(101) + getAnswerNum(108) + getAnswerNum(112)) / 3);
        meetingScore = Math.round((getAnswerNum(103) + getAnswerNum(106) + getAnswerNum(110)) / 3);
        groupScore = Math.round((getAnswerNum(104) + getAnswerNum(109) + getAnswerNum(111)) / 3);
        dyadScore = Math.round((getAnswerNum(102) + getAnswerNum(105) + getAnswerNum(107)) / 3);
        strangerScore = Math.round((getAnswerNum(101) + getAnswerNum(104) + getAnswerNum(107) + getAnswerNum(110)) / 4);
        acquaintanceScore = Math.round((getAnswerNum(102) + getAnswerNum(106) + getAnswerNum(109) + getAnswerNum(112)) / 4);
        friendScore = Math.round((getAnswerNum(103) + getAnswerNum(105) + getAnswerNum(108) + getAnswerNum(111)) / 4);

        totalCommunicationScore = Math.round((strangerScore + acquaintanceScore + friendScore) / 3);

        if (totalCommunicationScore >= 80) {
            communicationStatusClass = "good";
            communicationStatusText = "Excellent";
            communicationBarColor = "green";
        } else if (totalCommunicationScore >= 60) {
            communicationStatusClass = "yellow";
            communicationStatusText = "Good";
            communicationBarColor = "yellow";
        } else {
            communicationStatusClass = "needs-work";
            communicationStatusText = "Needs work";
            communicationBarColor = "red";
        }

        adaptabilityScore = getCategoryScore("Adaptability");
        eiScore = getCategoryScore("Emotional intelligence");
        teamworkScore = getCategoryScore("Teamwork");

        const categoryScores = [
            { name: "Communication", score: totalCommunicationScore },
            { name: "Adaptability", score: adaptabilityScore },
            { name: "Emotional Intelligence", score: eiScore },
            { name: "Teamwork", score: teamworkScore },
        ];
        
        categoryScores.sort((a, b) => a.score - b.score);
        lowestScoreCategory = categoryScores[0].name;
    }

    const renderScoreCard = (title: string, score: number, icon: string) => {
        let statusClass;
        let statusText;
        let barColor;

        if (score >= 80) {
            statusClass = "good";
            statusText = "Excellent";
            barColor = "green";
        } else if (score >= 60) {
            statusClass = "yellow";
            statusText = "Good";
            barColor = "yellow";
        } else {
            statusClass = "needs-work";
            statusText = "Needs work";
            barColor = "red";
        }

        return (
            <div className="score-card">
                <div className="score-header">
                    <div className="score-label">
                        {icon && <IonIcon icon={icon} />} {title}
                    </div>
                    <div className={`score-value ${statusClass}`}>
                        <strong>{score}%</strong> <span>{statusText}</span>
                    </div>
                </div>
                <div className="score-bar-bg">
                    <div className={`score-bar-fill ${barColor}`} style={{ width: `${score}%` }}></div>
                </div>
            </div>
        );
    };

    const canProceedInputSection = () => {
        return currentSection.questions.every((q) => {
            const ans = answers[q.id];
            if (!ans) return false;
            const num = Number.parseInt(ans, 10);
            return !Number.isNaN(num) && num >= 0 && num <= 100;
        });
    };

    const canProceedChoiceSection = () => {
        const q = currentSection.questions[currentQuestionIndex];
        return !!answers[q.id];
    };

    const canProceed = isInputSection ? canProceedInputSection() : canProceedChoiceSection();

    return (
        <IonPage>
            <IonContent ref={contentRef} fullscreen className="assessment-page">
                <div className="assessment-layout">
                    <SidebarNav />

                    <main className="assessment-into-container">
                        {!isComplete ? (
                            <div className="assessment-container">
                                {/* Quiz Header */}
                                <div className="assessment-top-banner">
                                    <div className="banner-nav">
                                        <button className="back-btn" onClick={handleBack}>
                                            <IonIcon icon={arrowBackOutline} /> {t("nav.back", "Back")}
                                        </button>
                                        <span className="banner-title">Soft Skills Assessment</span>
                                        <button className="skip-btn" onClick={handleSkip}>
                                            {t("assessment.skip", "Skip")}
                                        </button>
                                    </div>

                                    <div className="progress-container">
                                        <div className="progress-labels">
                                            <span>
                                                Test {currentSectionIndex + 1} of {assessmentData.length}
                                            </span>
                                            <span className="progress-percent">{progressPercentage}%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${progressPercentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Mascot Graphic */}
                                <div className="mascot-wrapper">
                                    <img src={lumiMascot} alt="Lumi Mascot" className="mascot-img" />
                                    <div className="mascot-question-mark">?</div>
                                </div>

                                {isInputSection ? (
                                    <div className="input-section-container">
                                        <div className="question-card section-card">
                                            <div className="question-category">
                                                {currentSection.icon && <IonIcon icon={currentSection.icon} />}
                                                <span>{currentSection.title}</span>
                                            </div>
                                            <p className="section-description">{currentSection.description}</p>
                                        </div>
                                        <h2 className="section-instruction">
                                            Dați note de la 0 = complet incompetent, până la 100 = competent.
                                        </h2>
                                        {currentSection.questions.map((q) => {
                                            const question = q as InputQuestion;
                                            const ansStr = answers[question.id];
                                            const ansNum = Number.parseInt(ansStr, 10);
                                            const isInvalid = ansStr ? (ansNum > 100 || ansNum < 0 || Number.isNaN(ansNum)) : false;

                                            return (
                                                <div key={question.id} className="input-question-card">
                                                    <p className="input-question-text">{question.question}</p>
                                                    <IonInput
                                                        type="number"
                                                        placeholder="0 - 100"
                                                        value={ansStr || ""}
                                                        onIonInput={(e) =>
                                                            selectAnswer(question.id, e.detail.value ?? "")
                                                        }
                                                        className={`number-input ${isInvalid ? "invalid-input" : ""}`}
                                                        min={0}
                                                        max={100}
                                                    />
                                                    {isInvalid && (
                                                        <p className="validation-error-text">
                                                            {t("assessment.validation", "The input must be between 0 and 100")}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="choice-section-container">
                                        {(() => {
                                            const q = currentSection.questions[
                                                currentQuestionIndex
                                            ] as ChoiceQuestion;
                                            return (
                                                <>
                                                    <div className="question-card">
                                                        <div className="question-category">
                                                            {currentSection.icon && <IonIcon icon={currentSection.icon} />}
                                                            <span>{currentSection.title}</span>
                                                        </div>
                                                        <p className="section-description">{currentSection.description}</p>
                                                        <h2 className="question-text">{q.question}</h2>
                                                    </div>

                                                    <div className="options-container">
                                                        {q.options.map((option) => {
                                                            const isSelected =
                                                                answers[q.id] === option.id;
                                                            return (
                                                                <button
                                                                    key={option.id}
                                                                    className={`option-btn ${
                                                                        isSelected ? "selected" : ""
                                                                    }`}
                                                                    onClick={() =>
                                                                        selectAnswer(q.id, option.id)
                                                                    }
                                                                >
                                                                    <div className="option-letter">
                                                                        {option.id}
                                                                    </div>
                                                                    <span className="option-text">
                                                                        {option.text}
                                                                    </span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                )}

                                <div className="action-container">
                                    <IonButton
                                        className="next-question-btn"
                                        expand="block"
                                        disabled={!canProceed}
                                        onClick={handleNext}
                                    >
                                        {t("assessment.next", "Next")}
                                        <IonIcon icon={arrowForwardOutline} slot="end" />
                                    </IonButton>
                                </div>
                            </div>
                        ) : (
                            <div className="assessment-container results-container">
                                {/* Results Header */}
                                <div className="results-top-banner">
                                    <h1>{t("assessment.complete", "Assessment Complete!")}</h1>
                                    <p>
                                        {t("assessment.stackUp", "Here's how your soft skills stack up")}
                                    </p>

                                    {/* Mascot Graphic Large */}
                                    <div className="mascot-wrapper large">
                                        <img src={lumiMascot} alt="Lumi Mascot" className="mascot-img" />
                                    </div>
                                </div>

                                {/* Recommendation Card */}
                                <div className="recommendation-card">
                                    <div className="recommendation-content">
                                        <div className="rec-icon">
                                            <IonIcon icon={starOutline} />
                                        </div>
                                        <div className="rec-text">
                                            <h3>{t("assessment.startHere", `Start Here: ${lowestScoreCategory}`)}</h3>
                                            <p>
                                                {t(
                                                    "assessment.recDesc",
                                                    "Your assessment shows this is your highest growth opportunity"
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <IonButton
                                        className="go-module-btn"
                                        expand="block"
                                        onClick={() => router.push("/modules")}
                                    >
                                        {t("assessment.goModule", `Go to ${lowestScoreCategory} Module`)}
                                        <IonIcon icon={arrowForwardOutline} slot="end" />
                                    </IonButton>
                                </div>

                                {/* Scores Section */}
                                <div className="scores-section">
                                    <h3 className="scores-title">
                                        {t("assessment.yourScores", "Your Skill Scores")}
                                    </h3>

                                    <div className="score-card">
                                        <div className="score-header">
                                            <div className="score-label">
                                                <IonIcon icon={chatbubbleOutline} /> Communication
                                            </div>
                                            <div className={`score-value ${communicationStatusClass}`}>
                                                <strong>{totalCommunicationScore}%</strong>{" "}
                                                <span>{communicationStatusText}</span>
                                            </div>
                                        </div>
                                        <div className="score-bar-bg">
                                            <div
                                                className={`score-bar-fill ${communicationBarColor}`}
                                                style={{ width: `${totalCommunicationScore}%` }}
                                            ></div>
                                        </div>
                                        <div className="subscore-container">
                                            <h4>Subgroups</h4>
                                            
                                            <div className="subscore-item">
                                                <div className="subscore-header"><span>Public</span><span>{publicScore}%</span></div>
                                                <div className="subscore-bar-bg"><div className="subscore-bar-fill" style={{ width: `${publicScore}%` }}></div></div>
                                            </div>
                                            <div className="subscore-item">
                                                <div className="subscore-header"><span>Meeting</span><span>{meetingScore}%</span></div>
                                                <div className="subscore-bar-bg"><div className="subscore-bar-fill" style={{ width: `${meetingScore}%` }}></div></div>
                                            </div>
                                            <div className="subscore-item">
                                                <div className="subscore-header"><span>Group</span><span>{groupScore}%</span></div>
                                                <div className="subscore-bar-bg"><div className="subscore-bar-fill" style={{ width: `${groupScore}%` }}></div></div>
                                            </div>
                                            <div className="subscore-item">
                                                <div className="subscore-header"><span>Dyad</span><span>{dyadScore}%</span></div>
                                                <div className="subscore-bar-bg"><div className="subscore-bar-fill" style={{ width: `${dyadScore}%` }}></div></div>
                                            </div>
                                            <div className="subscore-item">
                                                <div className="subscore-header"><span>Stranger</span><span>{strangerScore}%</span></div>
                                                <div className="subscore-bar-bg"><div className="subscore-bar-fill" style={{ width: `${strangerScore}%` }}></div></div>
                                            </div>
                                            <div className="subscore-item">
                                                <div className="subscore-header"><span>Acquaintance</span><span>{acquaintanceScore}%</span></div>
                                                <div className="subscore-bar-bg"><div className="subscore-bar-fill" style={{ width: `${acquaintanceScore}%` }}></div></div>
                                            </div>
                                            <div className="subscore-item">
                                                <div className="subscore-header"><span>Friend</span><span>{friendScore}%</span></div>
                                                <div className="subscore-bar-bg"><div className="subscore-bar-fill" style={{ width: `${friendScore}%` }}></div></div>
                                            </div>
                                        </div>
                                    </div>

                                    {renderScoreCard("Adaptability", adaptabilityScore, chatbubbleOutline)}
                                    {renderScoreCard("Emotional Intelligence", eiScore, happyOutline)}
                                    {renderScoreCard("Teamwork", teamworkScore, peopleOutline)}
                                </div>
                            </div>
                        )}
                    </main>
                </div>
                
                <IonAlert
                    isOpen={showExitWarning}
                    onDidDismiss={() => setShowExitWarning(false)}
                    header={t("assessment.exitWarningTitle", "Leave Assessment?")}
                    message={t(
                        "assessment.exitWarningMessage",
                        "If you leave now, all your current progress will be lost. Are you sure you want to exit?"
                    )}
                    buttons={[
                        {
                            text: t("assessment.stay", "Stay"),
                            role: "cancel",
                            handler: () => {
                                setShowExitWarning(false);
                            },
                        },
                        {
                            text: t("assessment.exit", "Exit"),
                            role: "destructive",
                            handler: () => {
                                setShowExitWarning(false);
                                router.goBack();
                            },
                        },
                    ]}
                />
                
                <MobileTabBar />
            </IonContent>
        </IonPage>
    );
};

export default InitialAssessment;

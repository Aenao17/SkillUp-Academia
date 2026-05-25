import {
    IonButton,
    IonContent,
    IonIcon,
    IonPage,
    useIonRouter,
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

// Mock Data for the Assessment
const mockQuestions = [
    {
        id: 1,
        category: "Communication",
        icon: chatbubbleOutline,
        question: "How do you typically handle disagreements with colleagues?",
        options: [
            { id: "A", text: "I listen to both sides and find a compromise" },
            { id: "B", text: "I prefer to avoid conflict and stay neutral" },
            { id: "C", text: "I express my opinion clearly and firmly" },
            { id: "D", text: "I ask a trusted colleague to mediate" },
        ],
    },
    {
        id: 2,
        category: "Empathy",
        icon: happyOutline,
        question: "When a team member is visibly stressed, what is your first reaction?",
        options: [
            { id: "A", text: "Ask if they need help with their workload" },
            { id: "B", text: "Give them space to figure it out" },
            { id: "C", text: "Report it to the manager" },
            { id: "D", text: "Invite them for a quick coffee chat" },
        ],
    },
    {
        id: 3,
        category: "Teamwork",
        icon: peopleOutline,
        question: "How do you approach a project where roles are poorly defined?",
        options: [
            { id: "A", text: "Take the lead and assign tasks" },
            { id: "B", text: "Wait for the manager to clarify" },
            { id: "C", text: "Call a quick team huddle to decide together" },
            { id: "D", text: "Just start working on what I know best" },
        ],
    },
];

const InitialAssessment: React.FC = () => {
    const router = useIonRouter();
    const { t } = useTranslation();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [isComplete, setIsComplete] = useState(false);

    const currentQuestion = mockQuestions[currentIndex];
    const progressPercentage = Math.round(((currentIndex + 1) / mockQuestions.length) * 100);

    const selectAnswer = (optionId: string) => {
        setAnswers((prev) => ({ ...prev, [currentIndex]: optionId }));
    };

    const handleNext = () => {
        if (currentIndex < mockQuestions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            setIsComplete(true);
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        } else {
            router.goBack();
        }
    };

    return (
        <IonPage>
            <IonContent fullscreen className="assessment-page">
                {/* Updated Layout structure to match LessonTest */}
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
                                        <span className="banner-title">{t("assessment.title", "Soft Skills Assessment")}</span>
                                        <button className="skip-btn" onClick={() => setIsComplete(true)}>
                                            {t("assessment.skip", "Skip")}
                                        </button>
                                    </div>

                                    <div className="progress-container">
                                        <div className="progress-labels">
                                            <span>Question {currentIndex + 1} of {mockQuestions.length}</span>
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

                                {/* Question Card */}
                                <div className="question-card">
                                    <div className="question-category">
                                        <IonIcon icon={currentQuestion.icon} />
                                        <span>{currentQuestion.category}</span>
                                    </div>
                                    <h2 className="question-text">{currentQuestion.question}</h2>
                                </div>

                                {/* Options */}
                                <div className="options-container">
                                    {currentQuestion.options.map((option) => {
                                        const isSelected = answers[currentIndex] === option.id;
                                        return (
                                            <button
                                                key={option.id}
                                                className={`option-btn ${isSelected ? "selected" : ""}`}
                                                onClick={() => selectAnswer(option.id)}
                                            >
                                                <div className="option-letter">{option.id}</div>
                                                <span className="option-text">{option.text}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="action-container">
                                    <IonButton
                                        className="next-question-btn"
                                        expand="block"
                                        disabled={!answers[currentIndex]}
                                        onClick={handleNext}
                                    >
                                        {t("assessment.next", "Next Question")}
                                        <IonIcon icon={arrowForwardOutline} slot="end" />
                                    </IonButton>
                                </div>
                            </div>
                        ) : (
                            <div className="assessment-container results-container">
                                {/* Results Header */}
                                <div className="results-top-banner">
                                    <h1>{t("assessment.complete", "Assessment Complete!")}</h1>
                                    <p>{t("assessment.stackUp", "Here's how your soft skills stack up")}</p>
                                    
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
                                            <h3>{t("assessment.startHere", "Start Here: Communication")}</h3>
                                            <p>{t("assessment.recDesc", "Your assessment shows this is your highest growth opportunity")}</p>
                                        </div>
                                    </div>
                                    <IonButton
                                        className="go-module-btn"
                                        expand="block"
                                        onClick={() => router.push("/modules")}
                                    >
                                        {t("assessment.goModule", "Go to Module")}
                                        <IonIcon icon={arrowForwardOutline} slot="end" />
                                    </IonButton>
                                </div>

                                {/* Scores Section */}
                                <div className="scores-section">
                                    <h3 className="scores-title">{t("assessment.yourScores", "Your Skill Scores")}</h3>
                                    
                                    <div className="score-card">
                                        <div className="score-header">
                                            <div className="score-label">
                                                <IonIcon icon={chatbubbleOutline} /> Communication
                                            </div>
                                            <div className="score-value needs-work">
                                                <strong>62%</strong> <span>Needs work</span>
                                            </div>
                                        </div>
                                        <div className="score-bar-bg"><div className="score-bar-fill red" style={{ width: "62%" }}></div></div>
                                    </div>

                                    <div className="score-card">
                                        <div className="score-header">
                                            <div className="score-label">
                                                <IonIcon icon={happyOutline} /> Empathy
                                            </div>
                                            <div className="score-value good">
                                                <strong>74%</strong> <span>Good</span>
                                            </div>
                                        </div>
                                        <div className="score-bar-bg"><div className="score-bar-fill yellow" style={{ width: "74%" }}></div></div>
                                    </div>

                                    <div className="score-card">
                                        <div className="score-header">
                                            <div className="score-label">
                                                <IonIcon icon={peopleOutline} /> Teamwork
                                            </div>
                                            <div className="score-value needs-work">
                                                <strong>55%</strong> <span>Needs work</span>
                                            </div>
                                        </div>
                                        <div className="score-bar-bg"><div className="score-bar-fill red" style={{ width: "55%" }}></div></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
                <MobileTabBar />
            </IonContent>
        </IonPage>
    );
};

export default InitialAssessment;
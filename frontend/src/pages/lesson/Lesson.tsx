import {
    IonButton,
    IonCard,
    IonCardContent,
    IonContent,
    IonIcon,
    IonPage,
    IonSpinner,
} from "@ionic/react";
import {
    arrowBackOutline,
    checkmarkCircleOutline,
    documentTextOutline,
    trophyOutline,
    playCircleOutline,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useIonRouter } from "@ionic/react";
import { useParams } from "react-router";
import SidebarNav from "../../components/SidebarNav/SidebarNav";
import MobileTabBar from "../../components/MobileTabBar/MobileTabBar";
import { getLessonById, LessonDetailsDto } from "../../api/api";
import "./Lesson.css";

const Lesson: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const router = useIonRouter();

    const [lesson, setLesson] = useState<LessonDetailsDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLesson = async () => {
            try {
                const data = await getLessonById(id);
                setLesson(data);
            } catch (error) {
                console.error("Failed to load lesson", error);
            } finally {
                setLoading(false);
            }
        };

        loadLesson();
    }, [id]);

    return (
        <IonPage>
            <IonContent fullscreen className="lesson-page">
                <div className="lesson-layout">
                    <SidebarNav />

                    <main className="lesson-content">
                        <div className="lesson-container">
                            <IonButton
                                fill="clear"
                                className="back-button"
                                onClick={() => router.goBack()}
                            >
                                <IonIcon icon={arrowBackOutline} slot="start" />
                                Back
                            </IonButton>

                            {loading ? (
                                <div className="lesson-loading">
                                    <IonSpinner name="crescent" />
                                    <p>Loading lesson...</p>
                                </div>
                            ) : lesson ? (
                                <>
                                    <section className="lesson-hero">
                                        <p className="lesson-eyebrow">Lesson</p>
                                        <h1>{lesson.title}</h1>
                                        <p>{lesson.description}</p>
                                    </section>

                                    <section className="lesson-grid">
                                        <IonCard className="lesson-main-card">
                                            <IonCardContent>
                                                <div className="lesson-section-title">
                                                    <IonIcon icon={documentTextOutline} />
                                                    <h2>Lesson content</h2>
                                                </div>

                                                <p className="lesson-text">{lesson.content}</p>
                                            </IonCardContent>
                                        </IonCard>

                                        <aside className="lesson-side">
                                            <IonCard className="lesson-side-card">
                                                <IonCardContent>
                                                    <IonIcon icon={checkmarkCircleOutline} />
                                                    <h3>Status</h3>
                                                    <p>
                                                        {lesson.completed
                                                            ? "Completed"
                                                            : "Not completed"}
                                                    </p>
                                                </IonCardContent>
                                            </IonCard>

                                            <IonCard className="lesson-side-card">
                                                <IonCardContent>
                                                    <IonIcon icon={trophyOutline} />
                                                    <h3>Score</h3>
                                                    <p>
                                                        {lesson.score !== null
                                                            ? `${lesson.score}%`
                                                            : "No score yet"}
                                                    </p>
                                                </IonCardContent>
                                            </IonCard>

                                            {lesson.test && (
                                                <IonCard className="lesson-side-card">
                                                    <IonCardContent>
                                                        <IonIcon icon={playCircleOutline} />
                                                        <h3>{lesson.test.title}</h3>
                                                        <p>Passing score: {lesson.test.passingScore}%</p>

                                                        <IonButton
                                                            expand="block"
                                                            onClick={() => router.push(`/lessons/${lesson.id}/test`)}
                                                        >
                                                            Start test
                                                        </IonButton>
                                                    </IonCardContent>
                                                </IonCard>
                                            )}
                                        </aside>
                                    </section>
                                </>
                            ) : (
                                <p>Lesson not found.</p>
                            )}
                        </div>
                    </main>
                </div>

                <MobileTabBar />
            </IonContent>
        </IonPage>
    );
};

export default Lesson;
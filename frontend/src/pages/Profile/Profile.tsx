import {
    IonAvatar,
    IonCard,
    IonCardContent,
    IonContent,
    IonIcon,
    IonPage,
    IonSpinner,
} from "@ionic/react";
import {
    personCircleOutline,
    trophyOutline,
    checkmarkCircleOutline,
    schoolOutline,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SidebarNav from "../../components/SidebarNav/SidebarNav";
import MobileTabBar from "../../components/MobileTabBar/MobileTabBar";
import {
    CurrentUserDto,
    getCurrentUser,
    getUserProgress,
    UserProgressDto,
} from "../../api/api";
import "./Profile.css";

const Profile: React.FC = () => {
    const [user, setUser] = useState<CurrentUserDto | null>(null);
    const [progress, setProgress] = useState<UserProgressDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const [userData, progressData] = await Promise.all([
                    getCurrentUser(),
                    getUserProgress(),
                ]);

                setUser(userData);
                setProgress(progressData);
            } catch (error) {
                console.error("Failed to load profile", error);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const completedLessons = progress.filter((item) => item.completed).length;

    const { t } = useTranslation();

    const averageScore =
        progress.length > 0
            ? Math.round(
                progress.reduce((sum, item) => sum + (item.score || 0), 0) /
                progress.length
            )
            : 0;

    return (
        <IonPage>
            <IonContent fullscreen className="profile-page">
                <div className="profile-layout">
                    <SidebarNav />

                    <main className="profile-content">
                        <div className="profile-container">
                            <section className="profile-hero">
                                <p className="profile-eyebrow">{t("profile.eyebrow")}</p>
                                <h1>{t("profile.title")}</h1>
                                <p className="profile-subtitle">
                                    {t("profile.subtitle")}
                                </p>
                            </section>

                            {loading ? (
                                <div className="profile-loading">
                                    <IonSpinner name="crescent" />
                                    <p>{t("profile.loading")}</p>
                                </div>
                            ) : (
                                <>
                                    <IonCard className="profile-user-card">
                                        <IonCardContent>
                                            <div className="profile-user-info">
                                                <IonAvatar className="profile-avatar">
                                                    <IonIcon icon={personCircleOutline} />
                                                </IonAvatar>

                                                <div>
                                                    <h2>{user?.username}</h2>
                                                    <p>{user?.role}</p>
                                                </div>
                                            </div>
                                        </IonCardContent>
                                    </IonCard>

                                    <section className="profile-stats">
                                        <IonCard className="profile-stat-card">
                                            <IonCardContent>
                                                <IonIcon icon={schoolOutline} />
                                                <h3>{progress.length}</h3>
                                                <p>{t("profile.totalLessons")}</p>
                                            </IonCardContent>
                                        </IonCard>

                                        <IonCard className="profile-stat-card">
                                            <IonCardContent>
                                                <IonIcon icon={checkmarkCircleOutline} />
                                                <h3>{completedLessons}</h3>
                                                <p>{t("profile.completed")}</p>
                                            </IonCardContent>
                                        </IonCard>

                                        <IonCard className="profile-stat-card">
                                            <IonCardContent>
                                                <IonIcon icon={trophyOutline} />
                                                <h3>{averageScore}%</h3>
                                                <p>{t("profile.averageScore")}</p>
                                            </IonCardContent>
                                        </IonCard>
                                    </section>

                                    <section className="profile-progress-section">
                                        <h2>{t("profile.learningProgress")}</h2>

                                        {progress.length === 0 ? (
                                            <p className="profile-empty">{t("profile.noProgress")}</p>
                                        ) : (
                                            <div className="profile-progress-list">
                                                {progress.map((item) => (
                                                    <IonCard
                                                        key={item.lessonId}
                                                        className="profile-progress-card"
                                                    >
                                                        <IonCardContent>
                                                            <div>
                                                                <h3>{item.lessonTitle}</h3>
                                                                <p>
                                                                    {item.completed
                                                                        ? t("profile.lessonCompleted")
                                                                        : t("profile.lessonNotCompleted")}
                                                                </p>
                                                            </div>

                                                            <span className="profile-score">
                                                                {item.score}%
                                                            </span>
                                                        </IonCardContent>
                                                    </IonCard>
                                                ))}
                                            </div>
                                        )}
                                    </section>
                                </>
                            )}
                        </div>
                    </main>
                </div>

                <MobileTabBar />
            </IonContent>
        </IonPage>
    );
};

export default Profile;
import { IonContent, IonIcon, IonPage, IonSpinner } from "@ionic/react";
import {
    arrowBackOutline,
    flashOutline,
    ribbonOutline,
    rocketOutline,
    schoolOutline,
    starOutline,
    trophyOutline,
    checkmarkDoneOutline,
    lockClosedOutline,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SidebarNav from "../../components/SidebarNav/SidebarNav";
import MobileTabBar from "../../components/MobileTabBar/MobileTabBar";
import { getUserProgress, UserProgressDto } from "../../api/api";
import "./Achievements.css";

type AchievementDef = {
    id: string;
    icon: string;
    color: string;
    earned: (p: UserProgressDto[]) => boolean;
};

const ACHIEVEMENT_DEFS: AchievementDef[] = [
    {
        id: "firstStep",
        icon: rocketOutline,
        color: "#6c5cff",
        earned: (p) => p.some((l) => l.completed),
    },
    {
        id: "onARoll",
        icon: flashOutline,
        color: "#f59e0b",
        earned: (p) => p.filter((l) => l.completed).length >= 3,
    },
    {
        id: "dedicated",
        icon: schoolOutline,
        color: "#10b981",
        earned: (p) => p.filter((l) => l.completed).length >= 5,
    },
    {
        id: "tenLessons",
        icon: checkmarkDoneOutline,
        color: "#2f4be8",
        earned: (p) => p.filter((l) => l.completed).length >= 10,
    },
    {
        id: "highAchiever",
        icon: starOutline,
        color: "#f59e0b",
        earned: (p) => p.some((l) => (l.score ?? 0) >= 90),
    },
    {
        id: "perfectionist",
        icon: trophyOutline,
        color: "#e53935",
        earned: (p) => p.some((l) => (l.score ?? 0) >= 100),
    },
    {
        id: "consistent",
        icon: ribbonOutline,
        color: "#00897b",
        earned: (p) => {
            if (p.length === 0) return false;
            const avg = p.reduce((s, l) => s + (l.score ?? 0), 0) / p.length;
            return avg >= 80;
        },
    },
];

const AchievementsPage: React.FC = () => {
    const history = useHistory();
    const { t } = useTranslation();

    const [progress, setProgress] = useState<UserProgressDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserProgress()
            .then(setProgress)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const earned = ACHIEVEMENT_DEFS.filter((a) => a.earned(progress));
    const locked = ACHIEVEMENT_DEFS.filter((a) => !a.earned(progress));

    return (
        <IonPage>
            <IonContent fullscreen className="ach-page">
                <div className="ach-layout">
                    <SidebarNav />

                    <main className="ach-main">
                        {/* Mobile header */}
                        <div className="ach-mobile-header">
                            <button
                                className="ach-back-btn"
                                onClick={() => history.goBack()}
                                aria-label="Back"
                            >
                                <IonIcon icon={arrowBackOutline} />
                            </button>
                            <p className="ach-title">{t("achievements.title")}</p>
                            <span className="ach-header-spacer" />
                        </div>

                        {/* Desktop header */}
                        <div className="ach-desktop-header">
                            <button className="ach-back-link" onClick={() => history.goBack()}>
                                <IonIcon icon={arrowBackOutline} /> {t("achievements.backToSettings")}
                            </button>
                            <h1>{t("achievements.title")}</h1>
                            <p className="ach-subtitle">{t("achievements.subtitle")}</p>
                        </div>

                        <div className="ach-content">
                            {loading ? (
                                <div className="ach-loading">
                                    <IonSpinner name="crescent" />
                                </div>
                            ) : (
                                <>
                                    {/* Earned */}
                                    <p className="ach-section-label">
                                        {t("achievements.earnedSection")} ({earned.length})
                                    </p>

                                    {earned.length === 0 ? (
                                        <p className="ach-empty">{t("achievements.noEarned")}</p>
                                    ) : (
                                        <div className="ach-grid">
                                            {earned.map((a) => (
                                                <div key={a.id} className="ach-badge ach-badge--earned">
                                                    <div
                                                        className="ach-badge-icon"
                                                        style={{ background: `${a.color}1a`, color: a.color }}
                                                    >
                                                        <IonIcon icon={a.icon} />
                                                    </div>
                                                    <p className="ach-badge-name">
                                                        {t(`achievements.a_${a.id}_name`)}
                                                    </p>
                                                    <p className="ach-badge-desc">
                                                        {t(`achievements.a_${a.id}_desc`)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Locked */}
                                    {locked.length > 0 && (
                                        <>
                                            <p className="ach-section-label">
                                                {t("achievements.lockedSection")} ({locked.length})
                                            </p>
                                            <div className="ach-grid">
                                                {locked.map((a) => (
                                                    <div key={a.id} className="ach-badge ach-badge--locked">
                                                        <div className="ach-badge-icon ach-badge-icon--locked">
                                                            <IonIcon icon={lockClosedOutline} />
                                                        </div>
                                                        <p className="ach-badge-name">
                                                            {t(`achievements.a_${a.id}_name`)}
                                                        </p>
                                                        <p className="ach-badge-desc">
                                                            {t(`achievements.a_${a.id}_desc`)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </main>
                </div>
            </IonContent>

            <MobileTabBar />
        </IonPage>
    );
};

export default AchievementsPage;

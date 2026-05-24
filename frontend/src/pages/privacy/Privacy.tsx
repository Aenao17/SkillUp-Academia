import { IonAlert, IonContent, IonIcon, IonPage, IonToggle } from "@ionic/react";
import {
    arrowBackOutline,
    cloudDownloadOutline,
    shieldCheckmarkOutline,
    trashOutline,
} from "ionicons/icons";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SidebarNav from "../../components/SidebarNav/SidebarNav";
import MobileTabBar from "../../components/MobileTabBar/MobileTabBar";
import { clearTokens } from "../../auth/authStorage";
import { deleteCurrentUser } from "../../api/api";
import "./Privacy.css";

const ANALYTICS_KEY = "skillup_analytics";
const RECOMMENDATIONS_KEY = "skillup_recommendations";

const PrivacyPage: React.FC = () => {
    const history = useHistory();
    const { t } = useTranslation();

    const [analytics, setAnalytics] = useState<boolean>(
        localStorage.getItem(ANALYTICS_KEY) !== "false"
    );
    const [recommendations, setRecommendations] = useState<boolean>(
        localStorage.getItem(RECOMMENDATIONS_KEY) !== "false"
    );
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    const handleAnalyticsChange = (val: boolean) => {
        setAnalytics(val);
        localStorage.setItem(ANALYTICS_KEY, String(val));
    };

    const handleRecommendationsChange = (val: boolean) => {
        setRecommendations(val);
        localStorage.setItem(RECOMMENDATIONS_KEY, String(val));
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteCurrentUser();
        } catch {
            // account deleted or token already invalid — proceed anyway
        }
        clearTokens();
        history.replace("/login");
    };

    return (
        <IonPage>
            <IonContent fullscreen className="privacy-page">
                <div className="privacy-layout">
                    <SidebarNav />

                    <main className="privacy-main">
                        {/* Mobile header */}
                        <div className="privacy-mobile-header">
                            <button
                                className="privacy-back-btn"
                                onClick={() => history.goBack()}
                                aria-label="Back"
                            >
                                <IonIcon icon={arrowBackOutline} />
                            </button>
                            <p className="privacy-title">{t("privacy.title")}</p>
                            <span className="privacy-header-spacer" />
                        </div>

                        {/* Desktop header */}
                        <div className="privacy-desktop-header">
                            <button className="privacy-back-link" onClick={() => history.goBack()}>
                                <IonIcon icon={arrowBackOutline} /> {t("privacy.backToSettings")}
                            </button>
                            <h1>{t("privacy.title")}</h1>
                            <p className="privacy-subtitle">{t("privacy.subtitle")}</p>
                        </div>

                        <div className="privacy-content">
                            {/* Data & Analytics */}
                            <p className="privacy-section-label">{t("privacy.analyticsSection")}</p>
                            <div className="privacy-card">
                                <div className="privacy-row">
                                    <span className="privacy-row-icon privacy-row-icon--blue">
                                        <IonIcon icon={shieldCheckmarkOutline} />
                                    </span>
                                    <div className="privacy-row-text">
                                        <span className="privacy-row-label">{t("privacy.analytics")}</span>
                                        <span className="privacy-row-desc">{t("privacy.analyticsDesc")}</span>
                                    </div>
                                    <IonToggle
                                        checked={analytics}
                                        onIonChange={(e) => handleAnalyticsChange(e.detail.checked)}
                                        className="privacy-toggle"
                                    />
                                </div>

                                <div className="privacy-divider" />

                                <div className="privacy-row">
                                    <span className="privacy-row-icon privacy-row-icon--purple">
                                        <IonIcon icon={shieldCheckmarkOutline} />
                                    </span>
                                    <div className="privacy-row-text">
                                        <span className="privacy-row-label">{t("privacy.recommendations")}</span>
                                        <span className="privacy-row-desc">{t("privacy.recommendationsDesc")}</span>
                                    </div>
                                    <IonToggle
                                        checked={recommendations}
                                        onIonChange={(e) => handleRecommendationsChange(e.detail.checked)}
                                        className="privacy-toggle"
                                    />
                                </div>
                            </div>

                            {/* Your Data */}
                            <p className="privacy-section-label">{t("privacy.dataSection")}</p>
                            <div className="privacy-card">
                                <button className="privacy-row privacy-row--btn">
                                    <span className="privacy-row-icon privacy-row-icon--teal">
                                        <IonIcon icon={cloudDownloadOutline} />
                                    </span>
                                    <span className="privacy-row-label">{t("privacy.downloadData")}</span>
                                </button>

                                <div className="privacy-divider" />

                                <button
                                    className="privacy-row privacy-row--btn privacy-row--danger"
                                    onClick={() => setShowDeleteAlert(true)}
                                >
                                    <span className="privacy-row-icon privacy-row-icon--red">
                                        <IonIcon icon={trashOutline} />
                                    </span>
                                    <span className="privacy-row-label">{t("privacy.deleteAccount")}</span>
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </IonContent>

            <MobileTabBar />

            <IonAlert
                isOpen={showDeleteAlert}
                onDidDismiss={() => setShowDeleteAlert(false)}
                header={t("privacy.deleteTitle")}
                message={t("privacy.deleteMessage")}
                buttons={[
                    { text: t("privacy.cancel"), role: "cancel" },
                    {
                        text: t("privacy.deleteConfirm"),
                        role: "destructive",
                        handler: handleDeleteAccount,
                    },
                ]}
            />
        </IonPage>
    );
};

export default PrivacyPage;

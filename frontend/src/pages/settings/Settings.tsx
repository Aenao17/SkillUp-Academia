import {
    IonAlert,
    IonContent,
    IonIcon,
    IonPage,
    IonToggle,
} from "@ionic/react";
import {
    globeOutline,
    notificationsOutline,
    volumeHighOutline,
    timeOutline,
    shieldOutline,
    trophyOutline,
    helpCircleOutline,
    chevronForwardOutline,
    logOutOutline,
    createOutline,
    keyOutline,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LANGUAGE_KEY, LANGUAGES, Language } from "../language/Language";
import SidebarNav from "../../components/SidebarNav/SidebarNav";
import MobileTabBar from "../../components/MobileTabBar/MobileTabBar";
import { getCurrentUser, CurrentUserDto, changeMyPassword } from "../../api/api";
import { clearTokens } from "../../auth/authStorage";
import { isSoundEnabled, setSoundEnabled } from "../../util/soundEffects";
import lumiSvg from "../../assets/lumi_fixed.svg";
import "./Settings.css";

const Settings: React.FC = () => {
    const [user, setUser] = useState<CurrentUserDto | null>(null);
    const [notifications, setNotifications] = useState(true);
    const [soundEffects, setSoundEffects] = useState(isSoundEnabled);
    const [showEditAlert, setShowEditAlert] = useState(false);
    const history = useHistory();

    const activeLangCode = localStorage.getItem(LANGUAGE_KEY) ?? "en";
    const activeLang = LANGUAGES.find((l: Language) => l.code === activeLangCode) ?? LANGUAGES[0];
    const { t } = useTranslation();

    useEffect(() => {
        getCurrentUser().then(setUser).catch(console.error);
    }, []);

    const handleLogOut = () => {
        clearTokens();
        history.replace("/login");
    };

    return (
        <IonPage>
            <IonContent fullscreen className="settings-page">
                <div className="settings-layout">
                    <SidebarNav />

                    <main className="settings-main">
                        <div className="settings-mobile-header">
                            <p className="settings-title-label">{t("settings.title")}</p>
                            <div className="settings-user-row">
                                <div className="settings-avatar"><img src={lumiSvg} alt="Lumi" className="mascot-img" /></div>
                                <div className="settings-user-text">
                                    <h2 className="settings-username">{user?.username ?? "—"}</h2>
                                    <p className="settings-role">{user?.role?.toLowerCase()}</p>
                                </div>
                                <button className="settings-edit-btn" aria-label="Edit profile" onClick={() => setShowEditAlert(true)}>
                                    <IonIcon icon={createOutline} />
                                </button>
                            </div>
                        </div>

                        <div className="settings-content">
                            <p className="settings-section-label">{t("settings.preferences")}</p>
                            <div className="settings-card">
                                <button
                                    className="settings-row settings-row--btn"
                                    onClick={() => history.push("/settings/language")}
                                >
                                    <span className="settings-row-icon settings-row-icon--blue">
                                        <IonIcon icon={globeOutline} />
                                    </span>
                                    <span className="settings-row-label">{t("settings.language")}</span>
                                    <span className="settings-row-value">{activeLang.flag} {activeLang.label}</span>
                                    <IonIcon icon={chevronForwardOutline} className="settings-chevron" />
                                </button>

                                <div className="settings-divider" />

                                <div className="settings-row">
                                    <span className="settings-row-icon settings-row-icon--yellow">
                                        <IonIcon icon={notificationsOutline} />
                                    </span>
                                    <span className="settings-row-label">{t("settings.notifications")}</span>
                                    <IonToggle
                                        checked={notifications}
                                        onIonChange={(e) => setNotifications(e.detail.checked)}
                                        className="settings-toggle"
                                    />
                                </div>

                                <div className="settings-divider" />

                                <div className="settings-row">
                                    <span className="settings-row-icon settings-row-icon--teal">
                                        <IonIcon icon={volumeHighOutline} />
                                    </span>
                                    <span className="settings-row-label">{t("settings.soundEffects")}</span>
                                    <IonToggle
                                        checked={soundEffects}
                                        onIonChange={(e) => {
                                            setSoundEffects(e.detail.checked);
                                            setSoundEnabled(e.detail.checked);
                                        }}
                                        className="settings-toggle"
                                    />
                                </div>

                                <div className="settings-divider" />

                                <button className="settings-row settings-row--btn" onClick={() => history.push("/settings/daily-reminder")}>
                                    <span className="settings-row-icon settings-row-icon--purple">
                                        <IonIcon icon={timeOutline} />
                                    </span>
                                    <span className="settings-row-label">{t("settings.dailyReminder")}</span>
                                    <span className="settings-row-value">{localStorage.getItem("skillup_reminder") ?? "08:00"}</span>
                                    <IonIcon icon={chevronForwardOutline} className="settings-chevron" />
                                </button>
                            </div>

                            <p className="settings-section-label">{t("settings.account")}</p>
                            <div className="settings-card">
                                <button className="settings-row settings-row--btn settings-desktop-only" onClick={() => setShowEditAlert(true)}>
                                    <span className="settings-row-icon settings-row-icon--purple">
                                        <IonIcon icon={keyOutline} />
                                    </span>
                                    <span className="settings-row-label">{t("settings.changePassword")}</span>
                                    <IonIcon icon={chevronForwardOutline} className="settings-chevron" />
                                </button>

                                <div className="settings-divider settings-desktop-only" />

                                <button className="settings-row settings-row--btn" onClick={() => history.push("/settings/privacy")}>
                                    <span className="settings-row-icon settings-row-icon--blue">
                                        <IonIcon icon={shieldOutline} />
                                    </span>
                                    <span className="settings-row-label">{t("settings.privacyData")}</span>
                                    <IonIcon icon={chevronForwardOutline} className="settings-chevron" />
                                </button>

                                <div className="settings-divider" />

                                <button className="settings-row settings-row--btn" onClick={() => history.push("/settings/achievements")}>
                                    <span className="settings-row-icon settings-row-icon--yellow">
                                        <IonIcon icon={trophyOutline} />
                                    </span>
                                    <span className="settings-row-label">{t("settings.achievements")}</span>
                                    <IonIcon icon={chevronForwardOutline} className="settings-chevron" />
                                </button>

                                <div className="settings-divider" />

                                <button className="settings-row settings-row--btn" onClick={() => history.push("/settings/help")}>
                                    <span className="settings-row-icon settings-row-icon--gray">
                                        <IonIcon icon={helpCircleOutline} />
                                    </span>
                                    <span className="settings-row-label">{t("settings.helpSupport")}</span>
                                    <IonIcon icon={chevronForwardOutline} className="settings-chevron" />
                                </button>
                            </div>

                            <button className="settings-card settings-card--logout" onClick={handleLogOut}>
                                <div className="settings-row">
                                    <IonIcon icon={logOutOutline} className="settings-logout-icon" />
                                    <span className="settings-logout-label">{t("settings.logOut")}</span>
                                </div>
                            </button>

                            <p className="settings-version">{t("settings.version")}</p>
                        </div>
                    </main>
                </div>
            </IonContent>
        <MobileTabBar />

        <IonAlert
            isOpen={showEditAlert}
            onDidDismiss={() => setShowEditAlert(false)}
            header="Change Password"
            inputs={[
                {
                    name: "newPassword",
                    type: "password",
                    placeholder: "New password",
                },
                {
                    name: "confirmPassword",
                    type: "password",
                    placeholder: "Confirm new password",
                },
            ]}
            buttons={[
                { text: "Cancel", role: "cancel" },
                {
                    text: "Save",
                    handler: async (data) => {
                        if (!data.newPassword || data.newPassword.length < 3) {
                            alert("Password must be at least 3 characters.");
                            return false;
                        }
                        if (data.newPassword !== data.confirmPassword) {
                            alert("Passwords do not match.");
                            return false;
                        }
                        try {
                            await changeMyPassword(data.newPassword);
                        } catch {
                            alert("Failed to change password.");
                            return false;
                        }
                    },
                },
            ]}
        />
    </IonPage>
    );
};

export default Settings;

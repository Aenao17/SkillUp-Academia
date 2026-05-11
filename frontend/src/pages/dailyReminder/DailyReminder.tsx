import { IonContent, IonIcon, IonPage, IonToggle } from "@ionic/react";
import { arrowBackOutline, timeOutline, checkmarkOutline } from "ionicons/icons";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SidebarNav from "../../components/SidebarNav/SidebarNav";
import MobileTabBar from "../../components/MobileTabBar/MobileTabBar";
import "./DailyReminder.css";

export const REMINDER_KEY = "skillup_reminder";
export const REMINDER_ENABLED_KEY = "skillup_reminder_enabled";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

const pad = (n: number) => String(n).padStart(2, "0");

const DailyReminderPage: React.FC = () => {
    const history = useHistory();
    const { t } = useTranslation();

    const savedTime = localStorage.getItem(REMINDER_KEY) ?? "08:00";
    const [hour, setHour] = useState<number>(parseInt(savedTime.split(":")[0], 10));
    const [minute, setMinute] = useState<number>(parseInt(savedTime.split(":")[1], 10));
    const [enabled, setEnabled] = useState<boolean>(
        localStorage.getItem(REMINDER_ENABLED_KEY) !== "false"
    );
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        const time = `${pad(hour)}:${pad(minute)}`;
        localStorage.setItem(REMINDER_KEY, time);
        localStorage.setItem(REMINDER_ENABLED_KEY, String(enabled));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const formattedTime = `${pad(hour)}:${pad(minute)}`;

    return (
        <IonPage>
            <IonContent fullscreen className="reminder-page">
                <div className="reminder-layout">
                    <SidebarNav />

                    <main className="reminder-main">
                        {/* Mobile header */}
                        <div className="reminder-mobile-header">
                            <button
                                className="reminder-back-btn"
                                onClick={() => history.goBack()}
                                aria-label="Back"
                            >
                                <IonIcon icon={arrowBackOutline} />
                            </button>
                            <p className="reminder-title">{t("dailyReminder.title")}</p>
                            <span className="reminder-header-spacer" />
                        </div>

                        {/* Desktop header */}
                        <div className="reminder-desktop-header">
                            <button className="reminder-back-link" onClick={() => history.goBack()}>
                                <IonIcon icon={arrowBackOutline} /> {t("dailyReminder.backToSettings")}
                            </button>
                            <h1>{t("dailyReminder.title")}</h1>
                            <p className="reminder-subtitle">{t("dailyReminder.subtitle")}</p>
                        </div>

                        <div className="reminder-content">
                            {/* Clock display */}
                            <div className="reminder-clock">
                                <IonIcon icon={timeOutline} className="reminder-clock-icon" />
                                <span className="reminder-clock-time">{formattedTime}</span>
                            </div>

                            {/* Enabled toggle */}
                            <p className="reminder-section-label">{t("dailyReminder.sectionLabel")}</p>
                            <div className="reminder-card">
                                <div className="reminder-row">
                                    <span className="reminder-row-label">{t("dailyReminder.enabled")}</span>
                                    <IonToggle
                                        checked={enabled}
                                        onIonChange={(e) => setEnabled(e.detail.checked)}
                                        className="reminder-toggle"
                                    />
                                </div>
                            </div>

                            {/* Hour picker */}
                            <div className={`reminder-pickers ${!enabled ? "reminder-pickers--disabled" : ""}`}>
                                <div className="reminder-picker-col">
                                    <p className="reminder-picker-label">Hour</p>
                                    <div className="reminder-picker-scroll">
                                        {HOURS.map((h) => (
                                            <button
                                                key={h}
                                                disabled={!enabled}
                                                className={`reminder-picker-item ${h === hour ? "reminder-picker-item--active" : ""}`}
                                                onClick={() => setHour(h)}
                                            >
                                                {pad(h)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <span className="reminder-colon">:</span>

                                <div className="reminder-picker-col">
                                    <p className="reminder-picker-label">Minute</p>
                                    <div className="reminder-picker-scroll">
                                        {MINUTES.map((m) => (
                                            <button
                                                key={m}
                                                disabled={!enabled}
                                                className={`reminder-picker-item ${m === minute ? "reminder-picker-item--active" : ""}`}
                                                onClick={() => setMinute(m)}
                                            >
                                                {pad(m)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Save button */}
                            <button className="reminder-save-btn" onClick={handleSave}>
                                {saved
                                    ? <><IonIcon icon={checkmarkOutline} /> {t("dailyReminder.saved")}</>
                                    : t("dailyReminder.save")
                                }
                            </button>
                        </div>
                    </main>
                </div>
            </IonContent>

            <MobileTabBar />
        </IonPage>
    );
};

export default DailyReminderPage;

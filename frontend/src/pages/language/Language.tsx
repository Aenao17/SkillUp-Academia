import { IonContent, IonIcon, IonPage } from "@ionic/react";
import { checkmarkOutline, arrowBackOutline } from "ionicons/icons";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SidebarNav from "../../components/SidebarNav/SidebarNav";
import MobileTabBar from "../../components/MobileTabBar/MobileTabBar";
import "./Language.css";

export const LANGUAGE_KEY = "skillup_language";

export type Language = {
    code: string;
    label: string;
    flag: string;
};

export const LANGUAGES: Language[] = [
    { code: "en", label: "English",    flag: "🇬🇧" },
    { code: "ro", label: "Română",     flag: "🇷🇴" },
    { code: "fr", label: "Français",   flag: "🇫🇷" },
    { code: "de", label: "Deutsch",    flag: "🇩🇪" },
    { code: "es", label: "Español",    flag: "🇪🇸" },
    { code: "it", label: "Italiano",   flag: "🇮🇹" },
    { code: "pt", label: "Português",  flag: "🇵🇹" },
];

const LanguagePage: React.FC = () => {
    const history = useHistory();
    const { t, i18n } = useTranslation();
    const [selected, setSelected] = useState<string>(
        () => localStorage.getItem(LANGUAGE_KEY) ?? "en"
    );

    const handleSelect = async (code: string) => {
        setSelected(code);
        localStorage.setItem(LANGUAGE_KEY, code);
        await i18n.changeLanguage(code);
    };

    return (
        <IonPage>
            <IonContent fullscreen className="lang-page">
                <div className="lang-layout">
                    <SidebarNav />

                    <main className="lang-main">
                        {/* Mobile header */}
                        <div className="lang-mobile-header">
                            <button
                                className="lang-back-btn"
                                onClick={() => history.goBack()}
                                aria-label="Back"
                            >
                                <IonIcon icon={arrowBackOutline} />
                            </button>
                            <p className="lang-title">{t("language.title")}</p>
                            <span className="lang-header-spacer" />
                        </div>

                        {/* Desktop title */}
                        <div className="lang-desktop-header">
                            <button
                                className="lang-back-link"
                                onClick={() => history.goBack()}
                            >
                                <IonIcon icon={arrowBackOutline} /> {t("language.backToSettings")}
                            </button>
                            <h1>{t("language.title")}</h1>
                            <p className="lang-subtitle">{t("language.subtitle")}</p>
                        </div>

                        <div className="lang-content">
                            <p className="lang-section-label">{t("language.sectionLabel")}</p>
                            <div className="lang-card">
                                {LANGUAGES.map((lang, i) => (
                                    <React.Fragment key={lang.code}>
                                        {i > 0 && <div className="lang-divider" />}
                                        <button
                                            className={`lang-row ${selected === lang.code ? "lang-row--active" : ""}`}
                                            onClick={() => handleSelect(lang.code)}
                                        >
                                            <span className="lang-flag">{lang.flag}</span>
                                            <span className="lang-label">{lang.label}</span>
                                            {selected === lang.code && (
                                                <IonIcon icon={checkmarkOutline} className="lang-check" />
                                            )}
                                        </button>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            </IonContent>

            <MobileTabBar />
        </IonPage>
    );
};

export default LanguagePage;

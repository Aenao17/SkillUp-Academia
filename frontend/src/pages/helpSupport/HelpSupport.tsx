import { IonContent, IonIcon, IonPage } from "@ionic/react";
import {
    arrowBackOutline,
    bugOutline,
    chatbubbleEllipsesOutline,
    chevronDownOutline,
    chevronUpOutline,
    mailOutline,
} from "ionicons/icons";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SidebarNav from "../../components/SidebarNav/SidebarNav";
import MobileTabBar from "../../components/MobileTabBar/MobileTabBar";
import "./HelpSupport.css";

const FAQ_IDS = ["q1", "q2", "q3", "q4"] as const;

const HelpSupportPage: React.FC = () => {
    const history = useHistory();
    const { t } = useTranslation();
    const [openFaq, setOpenFaq] = useState<string | null>(null);

    const toggle = (id: string) => setOpenFaq((prev) => (prev === id ? null : id));

    return (
        <IonPage>
            <IonContent fullscreen className="help-page">
                <div className="help-layout">
                    <SidebarNav />

                    <main className="help-main">
                        {/* Mobile header */}
                        <div className="help-mobile-header">
                            <button
                                className="help-back-btn"
                                onClick={() => history.goBack()}
                                aria-label="Back"
                            >
                                <IonIcon icon={arrowBackOutline} />
                            </button>
                            <p className="help-title">{t("helpSupport.title")}</p>
                            <span className="help-header-spacer" />
                        </div>

                        {/* Desktop header */}
                        <div className="help-desktop-header">
                            <button className="help-back-link" onClick={() => history.goBack()}>
                                <IonIcon icon={arrowBackOutline} /> {t("helpSupport.backToSettings")}
                            </button>
                            <h1>{t("helpSupport.title")}</h1>
                            <p className="help-subtitle">{t("helpSupport.subtitle")}</p>
                        </div>

                        <div className="help-content">
                            {/* FAQ */}
                            <p className="help-section-label">{t("helpSupport.faqSection")}</p>
                            <div className="help-card">
                                {FAQ_IDS.map((id, i) => (
                                    <React.Fragment key={id}>
                                        {i > 0 && <div className="help-divider" />}
                                        <div className="help-faq-item">
                                            <button
                                                className="help-faq-question"
                                                onClick={() => toggle(id)}
                                                aria-expanded={openFaq === id}
                                            >
                                                <span>{t(`helpSupport.${id}`)}</span>
                                                <IonIcon
                                                    icon={openFaq === id ? chevronUpOutline : chevronDownOutline}
                                                    className="help-faq-chevron"
                                                />
                                            </button>
                                            {openFaq === id && (
                                                <p className="help-faq-answer">
                                                    {t(`helpSupport.a${id.slice(1)}`)}
                                                </p>
                                            )}
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* Contact */}
                            <p className="help-section-label">{t("helpSupport.contactSection")}</p>
                            <div className="help-card">
                                <a
                                    className="help-row"
                                    href="mailto:support@skillup-academia.com"
                                >
                                    <span className="help-row-icon help-row-icon--blue">
                                        <IonIcon icon={mailOutline} />
                                    </span>
                                    <div className="help-row-text">
                                        <span className="help-row-label">{t("helpSupport.emailUs")}</span>
                                        <span className="help-row-desc">{t("helpSupport.emailUsDesc")}</span>
                                    </div>
                                </a>

                                <div className="help-divider" />

                                <button className="help-row help-row--btn">
                                    <span className="help-row-icon help-row-icon--red">
                                        <IonIcon icon={bugOutline} />
                                    </span>
                                    <div className="help-row-text">
                                        <span className="help-row-label">{t("helpSupport.reportBug")}</span>
                                        <span className="help-row-desc">{t("helpSupport.reportBugDesc")}</span>
                                    </div>
                                    <IonIcon icon={chatbubbleEllipsesOutline} className="help-row-action" />
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </IonContent>

            <MobileTabBar />
        </IonPage>
    );
};

export default HelpSupportPage;

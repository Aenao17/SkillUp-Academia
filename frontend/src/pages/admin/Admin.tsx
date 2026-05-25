import {
    IonContent,
    IonLabel,
    IonPage,
    IonSegment,
    IonSegmentButton,
} from "@ionic/react";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import "./Admin.css";
import UsersAdminSection from "../../components/Admin/UsersAdminSection";
import ModulesAdminSection from "../../components/Admin/ModulesAdminSection";
import LessonsAdminSection from "../../components/Admin/LessonsAdminSection";

type AdminSection = "users" | "modules" | "lessons";

const AdminPage: React.FC = () => {
    const [section, setSection] = useState<AdminSection>("users");
    const { t } = useTranslation();

    return (
        <IonPage className="admin-page">
            <IonContent fullscreen className="admin-content">
                <div className="admin-container">
                    <div className="admin-hero">
                        <p className="admin-eyebrow">{t("admin.eyebrow")}</p>
                        <h1>{t("admin.title")}</h1>
                        <p className="admin-subtitle">
                            {t("admin.subtitle")}
                        </p>
                    </div>

                    <IonSegment
                        className="admin-segment"
                        value={section}
                        onIonChange={(e) => {
                            const value = e.detail.value as AdminSection;
                            setSection(value);
                        }}
                    >
                        <IonSegmentButton value="users">
                            <IonLabel>{t("admin.tabUsers")}</IonLabel>
                        </IonSegmentButton>

                        <IonSegmentButton value="modules">
                            <IonLabel>{t("admin.tabModules")}</IonLabel>
                        </IonSegmentButton>

                        <IonSegmentButton value="lessons">
                            <IonLabel>{t("admin.tabLessons")}</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>

                    {section === "users" && <UsersAdminSection />}
                    {section === "modules" && <ModulesAdminSection />}
                    {section === "lessons" && <LessonsAdminSection />}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default AdminPage;
import {
    IonContent,
    IonLabel,
    IonPage,
    IonSegment,
    IonSegmentButton,
} from "@ionic/react";

import { useState } from "react";

import "./Admin.css";
import UsersAdminSection from "../../components/Admin/UsersAdminSection";
import ModulesAdminSection from "../../components/Admin/ModulesAdminSection";
import LessonsAdminSection from "../../components/Admin/LessonsAdminSection";

type AdminSection = "users" | "modules" | "lessons";

const AdminPage: React.FC = () => {
    const [section, setSection] = useState<AdminSection>("users");

    return (
        <IonPage className="admin-page">
            <IonContent fullscreen className="admin-content">
                <div className="admin-container">
                    <div className="admin-hero">
                        <p className="admin-eyebrow">Admin Panel</p>
                        <h1>Platform Administration</h1>
                        <p className="admin-subtitle">
                            Manage users, learning modules and lessons from one place.
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
                            <IonLabel>Users</IonLabel>
                        </IonSegmentButton>

                        <IonSegmentButton value="modules">
                            <IonLabel>Modules</IonLabel>
                        </IonSegmentButton>

                        <IonSegmentButton value="lessons">
                            <IonLabel>Lessons</IonLabel>
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
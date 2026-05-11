import {
    IonContent,
    IonIcon,
    IonPage,
    IonSpinner,
    useIonRouter,
    useIonViewWillEnter,
} from "@ionic/react";

import { bookOutline, chevronForwardOutline } from "ionicons/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import SidebarNav from "../../components/SidebarNav/SidebarNav";
import MobileTabBar from "../../components/MobileTabBar/MobileTabBar";

import { getModules } from "../../api/api";
import { LearningModuleDto } from "../../types/module";

import "./Modules.css";

const Modules: React.FC = () => {
    const [modules, setModules] = useState<LearningModuleDto[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();
    const router = useIonRouter();

    const loadModules = async () => {
        try {
            setLoading(true);

            const data = await getModules();

            setModules(data);
        } catch (error) {
            console.error("Failed to load modules", error);
        } finally {
            setLoading(false);
        }
    };

    useIonViewWillEnter(() => {
        loadModules();
    });

    return (
        <IonPage>
            <IonContent fullscreen className="modules-page">
                <div className="modules-layout">
                    <SidebarNav />

                    <main className="modules-content">
                        <div className="modules-container">
                            <section className="modules-top">
                                <div>
                                    <p className="modules-eyebrow">{t("modules.eyebrow")}</p>

                                    <h1>{t("modules.title")}</h1>

                                    <p>
                                        {t("modules.subtitle")}
                                    </p>
                                </div>

                                <div className="modules-mascot">😊</div>
                            </section>

                            <section className="modules-card">
                                <h2>{t("modules.sectionTitle")}</h2>

                                {loading ? (
                                    <div className="modules-loading">
                                        <IonSpinner name="crescent" />

                                        <p>{t("modules.loading")}</p>
                                    </div>
                                ) : modules.length === 0 ? (
                                    <p className="modules-empty">
                                        {t("modules.empty")}
                                    </p>
                                ) : (
                                    <div className="modules-list-page">
                                        {modules.map((module) => (
                                            <button
                                                key={module.id}
                                                className="module-path-card"
                                                onClick={() =>
                                                    router.push(`/modules/${module.id}`)
                                                }
                                            >
                                                <div className="module-path-icon">
                                                    <IonIcon icon={bookOutline} />
                                                </div>

                                                <div className="module-path-info">
                                                    <h3>{module.title}</h3>

                                                    <p>{module.description}</p>

                                                    <span>
                                                        {module.lessons.length} lessons
                                                    </span>
                                                </div>

                                                <IonIcon
                                                    className="module-path-arrow"
                                                    icon={chevronForwardOutline}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </div>
                    </main>
                </div>

                <MobileTabBar />
            </IonContent>
        </IonPage>
    );
};

export default Modules;
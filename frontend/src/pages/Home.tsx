import { IonContent, IonPage, useIonViewWillEnter} from "@ionic/react";
import React, { useState} from "react";
import { useTranslation } from "react-i18next";
import "./Home.css";

import { LearningModuleDto } from "../types/module";
import { getModules, getCurrentUser } from "../api/api";
import SidebarNav from "../components/SidebarNav/SidebarNav";
import InitialAssessmentCard from "../components/InitialAssessmentCard/InitialAssessmentCard";
import ModuleCard from "../components/ModuleCard/ModuleCard";
import InitialAssessmentAlert from "../components/InitialAssessmentAlert/InitialAssessmentAlert";
import MobileTabBar from "../components/MobileTabBar/MobileTabBar";
import lumiMascot from "../assets/lumi_fixed.svg";

const Home: React.FC = () => {
    const { t } = useTranslation();
    const [showAssessmentPopup, setShowAssessmentPopup] = useState(false);
    const [hasCompletedInitialAssessment, setHasCompletedInitialAssessment] =
        useState(false);

    const [modules, setModules] = useState<LearningModuleDto[]>([]);
    const [loadingModules, setLoadingModules] = useState(true);

    const loadHomeData = async () => {
        try {
            setLoadingModules(true);

            const currentUser = await getCurrentUser();

            const hidePopup = localStorage.getItem(
                `hideInitialAssessmentPopup_${currentUser.userId}`
            );

            const completed = localStorage.getItem(
                `hasCompletedInitialAssessment_${currentUser.userId}`
            );

            setHasCompletedInitialAssessment(completed === "true");
            setShowAssessmentPopup(hidePopup !== "true" && completed !== "true");

            const data = await getModules();
            setModules(data);
        } catch (e) {
            console.error("Failed to load home data", e);
            setShowAssessmentPopup(false);
        } finally {
            setLoadingModules(false);
        }
    };

    useIonViewWillEnter(() => {
        loadHomeData();
    });
    
    return (
        <IonPage>
            <IonContent>
                <div className="layout">
                    <SidebarNav />

                    <div className="main-content">
                        <div className="mobile-home-header">
                            <div>
                                <p className="mobile-kicker">{t("home.kicker")}</p>
                                <h1>{t("home.title")}</h1>
                            </div>

                            <div className="mobile-mascot">
                                <img src={lumiMascot} alt="Lumi Mascot" className="mascot-img" />
                            </div>
                        </div>

                        <div className="desktop-title">
                            <h1>{t("home.title")}</h1>
                        </div>

                        <InitialAssessmentCard show={!hasCompletedInitialAssessment} />

                        <div className="modules-list">
                            {loadingModules ? (
                                <p>{t("home.loadingModules")}</p>
                            ) : modules.length === 0 ? (
                                <p>{t("home.noModules")}</p>
                            ) : (
                                modules.map((module) => (
                                    <ModuleCard
                                        key={module.id}
                                        id={module.id}
                                        title={module.title}
                                        description={module.description}
                                        lessonCount={module.lessons.length}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <InitialAssessmentAlert
                    isOpen={showAssessmentPopup}
                    onClose={() => setShowAssessmentPopup(false)}
                />
            </IonContent>

            <MobileTabBar />
        </IonPage>
    );
};

export default Home;
import { IonContent, IonPage } from "@ionic/react";
import { useEffect, useState } from "react";
import "./Home.css";

import { LearningModuleDto } from "../types/module";
import {getModules} from "../api/api";
import SidebarNav from "../components/SidebarNav/SidebarNav";
import InitialAssessmentCard from "../components/InitialAssessmentCard/InitialAssessmentCard";
import ModuleCard from "../components/ModuleCard/ModuleCard";
import InitialAssessmentAlert from "../components/InitialAssessmentAlert/InitialAssessmentAlert";
import MobileTabBar from "../components/MobileTabBar/MobileTabBar";

const Home: React.FC = () => {
    const [showAssessmentPopup, setShowAssessmentPopup] = useState(false);
    const [hasCompletedInitialAssessment, setHasCompletedInitialAssessment] =
        useState(false);

    const [modules, setModules] = useState<LearningModuleDto[]>([]);
    const [loadingModules, setLoadingModules] = useState(true);

    useEffect(() => {
        const hidePopup = localStorage.getItem("hideInitialAssessmentPopup");
        const completed = localStorage.getItem("hasCompletedInitialAssessment");

        setHasCompletedInitialAssessment(completed === "true");

        if (hidePopup !== "true" && completed !== "true") {
            setShowAssessmentPopup(true);
        }
    }, []);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const data = await getModules();
                setModules(data);
            } catch (e) {
                console.error("Failed to fetch modules", e);
            } finally {
                setLoadingModules(false);
            }
        };

        fetchModules();
    }, []);

    return (
        <IonPage>
            <IonContent>
                <div className="layout">
                    <SidebarNav />

                    <div className="main-content">
                        <div className="mobile-home-header">
                            <div>
                                <p className="mobile-kicker">SkillUp Academia</p>
                                <h1>Home</h1>
                            </div>

                            <div className="mobile-mascot">😊</div>
                        </div>

                        <div className="desktop-title">
                            <h1>Home</h1>
                        </div>

                        <InitialAssessmentCard show={!hasCompletedInitialAssessment} />

                        <div className="modules-list">
                            {loadingModules ? (
                                <p>Loading modules...</p>
                            ) : modules.length === 0 ? (
                                <p>No modules available.</p>
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
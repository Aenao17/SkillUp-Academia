import { IonContent, IonPage } from "@ionic/react";
import { useEffect, useState } from "react";
import "./Home.css";
import InitialAssessmentAlert from "../components/InitialAssessmentAlert/InitialAssessmentAlert";
import MobileTabBar from "../components/MobileTabBar/MobileTabBar";
import InitialAssessmentCard from "../components/InitialAssessmentCard/InitialAssessmentCard";
import SidebarNav from "../components/SidebarNav/SidebarNav";

const Home: React.FC = () => {
    const [showAssessmentPopup, setShowAssessmentPopup] = useState(false);
    const [hasCompletedInitialAssessment, setHasCompletedInitialAssessment] =
        useState(false);

    useEffect(() => {
        const hidePopup = localStorage.getItem("hideInitialAssessmentPopup");
        const completed = localStorage.getItem("hasCompletedInitialAssessment");

        setHasCompletedInitialAssessment(completed === "true");

        if (hidePopup !== "true" && completed !== "true") {
            setShowAssessmentPopup(true);
        }
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



                        <InitialAssessmentCard
                            show={!hasCompletedInitialAssessment}
                        />
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
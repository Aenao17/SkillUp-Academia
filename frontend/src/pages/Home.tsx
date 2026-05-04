import { IonContent, IonPage } from "@ionic/react";
import { useEffect, useState } from "react";
import "./Home.css";

import InitialAssessmentAlert from "../components/InitialAssessmentAlert";
import SidebarNav from "../components/SidebarNav";
import MobileTabBar from "../components/MobileTabBar";

const Home: React.FC = () => {
    const [showAssessmentPopup, setShowAssessmentPopup] = useState(false);

    useEffect(() => {
        const hidden = localStorage.getItem("hideInitialAssessmentPopup");

        if (hidden !== "true") {
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

                        <div className="desktop-title">
                            <h1>Home</h1>
                            <p>Aici vin modulele tale</p>
                        </div>

                        <p className="mobile-subtitle">Aici vin modulele tale</p>
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
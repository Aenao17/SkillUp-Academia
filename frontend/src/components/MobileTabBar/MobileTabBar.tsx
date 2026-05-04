import { IonIcon, IonLabel, IonTabBar, IonTabButton } from "@ionic/react";
import {
    homeOutline,
    bookOutline,
    personOutline,
    settingsOutline,
} from "ionicons/icons";
import "./MobileTabBar.css";

const MobileTabBar: React.FC = () => {
    return (
        <div className="mobile-tabbar-wrapper">
            <IonTabBar className="mobile-tabbar">
                <IonTabButton href="/home">
                    <IonIcon icon={homeOutline} />
                    <IonLabel>Home</IonLabel>
                </IonTabButton>

                <IonTabButton href="/modules">
                    <IonIcon icon={bookOutline} />
                    <IonLabel>Modules</IonLabel>
                </IonTabButton>

                <IonTabButton href="/profile">
                    <IonIcon icon={personOutline} />
                    <IonLabel>Profile</IonLabel>
                </IonTabButton>

                <IonTabButton href="/settings">
                    <IonIcon icon={settingsOutline} />
                    <IonLabel>Settings</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </div>
    );
};

export default MobileTabBar;
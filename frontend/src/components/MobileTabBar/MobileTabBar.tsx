import {
    IonIcon,
    IonLabel,
    IonTabBar,
    IonTabButton,
} from "@ionic/react";

import {
    homeOutline,
    bookOutline,
    personOutline,
    settingsOutline,
    shieldOutline,
} from "ionicons/icons";

import { getAccessToken } from "../../auth/authStorage";
import { parseJwt } from "../../auth/jwt";

import "./MobileTabBar.css";

const MobileTabBar: React.FC = () => {
    const token = getAccessToken();

    const payload = token ? parseJwt(token) : null;

    const isAdmin = payload?.role === "ADMIN";

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

                {isAdmin && (
                    <IonTabButton href="/admin">
                        <IonIcon icon={shieldOutline} />
                        <IonLabel>Admin</IonLabel>
                    </IonTabButton>
                )}

                <IonTabButton href="/settings">
                    <IonIcon icon={settingsOutline} />
                    <IonLabel>Settings</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </div>
    );
};

export default MobileTabBar;
import { IonAlert } from "@ionic/react";
import { useIonRouter } from "@ionic/react";
import "./InitialAssessmentAlert.css";

type InitialAssessmentAlertProps = {
    isOpen: boolean;
    onClose: () => void;
};

const InitialAssessmentAlert: React.FC<InitialAssessmentAlertProps> = ({
                                                                           isOpen,
                                                                           onClose,
                                                                       }) => {
    const router = useIonRouter();

    return (
        <IonAlert
            cssClass="custom-alert"
            isOpen={isOpen}
            header="Initial assessment"
            message="Would you like to take the initial test to personalize your learning modules?"
            inputs={[
                {
                    type: "checkbox",
                    label: "Never show this again",
                    value: "never",
                },
            ]}
            buttons={[
                { text: "Maybe later", role: "cancel" },
                { text: "Start test", role: "confirm" },
            ]}
            onDidDismiss={(e) => {
                const selected = e.detail.data?.values ?? [];

                if (selected.includes("never")) {
                    localStorage.setItem("hideInitialAssessmentPopup", "true");
                }

                onClose();

                if (e.detail.role === "confirm") {
                    router.push("/initial-assessment");
                }
            }}
        />
    );
};

export default InitialAssessmentAlert;
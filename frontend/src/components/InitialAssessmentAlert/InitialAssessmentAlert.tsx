import { IonAlert } from "@ionic/react";
import { useIonRouter } from "@ionic/react";
import { useTranslation } from "react-i18next";
import "./InitialAssessmentAlert.css";
import { getCurrentUser } from "../../api/api";

type InitialAssessmentAlertProps = {
    isOpen: boolean;
    onClose: () => void;
};

const InitialAssessmentAlert: React.FC<InitialAssessmentAlertProps> = ({
                                                                           isOpen,
                                                                           onClose,
                                                                       }) => {
    const router = useIonRouter();
    const { t } = useTranslation();

    return (
        <IonAlert
            cssClass="custom-alert"
            isOpen={isOpen}
            header={t("assessment.alertHeader")}
            message={t("assessment.alertMessage")}
            inputs={[
                {
                    type: "checkbox",
                    label: t("assessment.neverShow"),
                    value: "never",
                },
            ]}
            buttons={[
                { text: t("assessment.maybeLater"), role: "cancel" },
                { text: t("assessment.startTest"), role: "confirm" },
            ]}
            
            onDidDismiss={async (e) => {
            const selected = e.detail.data?.values ?? [];

            if (selected.includes("never")) {
                const currentUser = await getCurrentUser();

                localStorage.setItem(
                    `hideInitialAssessmentPopup_${currentUser.userId}`,
                    "true"
                );
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
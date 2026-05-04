import { IonButton } from "@ionic/react";
import { useIonRouter } from "@ionic/react";
import "./InitialAssessmentCard.css";

type Props = {
    show: boolean;
};

const InitialAssessmentCard: React.FC<Props> = ({ show }) => {
    const router = useIonRouter();

    if (!show) return null;

    return (
        <div className="assessment-card">
            <div className="assessment-content">
                <div className="assessment-text">
                    <h2>Start your journey 🚀</h2>
                    <p>
                        Take the initial assessment to personalize your learning experience.
                    </p>
                </div>

                <IonButton
                    className="assessment-button"
                    onClick={() => router.push("/initial-assessment")}
                >
                    Start test
                </IonButton>
            </div>
        </div>
    );
};

export default InitialAssessmentCard;
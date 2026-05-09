import {
    IonContent,
    IonIcon,
    IonPage,
    IonSpinner,
} from "@ionic/react";
import { bookOutline, chevronForwardOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useIonRouter } from "@ionic/react";
import SidebarNav from "../../components/SidebarNav/SidebarNav";
import MobileTabBar from "../../components/MobileTabBar/MobileTabBar";
import { getModules } from "../../api/api";
import { LearningModuleDto } from "../../types/module";
import "./Modules.css";

const Modules: React.FC = () => {
    const [modules, setModules] = useState<LearningModuleDto[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useIonRouter();

    useEffect(() => {
        const loadModules = async () => {
            try {
                const data = await getModules();
                setModules(data);
            } catch (error) {
                console.error("Failed to load modules", error);
            } finally {
                setLoading(false);
            }
        };

        loadModules();
    }, []);

    return (
        <IonPage>
            <IonContent fullscreen className="modules-page">
                <div className="modules-layout">
                    <SidebarNav />

                    <main className="modules-content">
                        <div className="modules-container">
                            <section className="modules-top">
                                <div>
                                    <p className="modules-eyebrow">Skill path</p>
                                    <h1>Grow Your Soft Skills</h1>
                                    <p>
                                        Choose a module and continue your learning journey.
                                    </p>
                                </div>

                                <div className="modules-mascot">😊</div>
                            </section>

                            <section className="modules-card">
                                <h2>Available modules</h2>

                                {loading ? (
                                    <div className="modules-loading">
                                        <IonSpinner name="crescent" />
                                        <p>Loading modules...</p>
                                    </div>
                                ) : modules.length === 0 ? (
                                    <p className="modules-empty">No modules available.</p>
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
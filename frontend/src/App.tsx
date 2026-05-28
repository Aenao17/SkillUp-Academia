import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactHashRouter } from '@ionic/react-router';
import Profile from "./pages/Profile/Profile";
import Home from './pages/Home';
import ModuleDetails from "./pages/module/ModuleDetails";
import Lesson from "./pages/lesson/Lesson";
import Modules from "./pages/modules/Modules";
import LessonTest from "./pages/test/LessonTest";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import ProtectedRoute from "./auth/ProtectedRoute";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import AdminRoute from "./auth/AdminRoute";
import Admin from "./pages/admin/Admin";
import Settings from "./pages/settings/Settings";
import LanguagePage from "./pages/language/Language";
import DailyReminderPage from "./pages/dailyReminder/DailyReminder";
import PrivacyPage from "./pages/privacy/Privacy";
import AchievementsPage from "./pages/achievements/Achievements";
import HelpSupportPage from "./pages/helpSupport/HelpSupport";
import InitialAssessment from './pages/initialAssessment/InitialAssessment';
import "./theme/global.css";
import { useEffect, useState } from 'react';
import { AUTH_CHANGED_EVENT } from './auth/authStorage';
setupIonicReact();

const App: React.FC = () => {
    const [authVersion, setAuthVersion] = useState(0);

    useEffect(() => {
        const handleAuthChanged = () => {
            setAuthVersion((version) => version + 1);
        };

        window.addEventListener(AUTH_CHANGED_EVENT, handleAuthChanged);

        return () => {
            window.removeEventListener(AUTH_CHANGED_EVENT, handleAuthChanged);
        };
    }, []);

    return (
        <IonApp>
            <IonReactHashRouter>
                <IonRouterOutlet key={authVersion}>
                    <ProtectedRoute exact path="/home" component={Home} />

                    <Route exact path="/login">
                        <Login />
                    </Route>

                    <Route exact path="/signup">
                        <Signup />
                    </Route>

                    <Route exact path="/">
                        <Redirect to="/login" />
                    </Route>

                    <ProtectedRoute exact path="/profile" component={Profile} />
                    <ProtectedRoute exact path="/modules/:id" component={ModuleDetails} />
                    <ProtectedRoute exact path="/lessons/:id/test" component={LessonTest} />
                    <ProtectedRoute exact path="/lessons/:id" component={Lesson} />
                    <ProtectedRoute exact path="/modules" component={Modules} />
                    <ProtectedRoute exact path="/initial-assessment" component={InitialAssessment} />
                    <AdminRoute exact path="/admin" component={Admin} />
                    <ProtectedRoute exact path="/settings" component={Settings} />
                    <ProtectedRoute exact path="/settings/language" component={LanguagePage} />
                    <ProtectedRoute exact path="/settings/daily-reminder" component={DailyReminderPage} />
                    <ProtectedRoute exact path="/settings/privacy" component={PrivacyPage} />
                    <ProtectedRoute exact path="/settings/achievements" component={AchievementsPage} />
                    <ProtectedRoute exact path="/settings/help" component={HelpSupportPage} />
                </IonRouterOutlet>
            </IonReactHashRouter>
        </IonApp>
    );
};

export default App;

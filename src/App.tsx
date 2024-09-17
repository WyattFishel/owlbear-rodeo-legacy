import { ThemeUIProvider } from "theme-ui";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import theme from "./theme";
import Home from "./routes/Home";
import Game from "./routes/Game";
import About from "./routes/About";
import FAQ from "./routes/FAQ";
import ReleaseNotes from "./routes/ReleaseNotes";
import HowTo from "./routes/HowTo";

import { AuthProvider } from "./contexts/AuthContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { KeyboardProvider } from "./contexts/KeyboardContext";
import { DatabaseProvider } from "./contexts/DatabaseContext";
import { UserIdProvider } from "./contexts/UserIdContext";
import { Bounce, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <ThemeUIProvider theme={theme}>
      <SettingsProvider>
        <AuthProvider>
          <KeyboardProvider>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              transition={Bounce}
            />
            <Router>
              <Switch>
                <Route path="/how-to">
                  <HowTo />
                </Route>
                <Route path="/release-notes">
                  <ReleaseNotes />
                </Route>
                <Route path="/about">
                  <About />
                </Route>
                <Route path="/faq">
                  <FAQ />
                </Route>
                <Route path="/game/:id">
                  <DatabaseProvider>
                    <UserIdProvider>
                      <Game />
                    </UserIdProvider>
                  </DatabaseProvider>
                </Route>
                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            </Router>
          </KeyboardProvider>
        </AuthProvider>
      </SettingsProvider>
    </ThemeUIProvider>
  );
}

export default App;

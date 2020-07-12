import React, { createContext, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Authentication from "./pages/Authentication";
import Home from "./pages/Home";
import Nav from "./components/Nav/Nav";
import { Box, Grommet } from "grommet";

export const AppStateContext = createContext({
  token: "",
  userID: "",
  exp: 0,
  logout: () => {},
  login: (userID: string, token: string, exp: number) => {},
});

const theme = {
  global: {
    colors: {
      brand: "#FDCA40",
      focus: "#B68AF2",
      active: "#B68AF2",
      text: {
        light: "#271f32",
        dark: "#271f32",
      },
    },
    font: {
      family: "Roboto",
      size: "18px",
      height: "20px",
    },
  },
};

function App() {
  const [userID, setUserID] = useState("");
  const [token, setToken] = useState("");
  const [exp, setExp] = useState(0);

  const saveCredentials = (userID: string, token: string, exp: number) => {
    setUserID(userID);
    setToken(token);
    setExp(exp);
  };

  const removeCredentials = () => {
    setUserID("");
    setToken("");
    setExp(0);
  };

  return (
    <Grommet theme={theme} full>
      <Box fill>
        <Router>
          <AppStateContext.Provider
            value={{
              userID: userID,
              token: token,
              exp: exp,
              logout: removeCredentials,
              login: saveCredentials,
            }}
          >
            <Nav />
            <Box direction="row" flex overflow={{ horizontal: "hidden" }}>
              <Box flex align="center" justify="center">
                <Switch>
                  {!userID && <Redirect from="/" to="/auth" exact />}
                  {!userID && <Redirect from="/movies" to="/auth" />}
                  {userID && <Redirect from="/" to="/movies" exact />}
                  {userID && <Redirect from="/auth" to="/movies" />}
                  {!userID && <Route path="/auth" component={Authentication} />}
                  {userID && <Route path="/movies" component={Home} />}
                </Switch>
              </Box>
            </Box>
          </AppStateContext.Provider>
        </Router>
      </Box>
    </Grommet>
  );
}

export default App;

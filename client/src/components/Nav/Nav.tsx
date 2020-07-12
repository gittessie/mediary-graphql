import React, { useContext } from "react";
import { Box, Heading } from "grommet";
import { NavLink } from "react-router-dom";
import { AppStateContext } from "../../App";

const AppBar = (props: any) => (
  <Box
    tag="header"
    direction="row"
    align="center"
    justify="between"
    background="brand"
    pad={{ left: "medium", right: "small", vertical: "small" }}
    elevation="medium"
    style={{ zIndex: "1" }}
    {...props}
  />
);

const Nav: React.FC = () => {
  const { userID, logout } = useContext(AppStateContext);
  return (
    <AppBar>
      <Heading level="3" margin="none">
        Mediary
      </Heading>
      {userID && <NavLink to="/auth/login" onClick={logout}>Sign Out</NavLink>}
    </AppBar>
  );
};

export default Nav;

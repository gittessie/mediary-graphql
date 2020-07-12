import React from "react";
import { Box, Heading } from "grommet";

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
  return (
    <AppBar>
      <Heading level="3" margin="none">
        Mediary
      </Heading>
    </AppBar>
  );
};

export default Nav;

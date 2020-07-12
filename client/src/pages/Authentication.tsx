import React from "react";
import { Route } from "react-router-dom";
import Login from "../components/Authentication/Login";
import Register from "../components/Authentication/Register";

const Authentication: React.FC<any>= ({match}) => {
  return (
    <div>
      <Route path={`${match.path}/login`} component={Login} />
      <Route path={`${match.path}/register`} component={Register} />
    </div>
  );
};

export default Authentication;

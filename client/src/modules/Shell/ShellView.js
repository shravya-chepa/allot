import React from "react";
import { Route } from "react-router-dom";
import { Redirect } from "react-router";
import DashboardContainer from "../Dashboard";
import {Login, Signup} from '../Authentication'
import { StyledShellWrapper } from "./Shell.styled";

const ShellView = ({props}) => {
// this is view of web. we will directing to all the pages (components) from here.
  return (
    <StyledShellWrapper>
      <Route
        exact
        path="/"
        render={() => {
          return <Redirect to="/login" />;
        }}
      />
      <Route path="/dashboard" render={() => <DashboardContainer {...props} />} />
      <Route path="/signup" render={() => <Signup />} />
      <Route path="/login" render={() => <Login />} />
    </StyledShellWrapper>
  );
};

export default ShellView;

import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const ApplicationRouter = ({ isProtected, fallbackRoute, ...route }) => {   
  if (!isProtected) {
    return (
      <Route
        path={route.path}
        render={(props) => <route.component {...props} routes={route.routes} />}
      />
    );
  }
  return <ProtectedRoute fallbackRoute={fallbackRoute} {...route} />;
};
export default ApplicationRouter;

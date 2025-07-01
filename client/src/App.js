import React from "react";

import ApplicationRouter from "./router/ApplicationRouter";
import { Switch, Router as ReactRouter } from "react-router-dom";
import history from "./history";
import routes from "./router/routes";
import "./App.css";

function App() {
  return (
    <div className="App">
      <ReactRouter history={history}>
        <Switch>
          {routes.map((route, index) => {
            return <ApplicationRouter key={index} {...route} />;
          })}
        </Switch>
      </ReactRouter>
    </div>
  );
}

export default App;

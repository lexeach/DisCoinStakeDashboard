import React from "react";
import "./App.scss";
import AppRoutes from "./AppRoutes";

const App = () => {
  return (
    <div className="container-scroller ">
      <div className="container page-body-wrapper">
        <div className="main-panel ">
          <div className="content-wrapper">
            <AppRoutes />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

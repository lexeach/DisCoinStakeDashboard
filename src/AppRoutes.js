import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./components/home/home";
import EventList from "./components/events/events";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Header />
      {/* <Dashboard /> */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/event" element={<EventList />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

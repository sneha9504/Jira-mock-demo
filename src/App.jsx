import React from "react";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";

import Summary from "./components/dashboard/Summary";
import ProjectOverview from "./components/dashboard/ProjectOverview";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import ProjectDetails from "./components/dashboard/ProjectDetails";
import NotificationModal from "./components/UI/Notificationmodal";


const App = () => {
  return (
    <div className="relative">
       <NotificationModal />
    
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route
            path="/Dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }>
            <Route index element={<Summary />} />
            <Route
              path="overview"
              element={<ProjectOverview />}
            />
            <Route
              path=":id"
              element={<ProjectDetails />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

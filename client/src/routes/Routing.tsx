import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute, AuthRoute } from "../components/ProtectedRoute";
import { AuthRoutes, ProtectedRoutes, PublicRoutes } from ".";
import MainLayout from "../pages/MainLayout";

const Routing = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes  */}
          {AuthRoutes.map((page) => (
            <Route
              element={
                <AuthRoute>{React.createElement(page.element)}</AuthRoute>
              }
              path={page.path}
              key={page.path}
            />
          ))}

          {PublicRoutes.map((page) => (
            <Route element={<MainLayout />} path="/">
              <Route
                element={React.createElement(page.element)}
                path={page.path}
                index={page.path === "/"}
                key={page.path}
              />
            </Route>
          ))}

          {ProtectedRoutes.map((page) => (
            <Route element={<MainLayout />} path="/">
              <Route
                element={
                  <ProtectedRoute>
                    {React.createElement(page.element)}
                  </ProtectedRoute>
                }
                path={page.path}
                key={page.path}
                index={page.path === "/profile"}
              />
            </Route>
          ))}
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Routing;

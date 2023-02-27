import React from "react";
import { Route, Routes } from "react-router-dom";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import NewImage from "./containers/NewImage";
import AuthenticatedRoute from "./components/AuthenticatedRoutes";
import UnauthenticatedRoute from "./components/UnauthenticatedRoutes";
import Home from "./containers/Home";

export default function Links() {
    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <UnauthenticatedRoute>
                        <Login />
                    </UnauthenticatedRoute>
                }
            />
            <Route
                path="/signup"
                element={
                    <UnauthenticatedRoute>
                        <Signup />
                    </UnauthenticatedRoute>
                }
            />
            <Route
                path="/images/new"
                element={
                    <AuthenticatedRoute>
                        <NewImage />
                    </AuthenticatedRoute>
                }
            />
            <Route
                path="/"
                element={
                    <AuthenticatedRoute>
                        <Home />
                    </AuthenticatedRoute>
                }
            />
            {
                /* Finally, catch all unmatched routes */
            }
            <Route path="*" element={<NotFound />} />;
        </Routes>
    );
}
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Protected = ({ children }) => {
  const userState = useSelector((state) => state.auth.user);
  const loadingState = useSelector((state) => state.auth.loading);
  const { handleGetMe } = useAuth();
  const errorState = useSelector((state) => state.auth.error);

  useEffect(() => {
    // Only try to get user if we don't have one and aren't already loading
    if (!userState && !loadingState) {
      handleGetMe().catch((err) => {
        console.error("Failed to fetch user:", err);
        // Error is already in Redux state, don't retry
      });
    }
  }, []);

  if (loadingState) return <h1>Loading...</h1>;

  if (!userState) return <Navigate to="/login" />;

  if (userState.role !== "vendor") return <Navigate to="/login" />;

  return children;
};

export default Protected;

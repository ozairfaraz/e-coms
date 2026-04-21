import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const Protected = ({ children }) => {
  const userState = useSelector((state) => state.auth.user);
  const loadingState = useSelector((state) => state.auth.loading);

  if (loadingState) return <h1>Loading...</h1>;

  if (!userState) return <Navigate to="/login" />;

  if (userState.role !== "vendor") return <Navigate to="/login" />;

  return children;
};

export default Protected;

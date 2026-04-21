import "./App.css";
import { RouterProvider } from "react-router";
import { router } from "./app.routes";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function App() {
  const { handleGetMe } = useAuth();

  const userState = useSelector((state) => state.auth.user);

  console.log(userState);

  useEffect(() => {
    handleGetMe();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;

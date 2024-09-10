import SignIn from "@/pages/signIn";
import Home from "../pages/Home";
import Signup from "@/pages/signUp";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/pages/MainLayout";
import Profile from "@/pages/profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/login",
    element: <SignIn />,
  },
  {
    path: "/register",
    element: <Signup />,
  },
]);

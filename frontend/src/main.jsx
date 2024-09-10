import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes.jsx";
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")).render(
  <>
    <RouterProvider router={router}></RouterProvider>
    <Toaster />
  </>
);

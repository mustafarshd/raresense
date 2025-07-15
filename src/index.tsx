import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PictureExpanded } from "./screens/PictureExpanded";
import { Pricing } from "./screens/Pricing";
import { Generations } from "./screens/Generations";
import { SignUp } from "./screens/SignUp";
import { LogIn } from "./screens/LogIn";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/" element={
            <ProtectedRoute>
              <PictureExpanded />
            </ProtectedRoute>
          } />
          <Route path="/pricing" element={
            <ProtectedRoute>
              <Pricing />
            </ProtectedRoute>
          } />
          <Route path="/generations" element={
            <ProtectedRoute>
              <Generations />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PictureExpanded } from "./screens/PictureExpanded";
import { Pricing } from "./screens/Pricing";
import { Generations } from "./screens/Generations";
import { SignUp } from "./screens/SignUp";
import { LogIn } from "./screens/LogIn";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PictureExpanded />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/generations" element={<Generations />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

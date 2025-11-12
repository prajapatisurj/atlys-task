// src/App.tsx
import { useState } from "react";
import Feed from "./components/Feed";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import { AnimatePresence } from "framer-motion";

type Modal = "signin" | "signup" | null;

export default function App() {
  const [modal, setModal] = useState<Modal>(null);

  const openSignIn = () => setModal("signin");
  const openSignUp = () => setModal("signup");
  const closeModal = () => setModal(null);

  const handleSwitch = () => {
    setModal((prev) => (prev === "signin" ? "signup" : "signin"));
  };

  return (
    <div className="relative min-h-screen">
      {/* Feed is always visible */}
      <Feed openSignIn={openSignIn} />

      {/* MODALS - ANIMATED & OVERLAY */}
      <AnimatePresence>
        {modal === "signin" && (
          <SignIn onSwitch={handleSwitch} onClose={closeModal} />
        )}
        {modal === "signup" && (
          <SignUp onSwitch={handleSwitch} onClose={closeModal} />
        )}
      </AnimatePresence>
    </div>
  );
}

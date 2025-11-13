// App.tsx
"use client";

import { useState, useEffect } from "react";
import Feed from "./components/Feed";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import { AnimatePresence } from "framer-motion";

type Modal = "signin" | "signup" | null;
type User = { emailOrUsername: string } | null;

export default function App() {
  const [modal, setModal] = useState<Modal>(null);
  const [user, setUser] = useState<User>(null);

  // Persist login
  useEffect(() => {
    const saved = localStorage.getItem("demo-user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const openSignIn = () => setModal("signin");
  const closeModal = () => setModal(null);

  const handleSwitch = () =>
    setModal((prev) => (prev === "signin" ? "signup" : "signin"));

  const handleLogin = (emailOrUsername: string) => {
    const loggedInUser = { emailOrUsername };
    setUser(loggedInUser);
    localStorage.setItem("demo-user", JSON.stringify(loggedInUser));
    closeModal();
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("demo-user");
  };

  return (
    <div className="relative min-h-screen">
      <Feed
        openSignIn={openSignIn}
        currentUser={user}
        onLogout={handleLogout}
      />

      <AnimatePresence>
        {modal === "signin" && (
          <SignIn
            onSwitch={handleSwitch}
            onClose={closeModal}
            onLogin={handleLogin}
          />
        )}
        {modal === "signup" && (
          <SignUp onSwitch={handleSwitch} onClose={closeModal} />
        )}
      </AnimatePresence>
    </div>
  );
}

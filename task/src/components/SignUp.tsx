"use client";
import { motion } from "framer-motion";
import { UserPlus, Check, X } from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
  onSwitch: () => void;
  onClose: () => void;
}

export default function SignUp({ onSwitch, onClose }: Props) {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [repeatError, setRepeatError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmailOrUsername = (val: string) => {
    if (!val) return "Email / username is required";
    const emailRe = /^[\w.-]+@[\w.-]+\.\w+$/;
    const usernameRe = /^[\w-]{3,}$/;
    if (!emailRe.test(val) && !usernameRe.test(val))
      return "Enter a valid email or username";
    return "";
  };

  const getPasswordErrors = (pwd: string): string[] => {
    const errors: string[] = [];
    if (pwd.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(pwd)) errors.push("Missing uppercase letter");
    if (!/[a-z]/.test(pwd)) errors.push("Missing lowercase letter");
    if (!/\d/.test(pwd)) errors.push("Missing number");
    if (!/[@$!%*?&]/.test(pwd)) errors.push("Missing special character");
    return errors;
  };

  const validateRepeat = (pwd: string, repeat: string) => {
    if (pwd !== repeat) return "Passwords do not match";
    return "";
  };

  useEffect(() => {
    setEmailError(validateEmailOrUsername(emailOrUsername));
  }, [emailOrUsername]);

  useEffect(() => {
    setPasswordErrors(getPasswordErrors(password));
  }, [password]);

  useEffect(() => {
    setRepeatError(validateRepeat(password, repeatPassword));
  }, [password, repeatPassword]);

  const isFormValid =
    !emailError &&
    passwordErrors.length === 0 &&
    !repeatError &&
    emailOrUsername &&
    password &&
    repeatPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      alert("Account created! (demo)");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const requirements = [
    { test: (p: string) => p.length >= 8, text: "At least 8 characters" },
    { test: (p: string) => /[A-Z]/.test(p), text: "One uppercase letter" },
    { test: (p: string) => /[a-z]/.test(p), text: "One lowercase letter" },
    { test: (p: string) => /\d/.test(p), text: "One number" },
    { test: (p: string) => /[@$!%*?&]/.test(p), text: "One special character" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div className="p-2 bg-[#F9F9F9] rounded-2xl">
        <div
          className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-[#F9F9F9] rounded-full flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-black" />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-center mb-2">
            Create an account to continue
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Create an account to access all the features
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Enter your email or username"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {emailError && (
                <p className="mt-1 text-xs text-red-600">{emailError}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {passwordErrors.length > 0 && (
                <p className="mt-1 text-xs text-red-600">{passwordErrors[0]}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Repeat password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {repeatError && (
                <p className="mt-1 text-xs text-red-600">{repeatError}</p>
              )}
            </div>

            {password && (
              <div className="mt-2 space-y-1 text-xs">
                {requirements.map((req, i) => {
                  const ok = req.test(password);
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-1 ${
                        ok ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {ok ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <X className="w-3 h-3" />
                      )}
                      <span>{req.text}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium transition
                         disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
            >
              {isSubmitting ? "Creating…" : "Sign Up"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitch}
              className="text-blue-600 font-medium hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

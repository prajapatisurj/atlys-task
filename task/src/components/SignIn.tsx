"use client";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { useState } from "react";

interface Props {
  onSwitch: () => void;
  onClose: () => void;
  onLogin: (emailOrUsername: string) => void;
}
//  login  credaintails
const DEMO_ACCOUNTS = [
  { emailOrUsername: "demo@example.com", password: "password123" },
  { emailOrUsername: "test@user.com", password: "testpass" },
];
export default function SignIn({ onSwitch, onClose, onLogin }: Props) {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmailOrUsername = (val: string) => {
    if (!val) return "Email / username is required";
    const emailRe = /^[\w.-]+@[\w.-]+\.\w+$/;
    const usernameRe = /^[\w-]{3,}$/;
    if (!emailRe.test(val) && !usernameRe.test(val))
      return "Enter a valid email or username";
    return "";
  };

  const validatePassword = (pwd: string) => {
    if (!pwd) return "Password is required";
    return "";
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmailOrUsername(val);
    setEmailError(validateEmailOrUsername(val));
    setLoginError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    setPasswordError(validatePassword(val));
    setLoginError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailErr = validateEmailOrUsername(emailOrUsername);
    const passErr = validatePassword(password);
    setEmailError(emailErr);
    setPasswordError(passErr);

    if (emailErr || passErr) return;

    setIsSubmitting(true);
    setLoginError("");

    await new Promise((r) => setTimeout(r, 800));

    const match = DEMO_ACCOUNTS.find(
      (acc) =>
        acc.emailOrUsername.toLowerCase() === emailOrUsername.toLowerCase() &&
        acc.password === password
    );

    if (match) {
      onLogin(match.emailOrUsername);
    } else {
      setLoginError("Invalid email/username or password");
    }

    setIsSubmitting(false);
  };

  const isFormValid =
    !emailError && !passwordError && emailOrUsername && password;

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
              <LogIn className="w-5 h-5 text-black" />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-center mb-2">
            Sign in to continue
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Use demo accounts:
            <br />
            <code className="text-xs bg-gray-100 px-1 rounded">
              demo@example.com / password123
            </code>
            <br />
            <code className="text-xs bg-gray-100 px-1 rounded">
              test@user.com / testpass
            </code>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Enter your email or username"
                value={emailOrUsername}
                onChange={handleEmailChange}
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
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {passwordError && (
                <p className="mt-1 text-xs text-red-600">{passwordError}</p>
              )}
            </div>

            {loginError && (
              <p className="text-xs text-red-600 text-center">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium transition
                         disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
            >
              {isSubmitting ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onSwitch}
              className="text-blue-600 font-medium hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

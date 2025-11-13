import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";

interface Props {
  onSwitch: () => void;
  onClose: () => void;
}

export default function SignUp({ onSwitch, onClose }: Props) {
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
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-[#F9F9F9] rounded-full flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-black" />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-center mb-2">
            Create an account to continue
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Create an account to access all the features of this app
          </p>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Enter your email or username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Repeat password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600">
            Already have an account?{" "}
            <button
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

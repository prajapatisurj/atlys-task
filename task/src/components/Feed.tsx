"use client";
import { useState, useRef, useEffect } from "react";
import MessageCard from "./MessageCard";
import { Message } from "../types";
import { motion } from "framer-motion";
import {
  Bold,
  Italic,
  List,
  Paperclip,
  Mic,
  Video,
  Send,
  X,
  LogOut,
  User,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const mockMessages: Message[] = [
  {
    id: "1",
    user: "Theresa Webb",
    avatar: "https://i.pravatar.cc/150?img=1",
    text: "Just launched my new portfolio! Check it out and let me know what you think!",
    time: "5 mins ago",
    emoji: "rocket",
  },
  {
    id: "2",
    user: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=2",
    text: "Anyone up for a quick sync at 3 PM? Need to discuss the Q4 roadmap.",
    time: "12 mins ago",
    emoji: "calendar",
  },
  {
    id: "3",
    user: "Sarah Chen",
    avatar: "https://i.pravatar.cc/150?img=3",
    text: "Just shipped v2.1.0 — includes dark mode and performance fixes!",
    time: "1 hour ago",
  },
  {
    id: "4",
    user: "Alex Kim",
    avatar: "https://i.pravatar.cc/150?img=4",
    text: "Coffee break in 10 mins? Let's grab one at the rooftop!",
    time: "2 hours ago",
    emoji: "coffee",
  },
];

interface FeedProps {
  openSignIn: () => void;
  currentUser: { emailOrUsername: string } | null;
  onLogout: () => void;
}

export default function Feed({ openSignIn, currentUser, onLogout }: FeedProps) {
  const [messages, setMessages] = useState(mockMessages);
  const [file, setFile] = useState<File | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Show login toast on first login
  useEffect(() => {
    if (currentUser) {
      toast.success(`Logged in as ${currentUser.emailOrUsername}`, {
        duration: 3000,
        icon: "wave",
      });
    }
  }, [currentUser]);

  // AUTO-UPDATE TIME
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });
      setCurrentTime(`${formatted} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const forceUpdate = () => {
    const empty =
      !editorRef.current?.innerHTML ||
      editorRef.current.innerHTML === "" ||
      editorRef.current.innerHTML === "<br>" ||
      editorRef.current.innerHTML === "<div><br></div>";
    setIsEditorEmpty(empty);
  };

  const openCamera = async () => {
    if (!currentUser) {
      toast.error("Please log in to record video");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setShowCamera(true);
      }
    } catch (err) {
      toast.error("Camera access denied.");
    }
  };

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setShowCamera(false);
  };

  const execCommand = (command: string, value?: string) => {
    if (!currentUser) return;
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleSend = () => {
    if (!currentUser) {
      toast.error("You must be logged in to send messages");
      return;
    }

    const text = editorRef.current?.innerHTML || "";
    const isEmpty = !text || text === "<br>" || text === "<div><br></div>";
    if (isEmpty && !file) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      user: currentUser.emailOrUsername,
      avatar: "https://i.pravatar.cc/150?img=5",
      text: isEmpty ? `Attached: ${file?.name}` : text,
      time: "Just now",
      file: file || undefined,
    };

    setMessages([newMsg, ...messages]);
    if (editorRef.current) editorRef.current.innerHTML = "";
    setFile(null);
    setIsEditorEmpty(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentUser) {
      toast.error("Log in to attach files");
      return;
    }
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Toaster position="top-center" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-gray-600">F</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-900">foo-rum</h1>
        </div>

        {currentUser ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-green-600" />
              <span className="font-medium">{currentUser.emailOrUsername}</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-red-600 text-sm font-medium hover:underline transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={openSignIn}
            className="flex items-center gap-1.5 text-blue-600 text-sm font-medium hover:underline transition"
          >
            <span>Login</span>
          </button>
        )}
      </header>

      {/* Time Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-1 text-xs text-gray-600 text-center mt-16">
        {currentTime} | IN
      </div>

      {/* Main Feed */}
      <div className="flex-1 flex flex-col items-center pt-8 pb-6">
        <div className="w-full max-w-md">
          {/* Editor */}
          <div className="bg-white border-b border-gray-200 p-3 mb-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 px-3 pb-2 border-b border-gray-200">
              <button
                onClick={() => execCommand("bold")}
                className={`p-1.5 rounded hover:bg-gray-100 ${
                  !currentUser ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title="Bold"
                disabled={!currentUser}
              >
                <Bold className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => execCommand("italic")}
                className={`p-1.5 rounded hover:bg-gray-100 ${
                  !currentUser ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title="Italic"
                disabled={!currentUser}
              >
                <Italic className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => execCommand("insertUnorderedList")}
                className={`p-1.5 rounded hover:bg-gray-100 ${
                  !currentUser ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title="Bullets"
                disabled={!currentUser}
              >
                <List className="w-4 h-4 text-gray-600" />
              </button>
              <div className="flex-1" />
              <button
                onClick={openCamera}
                className={`p-1.5 rounded hover:bg-gray-100 ${
                  !currentUser ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title="Record Video"
                disabled={!currentUser}
              >
                <Video className="w-4 h-4 text-gray-600" />
              </button>
              <button
                className={`p-1.5 rounded hover:bg-gray-100 ${
                  !currentUser ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title="Voice"
                disabled={!currentUser}
              >
                <Mic className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`p-1.5 rounded hover:bg-gray-100 ${
                  !currentUser ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title="Attach"
                disabled={!currentUser}
              >
                <Paperclip className="w-4 h-4 text-gray-600" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                disabled={!currentUser}
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <div
                ref={editorRef}
                contentEditable={!!currentUser}
                suppressContentEditableWarning
                className={`relative flex-1 min-h-10 px-4 py-2.5 bg-gray-50 rounded-full text-sm border border-gray-300 focus:outline-none transition prose prose-sm max-w-none
                  ${
                    !currentUser
                      ? "opacity-50 cursor-not-allowed"
                      : "focus:ring-2 focus:ring-blue-500"
                  }`}
                onInput={forceUpdate}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && currentUser) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              >
                {isEditorEmpty && (
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none select-none">
                    {currentUser
                      ? "How are you feeling today?"
                      : "Log in to post..."}
                  </span>
                )}
              </div>
              <button
                onClick={handleSend}
                disabled={!currentUser}
                className={`bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition shadow-sm
                  ${!currentUser ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {file && currentUser && (
              <div className="mt-2 text-xs text-gray-600 flex items-center gap-2">
                <Paperclip className="w-3 h-3" />
                <span>{file.name}</span>
                <button
                  onClick={() => setFile(null)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="h-full max-h-[calc(100vh-380px)] overflow-y-auto px-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="space-y-4 pb-4">
              {messages.map((msg) => (
                <div key={msg.id} className="w-full">
                  <MessageCard message={msg} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeCamera}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl p-4 max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Record Video</h3>
              <button
                onClick={closeCamera}
                className="p-1 rounded hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <button className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

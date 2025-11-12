import { Message } from "../types";
import { Paperclip } from "lucide-react";

interface MessageCardProps {
  message: Message;
}

export default function MessageCard({ message }: MessageCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-start gap-3">
        <img
          src={message.avatar}
          alt={message.user}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{message.user}</span>
            {message.emoji && <span>{message.emoji}</span>}
            <span className="text-xs text-gray-500">{message.time}</span>
          </div>
          <div
            className="mt-1 text-sm prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: message.text }}
          />
          {message.file && (
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
              <Paperclip className="w-3 h-3" />
              <span>{message.file.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef } from "react";
import { AiOutlineCheck } from "react-icons/ai";

interface Message {
  _id: string;
  content: string;
  createdAt: string;
  sender: { _id: string };
  files?: string[];
}

interface User {
  user?: {
    _id: string;
  };
}

interface ConversationDetailsScreenProps {
  messages: Message[];
}

const ConversationDetailsScreen: React.FC<ConversationDetailsScreenProps> = ({
  messages,
}) => {
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const user: User | null = JSON.parse(
    localStorage.getItem("nrv-user") as string
  );

  const isNewDay = (current: string, previous: string | null): boolean => {
    if (!previous) return true;
    const currentDate = new Date(current).toDateString();
    const previousDate = new Date(previous).toDateString();
    return currentDate !== previousDate;
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Trigger scrolling whenever messages change

  let lastDate: string | null = null;

  return (
    <div>
      {messages &&
        messages.map((message) => {
          const isSender = message.sender._id === user?.user?._id;
          const showDateHeader = isNewDay(message.createdAt, lastDate);
          lastDate = message.createdAt;

          return (
            <div key={message._id}>
              {/* Date Header */}
              {showDateHeader && (
                <div className="text-center text-sm text-gray-500 my-4">
                  {new Date(message.createdAt).toLocaleDateString([], {
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`flex ${
                  isSender ? "justify-end" : "justify-start"
                } mb-3`}
              >
                <div
                  className={`p-3 rounded-lg w-fit max-w-xs ${
                    isSender
                      ? "bg-nrvDarkBlue text-white"
                      : "bg-gray-200 text-black"
                  }`}
                  style={{
                    borderRadius: isSender
                      ? "18px 18px 0 18px" // Rounded for sent
                      : "18px 18px 18px 0", // Rounded for received
                  }}
                >
                  {/* Text Content */}
                  <p className="text-xs">{message.content}</p>

                  {/* File Attachments */}
                  {message.files && message.files.length > 0 && (
                    <div className="mt-2 grid gap-2">
                      {message.files.map((file, index) => {
                        const isImage = /\.(jpeg|jpg|png|gif)$/i.test(file);
                        const isPDF = /\.pdf$/i.test(file);

                        return (
                          <div
                            key={index}
                            className="flex flex-col items-start"
                          >
                            {/* Render Images */}
                            {isImage && (
                              <img
                                src={file}
                                alt={`file-${index}`}
                                className="w-60 h-32 object-cover rounded-lg"
                              />
                            )}

                            {/* Render PDF */}
                            {isPDF && (
                              <>
                                <a
                                  href={file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 underline text-sm"
                                >
                                  Open PDF
                                </a>
                                <iframe
                                  src={file}
                                  title={`PDF-${index}`}
                                  className="w-60 h-32 border rounded-lg mt-2"
                                ></iframe>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Time Display */}
                  <div className="flex items-center justify-between mt-2">
                    <p
                      className={`text-[10px] ${
                        isSender ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {isSender && (
                      <span className="ml-2 flex items-center text-gray-300 text-[10px]">
                        <AiOutlineCheck />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      {/* Dummy div for scrolling */}
      <div ref={messageEndRef} />
    </div>
  );
};

export default ConversationDetailsScreen;

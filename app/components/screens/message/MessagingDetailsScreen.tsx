import React, { useState, useEffect, useRef } from "react";
import EmptyState from "../empty-state/EmptyState";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { FaPencil } from "react-icons/fa6";
import { getConversation, sendMessage } from "@/redux/slices/messageSlice";
import { useParams } from "next/navigation";
import { FaPlusCircle, FaTimesCircle } from "react-icons/fa";
import { IoArrowBack, IoSend } from "react-icons/io5";
import { MessageBox } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import { AiOutlineCheck } from "react-icons/ai"; // Install react-icons if not already installed
import ConversationDetailsScreen from "./ConversationDetailsScreen";

const RandomColorCircle = ({ firstName, lastName }: any) => {
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const initials = `${firstName?.charAt(0)}${lastName?.charAt(0)}`;

  const circleStyle = {
    backgroundColor: getRandomColor(),
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "18px",
  };

  return (
    <div className="w-1/7">
      <div style={circleStyle}>{initials}</div>
    </div>
  );
};

const MessagingDetailsScreen = ({source}: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [conversation, setConversation] = useState<any[]>([]);
  const [messageContent, setMessageContent] = useState("");
  const [files, setFiles] = useState<File[]>([]); // Store multiple selected files
  const { id } = useParams();
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useDispatch();
  const router = useRouter();

  // Define types for message and user
  interface Message {
    _id: string;
    content: string;
    createdAt: string;
    sender: { _id: string };
    files?: string[]; // Array of file URLs
  }

  interface User {
    user?: {
      _id: string;
    };
  }

  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(user?.user);
    const formData = {
      senderId: user?.user?._id,
      recipientId: id,
    };
    try {
      const response = await dispatch(getConversation(formData) as any);
      setConversation(response?.payload?.data);
    } catch (error) {
      console.error("Error fetching conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendMessage = async () => {
    if (!messageContent.trim() && files.length === 0) {
      alert("Please enter a message or select files.");
      return;
    }

    const formData: any = new FormData();
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    formData.append("sender", user?.user?._id);
    formData.append("recipient", id);
    formData.append("content", messageContent);

    files.forEach((file) => {
      formData.append("file", file);
    });

    try {
      await dispatch(sendMessage(formData) as any);
      setMessageContent("");
      setFiles([]);
      fetchData();
    } catch (error) {
      alert("Error sending message");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];

    // Filter out any files that are too large or exceed the max number of files
    const validFiles = selectedFiles.filter(
      (file) => file.size <= 2 * 1024 * 1024
    ); // Max 2MB

    if (validFiles.length + files.length > 4) {
      alert("You can upload a maximum of 4 files.");
      return;
    }

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const renderFilePreviews = () => {
    return (
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {files.map((file, index) => {
          const isImage = file.type.startsWith("image/");
          return (
            <div
              key={index}
              className="flex flex-col items-center gap-2 mb-2 relative"
            >
              <FaTimesCircle
                onClick={() => handleRemoveFile(index)}
                className="absolute top-1 right-1 text-red-500 cursor-pointer"
                size={18}
              />
              {isImage ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview-${index}`}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ) : (
                <div className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded-lg">
                  <p className="text-xs text-center truncate">{file.name}</p>
                </div>
              )}
              <span className="text-xs text-center">{file.name}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="w-full mx-auto p-4 space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center gap-4 border-b pb-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          </div>
          
          {/* Messages Skeleton */}
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`h-16 rounded-2xl bg-gray-100 animate-pulse ${index % 2 === 0 ? 'w-2/3 rounded-tl-none' : 'w-1/2 rounded-tr-none bg-emerald-50'}`}></div>
              </div>
            ))}
          </div>
          
          {/* Input Skeleton */}
          <div className="mt-auto pt-4 border-t flex gap-2">
            <div className="h-12 bg-gray-100 rounded-full flex-grow animate-pulse"></div>
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      ) : (
        <div>
          {conversation?.length < 1 ? (
            <div className="h-screen flex flex-col">
              <div className="container flex-grow flex flex-col">
                <div className="p-2 w-full flex items-center justify-around sticky top-0 bg-white z-10">
                  {/* Back Icon */}
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => router.back()}
                  >
                    <IoArrowBack size={24} className="text-nrvDarkGrey" />
                  </div>

                  {/* Conversation Header */}
                  <div
                    className="flex-1 flex justify-between"
                    onClick={() => {
                      router.push(
                        `/dashboard/tenant/messages/${conversation[0]?.applicant?._id}`
                      );
                    }}
                  >
                    {source === "recipent" && (
                      <div className="w-full scrollbar-hide">
                        <div className="flex gap-2">
                          <div className="w-1/7">
                            <RandomColorCircle
                              firstName={conversation[0]?.recipient?.firstName}
                              lastName={conversation[0]?.recipient?.lastName}
                            />
                          </div>

                          <p className="w-6/7 text-sm text-nrvDarkGrey font-light mt-3">
                            {conversation[0]?.recipient?.firstName}{" "}
                            {conversation[0]?.recipient?.lastName}
                          </p>
                        </div>
                      </div>
                    )}

                    {source === "sender" && (
                      <div className="w-full scrollbar-hide">
                        <div className="flex gap-2">
                          <div className="w-1/7">
                            <RandomColorCircle
                              firstName={conversation[0]?.sender?.firstName}
                              lastName={conversation[0]?.sender?.lastName}
                            />
                          </div>

                          <p className="w-6/7 text-sm text-nrvDarkGrey font-light mt-3">
                            {conversation[0]?.sender?.firstName}{" "}
                            {conversation[0]?.sender?.lastName}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className="flex-grow md:p-4 p-0 overflow-y-auto scrollbar-hide"
                  style={{
                    maxHeight: "calc(100vh - 200px)",
                  }}
                >
                  <div
                    className="md:hidden"
                    style={{
                      maxHeight: "calc(100vh - 250px)",
                    }}
                  >
                    <ConversationDetailsScreen messages={conversation} />
                  </div>
                  <div className="hidden md:block">
                    <ConversationDetailsScreen messages={conversation} />
                  </div>
                </div>
              </div>

              <div className="flex-grow flex justify-center items-center">
                <div>
                  <EmptyState />
                  <p className="text-nrvLightGrey m-2">No Conversation Yet</p>
                </div>
              </div>

              <div className="p-4 bg-gray-100 sticky bottom-0 z-10">
                {renderFilePreviews && renderFilePreviews()}

                <div className="flex items-center gap-4">
                  <FaPlusCircle
                    size={25}
                    className="cursor-pointer text-nrvPrimaryGreen"
                    onClick={() =>
                      document.getElementById("file-input")?.click()
                    }
                  />
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <textarea
                    className="w-full p-2 text-black text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-0"
                    placeholder="Type your message..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                  />
                  <IoSend
                    onClick={handleSendMessage}
                    size={25}
                    className="cursor-pointer text-nrvPrimaryGreen"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-screen flex flex-col md:mx-auto">
              <div className="container flex-grow flex flex-col">
                {/* Header Section */}
                <div className="p-2 rounded-lg w-full flex items-center justify-between fixed top-0 bg-white z-10">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => router.back()}
                  >
                    <IoArrowBack size={24} className="text-nrvDarkGrey" />
                  </div>

                  {/* Conversation Header */}
                  <div
                    className="flex-1 flex justify-between"
                    onClick={() =>
                      router.push(
                        `/dashboard/tenant/messages/${conversation[0]?.applicant?._id}`
                      )
                    }
                  >
                     {source === "recipent" && (
                      <div className="w-full scrollbar-hide">
                        <div className="flex gap-2">
                          <div className="w-1/7">
                            <RandomColorCircle
                              firstName={conversation[0]?.recipient?.firstName}
                              lastName={conversation[0]?.recipient?.lastName}
                            />
                          </div>

                          <p className="w-6/7 text-sm text-nrvDarkGrey font-light mt-3">
                            {conversation[0]?.recipient?.firstName}{" "}
                            {conversation[0]?.recipient?.lastName}
                          </p>
                        </div>
                      </div>
                    )}

                    {source === "sender" && (
                      <div className="w-full scrollbar-hide">
                        <div className="flex gap-2">
                          <div className="w-1/7">
                            <RandomColorCircle
                              firstName={conversation[0]?.sender?.firstName}
                              lastName={conversation[0]?.sender?.lastName}
                            />
                          </div>

                          <p className="w-6/7 text-sm text-nrvDarkGrey font-light mt-3">
                            {conversation[0]?.sender?.firstName}{" "}
                            {conversation[0]?.sender?.lastName}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Messages Section */}
                <div
                  className="flex-grow md:p-4 p-0 overflow-y-auto custom-scrollbar"
                  style={{
                    maxHeight: "calc(100vh - 200px)", // Adjusts height dynamically
                  }}
                >
                  <div
                    className="md:hidden"
                    style={{
                      maxHeight: "calc(100vh - 250px)", // Custom height for mobile
                    }}
                  >
                    <ConversationDetailsScreen messages={conversation} />
                  </div>
                  <div className="hidden md:block">
                    <ConversationDetailsScreen messages={conversation} />
                  </div>
                </div>
              </div>

              {/* Input Section */}
              <div className="md:p-4 p-0 bg-gray-100 z-10 md:mb-0 mb-24">
                {/* File Previews */}
                {renderFilePreviews()}

                <div className="flex items-center gap-4">
                  {/* File Upload Trigger */}
                  <FaPlusCircle
                    size={25}
                    className="cursor-pointer text-nrvPrimaryGreen"
                    onClick={() =>
                      document.getElementById("file-input")?.click()
                    }
                  />
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {/* Text Input */}
                  <textarea
                    className="w-full p-2 text-black text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-0"
                    placeholder="Type your message..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                  />

                  {/* Send Button */}
                  <IoSend
                    onClick={handleSendMessage}
                    size={25}
                    className="cursor-pointer text-nrvPrimaryGreen"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessagingDetailsScreen;

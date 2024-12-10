import React, { useState, useEffect } from "react";
import EmptyState from "../../../components/screens/empty-state/EmptyState";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { FaPencil } from "react-icons/fa6";
import { getConversation, sendMessage } from "@/redux/slices/messageSlice";
import { useParams } from "next/navigation";
import { FaPlusCircle, FaTimesCircle } from "react-icons/fa";
import { IoSend } from "react-icons/io5";

const RandomColorCircle = ({ firstName, lastName }: any) => {
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

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

const RentersListScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [conversation, setConversation] = useState<any[]>([]);
  const [messageContent, setMessageContent] = useState("");
  const [files, setFiles] = useState<File[]>([]); // Store multiple selected files
  const { id } = useParams();

  const dispatch = useDispatch();
  const router = useRouter();

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
      // Assuming you have a sendMessage action to handle the form submission
       await dispatch(sendMessage(formData) as any);
      setMessageContent(""); // Clear input field after sending
      setFiles([]); // Clear files after sending
      fetchData(); // Refresh conversation list
    } catch (error) {
      alert("Error sending message");
    }
  };

  const renderMessage = (message: any) => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    const isSender: any = message.sender._id === user?.user?._id;

    return (
      <div
        key={message._id}
        className={`flex gap-2 mb-3 ${isSender ? "justify-end" : ""}`}
      >
        <div
          className={`w-6/7 p-3 rounded-lg ${
            isSender ? "bg-nrvDarkBlue text-white" : "bg-gray-200 text-black"
          }`}
        >
          <p className="text-xs">{message.content}</p>

          {message.files && message.files.length > 0 && (
            <div className="mt-2">
              {message.files.map((file: any, index: any) => (
                <img
                  key={index}
                  src={file}
                  alt={`file-${index}`}
                  className="w-60 h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
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
        <div className="w-full mx-auto">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="flex mt-4 rounded-2xl p-4">
              <div className="w-1/5">
                <div className="h-20 rounded"></div>
              </div>
              <div className="w-4/5">
                <div className="flex justify-between w-full">
                  <div className="h-6 rounded w-1/2"></div>
                  <div className="h-6 rounded w-1/2 text-right"></div>
                </div>
                <div className="h-4 rounded mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {conversation?.length < 1 ? (
            <div className="flex justify-center items-center">
              <div>
                <EmptyState />
                <p className="text-nrvLightGrey m-2">No Tenant Yet</p>
              </div>
            </div>
          ) : (
            <div className="md:mx-auto mx-4">
              <div className="container">
                <div
                  key={conversation[0]._id}
                  className="p-2 rounded-lg w-full flex justify-between sticky top-0 bg-white z-10"
                  onClick={() => {
                    router.push(
                      `/dashboard/tenant/messages/${conversation[0].applicant._id}`
                    );
                  }}
                >
                  <div className="w-full">
                    <div className="flex gap-2">
                      <div className="w-1/7">
                        <RandomColorCircle
                          firstName={conversation[0].recipient?.firstName}
                          lastName={conversation[0].recipient?.lastName}
                        />
                      </div>

                      <p className="w-6/7 text-sm text-nrvDarkGrey font-light mt-3">
                        {conversation[0].recipient?.firstName}{" "}
                        {conversation[0].recipient?.lastName}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="messages p-4 overflow-y-auto"
                  style={{ maxHeight: "600px" }}
                >
                  {conversation.map((message) => renderMessage(message))}
                </div>

                <div className="p-4 bg-gray-100">
                  {/* File Previews */}
                  {renderFilePreviews()}

                  <div className="flex items-center gap-4">
                    {/* File Upload Trigger */}
                    <FaPlusCircle
                      size={25}
                      className="cursor-pointer text-blue-500"
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
                      className="w-full p-2 rounded-lg border border-gray-300"
                      placeholder="Type your message..."
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                    />
                    {/* Send Button */}
                    <IoSend
                      onClick={handleSendMessage}
                      className=""
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RentersListScreen;

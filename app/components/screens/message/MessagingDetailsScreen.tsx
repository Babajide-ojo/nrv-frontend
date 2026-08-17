import React, { useState, useEffect, useRef, useCallback, useId } from "react";
import EmptyState from "../empty-state/EmptyState";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { getConversation, sendMessage } from "@/redux/slices/messageSlice";
import { useParams } from "next/navigation";
import { FaPlusCircle, FaTimesCircle } from "react-icons/fa";
import { IoArrowBack, IoSend } from "react-icons/io5";
import ConversationDetailsScreen from "./ConversationDetailsScreen";
import { apiClient } from "@/lib/api";

const POLL_INTERVAL_MS = 4000;

const RandomColorCircle = ({
  firstName,
  lastName,
}: {
  firstName?: string;
  lastName?: string;
}) => {
  const getColorFromName = () => {
    const seed = `${firstName ?? ""}${lastName ?? ""}` || "user";
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 45%, 42%)`;
  };

  const initials = `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase() || "?";

  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
      style={{ backgroundColor: getColorFromName() }}
      aria-hidden
    >
      {initials}
    </div>
  );
};

type PartnerProfile = {
  _id?: string;
  firstName?: string;
  lastName?: string;
};

const MessagingDetailsScreen = ({ source }: { source?: string }) => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [conversation, setConversation] = useState<any[]>([]);
  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const { id } = useParams();
  const partnerId = Array.isArray(id) ? id[0] : id;
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const fetchConversationRef = useRef<(options?: { silent?: boolean }) => Promise<void>>(
    async () => {},
  );
  const fileInputId = useId();
  const isLandlordView = source === "recipent" || source === "recipient";

  const dispatch = useDispatch();
  const router = useRouter();

  const resolvePartnerFromMessages = useCallback(
    (messages: any[], userId: string): PartnerProfile | null => {
      if (!messages?.length || !userId) {
        return null;
      }
      const first = messages[0];
      const sender = first?.sender;
      const recipient = first?.recipient;
      const senderId = String(sender?._id ?? sender ?? "");
      if (senderId === userId) {
        return recipient ?? null;
      }
      return sender ?? null;
    },
    [],
  );

  const fetchPartnerProfile = useCallback(async () => {
    if (!partnerId) {
      return;
    }
    try {
      const response = await apiClient.get(`/users/${partnerId}`);
      const user = response?.data?.data ?? response?.data;
      if (user?._id) {
        setPartnerProfile(user);
      }
    } catch {
      // Partner profile is optional — header falls back to conversation data.
    }
  }, [partnerId]);

  const fetchConversation = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!partnerId) {
        if (!options?.silent) {
          setIsInitialLoading(false);
        }
        return;
      }

      let userId = currentUserId;
      if (!userId) {
        const stored = JSON.parse(localStorage.getItem("nrv-user") as string);
        userId = stored?.user?._id ?? "";
        if (userId) {
          setCurrentUserId(userId);
        }
      }

      if (!userId) {
        if (!options?.silent) {
          setIsInitialLoading(false);
        }
        return;
      }

      try {
        const response = await dispatch(
          getConversation({
            senderId: userId,
            recipientId: partnerId,
          }) as any,
        );
        const nextMessages = Array.isArray(response?.payload?.data)
          ? response.payload.data
          : [];
        setConversation((prev) => {
          const prevLastId = prev[prev.length - 1]?._id;
          const nextLastId = nextMessages[nextMessages.length - 1]?._id;
          if (prev.length === nextMessages.length && prevLastId === nextLastId) {
            return prev;
          }
          return nextMessages;
        });

        const partnerFromMessages = resolvePartnerFromMessages(nextMessages, userId);
        if (partnerFromMessages) {
          setPartnerProfile(partnerFromMessages);
        }
      } catch (error) {
        console.error("Error fetching conversation:", error);
      } finally {
        if (!options?.silent) {
          setIsInitialLoading(false);
        }
      }
    },
    [currentUserId, dispatch, partnerId, resolvePartnerFromMessages],
  );

  fetchConversationRef.current = fetchConversation;

  useEffect(() => {
    void fetchPartnerProfile();
    void fetchConversation();
  }, [fetchConversation, fetchPartnerProfile]);

  useEffect(() => {
    const poll = () => {
      if (document.visibilityState === "hidden") {
        return;
      }
      void fetchConversationRef.current({ silent: true });
    };
    const intervalId = window.setInterval(poll, POLL_INTERVAL_MS);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        poll();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [partnerId]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [conversation.length]);

  const handleSendMessage = async () => {
    if (!messageContent.trim() && files.length === 0) {
      return;
    }
    if (!partnerId) {
      return;
    }

    const stored = JSON.parse(localStorage.getItem("nrv-user") as string);
    const senderId = stored?.user?._id;
    if (!senderId) {
      return;
    }

    const formData = new FormData();
    formData.append("sender", senderId);
    formData.append("recipient", partnerId);
    formData.append("content", messageContent.trim());

    files.forEach((file) => {
      formData.append("file", file);
    });

    try {
      setIsSending(true);
      await dispatch(sendMessage(formData) as any);
      setMessageContent("");
      setFiles([]);
      await fetchConversation({ silent: true });
    } catch {
      alert("Error sending message");
    } finally {
      setIsSending(false);
    }
  };

  const handleComposerKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSendMessage();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files ? Array.from(event.target.files) : [];
    const validFiles = selectedFiles.filter((file) => file.size <= 2 * 1024 * 1024);

    if (validFiles.length + files.length > 4) {
      alert("You can upload a maximum of 4 files.");
      return;
    }

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    event.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index));
  };

  const partner =
    partnerProfile ??
    resolvePartnerFromMessages(conversation, currentUserId) ??
    null;

  const partnerName = [partner?.firstName, partner?.lastName].filter(Boolean).join(" ") || "Conversation";

  const renderFilePreviews = () => {
    if (files.length === 0) {
      return null;
    }

    return (
      <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {files.map((file, index) => {
          const isImage = file.type.startsWith("image/");
          return (
            <div key={`${file.name}-${index}`} className="relative flex flex-col items-center gap-1">
              <FaTimesCircle
                onClick={() => handleRemoveFile(index)}
                className="absolute -right-1 -top-1 cursor-pointer text-red-500"
                size={18}
                aria-label={`Remove ${file.name}`}
              />
              {isImage ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview-${index}`}
                  className="h-16 w-16 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-200 px-1">
                  <p className="truncate text-[10px] text-center">{file.name}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderComposer = () => (
    <div className="shrink-0 border-t border-gray-200 bg-white px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-4 md:pb-3">
      {renderFilePreviews()}
      <div className="flex items-end gap-2 md:gap-3">
        <button
          type="button"
          className="shrink-0 p-1 text-nrvPrimaryGreen"
          onClick={() => document.getElementById(fileInputId)?.click()}
          aria-label="Attach files"
        >
          <FaPlusCircle size={22} />
        </button>
        <input
          id={fileInputId}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <textarea
          rows={1}
          className="max-h-32 min-h-[44px] flex-1 resize-none rounded-2xl border border-gray-300 px-4 py-2.5 text-sm text-black focus:border-nrvPrimaryGreen focus:outline-none focus:ring-1 focus:ring-nrvPrimaryGreen"
          placeholder="Type your message..."
          value={messageContent}
          onChange={(event) => setMessageContent(event.target.value)}
          onKeyDown={handleComposerKeyDown}
        />
        <button
          type="button"
          className="shrink-0 rounded-full bg-nrvPrimaryGreen p-2.5 text-white disabled:opacity-50"
          onClick={() => void handleSendMessage()}
          disabled={isSending || (!messageContent.trim() && files.length === 0)}
          aria-label="Send message"
        >
          <IoSend size={18} />
        </button>
      </div>
    </div>
  );

  if (isInitialLoading) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6 p-4">
        <div className="flex items-center gap-4 border-b pb-4">
          <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`h-16 animate-pulse rounded-2xl bg-gray-100 ${
                  index % 2 === 0 ? "w-2/3" : "w-1/2 bg-emerald-50"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const hasMessages = conversation.length > 0;

  return (
    <div className="-mx-2 -mt-3 mb-0 flex h-[calc(100dvh-3.75rem)] max-h-[calc(100dvh-3.75rem)] w-auto flex-col overflow-hidden bg-white sm:-mx-4 md:mx-auto md:mt-0 md:h-[calc(100dvh-6.5rem)] md:max-h-[calc(100dvh-6.5rem)] md:max-w-3xl md:rounded-2xl md:border md:border-gray-200 md:shadow-sm lg:h-[calc(100dvh-5.5rem)] lg:max-h-[calc(100dvh-5.5rem)]">
      <div className="flex shrink-0 items-center gap-3 border-b border-gray-200 px-3 py-3 md:px-4">
        <button
          type="button"
          className="shrink-0 p-1"
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <IoArrowBack size={22} className="text-nrvDarkGrey" />
        </button>
        <RandomColorCircle
          firstName={partner?.firstName}
          lastName={partner?.lastName}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-nrvDarkGrey">{partnerName}</p>
          <p className="text-xs text-gray-500">
            {isLandlordView ? "Tenant conversation" : "Landlord conversation"}
          </p>
        </div>
      </div>

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-3 py-4 md:px-4"
      >
        {hasMessages ? (
          <ConversationDetailsScreen messages={conversation} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center py-8 text-center">
            <EmptyState />
            <p className="mt-2 text-sm text-nrvLightGrey">No messages yet</p>
            <p className="mt-1 max-w-xs text-xs text-gray-400">
              Send a message to start the conversation. New messages appear here automatically.
            </p>
          </div>
        )}
      </div>

      {renderComposer()}
    </div>
  );
};

export default MessagingDetailsScreen;

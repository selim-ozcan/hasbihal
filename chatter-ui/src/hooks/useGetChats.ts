import { useQuery } from "@tanstack/react-query";
import { useGetMe } from "./useGetMe";
import { useEffect } from "react";
import { useSocketContext } from "./useSocketContext";
import { useParams } from "react-router-dom";

const getChats = async () => {
  const response = await fetch("http://localhost:3000/chats", {
    credentials: "include",
  });

  if (!response.ok) {
    throw await response.json();
  }

  const user = await response.json();
  return user;
};

export const useGetChats = () => {
  const user = useGetMe();
  const { socket } = useSocketContext();
  const { data } = useQuery({
    queryFn: getChats,
    queryKey: ["chats", user._id],
    retry: false,
  });

  useEffect(() => {
    if (data) {
      data.forEach((chat) => socket.emit("join", { chatId: chat._id }));
    }

    return () => {
      data.forEach((chat) => socket.emit("leave", { chatId: chat._id }));
    };
  }, [user, data, socket]);
  return { data };
};

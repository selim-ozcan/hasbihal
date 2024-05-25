import { useQuery } from "@tanstack/react-query";
import { useGetMe } from "./useGetMe";
import { useEffect } from "react";
import { useSocketContext } from "./useSocketContext";

const getChat = async (id: string) => {
  const response = await fetch(`http://localhost:3000/chats/${id}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw await response.json();
  }

  const user = await response.json();
  return user;
};

export const useGetChat = (id: string) => {
  const user = useGetMe();
  const { socket } = useSocketContext();
  const { data, error, isError } = useQuery({
    queryFn: () => getChat(id),
    queryKey: ["chat", user._id, id],
    retry: false,
  });

  useEffect(() => {
    if (data) {
      socket.emit("join", { chatId: data._id });
    }

    return () => {
      if (data) {
        socket.emit("leave", { chatId: data._id });
      }
    };
  }, [user, data, socket]);

  return { data, error, isError };
};

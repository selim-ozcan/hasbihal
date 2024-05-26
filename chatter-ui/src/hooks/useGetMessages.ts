import { useQuery } from "@tanstack/react-query";
import { useGetMe } from "./useGetMe";
import { queryClient } from "../constants/query-client";
import { useEffect } from "react";
import { useSocketContext } from "./useSocketContext";
import { enqueueSnackbar } from "notistack";

const getMessages = async (chatId: string) => {
  const response = await fetch(`http://localhost:3000/messages/${chatId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw await response.json();
  }

  const user = await response.json();
  return user;
};

export const useGetMessages = (chatId) => {
  const me = useGetMe();
  const { socket } = useSocketContext();

  const { data } = useQuery({
    queryFn: () => getMessages(chatId),
    queryKey: ["messages", me._id, chatId],
    retry: false,
  });

  useEffect(() => {
    const listener = async (message) => {
      if (message.chatId === chatId) {
        await queryClient.setQueryData(
          ["messages", me._id, message.chatId],
          (oldData: any[]) => {
            return [...oldData, message];
          },
          {}
        );
      } else {
        const chat = queryClient
          .getQueryData<any[]>(["chats", me._id])
          ?.filter((chat) => chat._id === chatId)[0];
        enqueueSnackbar(`New message on chat: ${chat.name}`, {
          anchorOrigin: { horizontal: "center", vertical: "top" },
          variant: "default",
          TransitionProps: { direction: "down" },
        });
      }
    };
    if (chatId && me?._id) {
      socket.on("message", listener);
    }

    return () => {
      socket.off("message", listener);
    };
  }, [chatId, me._id, socket]);

  return { data };
};

import { useQuery } from "@tanstack/react-query";
import { useGetMe } from "./useGetMe";
import { queryClient } from "../constants/query-client";
import { useEffect } from "react";
import { useSocketContext } from "./useSocketContext";

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
    if (chatId && me?._id) {
      socket.on(
        "message",
        async (message) => {
          await queryClient.setQueryData(
            ["messages", me._id, chatId],
            (oldData: any[]) => {
              return [...oldData, message];
            }
          );
        }

        // her mesajda yeniden fetch de edilebilir ancak performans sıkıntısı yaratabilir.
        // await queryClient.invalidateQueries({
        //   queryKey: ["messages", me._id, chatId],
        //   exact: true,
        // })
      );
    }

    return () => {
      socket.off("message");
    };
  }, [chatId, me._id, socket]);

  return { data };
};

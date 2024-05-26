import { useQuery } from "@tanstack/react-query";
import { useGetMe } from "./useGetMe";

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

  const { data } = useQuery({
    queryFn: () => getMessages(chatId),
    queryKey: ["messages", me._id, chatId],
    retry: false,
  });

  return { data };
};

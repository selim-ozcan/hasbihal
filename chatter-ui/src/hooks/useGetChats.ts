import { useQuery } from "@tanstack/react-query";
import { useGetMe } from "./useGetMe";

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
  const { data } = useQuery({
    queryFn: getChats,
    queryKey: ["chats", user._id],
    retry: false,
  });

  return { data };
};

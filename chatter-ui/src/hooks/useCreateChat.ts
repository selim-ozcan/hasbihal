import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { queryClient } from "../constants/query-client";
import { useGetMe } from "./useGetMe";
import { useNavigate } from "react-router-dom";

const createChat = async (chat: any) => {
  const response = await fetch("http://localhost:3000/chats", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(chat),
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return await response.json();
};

const useCreateChat = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const me = useGetMe();
  const { mutate } = useMutation({
    mutationFn: createChat,
    onSuccess: async (chat) => {
      enqueueSnackbar("New chat created!", { variant: "success" });
      await queryClient.invalidateQueries({
        queryKey: ["chats", me._id],
        exact: true,
      });
      navigate(`/chats/${chat._id}`);
    },
    onError: () => {
      enqueueSnackbar("Error creating chat", { variant: "error" });
    },
  });

  return { createChat: mutate };
};

export default useCreateChat;

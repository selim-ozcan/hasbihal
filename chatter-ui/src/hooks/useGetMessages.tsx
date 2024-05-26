import { useQuery } from "@tanstack/react-query";
import { useGetMe } from "./useGetMe";
import { queryClient } from "../constants/query-client";
import { useEffect } from "react";
import { useSocketContext } from "./useSocketContext";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

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
  const navigate = useNavigate();

  const { data } = useQuery({
    queryFn: () => getMessages(chatId),
    queryKey: ["messages", me._id, chatId],
    retry: false,
  });

  return { data };
};

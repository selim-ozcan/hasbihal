import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useSocketContext } from "./useSocketContext";
//import { queryClient } from "../constants/query-client";
//import { useGetMe } from "./useGetMe";

const createMessage = async ({ message, chatId }) => {
  // const response = await fetch("http://localhost:3000/messages", {
  //   method: "POST",
  //   headers: {
  //     "Content-type": "application/json",
  //   },
  //   body: JSON.stringify({ content: message, chatId }),
  //   credentials: "include",
  // });
  // if (!response.ok) {
  //   const error = await response.json();
  //   throw error;
  // }
  // return await response.json();
  return Promise.resolve({ message, chatId });
};

const useCreateMessage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { socket } = useSocketContext();
  //const me = useGetMe();
  const { mutate } = useMutation({
    mutationFn: createMessage,
    onSuccess: async (_, { message, chatId }) => {
      // her mesaj gönderildikten sonra yeniden fetch edilebilir. ama tabi ki daha yavaş.
      // await queryClient.invalidateQueries({
      //   queryKey: ["messages", me._id, chatId],
      //   exact: true,
      // });
      socket.emit("message", { content: message, chatId });
    },
    onError: () => {
      enqueueSnackbar("Error creating message", { variant: "error" });
    },
  });

  return { createMessage: mutate };
};

export default useCreateMessage;

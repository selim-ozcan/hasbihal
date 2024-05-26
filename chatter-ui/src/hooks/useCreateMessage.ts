import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useSocketContext } from "./useSocketContext";

const createMessage = async ({ message, chatId }) => {
  return Promise.resolve({ message, chatId });
};

const useCreateMessage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { socket } = useSocketContext();
  const { mutate } = useMutation({
    mutationFn: createMessage,
    onSuccess: async (_, { message, chatId }) => {
      socket.emit("message", { content: message, chatId });
    },
    onError: () => {
      enqueueSnackbar("Error creating message", { variant: "error" });
    },
  });

  return { createMessage: mutate };
};

export default useCreateMessage;

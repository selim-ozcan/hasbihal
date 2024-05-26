import List from "@mui/material/List";
import ChatListItem from "./ChatListItem";
import ChatListHeader from "./ChatListHeader";
import { Divider, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import AddChatModal from "./AddChatModal";
import { useGetChats } from "../../hooks/useGetChats";
import { useSocketContext } from "../../hooks/useSocketContext";

export default function ChatList() {
  const [showAddChatModal, setShowAddChatModal] = useState(false);
  const { socket } = useSocketContext();
  const { data: chats } = useGetChats();
  const [renderedChats, setRenderedChats] = useState<any[]>([]);

  useEffect(() => {
    setRenderedChats(chats);

    const listener = async (message) => {
      setRenderedChats(
        chats.map((chat) => {
          if (chat._id === message.chatId) {
            return { ...chat, lastMessage: message };
          } else return chat;
        })
      );
    };
    if (chats) {
      socket.on("message", listener);
    }

    return () => {
      socket.off("message", listener);
    };
  }, [chats, socket]);

  function handleOpenAddChatModal() {
    setShowAddChatModal(true);
  }

  function handleCloseAddChatModal() {
    setShowAddChatModal(false);
  }
  return (
    <>
      <AddChatModal
        open={showAddChatModal}
        handleClose={handleCloseAddChatModal}
      ></AddChatModal>
      <Stack>
        <ChatListHeader handleAddChat={handleOpenAddChatModal}></ChatListHeader>
        <Divider />
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            maxHeight: "80vh",
            overflow: "auto",
          }}
        >
          {renderedChats &&
            renderedChats.length > 0 &&
            renderedChats
              .sort((a, b) => {
                return (
                  (b.lastMessage
                    ? new Date(b.lastMessage.createdAt).getTime()
                    : 0) -
                  (a.lastMessage
                    ? new Date(a.lastMessage.createdAt).getTime()
                    : 0)
                );
              })
              .map((chat) => (
                <ChatListItem key={chat._id} chat={chat}></ChatListItem>
              ))}
        </List>
      </Stack>
    </>
  );
}

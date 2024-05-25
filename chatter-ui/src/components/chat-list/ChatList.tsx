import List from "@mui/material/List";
import ChatListItem from "./ChatListItem";
import ChatListHeader from "./ChatListHeader";
import { Divider, Stack } from "@mui/material";
import { useState } from "react";
import AddChatModal from "./AddChatModal";
import { useGetChats } from "../../hooks/useGetChats";

export default function ChatList() {
  const [showAddChatModal, setShowAddChatModal] = useState(false);
  const { data: chats } = useGetChats();

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
          {chats &&
            chats.length > 0 &&
            chats.map((chat) => (
              <ChatListItem key={chat._id} chat={chat}></ChatListItem>
            ))}
        </List>
      </Stack>
    </>
  );
}

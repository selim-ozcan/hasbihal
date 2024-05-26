import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import useCreateChat from "../../hooks/useCreateChat";
import UserSearchInput from "./UserSearchInput";

const AddChatModal = ({ open, handleClose }) => {
  const [name, setName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const { createChat } = useCreateChat();

  useEffect(() => {
    setSelectedUsers([]);
    setName("");
  }, [open]);

  async function handleCreateChat() {
    const userIds = selectedUsers.map((user) => user._id);
    handleClose();
    createChat({
      name: name || undefined,
      userIds: userIds,
    });
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Stack spacing={4}>
          <Typography variant="h6" textAlign="center" component={"h2"}>
            Create Chat
          </Typography>

          <TextField
            label={"Name"}
            value={name}
            onChange={(event) => setName(event.target.value)}
          ></TextField>

          <UserSearchInput
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
          ></UserSearchInput>

          <Button
            variant="outlined"
            onClick={handleCreateChat}
            disabled={name === "" || selectedUsers.length === 0}
          >
            Save
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AddChatModal;

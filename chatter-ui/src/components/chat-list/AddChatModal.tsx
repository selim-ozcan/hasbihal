import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputBase,
  Modal,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import SearchIcon from "@mui/icons-material/Search";
import useCreateChat from "../../hooks/useCreateChat";

const AddChatModal = ({ open, handleClose }) => {
  const [isPrivate, setIsPrivate] = useState(true);
  const [name, setName] = useState("");
  const [userIds, setUserIds] = useState<string[]>([]);
  const { createChat } = useCreateChat();
  const [emailToAdd, setEmailToAdd] = useState("");

  useEffect(() => {
    setEmailToAdd("");
    setUserIds([]);
  }, [open]);

  async function handleCreateChat() {
    handleClose();
    createChat({
      isPrivate,
      name: name || undefined,
      userIds: userIds.length === 0 ? undefined : userIds,
    });
  }

  function handleAddUser() {
    setUserIds((prev) => [...prev, emailToAdd]);
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
        <Stack spacing={2}>
          <Typography variant="h6" component={"h2"}>
            Add Chat
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  defaultChecked
                  value={isPrivate}
                  onChange={(event) => setIsPrivate(event.target.checked)}
                />
              }
              label="Private"
            />
          </FormGroup>
          {isPrivate ? (
            <>
              <Paper
                sx={{
                  padding: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search Users"
                  value={emailToAdd}
                  onChange={(event) => setEmailToAdd(event.target.value)}
                />
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </Paper>
              <Button variant="outlined" onClick={handleAddUser}>
                Add User
              </Button>
            </>
          ) : (
            <TextField
              label={"Name"}
              value={name}
              onChange={(event) => setName(event.target.value)}
            ></TextField>
          )}
          <Button variant="outlined" onClick={handleCreateChat}>
            Save
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AddChatModal;

import { useNavigate, useParams } from "react-router-dom";
import { useGetChat } from "../../hooks/useGetChat";
import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import useCreateMessage from "../../hooks/useCreateMessage";
import { useGetMessages } from "../../hooks/useGetMessages";

const Chat = () => {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const { data: chat, isError } = useGetChat(id!);
  const { createMessage } = useCreateMessage();
  const { data: messages } = useGetMessages(id);
  const navigate = useNavigate();
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isError) {
      navigate("/chats");
    }
  }, [isError, navigate]);

  useEffect(() => {
    setMessage("");
    scrollToBottom();
  }, [id, messages]);

  function scrollToBottom() {
    chatBottomRef.current?.scrollIntoView({ block: "start" });
  }

  async function handleSendMessage() {
    if (message !== "") {
      createMessage({ message, chatId: chat._id });
      setMessage("");
    }
  }

  function calculateAppBarHeight() {
    const header = document.getElementsByTagName("header")[0];
    return header?.offsetHeight;
  }

  function calculateAddChatBarHeight() {
    const header = document.getElementsByTagName("header")[1];
    if (header?.offsetHeight === 0) {
      return "auto";
    } else {
      return header?.offsetHeight;
    }
  }

  return (
    <Stack
      sx={{
        maxHeight: `calc(98vh - ${calculateAppBarHeight()}px)`,
        height: `calc(98vh - ${calculateAppBarHeight()}px)`,
        overflow: "hidden",
        justifyContent: "space-between",
        alignItems: "stretch",
      }}
      display={{ xs: id ? "flex" : "none", md: "flex" }}
    >
      <h1
        style={{
          minHeight: `calc(${calculateAddChatBarHeight()}px)`,
          height: `calc(${calculateAddChatBarHeight()}px)`,
          maxHeight: `calc(${calculateAddChatBarHeight()}px)`,
          alignContent: "center",
          margin: 0,
        }}
      >
        {chat?.name}
      </h1>
      <Box sx={{ overflow: "auto", height: "100%" }}>
        {messages?.map((message) => (
          <Grid
            key={message._id}
            container
            alignItems="center"
            marginBottom="1rem"
            /*flexDirection="row-reverse" */
          >
            <Grid item xs={2} lg={1}>
              <Avatar
                src=""
                sx={{
                  height: 52,
                  width: 52,
                  marginTop: "-15px",
                }}
              ></Avatar>
            </Grid>
            <Grid item xs={8} lg={10}>
              <Stack /* alignItems="flex-end" */>
                <Paper sx={{ width: "fit-content", marginRight: "0.25rem" }}>
                  <Typography sx={{ padding: "0.9rem" }}>
                    {message.content}
                  </Typography>
                </Paper>
                <Typography variant="caption" sx={{ marginLeft: "0.25rem" }}>
                  {new Date(message.createdAt).toLocaleTimeString()}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        ))}
        <div ref={chatBottomRef}></div>
      </Box>
      <Paper
        sx={{
          p: "2px 4px",
          display: "flex",
          justifySelf: "flex-end",
          alignItems: "center",
          width: "100%",
          margin: "1rem 0",
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1, width: "100%" }}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSendMessage();
            }
          }}
          placeholder="Message"
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton
          color="primary"
          sx={{ p: "10px" }}
          onClick={handleSendMessage}
        >
          <SendIcon></SendIcon>
        </IconButton>
      </Paper>
    </Stack>
  );
};

export default Chat;

import { useGetMe } from "../../hooks/useGetMe";
import { useNavigate, useParams } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useSocketContext } from "../../hooks/useSocketContext";
import { enqueueSnackbar } from "notistack";
import { useGetChats } from "../../hooks/useGetChats";
import { queryClient } from "../../constants/query-client";

function Header() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const { socket } = useSocketContext();
  const navigate = useNavigate();
  const { data } = useGetChats();
  const user = useGetMe();
  const params = useParams();

  useEffect(() => {
    let c;
    const listener = (chat) => {
      c = chat;
      socket.emit("join", { chatId: chat._id });
      enqueueSnackbar(`New chat: ${chat.name}`, { variant: "info" });
    };
    socket.emit("join-chat-announce");
    socket.on("chat-announce", listener);

    return () => {
      socket.off("chat-announce", listener);
      socket.off("join-chat-announce");
      if (c) socket.emit("leave", { chatId: c?._id });
    };
  }, [socket]);

  useEffect(() => {
    if (data) {
      data.forEach((chat) => socket.emit("join", { chatId: chat._id }));
    }

    return () => {
      if (data) {
        data.forEach((chat) => socket.emit("leave", { chatId: chat._id }));
      }
    };
  }, [socket, data]);

  useEffect(() => {
    const listener = async (message) => {
      if (params.id && message.chatId === params.id) {
        await queryClient.setQueryData(
          ["messages", user._id, message.chatId],
          (oldData: any[]) => {
            return [...oldData, message];
          },
          {}
        );
      } else {
        enqueueSnackbar(`New message on chat: ${message.chatName}`, {
          action: () => (
            <Button
              onClick={() => navigate(`/chats/${message.chatId}`)}
              style={{
                height: "100%",
                left: 0,
                position: "absolute",
                top: 0,
                width: "100%",
              }}
            />
          ),
          anchorOrigin: { horizontal: "center", vertical: "top" },
          variant: "info",
          TransitionProps: { direction: "down" },
        });
      }
    };
    if (user?._id) {
      socket.on("message", listener);
    }

    return () => {
      socket.off("message", listener);
    };
  }, [params, user?._id, socket, navigate]);

  const handleClickLogout = () => {
    handleCloseUserMenu();
    navigate("/logout");
  };

  const handleOpenChatList = () => {
    navigate("/chats");
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleHeaderClick = () => {
    navigate("/chats");
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <QuestionAnswerIcon
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
          />
          <Typography
            onClick={handleHeaderClick}
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              letterSpacing: ".2rem",
              color: "inherit",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            hasbihal
          </Typography>
          <QuestionAnswerIcon
            sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
          />
          <Typography
            onClick={handleHeaderClick}
            variant="h5"
            noWrap
            component="a"
            sx={{
              display: { xs: "flex", md: "none" },

              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".2rem",
              color: "inherit",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            hasbihal
          </Typography>

          <Box sx={{ flexGrow: 1 }}>
            <MenuItem onClick={handleOpenChatList}>
              <Typography textAlign="center">Chats</Typography>
            </MenuItem>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={user?.email?.charAt(0)?.toUpperCase()}
                  src={user?.imageUrl}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={() => navigate("/profile")}>
                <Typography textAlign="center">Profile</Typography>
              </MenuItem>
              <MenuItem onClick={handleClickLogout}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;

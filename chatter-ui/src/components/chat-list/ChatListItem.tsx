import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { ListItemButton } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const ChatListItem = ({ chat }) => {
  const navigate = useNavigate();
  const params = useParams();

  function handleChatClick() {
    navigate(`/chats/${chat._id}`);
  }
  return (
    <>
      {chat && (
        <>
          {" "}
          <ListItem alignItems="flex-start" disablePadding>
            <ListItemButton
              onClick={handleChatClick}
              selected={params.id === chat._id}
            >
              <ListItemAvatar>
                <Avatar
                  alt={chat.lastMessage?.username}
                  src={chat.lastMessage?.imageUrl}
                />
              </ListItemAvatar>
              <ListItemText
                primary={chat.name}
                secondary={
                  <>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {chat.lastMessage
                        ? chat.lastMessage.content.substring(0, 20) +
                          (chat.lastMessage.content.length > 20 ? "... " : " ")
                        : null}
                    </Typography>
                    {chat.lastMessage &&
                      new Date(chat.lastMessage.createdAt).toLocaleTimeString()}
                  </>
                }
              />
            </ListItemButton>
          </ListItem>
          <Divider variant="inset" component="li" />
        </>
      )}
    </>
  );
};

export default ChatListItem;

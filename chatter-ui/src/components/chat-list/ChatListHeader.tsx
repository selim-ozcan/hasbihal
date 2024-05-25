import { AddCircle } from "@mui/icons-material";
import { AppBar, IconButton, Toolbar } from "@mui/material";

const ChatListHeader = ({ handleAddChat }) => {
  return (
    <AppBar position="static" color="transparent">
      <Toolbar>
        <IconButton size="large" edge="start" onClick={handleAddChat}>
          <AddCircle></AddCircle>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default ChatListHeader;

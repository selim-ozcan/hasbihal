import Grid from "@mui/material/Grid";
import ChatList from "../chat-list/ChatList";
import { Outlet, useParams } from "react-router-dom";

export default function Home() {
  const params = useParams();

  return (
    <Grid container spacing={3}>
      <Grid
        item
        xs={13}
        md={5}
        lg={4}
        xl={3}
        display={{ xs: params.id ? "none" : "block", md: "block" }}
      >
        <ChatList></ChatList>
      </Grid>
      <Grid item xs={12} md={7} lg={8} xl={9}>
        <Outlet></Outlet>
      </Grid>
    </Grid>
  );
}

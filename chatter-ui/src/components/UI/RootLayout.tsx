import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Container } from "@mui/material";

const RootLayout = () => {
  return (
    <>
      <Header></Header>
      <Container maxWidth="xl">
        <Outlet></Outlet>
      </Container>
    </>
  );
};

export default RootLayout;

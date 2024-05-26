import { createBrowserRouter, redirect } from "react-router-dom";
import Auth from "./components/auth/Auth";
import Home from "./components/home/Home";
import AuthGuard from "./components/auth/AuthGuard";
import RootLayout from "./components/UI/RootLayout";
import { queryClient } from "./constants/query-client";
import { enqueueSnackbar } from "notistack";
import Chat from "./components/chat/Chat";
import Profile from "./components/profile/Profile";

const homePageRoles = ["user", "admin"];
const router = createBrowserRouter([
  {
    element: <RootLayout></RootLayout>,
    children: [
      {
        path: "/",
        loader: () => redirect("/chats"),
      },

      {
        path: "/chats",
        element: <AuthGuard roles={homePageRoles} />,
        children: [
          {
            path: "",
            element: <Home />,
            children: [{ path: ":id", element: <Chat /> }],
          },
        ],
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/logout",
        loader: logoutLoader,
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
  },
]);

export default router;

async function logoutLoader() {
  try {
    await fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    await queryClient.invalidateQueries({ refetchType: "inactive" });
    queryClient.clear();
    enqueueSnackbar("You are logged out.", { variant: "success" });
    return redirect("/");
  } catch {
    return redirect("/");
  }
}

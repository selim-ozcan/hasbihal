import { CssBaseline, Slide, ThemeProvider, createTheme } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./constants/query-client";
import LoadingProvider from "./components/UI/LoadingProvider";
import { SnackbarProvider } from "notistack";
import SocketProvider from "./components/utils/SocketProvider";

const darkTheme = createTheme({ palette: { mode: "dark" } });

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline enableColorScheme />
      <SocketProvider>
        <QueryClientProvider client={queryClient}>
          <LoadingProvider>
            <SnackbarProvider
              autoHideDuration={2000}
              maxSnack={2}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              TransitionComponent={(props) => (
                <Slide {...props} direction="up" />
              )}
            >
              <RouterProvider router={router}></RouterProvider>
            </SnackbarProvider>
          </LoadingProvider>
        </QueryClientProvider>
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App;

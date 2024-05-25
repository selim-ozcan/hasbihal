import { useCallback, useState } from "react";
import { queryClient } from "../constants/query-client";
import { useLoadingSpinnerContext } from "./useLoadingSpinnerContext";
import { useSnackbar } from "notistack";
import { useSocketContext } from "./useSocketContext";
import { io } from "socket.io-client";

interface LoginRequest {
  email: string;
  password: string;
}

const useLogin = () => {
  const [error, setError] = useState<boolean>();
  const { setLoading } = useLoadingSpinnerContext();
  const { enqueueSnackbar } = useSnackbar();
  const { setSocket } = useSocketContext();

  const login = useCallback(
    async (request: LoginRequest) => {
      setLoading(true);
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!res.ok) {
        setError(true);
        setLoading(false);
        enqueueSnackbar("Login failed", { variant: "error" });
        return;
      }

      setError(false);
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      enqueueSnackbar("You are logged in.", {
        variant: "success",
      });
      setSocket(
        io("http://localhost:3000", {
          withCredentials: true,
        })
      );
      setLoading(false);
    },
    [setLoading, enqueueSnackbar, setSocket]
  );

  return { login, error };
};

export default useLogin;

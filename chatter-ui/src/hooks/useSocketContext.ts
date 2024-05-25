import { SetStateAction, createContext, useContext } from "react";
import { Socket, io } from "socket.io-client";

export const initialSocketValue = {
  socket: io("http://localhost:3000", {
    withCredentials: true,
  }),
  setSocket: () => {},
};

export const SocketContext = createContext<{
  socket: Socket;
  setSocket: React.Dispatch<SetStateAction<Socket>>;
}>(initialSocketValue);

export const useSocketContext = () => {
  const context = useContext(SocketContext);

  if (!context) throw new Error("You cannot use socket context here.");

  return context;
};

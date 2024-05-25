import { useState } from "react";
import {
  SocketContext,
  initialSocketValue,
} from "../../hooks/useSocketContext";

export default function SocketProvider({ children }) {
  const [socket, setSocket] = useState<any>(initialSocketValue.socket);

  const contextValue = { socket, setSocket };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
}

import { SetStateAction, createContext, useEffect, useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

export const LoadingContext = createContext<{
  loading: boolean;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
}>({
  loading: false,
  setLoading: () => {},
});

export default function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const ctxValue = {
    loading,
    setLoading,
  };

  useEffect(() => {
    if (isFetching || isMutating) setLoading(true);
    else setLoading(false);
  }, [isFetching, isMutating]);

  return (
    <>
      {loading && <LoadingSpinner></LoadingSpinner>}
      <LoadingContext.Provider value={ctxValue}>
        {children}
      </LoadingContext.Provider>
    </>
  );
}

import { useContext } from "react";
import { LoadingContext } from "../components/UI/LoadingProvider";

export const useLoadingSpinnerContext = () => {
  const ctx = useContext(LoadingContext);

  if (!ctx) {
    throw new Error("Loading spinner context not available here.");
  }
  return ctx;
};

import { useMutation } from "@tanstack/react-query";
import useLogin from "./useLogin";

const signup = async ({ email, username, password }) => {
  const response = await fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, username, password }),
  });

  if (!response.ok) {
    // error handling
    throw await response.json();
  }
  return await response.json();
};

const useSignup = () => {
  const { mutate } = useMutation({
    mutationFn: signup,
    onSuccess: (_, { email, password }) => {
      login({ email, password });
    },
  });
  const { login } = useLogin();

  return { signup: mutate };
};

export default useSignup;

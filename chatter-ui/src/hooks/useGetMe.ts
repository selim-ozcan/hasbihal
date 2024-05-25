import { useQuery } from "@tanstack/react-query";

const getMeQuery = async () => {
  const response = await fetch("http://localhost:3000/users/me", {
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  const user = await response.json();
  return user;
};

export const useGetMe = () => {
  const { data, isError } = useQuery({
    queryFn: getMeQuery,
    queryKey: ["me"],
    retry: false,
    staleTime: 10000,
  });

  if (isError) {
    return null;
  } else return data;
};

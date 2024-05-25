import { Button, Stack, TextField, Link as MUILink } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { useGetMe } from "../../hooks/useGetMe";
import useSignup from "../../hooks/useSignup";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";

  const { login } = useLogin();
  const { signup } = useSignup();
  const user = useGetMe();

  useEffect(() => {
    if (user) {
      navigate("/chats");
    }
  }, [navigate, user]);

  // setSearchParams method's reference changes every render due to a bug in react-router:v6.
  // So we cannot put setSearchParams in the dependency list.
  useEffect(() => {
    setSearchParams("?mode=login");
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (isLogin) {
      login({ email, password });
    } else {
      signup({ email, password });
    }
  }

  return (
    <>
      {user === null && (
        <form onSubmit={(e) => handleSubmit(e)}>
          <Stack
            spacing={3}
            sx={{
              height: "100vh",
              maxWidth: { xs: "70%", md: "25%" },
              margin: "0 auto",
              justifyContent: "center",
            }}
          >
            <TextField
              name="email"
              type="email"
              label="Email"
              variant="outlined"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <TextField
              name="email"
              type="password"
              label="Password"
              variant="outlined"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <Button type="submit" variant="contained">
              {isLogin ? "Login" : "Signup"}
            </Button>
            <Link to={`/auth?mode=${isLogin ? "signup" : "login"}`}>
              <MUILink component="span">{isLogin ? "Signup" : "Login"}</MUILink>
            </Link>
          </Stack>
        </form>
      )}
    </>
  );
}

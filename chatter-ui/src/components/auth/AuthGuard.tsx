import { Outlet, useNavigate } from "react-router-dom";
import { useGetMe } from "../../hooks/useGetMe";
import { useEffect } from "react";

export default function AuthGuard({ roles }) {
  const me = useGetMe();
  const navigate = useNavigate();

  useEffect(() => {
    if (me === null) {
      navigate("/auth");
    } else if (me && !roles.includes(me.role)) {
      navigate("/");
    }
  }, [me, navigate, roles]);

  return <>{me && <Outlet></Outlet>}</>;
}

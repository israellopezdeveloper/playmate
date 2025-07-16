import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function useWalletLogout() {
  const { isConnected } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isConnected) {
      window.localStorage.removeItem("token");
      window.localStorage.setItem("loggedIn", false);
      navigate("/login");
    }
  }, [isConnected, navigate]);
}

import { redirect } from "react-router";

const verifyIfUserIsAuthenticated = () => {
  const authToken = localStorage.getItem("authToken");
  const expireSession = localStorage.getItem("expireSession");
  const now = new Date().getTime();
  if (!authToken || !expireSession || now >= Number(expireSession)) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("expireSession");
    throw redirect("/login");
  }
};

export { verifyIfUserIsAuthenticated };

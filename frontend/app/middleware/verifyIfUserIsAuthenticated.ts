import { redirect } from "react-router";

const verifyIfUserIsAuthenticated = () => {
  const authKey = localStorage.getItem("authKey");
  const expireSession = localStorage.getItem("expireSession");
  const now = new Date().getTime();
  if (!authKey || !expireSession || now >= Number(expireSession)) {
    localStorage.removeItem("authKey");
    localStorage.removeItem("expireSession");
    throw redirect("/login");
  }
};

export { verifyIfUserIsAuthenticated };

import { Container } from "@mui/material";
import logo from "../assets/logo.png";

export const AppBar = () => {
  return (
    <div>
      <Container
        maxWidth="lg"
        className="flex flex-col justify-center items-center"
      >
        <img src={logo} width={200} />
        <div className="flex flex-row">
          <div className="divider-appbar "></div>
        </div>
      </Container>
    </div>
  );
};

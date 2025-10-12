import { Container } from "@mui/material";
import logo from "../assets/file.svg";

export const AppBar = () => {
  return (
    <div className="bg-[#19273170]">
      <Container maxWidth="lg" className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-4">
          <img src={logo} width="100px" />
          <b style={{ fontFamily: "Lora" }} className="text-4xl">
            Sweet Track
          </b>
        </div>
      </Container>
    </div>
  );
};

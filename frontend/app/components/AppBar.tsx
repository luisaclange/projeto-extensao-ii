import { Button, Container, IconButton, Menu, MenuItem } from "@mui/material";
import logo from "../assets/file.svg";
import { useId, useState } from "react";
import { Menu as MenuIcon } from "@mui/icons-material";

export const AppBar = () => {
  const id = useId();
  const buttonId = `${id}-button`;
  const menuId = `${id}-menu`;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="bg-[#19273170]">
      <Container
        maxWidth="lg"
        className="flex flex-row justify-between items-center"
      >
        <div className="flex flex-row items-center gap-4">
          <img src={logo} width="100px" />
          <b style={{ fontFamily: "Lora" }} className="text-4xl">
            Sweet Track
          </b>
        </div>
        <div>
          <IconButton
            id={buttonId}
            aria-controls={open ? menuId : undefined}
            aria-haspopup="true"
            aria-expanded={open}
            color="secondary"
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id={menuId}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              list: {
                "aria-labelledby": buttonId,
              },
            }}
          >
            <MenuItem onClick={handleClose}>
              <span className="text-white">Usuários</span>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <span className="text-white">Minha conta</span>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <span className="text-white">Tema</span>
            </MenuItem>
          </Menu>
        </div>
      </Container>
    </div>
  );
};

import { CheckCircle, Error, Info } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export interface IAlertMessage {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  title: string;
  message: string;
  labelRightButton?: string;
  onClickRightButton?: () => void;
  labelLeftButton?: string;
  onClickLeftButton?: () => void;
  variant?: "info" | "error" | "success" | "warning";
}

export const AlertMessage = ({
  isOpen,
  message,
  setIsOpen,
  title,
  labelLeftButton,
  labelRightButton,
  onClickLeftButton,
  onClickRightButton,
  variant = "info",
}: IAlertMessage) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {variant == "info" ? (
          <Info color="info" className="mr-4 -mt-1" />
        ) : variant == "error" ? (
          <Error color="error" className="mr-4 -mt-1" />
        ) : variant == "success" ? (
          <CheckCircle color="success" className="mr-4 -mt-1" />
        ) : variant == "warning" ? (
          <Error color="warning" className="mr-4 -mt-1" />
        ) : (
          ""
        )}
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <span className="text-[#f4f6fc]">{message}</span>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <div className="w-full flex flex-row justify-between p-2">
          {onClickLeftButton ? (
            <Button
              variant="outlined"
              onClick={() => {
                onClickLeftButton();
                setIsOpen(false);
              }}
              autoFocus
            >
              <b>{labelLeftButton}</b>
            </Button>
          ) : (
            <div></div>
          )}
          <Button
            variant="contained"
            onClick={() => {
              if (onClickRightButton) onClickRightButton();
              setIsOpen(false);
            }}
            autoFocus
          >
            <b>{labelRightButton || "OK"}</b>
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

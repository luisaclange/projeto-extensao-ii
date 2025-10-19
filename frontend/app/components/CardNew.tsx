import { Add } from "@mui/icons-material";
import { Card, CardContent } from "@mui/material";

export function CardNew({
  handleClick,
  size = "8xl",
}: {
  handleClick: () => void;
  size?: string;
}) {
  return (
    <Card
      className="p-0 bg-transparent h-full"
      sx={{ backgroundColor: "#19273170", borderRadius: "16px" }}
      color="transparent"
      onClick={handleClick}
    >
      <CardContent className="flex justify-center items-center h-full p-0">
        <span className={`text-8xl text-[#ff096c]`}>+</span>
      </CardContent>
    </Card>
  );
}

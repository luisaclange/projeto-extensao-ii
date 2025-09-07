import { Add, PlusOne } from "@mui/icons-material";
import { Card, CardContent } from "@mui/material";

export function CardNew({
  handleClick,
  size = "48",
}: {
  handleClick: () => void;
  size?: string;
}) {
  return (
    <Card
      className={`border-2 p-0 border-[#eed0d5] border-dotted h-full min-h-${size}`}
      onClick={handleClick}
    >
      <CardContent className="flex justify-center items-center h-full p-0">
        <span className="text-8xl text-[#d7586d]">+</span>
      </CardContent>
    </Card>
  );
}

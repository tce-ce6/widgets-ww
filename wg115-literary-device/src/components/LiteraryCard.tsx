import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import type { Root } from "./../../interface";

interface Props {
  device: Root;
  onClick: () => void;
}

const LiteraryCard: React.FC<Props> = ({ device, onClick }) => {
  return (
    <Card
      sx={{ p: 3, textAlign: "center", cursor: "pointer" }}
      onClick={onClick}
    >
      <CardContent>
        <Typography variant="h5">
          {device.title}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default LiteraryCard;
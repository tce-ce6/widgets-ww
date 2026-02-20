import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Grid,
  Box,
  Button
} from "@mui/material";
import type { Root } from "./../../interface";
import Builder from "./Builder";

interface Props {
  open: boolean;
  onClose: () => void;
  device: Root;
}

const DetailDialog: React.FC<Props> = ({ open, onClose, device }) => {
  const [launchBuilder, setLaunchBuilder] = useState(false);

  if (launchBuilder) {
    return <Builder device={device} onClose={onClose} />;
  }

  const { mapping, sentence } = device.example;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Description</Typography>
            <Typography>{device.description}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6">Example</Typography>

            {/* Legend */}
            <Box mb={2}>
              {Object.entries(mapping).map(([key, value]) => (
                <Box key={key} display="flex" alignItems="center" mb={1}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      background: value.background,
                      mr: 1
                    }}
                  />
                  <Typography>{value.title}</Typography>
                </Box>
              ))}
            </Box>

            {/* Sentence */}
            <Typography>
              {sentence.map((word, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: word.type
                      ? mapping[word.type]?.background
                      : "transparent",
                    padding: "4px",
                    marginRight: "4px"
                  }}
                >
                  {word.words}
                </span>
              ))}
            </Typography>
          </Grid>
        </Grid>

        <Box textAlign="center" mt={4}>
          <Button variant="contained" onClick={() => setLaunchBuilder(true)}>
            Launch Builder
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DetailDialog;
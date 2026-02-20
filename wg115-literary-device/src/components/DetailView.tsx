import React, {
  useLayoutEffect,
  useRef,
  useState
} from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Grid,
  Box,
  Button
} from "@mui/material";
import type { Root } from "./../../interface";

interface Props {
  open: boolean;
  device: Root;
  onClose: () => void;
  onLaunchBuilder: () => void;
}

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}

const DetailView: React.FC<Props> = ({
  open,
  device,
  onClose,
  onLaunchBuilder
}) => {
  const { mapping, sentence } = device.example;

  const containerRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const [lines, setLines] = useState<Line[]>([]);
  const [svgHeight, setSvgHeight] = useState<number>(300);

  useLayoutEffect(() => {
    if (!open) return;

    const calculateLines = () => {
      if (!containerRef.current) return;

      const containerRect =
        containerRef.current.getBoundingClientRect();

      const newLines: Line[] = [];

      sentence.forEach((word, index) => {
        if (!word.type) return;

        const labelEl = labelRefs.current[word.type];
        const wordEl = wordRefs.current[index];

        if (!labelEl || !wordEl) return;

        const labelRect = labelEl.getBoundingClientRect();
        const wordRect = wordEl.getBoundingClientRect();

        newLines.push({
          x1:
            labelRect.left +
            labelRect.width / 2 -
            containerRect.left,
          y1:
            labelRect.bottom -
            containerRect.top,
          x2:
            wordRect.left +
            wordRect.width / 2 -
            containerRect.left,
          y2:
            wordRect.top -
            containerRect.top,
          color: mapping[word.type].background
        });
      });

      setSvgHeight(containerRect.height);
      setLines(newLines);
    };

    // Delay slightly to allow dialog animation to finish
    const timeout = setTimeout(() => {
      calculateLines();
    }, 50);

    window.addEventListener("resize", calculateLines);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", calculateLines);
    };
  }, [open, sentence, mapping]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogContent>

        <Grid container spacing={4}>
          {/* LEFT SIDE */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="h5" mb={2}>
              {device.title}
            </Typography>
            <Typography>
              {device.description}
            </Typography>
          </Grid>

          {/* RIGHT SIDE */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              ref={containerRef}
              position="relative"
            >
              {/* 🔹 Horizontal Labels */}
              <Box
                display="flex"
                justifyContent="space-around"
                mb={6}
              >
                {Object.entries(mapping).map(
                  ([key, value]) => (
                    <Box
                      key={key}
                      ref={(el) =>
                        (labelRefs.current[key] = el)
                      }
                    >
                      <Typography
                        fontWeight={600}
                        textAlign="center"
                      >
                        {value.title}
                      </Typography>
                    </Box>
                  )
                )}
              </Box>

              {/* 🔹 Sentence */}
              <Box
                sx={{
                  backgroundColor: "#f4f4dc",
                  padding: 2,
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6">
                  {sentence.map((word, i) => (
                    <span
                      key={i}
                      ref={(el) =>
                        (wordRefs.current[i] = el)
                      }
                      style={{
                        backgroundColor: word.type ? mapping[word.type] ?.background : "transparent",
                        // padding: "4px 6px",
                        // marginRight: "4px",
                        borderRadius: "4px"
                      }}
                    >
                      {word.words}
                    </span>
                  ))}
                </Typography>
              </Box>

              {/* 🔹 SVG Overlay */}
              <svg
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: svgHeight,
                  pointerEvents: "none",
                  overflow: "visible"
                }}
              >
                {lines.map((line, i) => (
                  <line
                    key={i}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke={line.color}
                    strokeWidth={2}
                  />
                ))}
              </svg>
            </Box>
          </Grid>
        </Grid>

        {/* Launch Builder */}
        <Box
          mt={4}
          display="flex"
          justifyContent="flex-end"
        >
          <Button
            variant="contained"
            onClick={onLaunchBuilder}
          >
            Launch Builder
          </Button>
        </Box>

      </DialogContent>
    </Dialog>
  );
};

export default DetailView;
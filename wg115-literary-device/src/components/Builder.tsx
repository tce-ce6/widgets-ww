import React, { useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Dialog,
  DialogContent
} from "@mui/material";
import type { Root, Answer } from "./../../interface";

interface Props {
  device: Root;
  onHome: () => void;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

const Builder: React.FC<Props> = ({ device, onHome }) => {
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [invalidSelection, setInvalidSelection] = useState<{
    colIndex: number;
    itemId: number;
  } | null>(null);
  const [shuffledCombinations] = useState(() =>
    device.player.combinations.map((col) =>
      shuffleArray(col)
    )
  );

  const [resultOpen, setResultOpen] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState<Answer | null>(null);

  const combinations = device.player.combinations;
  const correctAnswers = device.player.correctAnswers;

  // 🔹 Handle Selection
  const handleSelect = (colIndex: number, itemId: number) => {
    // 🔹 Prevent selecting future column
    if (colIndex > selectedIndexes.length) return;

    let baseSelections: number[];

    // 🔹 If editing existing column, truncate right side first
    if (colIndex < selectedIndexes.length) {
      baseSelections = selectedIndexes.slice(0, colIndex);
    } else {
      baseSelections = [...selectedIndexes];
    }

    const updated = [...baseSelections];
    updated[colIndex] = itemId;

    const answerString = updated.join("");

    const isValidPrefix = correctAnswers.some((ans) =>
      ans.answer.startsWith(answerString)
    );

    if (!isValidPrefix) {
      // 🔥 Reset current column AND everything to right
      setSelectedIndexes(baseSelections);

      // Flash red briefly
      setInvalidSelection({ colIndex, itemId });

      setTimeout(() => {
        setInvalidSelection(null);
      }, 700);

      return;
    }

    setInvalidSelection(null);
    setSelectedIndexes(updated);
  };

  // 🔹 Construct Sentence
  const constructedSentence = selectedIndexes
    .map((sel, i) => combinations[i][sel]?.title)
    .join(" ");

  // 🔹 Submit Handler
  const handleSubmit = () => {
    const answerString = selectedIndexes.join("");

    const matchedAnswer = correctAnswers.find(
      (ans) => ans.answer === answerString
    );

    setFinalAnswer(matchedAnswer || null);
    setResultOpen(true);
  };

  // 🔹 Build answer string
  const answerString = selectedIndexes.join("");

  // 🔹 Check exact correctness
  const isExactCorrect = correctAnswers.some(
    (ans) => ans.answer === answerString
  );

  // 🔹 Final submit disable logic
  const isSubmitDisabled =
    selectedIndexes.length !== combinations.length ||
    !isExactCorrect;


  return (
    <>
      <Typography variant="h4" mb={4}>
        {device.title}
      </Typography>

      {/* Combination Grid */}
      <Grid container spacing={3}>
        {shuffledCombinations.map((column, colIndex) => {
          const isColumnDisabled = colIndex > selectedIndexes.length;

          return (
            <Grid key={colIndex} size={{ xs: 12 / combinations.length }}>
              {column.map((item) => {
                const isSelected =
                  selectedIndexes[colIndex] === item.id;

                const isInvalid =
                  invalidSelection?.colIndex === colIndex &&
                  invalidSelection?.itemId === item.id;

                return (
                  <Card
                    key={item.id}
                    sx={{
                      mb: 2,
                      cursor: isColumnDisabled ? "not-allowed" : "pointer",
                      backgroundColor: isColumnDisabled
                        ? "#eeeeee"         // 🔹 Disabled Grey
                        : isInvalid
                          ? "#ffcdd2"         // 🔹 Red
                          : isSelected
                            ? "#d0f0ff"         // 🔹 Blue
                            : "white",
                      opacity: isColumnDisabled ? 0.6 : 1,
                      pointerEvents: isColumnDisabled ? "none" : "auto",
                      transition: "all 0.2s ease"
                    }}
                    onClick={() =>
                      !isColumnDisabled &&
                      handleSelect(colIndex, item.id)
                    }
                  >
                    <CardContent>
                      <Typography>{item.title}</Typography>
                    </CardContent>
                  </Card>
                );
              })}
            </Grid>
          );
        })}
      </Grid>

      {/* Placeholder Sentence */}
      <Box mt={4}>
        <Typography variant="h6">
          {constructedSentence || "Select combinations above..."}
        </Typography>
      </Box>

      {/* Buttons */}
      <Box
        mt={4}
        display="flex"
        justifyContent="space-between"
      >
        <Button variant="outlined" onClick={onHome}>
          Home
        </Button>

        <Button
          variant="contained"
          disabled={isSubmitDisabled}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>

      {/* Result Dialog */}
      <Dialog
        open={resultOpen}
        onClose={() => setResultOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
          <Box mb={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {constructedSentence}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Card>
            <CardContent>
              <Typography>
                {finalAnswer?.explanation ||
                  finalAnswer?.title ||
                  "Incorrect combination."}
              </Typography>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Builder;
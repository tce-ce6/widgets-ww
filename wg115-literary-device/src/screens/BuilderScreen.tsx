import React, { useMemo, useState } from "react";
import type { Root } from "./../../interface";

interface Props {
  device: Root;
  onBack: () => void;
}

const BuilderScreen: React.FC<Props> = ({
  device,
  onBack
}) => {
  const { combinations, correctAnswers } =
    device.player;

  const [selected, setSelected] = useState<number[]>(
    []
  );
  const [invalidFlash, setInvalidFlash] = useState<{
    col: number;
    id: number;
  } | null>(null);
  const [showResult, setShowResult] =
    useState(false);

  // Shuffle once
  const shuffled = useMemo(() => {
    return combinations.map((col) => {
      const copy = [...col];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(
          Math.random() * (i + 1)
        );
        [copy[i], copy[j]] = [
          copy[j],
          copy[i]
        ];
      }
      return copy;
    });
  }, [device]);

  const columnX = [250, 550, 850];
  const cardWidth = 200;
  const cardHeight = 60;
  const startY = 200;
  const gapY = 100;

  const handleSelect = (
    colIndex: number,
    itemId: number
  ) => {
    if (colIndex > selected.length) return;

    let base =
      colIndex < selected.length
        ? selected.slice(0, colIndex)
        : [...selected];

    const updated = [...base];
    updated[colIndex] = itemId;

    const answerString = updated.join("");

    const isValidPrefix =
      correctAnswers.some((ans) =>
        ans.answer.startsWith(answerString)
      );

    if (!isValidPrefix) {
      setInvalidFlash({ col: colIndex, id: itemId });

      setTimeout(() => {
        setInvalidFlash(null);
      }, 600);

      setSelected(base); // reset current + right
      return;
    }

    setSelected(updated);
  };

  const answerString = selected.join("");

  const isExactCorrect =
    correctAnswers.some(
      (ans) => ans.answer === answerString
    );

  const constructedSentence = selected
    .map(
      (sel, i) =>
        shuffled[i].find((c) => c.id === sel)
          ?.title
    )
    .join(" ");

  const explanation =
    correctAnswers.find(
      (ans) => ans.answer === answerString
    )?.explanation ||
    correctAnswers.find(
      (ans) => ans.answer === answerString
    )?.title ||
    "";

  return (
    <>
      {/* Back Button */}
      <text
        x="100"
        y="80"
        fontSize="20"
        fill="blue"
        style={{ cursor: "pointer" }}
        onClick={onBack}
      >
        ← Home
      </text>

      {/* Title */}
      <text
        x="600"
        y="80"
        textAnchor="middle"
        fontSize="36"
        fontWeight="bold"
      >
        {device.title} Builder
      </text>

      {/* Columns */}
      {shuffled.map((column, colIndex) => {
        const isColumnDisabled =
          colIndex > selected.length;

        return column.map((item, rowIndex) => {
          const x = columnX[colIndex];
          const y =
            startY + rowIndex * gapY;

          const isSelected =
            selected[colIndex] === item.id;

          const isInvalid =
            invalidFlash?.col === colIndex &&
            invalidFlash?.id === item.id;

          let fill = "#ffffff";

          if (isColumnDisabled)
            fill = "#dddddd";
          else if (isInvalid)
            fill = "#ffb3b3";
          else if (isSelected)
            fill = "#b3e0ff";

          return (
            <g
              key={`${colIndex}-${item.id}`}
              onClick={() =>
                !isColumnDisabled &&
                handleSelect(
                  colIndex,
                  item.id
                )
              }
              style={{
                cursor: isColumnDisabled
                  ? "not-allowed"
                  : "pointer"
              }}
            >
              <rect
                x={x}
                y={y}
                width={cardWidth}
                height={cardHeight}
                rx={10}
                fill={fill}
                stroke="#333"
              />
              <text
                x={x + cardWidth / 2}
                y={y + cardHeight / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="16"
              >
                {item.title}
              </text>
            </g>
          );
        });
      })}

      {/* Constructed Sentence */}
      <text
        x="600"
        y="650"
        textAnchor="middle"
        fontSize="22"
      >
        {constructedSentence ||
          "Select combinations in sequence..."}
      </text>

      {/* Submit Button */}
      <g
        onClick={() =>
          isExactCorrect &&
          setShowResult(true)
        }
        style={{
          cursor: isExactCorrect
            ? "pointer"
            : "not-allowed"
        }}
      >
        <rect
          x="500"
          y="700"
          width="200"
          height="60"
          rx="10"
          fill={
            isExactCorrect
              ? "#4CAF50"
              : "#999999"
          }
        />
        <text
          x="600"
          y="730"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="20"
          fill="white"
        >
          Submit
        </text>
      </g>

      {/* Result Dialog */}
      {showResult && (
        <g>
          <rect
            x="200"
            y="150"
            width="800"
            height="500"
            fill="white"
            stroke="#333"
            rx="20"
          />

          {/* Sentence */}
          <text
            x="600"
            y="250"
            textAnchor="middle"
            fontSize="24"
            fontWeight="bold"
          >
            {constructedSentence}
          </text>

          {/* Explanation */}
          <text
            x="600"
            y="350"
            textAnchor="middle"
            fontSize="20"
          >
            {explanation}
          </text>

          {/* Close */}
          <text
            x="600"
            y="550"
            textAnchor="middle"
            fontSize="22"
            fill="blue"
            style={{ cursor: "pointer" }}
            onClick={() =>
              setShowResult(false)
            }
          >
            Close
          </text>
        </g>
      )}
    </>
  );
};

export default BuilderScreen;
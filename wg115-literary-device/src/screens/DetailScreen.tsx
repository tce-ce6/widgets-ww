import React, { useEffect, useRef, useState } from "react";
import type { Root } from "./../../interface";

interface Props {
  device: Root;
  onBack: () => void;
  onLaunch: () => void;
}

interface LayoutWord {
  x: number;
  y: number;
  width: number;
  word: {
    words: string;
    type?: string | null;
  };
}

const DetailScreen: React.FC<Props> = ({
  device,
  onBack,
  onLaunch
}) => {
  const { sentence, mapping } = device.example;

  /* ---------------- DIALOG DIMENSIONS ---------------- */
  const dialogX = 150;
  const dialogY = 80;
  const dialogWidth = 900;
  const dialogHeight = 640;

  /* ---------------- LABEL POSITIONS ---------------- */
  const labelY = dialogY + 130;

  const labelPositions: Record<string, number> = {};
  Object.keys(mapping).forEach((key, i) => {
    labelPositions[key] = dialogX + 520 + i * 170;
  });

  /* ---------------- SENTENCE LAYOUT ---------------- */

  const contentLeft = dialogX + 480;
  const contentRight = dialogX + dialogWidth - 50;

  const startY = dialogY + 300;
  const lineHeight = 50;

  const textRefs = useRef<(SVGTextElement | null)[]>([]);
  const [layouts, setLayouts] = useState<LayoutWord[]>([]);

  useEffect(() => {
    const computedLayouts: LayoutWord[] = [];

    let xCursor = contentLeft;
    let yCursor = startY;

    sentence.forEach((word, index) => {
      const textEl = textRefs.current[index];
      if (!textEl) return;

      const bbox = textEl.getBBox();

      const horizontalPadding = 0;
      const wordSpacing = 0;

      const wordWidth = bbox.width + horizontalPadding;

      if (xCursor + wordWidth > contentRight) {
        xCursor = contentLeft;
        yCursor += lineHeight;
      }

      computedLayouts.push({
        x: xCursor,
        y: yCursor,
        width: wordWidth,
        word
      });

      xCursor += wordWidth + wordSpacing;
    });

    setLayouts(computedLayouts);
  }, [device]);

  /* -------------------------------------------------- */

  return (
    <>
      {/* Overlay */}
      <rect
        x="0"
        y="0"
        width="1200"
        height="800"
        fill="rgba(0,0,0,0.4)"
      />

      {/* Dialog */}
      <rect
        x={dialogX}
        y={dialogY}
        width={dialogWidth}
        height={dialogHeight}
        rx="20"
        fill="#ffffff"
        stroke="#333"
      />

      {/* Title */}
      <text
        x="600"
        y={dialogY + 60}
        textAnchor="middle"
        fontSize="32"
        fontWeight="bold"
      >
        {device.title}
      </text>

      {/* Close Button */}
      <text
        x={dialogX + dialogWidth - 35}
        y={dialogY + 40}
        fontSize="22"
        fill="red"
        style={{ cursor: "pointer" }}
        onClick={onBack}
      >
        ✕
      </text>

      {/* Description */}
      <foreignObject
        x={dialogX + 40}
        y={dialogY + 120}
        width="380"
        height="380"
      >
        <div
          style={{
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#333"
          }}
        >
          {device.description}
        </div>
      </foreignObject>

      {/* Labels */}
      {Object.entries(mapping).map(([key, value]) => (
        <text
          key={key}
          x={labelPositions[key]}
          y={labelY}
          textAnchor="middle"
          fontSize="18"
          fontWeight="600"
        >
          {value.title}
        </text>
      ))}

      {/* Invisible text for measurement */}
      {sentence.map((word, i) => (
        <text
          key={`measure-${i}`}
          ref={(el) => (textRefs.current[i] = el)}
          x="-1000"
          y="-1000"
          fontSize="18"
        >
          {word.words}
        </text>
      ))}

      {/* Render Sentence + Lines */}
      {layouts.map((layout, i) => (
        <g key={i}>
          {/* Background */}
          <rect
            x={layout.x}
            y={layout.y - 24}
            width={layout.width}
            height="34"
            fill={
              layout.word.type
                ? mapping[layout.word.type]?.background
                : "transparent"
            }
            rx="6"
          />

          {/* Word */}
          <text
            x={(layout.x + layout.width / 2) - (layout.word.type ? 0 : 2)}
            y={layout.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="18"
          >
            {layout.word.words}
          </text>

          {/* Connector Line */}
          {layout.word.type && (
            <line
              x1={labelPositions[layout.word.type]}
              y1={labelY + 10}
              x2={layout.x + layout.width / 2}
              y2={layout.y - 24}
              stroke={
                mapping[layout.word.type].background
              }
              strokeWidth="2"
            />
          )}
        </g>
      ))}

      {/* Launch Builder Button */}
      <g
        onClick={onLaunch}
        style={{ cursor: "pointer" }}
      >
        <rect
          x={dialogX + dialogWidth - 230}
          y={dialogY + dialogHeight - 80}
          width="190"
          height="50"
          rx="10"
          fill="#4CAF50"
        />
        <text
          x={dialogX + dialogWidth - 135}
          y={dialogY + dialogHeight - 50}
          textAnchor="middle"
          fontSize="18"
          fill="white"
        >
          Launch Builder
        </text>
      </g>
    </>
  );
};

export default DetailScreen;
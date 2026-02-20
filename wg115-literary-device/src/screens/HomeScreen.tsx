import React from "react";
import type { Root } from "./../../interface";

interface Props {
  devices: Root[];
  onSelect: (d: Root) => void;
}

const HomeScreen: React.FC<Props> = ({ devices, onSelect }) => {
  const cardWidth = 250;
  const cardHeight = 120;
  const startX = 150;
  const startY = 150;
  const gapX = 300;
  const gapY = 200;

  return (
    <>
      <text
        x="600"
        y="80"
        textAnchor="middle"
        fontSize="40"
        fontWeight="bold"
      >
        Literary Devices
      </text>

      {devices.map((d, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);

        const x = startX + col * gapX;
        const y = startY + row * gapY;

        return (
          <g
            key={d.id}
            onClick={() => onSelect(d)}
            style={{ cursor: "pointer" }}
          >
            <rect
              x={x}
              y={y}
              width={cardWidth}
              height={cardHeight}
              rx={15}
              fill="#ffffff"
              stroke="#333"
            />
            <text
              x={x + cardWidth / 2}
              y={y + cardHeight / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="22"
            >
              {d.title}
            </text>
          </g>
        );
      })}
    </>
  );
};

export default HomeScreen;
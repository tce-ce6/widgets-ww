import React, { useState } from "react";
import { data } from "./data/literaryDevices";
import type { Root } from "./../interface";
import HomeScreen from "./screens/HomeScreen";
import DetailScreen from "./screens/DetailScreen";
import BuilderScreen from "./screens/BuilderScreen";

type ViewMode = "home" | "detail" | "builder";

const SvgApp: React.FC = () => {
  const [view, setView] = useState<ViewMode>("home");
  const [selected, setSelected] = useState<Root | null>(null);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <svg
        viewBox="0 0 1200 800"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ background: "#f9f6ef" }}
      >
        {view === "home" && (
          <HomeScreen
            devices={data}
            onSelect={(d) => {
              setSelected(d);
              setView("detail");
            }}
          />
        )}

        {view === "detail" && selected && (
          <DetailScreen
            device={selected}
            onBack={() => setView("home")}
            onLaunch={() => setView("builder")}
          />
        )}

        {view === "builder" && selected && (
          <BuilderScreen
            device={selected}
            onBack={() => setView("home")}
          />
        )}
      </svg>
    </div>
  );
};

export default SvgApp;
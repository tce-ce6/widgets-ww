import React, { useState } from "react";
import { Container, Typography, Grid } from "@mui/material";
import type { Root } from "./../interface";
import { data } from "./data/literaryDevices";
import LiteraryCard from "./components/LiteraryCard";
import DetailView from "./components/DetailView";
import Builder from "./components/Builder";

type ViewMode = "home" | "builder";

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>("home");
  const [selectedDevice, setSelectedDevice] = useState<Root | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const sortedDevices = [...data].sort(
    (a, b) => a.order - b.order
  );

  const openDetail = (device: Root) => {
    setSelectedDevice(device);
    setDetailOpen(true);
  };

  const launchBuilder = () => {
    setDetailOpen(false);
    setView("builder");
  };

  const goHome = () => {
    setView("home");
    setSelectedDevice(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      {view === "home" && (
        <>
          <Typography variant="h4" mb={4}>
            Literary Devices
          </Typography>

          <Grid container spacing={3}>
            {sortedDevices.map((device) => (
              <Grid
                key={device.id}
                size={{ xs: 12, sm: 6, md: 4 }}
              >
                <LiteraryCard
                  device={device}
                  onClick={() => openDetail(device)}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {selectedDevice && (
        <DetailView
          open={detailOpen}
          device={selectedDevice}
          onClose={() => setDetailOpen(false)}
          onLaunchBuilder={launchBuilder}
        />
      )}

      {view === "builder" && selectedDevice && (
        <Builder device={selectedDevice} onHome={goHome} />
      )}
    </Container>
  );
};

export default App;
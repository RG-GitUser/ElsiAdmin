import React, { useEffect } from "react";
import { getAnalytics, logEvent } from "firebase/analytics";
import { Box, Typography } from "@mui/material";

const Analytics = () => {
  useEffect(() => {
    const analytics = getAnalytics();
    logEvent(analytics, "page_view", {
      page_title: "Analytics",
      page_path: "/analytics",
    });
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics
      </Typography>
      <Typography>This is the analytics page. More to come!</Typography>
    </Box>
  );
};

export default Analytics;

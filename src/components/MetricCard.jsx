
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

function MetricCard({ title, value }) {
  return (
    <Card sx={{ minWidth: 275, textAlign: "center" }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5" component="div">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default MetricCard;

import React, { useState } from "react";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField, Button, Box } from "@mui/material";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [pageUrl, setPageUrl] = useState("");

  const fetchData = async () => {
    if (!startDate || !endDate || !pageUrl) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/stats", {
        params: {
          siteId: "ecstech.com",
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
          pageUrl: pageUrl,
        },
      });
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="App">
      <h1>Plausible Stats</h1>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
        }}
      >
        <TextField
          label="Page URL"
          variant="outlined"
          value={pageUrl}
          onChange={(e) => setPageUrl(e.target.value)}
          placeholder="/ecs-insight/article/what-should-your-ai-factory-look-like/"
          sx={{ width: 300 }}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <Button
          variant="contained"
          color="primary"
          onClick={fetchData}
          disabled={loading}
        >
          {loading ? "Loading..." : "Fetch Stats"}
        </Button>
      </Box>
      {data && (
        <div>
          <h1>2 Week Health Check</h1>
          <h2>Total Views: {data.page_specific.results.pageviews.value}</h2>
          <h2>
            Avg Time on Page:{" "}
            {formatTime(data.page_specific.results.time_on_page.value)}
          </h2>
          <h3>Top Traffic Sources:</h3>
          <ul>
            {data.sources.map((source, index) => (
              <li key={index}>
                {source.source}: {source.visitors} visitors,{" "}
                {formatTime(source.time_on_page)} average time on page
              </li>
            ))}
          </ul>
          <h3>Entry Pages:</h3>
          <ul>
            {data.entry_pages.map((entry, index) => (
              <li key={index}>
                {entry.entry_page}: {entry.visitors} unique entrances
              </li>
            ))}
          </ul>
          <h3>Exit Pages:</h3>
          <ul>
            {data.exit_pages.map((exit, index) => (
              <li key={index}>
                {exit.exit_page}: {exit.visitors} unique exits
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;

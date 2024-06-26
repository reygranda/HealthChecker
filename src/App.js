import React, { useState } from "react";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  Paper,
  Container,
  Link,
} from "@mui/material";
import Logo from "./ECS-site-stats.png";
import "./customScrollbar.css"; // Import the custom scrollbar styles

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
      <Container maxWidth="md">
        <Grid container spacing={2} sx={{ marginTop: 4 }}>
          <Grid item xs={12} sx={{ paddingBottom: 2 }}>
            <Box sx={{ textAlign: "center" }}>
              <img src={Logo} alt="logo" width={400} />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ padding: 2, boxShadow: "none" }}>
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
                  fullWidth
                  sx={{
                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#acacac",
                    },
                  }}
                />
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            sx={{
                              "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "#acacac",
                                },
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            sx={{
                              "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "#acacac",
                                },
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#ef2d3d",
                    marginTop: 2,
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#c52830",
                    },
                  }}
                  onClick={fetchData}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Explore"}
                </Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper
              className="custom-scrollbar"
              sx={{
                padding: 2,
                backgroundColor: "#eeeeee",
                border: "1px solid #acacac",
                borderRadius: "15px",
                color: "black",
                minHeight: "200px",
                maxHeight: "350px",
                overflowY: "auto",
                fontSize: "0.875rem",
              }}
            >
              {data ? (
                <>
                  <Typography variant="h5" component="h2">
                    2 Week Health Check
                  </Typography>
                  <Typography variant="body1">
                    Total Views: {data.page_specific.results.pageviews.value}
                  </Typography>
                  <Typography variant="body1">
                    Avg Time on Page:{" "}
                    {formatTime(data.page_specific.results.time_on_page.value)}
                  </Typography>
                  <Typography variant="body2">Top Traffic Sources:</Typography>
                  <ul>
                    {data.sources.map((source, index) => (
                      <li key={index}>
                        {source.source}: {source.visitors} visitors,{" "}
                        {formatTime(source.time_on_page)} average time on page
                      </li>
                    ))}
                  </ul>
                  <Typography variant="body2">Entry Pages:</Typography>
                  <ul>
                    {data.entry_pages.map((entry, index) => (
                      <li key={index}>
                        {entry.entry_page}: {entry.visitors} unique entrances
                      </li>
                    ))}
                  </ul>
                  <Typography variant="body2">Exit Pages:</Typography>
                  <ul>
                    {data.exit_pages.map((exit, index) => (
                      <li key={index}>
                        {exit.exit_page}: {exit.visitors} unique exits
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Typography variant="body1">
                  Please fill in the form and fetch stats.
                </Typography>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ textAlign: "center", marginTop: 2 }}>
              <Link
                href="https://ecstech.com/"
                color="error"
                sx={{ mx: 1, fontWeight: "bold" }}
              >
                ecstech.com
              </Link>
              <Link
                href="https://plausible.io/"
                color="error"
                sx={{ mx: 1, fontWeight: "bold" }}
              >
                plausible.io
              </Link>
              <Link
                href="https://crazyegg.com/"
                color="error"
                sx={{ mx: 1, fontWeight: "bold" }}
              >
                crazyegg.com
              </Link>
              <Typography variant="body2" sx={{ color: "#555555", mt: 1 }}>
                Developed by Dev Team
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default App;

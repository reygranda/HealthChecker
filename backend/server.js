const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const API_KEY = "YOUR_PLAUSIBLE_API_KEY";
const BASE_URL = "https://plausible.io/api/v1/stats";

app.get("/api/stats", async (req, res) => {
  const { siteId, startDate, endDate, pageUrl } = req.query;

  try {
    // Fetch aggregate data
    const aggregateParams = {
      site_id: siteId,
      period: "custom",
      date: `${startDate},${endDate}`,
      metrics: "pageviews,time_on_page",
      filters: `event:page==${pageUrl}`,
    };
    const aggregateResponse = await axios.get(`${BASE_URL}/aggregate`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      params: aggregateParams,
    });
    const aggregateData = aggregateResponse.data;

    // Fetch breakdown data for sources
    const breakdownParams = {
      site_id: siteId,
      period: "custom",
      date: `${startDate},${endDate}`,
      property: "visit:source",
      filters: `event:page==${pageUrl}`,
      metrics: "pageviews,visitors",
      limit: 5,
    };
    const breakdownResponse = await axios.get(`${BASE_URL}/breakdown`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      params: breakdownParams,
    });
    const breakdownData = breakdownResponse.data.results;

    // Fetch time_on_page for each source
    for (const source of breakdownData) {
      const sourceFilter = source.source;
      const sourceParams = {
        site_id: siteId,
        period: "custom",
        date: `${startDate},${endDate}`,
        metrics: "time_on_page",
        filters: `event:page==${pageUrl};visit:source==${sourceFilter}`,
      };
      const sourceResponse = await axios.get(`${BASE_URL}/aggregate`, {
        headers: { Authorization: `Bearer ${API_KEY}` },
        params: sourceParams,
      });
      const sourceTimeData = sourceResponse.data.results.time_on_page || {};
      source.time_on_page = sourceTimeData.value || 0;
    }

    res.json({ page_specific: aggregateData, sources: breakdownData });
  } catch (error) {
    console.error(
      "Error fetching data:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

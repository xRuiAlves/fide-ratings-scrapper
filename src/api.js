require("dotenv-flow").config();
const { buildErrorResponse } = require("./utils");
const express = require("express");
const timeout = require("express-timeout-handler");
const app = express();
const {
    getPlayerElo, getPlayerFullInfo, getPlayerHistory, getPlayerPersonalData, getPlayerRank,
    getPlayerGamesByMonth,
} = require("./main");

/**
 * Server configurations
 */
const DEFAULT_PORT = 3000;
const DEFAULT_REQUEST_TIMEOUT = 10000;
const API_INFO_URL = "https://github.com/xRuiAlves/fide-ratings-scraper/blob/master/README.md#api";
const port = process.env.PORT || DEFAULT_PORT;
const request_timeout = parseInt(process.env.RESPONSE_TIMEOUT_MS, 10) || DEFAULT_REQUEST_TIMEOUT;

/**
 * Request timeout setup
 */
app.use(timeout.handler({
    timeout: request_timeout,
    onTimeout: (_req, res) => res.status(408).send(),
}));

/**
 * Server response headers middleware
 */
app.use((_req, res, next) => {
    res.set("Content-Type", "application/json");
    res.set("Access-Control-Allow-Origin", "*");

    next();
});

/**
 * Root endpoint
 */
app.get("/", (_req, res) => {
    res.json(`Greetings! Please refer to  ${API_INFO_URL}  for info about the available endpoints.`);
});

/**
 * Player fide number parameter validator middleware
 */
app.get("/player/:fide_num/*", (req, res, next) => {
    const { fide_num } = req.params;

    if (isNaN(fide_num)) {
        return res.status(400).json(
            buildErrorResponse("The player's fide number must be a positive integer number",
            ));
    } else {
        next();
    }
});

/**
 * GET player information endpoint
 */
app.get("/player/:fide_num/info", (req, res) => {
    const { fide_num } = req.params;
    const { include_history } = req.query;

    getPlayerFullInfo(fide_num, include_history)
        .then((data) => res.json(data))
        .catch((err) => playerEndpointsErrorHandler(err, res));
});

/**
 * GET player personal data endpoint
 */
app.get("/player/:fide_num/personal-data", (req, res) => {
    const { fide_num } = req.params;

    getPlayerPersonalData(fide_num)
        .then((data) => res.json(data))
        .catch((err) => playerEndpointsErrorHandler(err, res));
});

/**
 * GET player ranking endpoint
 */
app.get("/player/:fide_num/rank", (req, res) => {
    const { fide_num } = req.params;

    getPlayerRank(fide_num)
        .then((data) => res.json(data))
        .catch((err) => playerEndpointsErrorHandler(err, res));
});

/**
 * GET player elo rating endpoint
 */
app.get("/player/:fide_num/elo", (req, res) => {
    const { fide_num } = req.params;

    getPlayerElo(fide_num)
        .then((data) => res.json(data))
        .catch((err) => playerEndpointsErrorHandler(err, res));
});

/**
 * GET player history endpoint
 */
app.get("/player/:fide_num/history/", (req, res) => {
    const { fide_num } = req.params;

    getPlayerHistory(fide_num)
        .then((data) => res.json(data))
        .catch((err) => playerEndpointsErrorHandler(err, res));
});

/**
 * GET player games by month endpoint
 */
app.get("/player/:fide_num/games/:date", (req, res) => {
    const  date  = req.params.date;
    const  fide_num  = req.params.fide_num;

    getPlayerGamesByMonth(fide_num, date)
        .then((data) => res.json(data))
        .catch((err) => playerEndpointsErrorHandler(err, res));
});

/**
 * Page not found fallback
 */
app.get("*", (_req, res) => res.status(404).send(""));

/**
 * Server
 */
app.listen(port, () =>
    console.info(`Started listening on ${port} . . .`),
);

/**
 * Handles requests error responses
 * @param {String} err
 * @param {Object} res
 */
const playerEndpointsErrorHandler = (err, res) => {
    if (err === "Not found") {
        return res.status(404).json(buildErrorResponse(
            "Requested information does not exist",
        ));
    }
    return res.status(500).json(buildErrorResponse(
        "Failed to fetch player information",
    ));
};

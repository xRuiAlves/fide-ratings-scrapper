/* eslint-disable array-callback-return */
const { fetchProfilePage, fetchHistoryPage, fetchGamesPage } = require("./fideAPI");
const {
    parseRankFromProfilePage, parsePersonalDataFromProfilePage, parseEloFromProfilePage, parseHistoryFromHistoryPage, parseGamesFromGamesPage
} = require("./parser");

/**
 * Get player ranking
 * @param {Integer} fide_num
 * @returns {JSON} Player ranking
 */
const getPlayerRank = async (fide_num) => {
    const data = await fetchProfilePage(fide_num);
    return parseRankFromProfilePage(data);
};

/**
 * Get player personal data
 * @param {Integer} fide_num
 * @returns {JSON} Player personal data
 */
const getPlayerPersonalData = async (fide_num) => {
    const data = await fetchProfilePage(fide_num);
    return parsePersonalDataFromProfilePage(data);
};

/**
 * Get player ELO
 * @param {Integer} fide_num
 * @returns {JSON} Player ELO
 */
const getPlayerElo = async (fide_num) => {
    const data = await fetchProfilePage(fide_num);
    return parseEloFromProfilePage(data);
};

/**
 * Get player full information
 * @param {Integer} fide_num
 * @returns {JSON} Player full information
 */
const getPlayerFullInfo = async (fide_num, include_history = false) => {
    const data = await fetchProfilePage(fide_num);
    const history = await (include_history ? getPlayerHistory(fide_num) : Promise.resolve(undefined));

    return {
        ...parsePersonalDataFromProfilePage(data),
        ...parseEloFromProfilePage(data),
        ...parseRankFromProfilePage(data),
        history,
    };
};

/**
 * Get player history
 * @param {Integer} fide_num
 * @returns {JSON} Player history
 */
const getPlayerHistory = async (fide_num) => {
    const data = await fetchHistoryPage(fide_num);
    return parseHistoryFromHistoryPage(data);
};

/**
 * Get player history
 * @param {Integer} fide_num
 * @returns {JSON} Player history
 */
const getPlayerGamesByMonth = async (fide_num, date) => {
    const data = await fetchGamesPage(fide_num, date);
    return parseGamesFromGamesPage(data);
    console.log(data);
    console.log();
};


module.exports = {
    getPlayerFullInfo,
    getPlayerElo,
    getPlayerHistory,
    getPlayerRank,
    getPlayerPersonalData,
    getPlayerGamesByMonth
};

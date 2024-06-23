const fetch = require("node-fetch");
const puppeteer = require('puppeteer');

const FIDE_RATINGS_URL = "https://ratings.fide.com/profile";
const FIDE_BASE_URL = "https://ratings.fide.com/";
/**
 * Fetch player profile page
 * @param {Integer} fide_num
 * @throws {String}
 * @returns {Object} Cheerio query object
 */
const fetchProfilePage = (fide_num) => fetch(`${FIDE_RATINGS_URL}/${fide_num}`).then((res) => res.text());

/**
 * Fetch player history page
 * @param {Integer} fide_num
 * @throws {String}
 * @returns {Object} Cheerio query object
 */
const fetchHistoryPage = (fide_num) => fetch(`${FIDE_RATINGS_URL}/${fide_num}/chart`).then((res) => res.text());

/**
 * Fetch player games page by month
 * @param {Integer} fide_num
 * @param {String} date
 * @throws {String}
 * @returns {Object} Cheerio query object
 */
const fetchGamesPage = async (fide_num, date) => {

        const url = `${FIDE_BASE_URL}/calculations.phtml?id_number=${fide_num}&period=${date}&rating=0`;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        await page.waitForSelector('.calc_output');
        const content = await page.content();
        await browser.close();

        return content;
}

module.exports = {
    fetchProfilePage,
    fetchHistoryPage,
    fetchGamesPage,
};

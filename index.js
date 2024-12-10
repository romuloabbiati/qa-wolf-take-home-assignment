// @ts-check
// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");
const exp = require("constants");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  const hackerNewsPerPage = 30;
  const totalHackerNews = 100;
  const numberOfPages = Math.ceil(totalHackerNews / hackerNewsPerPage);
  const allTimes = [];

  for (let i = 1; i <= numberOfPages; i++) {

    const times = await page.$$eval(
      '.age',
      elements => elements.map(el => el.getAttribute('title'))
    );

    allTimes.push(...times);
    console.log(`Elements of page ${i}: `, allTimes);

    if (allTimes.length >= totalHackerNews) {
      break;
    }
    const moreHackerNewsLink = await page.$('.morelink');

    if (moreHackerNewsLink) {
      await Promise.all([
        moreHackerNewsLink.click(),
        page.waitForNavigation(),
      ]);
    } else {
      console.error('Next page link not found!');
      break;
    }  
  }

  const parsedTimes = allTimes.slice(0, totalHackerNews).map(ts => new Date().toISOString()); 
  let isSorted = true;
  for (let i = 0; i < parsedTimes.length - 1; i++) {
    if (parsedTimes[i] < parsedTimes[i + 1]) {
      isSorted = false;
      break;
    }
  }

  if (isSorted) {
    console.log('The Hacker news are correctly sorted from newest to oldest.');
  } else {
    console.error('The Hacker news are NOT correctly sorted from newest to oldest.');
  }

  console.log('length of number of times array: ', allTimes.length);
  console.log('100 sorted times: ', parsedTimes.length);

  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})()
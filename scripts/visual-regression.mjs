import { chromium } from '/Users/joaoyukiotakaki/node_modules/playwright/index.mjs';

const browser = await chromium.launch({
  headless: true,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});
const page = await browser.newPage({ viewport: { width: 1888, height: 1336 } });
await page.goto('file:///Users/joaoyukiotakaki/Documents/ChatGPT/running/lessons/0001-primeiros-cinco-semanas-de-corrida.html');
await page.waitForTimeout(1200);

const boxes = await page.locator('.intro > div').evaluateAll((elements) => elements.map((element) => {
  const rect = element.getBoundingClientRect();
  return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
}));

if (boxes.length !== 2) throw new Error(`expected two intro columns, found ${boxes.length}`);
const [left, right] = boxes;
const overlap = Math.max(0, Math.min(left.x + left.width, right.x + right.width) - Math.max(left.x, right.x))
  * Math.max(0, Math.min(left.y + left.height, right.y + right.height) - Math.max(left.y, right.y));

console.log(JSON.stringify({ boxes, overlap }));
if (overlap > 0) throw new Error(`intro columns overlap by ${overlap}px²`);
await browser.close();

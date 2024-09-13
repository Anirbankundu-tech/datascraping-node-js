import puppeteer from 'puppeteer';

/* (async () => {
    try {
    const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  await page.goto('https://www.google.com');
  await page.screenshot({path:'google.png'});
  // other actions...
  await browser.close();

    }
  catch(err)
  {
    console.log(err);
  }
})(); */

async function run() {
    const browser=await puppeteer.launch({headless:false});
    const page=await browser.newPage();
    await page.goto("https://www.geeksforgeeks.org/");
    const title=await page.title();
    console.log(title);
    const heading=await page.$eval('p',(Element)=>Element.textContent);
    console.log(heading);
    await browser.close();
    
}
run();
const { Builder, Browser, By } = require("selenium-webdriver");
const fs = require("fs");
let path = require("path");

// 当前页数
let currentPage = 1;
//最大页码
let maxPage = 4;
//存放数据
let result = [];

(async function start() {
  let driver = await new Builder().forBrowser(Browser.CHROME).build();
  await driver.get("https://www.hengdulaw.com/Category14");

  getData(driver);
})();
async function getData(driver) {
  console.log(
    `------当前正在获取第${currentPage}页的数据,共${maxPage}页数据-----`
  );
  await driver.sleep(3000);

  //使用driver.findElement()找到所有条目项
  let items = await driver.findElements(By.css(".he_hdteamuul .he_hdteamli"));

  //迭代数组，获取我们所需要的数据
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let pic = await item
      .findElement(By.css(".he_hdteambx .he_hdteaim .he_img2"))
      .getAttribute("src");
    let name = await item
      .findElement(By.css(".he_hdteambx .he_hdteapi h4"))
      .getText();
    let job = await item
      .findElement(By.css(".he_hdteambx .he_hdteapi p"))
      .getText();

    result.push({
      pic,
      name,
      job,
    });
  }
  // 爬取到了一页数据
  console.log(result, result.length);

  currentPage++;
  if (currentPage <= maxPage) {
    await driver.get(`https://www.hengdulaw.com/Category14_${currentPage}`);
    // 递归获取数据
    getData(driver);
  } else {
    fs.writeFileSync(
      path.join(__dirname, "lvshi.json"),
      JSON.stringify(result)
    );
  }
}

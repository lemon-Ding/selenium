# [selenium.github.io](https://github.com/lemon-Ding/selenium.github.io#seleniumgithubio)

## 1. 准备

电脑已经装好Node，在爬取目标网站之前，建议浏览该网站的robots.txt（一个网站的"管家",规定哪些搜索引擎可以访问我们的网站而哪些搜索引擎不能爬取我们网站的信息等等，是网站管理者指定的"君子协议"），来确保自己爬取的数据在对方允许范围之内，本文档仅供参考学习娱乐。

## 2. 根据平台下载需要的webdriver（可省略：需要selenium-webdriver版本: "^4.14.0"）

selenium-webdriver支持（Chrome，Internet Explorer，Edge，Firefox，Opera，Safari）浏览器，其他浏览器自行搜索教程，使用谷歌浏览器下载webdriver：

在浏览器的地址栏，输入chrome://version/，回车后即可查看到对应版本

116版本以下下载：[chromedriver(.exe)](http://chromedriver.storage.googleapis.com/index.html)

116版本下载：https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/116.0.5845.96/win64/chromedriver-win64.zip

117/118/119版本:https://googlechromelabs.github.io/chrome-for-testing/

打开链接下载：

下载后放入项目根目录

## 3. 项目中安装selenium-webdriver包

selenium：使用代码启动浏览器，让真正的浏览器去打开网页，然后去网页中获取想要的信息

```
npm init -y
npm install selenium-webdriver
```

## 4 获取需要的数据

1. 使用driver打开恒都团队页面

2. 使用driver.findElement()找到所有条目项，根据需求分析页面元素，获取其文本内容即可:

3. 自动翻页

   >    			1. 定义初始页码,最大页码和存放数据的数组
   >    			2. 开始获取数据时打印当前正在获取的页码数
   >    			3. 获取完一页数据后，当前页码自增，然后判断是否小于等于最大页码
   >    			4. 小于等于最大页码，查找下一页按钮并调用点击api，进行自动翻页，递归调用获取数据的函数
   >    			5. 大于最大页码就把存放数据的数组转成字符串写入到文件中

```
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
```

const axios = require("axios");
const fs = require("fs");
const pathToReport = require("../constants").PATH_TO_REPORT;
const pathToReportsDir = require("../constants").PATH_TO_REPORTS_DIR;

const routes = [
  {
    method: "POST",
    path: "/make-report",
    handler: async (request, h) => {
      const countTopWords = async url => {
        let res = await axios.get(url);
        let data = res.data;
        let dataBody = data.slice(
          data.indexOf("<body"),
          data.indexOf("</body")
        );
        const wordArr = dataBody.toLowerCase().match(/[А-Яа-я]+/g);

        let wordMap = {};
        wordArr.forEach(word => {
          if (word.length > 4) {
            if (wordMap[word]) wordMap[word]++;
            else wordMap[word] = 1;
          }
        });

        let topWords = [];
        for (let word in wordMap) {
          let qnty = wordMap[word];
          if (topWords[qnty]) topWords[qnty][1].push(word);
          else topWords[qnty] = [qnty, [word]];
        }

        topWords.sort((a, b) => b[0] - a[0]).splice(3);

        let stats = topWords
          .map(elem => `${elem[0]} - ${elem[1].join(", ")}`)
          .join(" | ");
        return `Статистика повторяемости слов на ${url}:  ${stats}\n\n`;
      };
      // // check existing data folder
      try {
        fs.readdirSync(pathToReportsDir);
      } catch (err) {
        fs.mkdirSync(pathToReportsDir);
      }
      // // remove prev report
      fs.stat(pathToReport, (err, stat) => {
        if (err) return console.error(err);
        fs.unlink(pathToReport, err => {
          if (err) return console.error(err);
          console.log("prev word stat report version deleted successfully");
        });
      });
      // // prepare data
      let urls = Object.values(request.payload);
      const wordStat = [];
      for (let i in urls) {
        wordStat.push(await countTopWords(urls[i]));
      }
      console.log("обработано - ", wordStat.length);

      // export to pdf format
      let createPdf = require("../utils/createPdf");
      createPdf(wordStat);

      // return file existing
      let stat = fs.statSync(pathToReport);
      if (stat.size >= 0) return true;
      else return false;
    }
  },
  {
    method: "GET",
    path: "/show-report",
    handler: (request, h) => {
      let fs = require("fs");
      let pdf = fs.readFileSync(pathToReport);
      const response = h.response(pdf);
      return response;
    }
  }
];
module.exports = routes;
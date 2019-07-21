const axios = require('axios')
const fs = require('fs')
const pathToReport = require('../constants').PATH_TO_REPORT

const routes = [
  {
    method: 'POST',
    path:'/make-report',
    handler: async (request, h) => {
      // curl -X POST localhost:3000/make-report -d "url0=https://tass.ru/v-strane&url1=https://www.kommersant.ru/rubric/47"
      const countTopWords = async (url) => {
        let res = await axios.get(url);
        let data = res.data;
        let dataBody = data.slice(data.indexOf('<body'), data.indexOf('</body'))
        console.log('html body lenght', dataBody.length)
        // console.log(data.indexOf('<body'), data.indexOf('</body'))
        // console.log(data.length, dataBody.length);
        
        const wordArr = dataBody.toLowerCase().match(/[А-Яа-я]+/g);
        const lengthFilter = wordArr.filter(word => word.length > 4)
        
        const wordMap = {}
        lengthFilter.forEach(function(word) {
          if(wordMap[word]) wordMap[word]++; 
          else wordMap[word] = 1;
        });
        
        let sortedValues = Object.values(wordMap).sort((a, b) => b - a);
        let n = 0
        top = []
        for(let i=1; i < sortedValues.length; i++){
          if(n == 3) break  
          if( sortedValues[i-1] > sortedValues[i] ){
            top.push(sortedValues[i-1])
            n++
            // console.log(sortedValues[i-1], sortedValues[i], n);
          }      
        }
        
        let topWord = {}
        for(let word in wordMap) {
          for(let n in top) {
            if(wordMap[word] === top[n]) {          
              topWord[word] = wordMap[word];
            }
          }
        }
        
        let sortedTopWord = [];
        for (let key in topWord) {
          sortedTopWord.push([key, topWord[key]]);
        }
        sortedTopWord.sort((a, b) => b[1] - a[1] );
        let stats = sortedTopWord.map(elem => `слово "${elem[0]}" встречается ${elem[1]} раз`).join(', ')
        // console.log(top, topWord, sortedTopWord, stats);
        // stats = 
        return `На странице ${url} ${stats}\n\n` 
      }
      // ========================= BEGIN =======================================
      // // remove prev report
      fs.stat(pathToReport, (err, stat) => {
        if(err) return console.error(err);      
        fs.unlink(pathToReport, err => {
          if(err) return console.error(err);
          console.log('prev word stat report version deleted successfully');
        });
      })
      // // prepare data      
      // let urls = ['https://tass.ru/v-strane', 'https://www.kommersant.ru/rubric/47']

      let urls = Object.values(request.payload)
      const wordStat = [] 
      for(let i in urls){
        console.log(urls[i]);
        wordStat.push(await countTopWords(urls[i]))
      }
      console.log('обработано - ', wordStat.length);
      
      // export to pdf format
      let createPdf = require('../utils/createPdf')
      createPdf(wordStat)
      // return file existing
      let stat = fs.statSync(pathToReport)
      console.log('report size', stat.size);
      if(stat.size >= 0) return true;
      else return false
    }
  }
  ,{
    method: 'GET',
    path:'/show-report',
    handler: (request, h) => {
      // // return data || 500
      let fs = require('fs')
      let pdf = fs.readFileSync(pathToReport)
      // console.log(pdf);
      const response = h
      .response(pdf)
      // .type('application/pdf')
      // .header('Content-Length', pdf.length );
      // .header('Content-Disposition', 'attachment;filename=downloaded.pdf');
      return response;
      
      // // return file || 404 
      // return h.file(pathToReport)
  
    }
  }
  ,
]
module.exports = routes;
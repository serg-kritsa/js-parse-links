const pathToReport = require("../constants").PATH_TO_REPORT;

module.exports = function createPdf(data) {
  var fs = require("fs");

  var fonts = {
    Roboto: {
      normal: "./utils/fonts/Roboto-Regular.ttf",
      // bold: "fonts/Roboto-Medium.ttf",
      // italics: "fonts/Roboto-Italic.ttf",
      // bolditalics: "fonts/Roboto-MediumItalic.ttf"
    }
  };

  var PdfPrinter = require("pdfmake/src/printer");
  var printer = new PdfPrinter(fonts);

  var docDefinition = {
    content: data
    // [
    // '---------------First paragraph!!!',
    // 'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
    // ]
  };

  var pdfDoc = printer.createPdfKitDocument(docDefinition);
  // console.log(pdfDoc);

  pdfDoc.pipe(fs.createWriteStream(pathToReport));
  pdfDoc.end();
};

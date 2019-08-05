const pathToReport = require("../constants").PATH_TO_REPORT;

module.exports = function createPdf(data) {
  let fs = require("fs");

  let fonts = {
    Roboto: {
      normal: "./utils/fonts/Roboto-Regular.ttf"
    }
  };

  let PdfPrinter = require("pdfmake/src/printer");
  let printer = new PdfPrinter(fonts);

  let docDefinition = {
    content: data
  };

  let pdfDoc = printer.createPdfKitDocument(docDefinition);
  // console.log(pdfDoc);

  pdfDoc.pipe(fs.createWriteStream(pathToReport));
  pdfDoc.end();
};

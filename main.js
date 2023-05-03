const fs = require('fs');
var mod = require('./exports');
csvFile = "./in/data1/file1.txt";
// mod.move("./in/data1/file1.txt", "./out/file1.txt");
// mod.read(csvFile);

fs.rename('./in/mynewfile1.txt', './out/myrenamedfile.txt', function (err) {
    if (err) throw err;
    console.log('File Renamed!');
  });
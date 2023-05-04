
const fs = require('fs');

const processInputDir = "\\\\qppilot.appli/processes/ALM_SE/data/processed/";
const poolDir = "\\\\qppilot.appli/processes/ALM_SE/data/pool/";
const csvPath = "Import_a_reprendre.csv"
const targetDir = "\\\\qppilot.appli/Temp/flux_a_reprendre_/"

/**
 * Copy the src folder to the dest folder
 * @param {string} src
 * @param {string} dest
 * @param {function} callback
 */
const copyDir = (src, dest, callback) => {
  const copy = (copySrc, copyDest) => {
    fs.readdir(copySrc, (err, list) => {
      if (err) {
        callback(err);
        return;
      }
      list.forEach((item) => {
        const ss = path.resolve(copySrc, item);
        fs.stat(ss, (err, stat) => {
          if (err) {
            callback(err);
          } else {
            const curSrc = path.resolve(copySrc, item);
            const curDest = path.resolve(copyDest, item);

            if (stat.isFile()) {
              // file, copy directly
              fs.createReadStream(curSrc).pipe(fs.createWriteStream(curDest));
            } else if (stat.isDirectory()) {
              // directory, recursively
              fs.mkdirSync(curDest, { recursive: true });
              copy(curSrc, curDest);
            }
          }
        });
      });
    });
  };

  fs.access(dest, (err) => {
    if (err) {
      // If the target directory does not exist, create it
      fs.mkdirSync(dest, { recursive: true });
    }
    copy(src, dest);
  });
};

/**
 * READ CSV
 */
var today = new Date();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

console.log(`START COPY : ${today} ${time}`)
var fluxObj = {};
// var pdfsArray = [];
fs.readFile(csvPath, { encoding: 'utf8' }, function (err, data) {
  if (err) {
    console.log(err)
  }
  // console.log(data);
  var dataArray = data.split(/\r?\n/);
  var count = 0;


  for (i in dataArray) {
    count++
    // skip first line
    if (count > 1) {
      fluxObj.fluxname = dataArray[i].split(";")[0];
      fluxObj.xml = dataArray[i].split(";")[1];
      fluxObj.pdfFilename = dataArray[i].split(";")[2];
      console.log(fluxObj.fluxname);
      console.log(fluxObj.xml);
      console.log(fluxObj.pdfFilename);
    }
    var flux = fluxObj.fluxname;
    var file = fluxObj.pdfFilename;
    var pdfInputPath = poolDir + file;
    var inputPath = processInputDir + flux;
    var targetPath = targetDir + flux
    
    
    if (flux) {
      console.log(`Trying to copy input ${inputPath} to ${targetPath}`);
      copyDir(inputPath, targetPath);
      console.log(inputPath  + "/" + flux + ".xml" )
      fs.copyFile(inputPath  + "/" + flux + ".xml", targetPath + "/" + flux + ".xml", function (err) {
          if (err) throw err;
         });
         fs.copyFile(inputPath  + "/" + flux + ".xml", targetPath + "/" + flux + ".xml", function (err) {
            if (err) throw err;
           });
        }
        if (file) {
          console.log("Input pdf " + pdfInputPath);
          console.log("output pdf " + targetPath + "/" + file);
          fs.copyFile(pdfInputPath, targetPath + "/" + file, function (err) {
            if (err) throw err;
          });
        }
      }



  var now = new Date();

  console.log(`Temps ecoulé ${(now - today) / 100} sec`);
});
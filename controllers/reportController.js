const fs = require('fs');
let promises = [];
let readline = require('readline');
let path = require('path');

let readFile = async function (file, dates) {
    return new Promise(function (resolve, reject) {
        let lines = new Set();
        let r1 = readline.createInterface({
            input: fs.createReadStream('./logs/' + file)
        })
        r1.on('line', function (line) {
            for (let date of dates) {
                if (line.includes(date)) {
                    lines.add(line);
                }
            }
        })
        r1.on('close', function () {
            let temp = Array.from(lines);
            resolve(temp);
        })
    })
}

let writeFile = function (data) {
    return new Promise(function (resolve, reject) {
        fs.appendFile('output.txt', data, 'utf8', function (err) {
            if (err) {
                resolve('Writing File Error!');
            } else {
                reject('Writing file succeeded!');
            }
        })
    })
}


async function reportGenerator(dateRange) {
    return new Promise(function (resolve, reject) {
        fs.readdir('./logs', function (err, files) {
            if (err) {
                console.log("Logs Path Does Not Exist");
                reject(err);
            }
            files = files.filter((file) => { if (path.extname(file) == '.log') { return file; } })
            for (let i = 0; i < files.length; i++) {
                promises.push(readFile(files[i], dateRange));
                if (i == (files.length - 1)) {
                    let results = Promise.all(promises);
                    results.then((data) => {
                        data = data.filter((item) => { if (item.length) { return item; } })
                        result = [];
                        for (row of data) for (e of row) result.push(e);
                        dropCount = {};
                        disconnectCount = {};
                        avgLimitExceedCount = {};
                        result.forEach((item) => {
                            let tempName = item.split(' ');
                            let username = tempName[1].split(':')[1];
                            if (item.includes('Drop count limit')) {
                                if (dropCount[username]) {
                                    dropCount[username] = parseInt(dropCount[username]) + 1;
                                } else {
                                    dropCount[username] = 1;
                                }
                            } else if (item.includes('Client is disconnected from agent')) {
                                if (disconnectCount[username]) {
                                    disconnectCount[username] = parseInt(disconnectCount[username]) + 1;
                                } else {
                                    disconnectCount[username] = 1;
                                }
                            } else if (item.includes('Average limit')) {
                                if (avgLimitExceedCount[username]) {
                                    avgLimitExceedCount[username] = parseInt(avgLimitExceedCount[username]) + 1;
                                } else {
                                    avgLimitExceedCount[username] = 1;
                                }
                            }
                        })
                        let resultList = { "dropCount": dropCount, "disconnectCount": disconnectCount, "avgLimitExceedCount": avgLimitExceedCount };
                        resolve(resultList);
                    })
                }
            }
        })
    })
}

module.exports = {
    reportGenerator
}
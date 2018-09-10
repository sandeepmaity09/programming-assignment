const logFolder = __dirname + '/logs';

/**
 * adding of controllers 
 */
const Reader = require('./controllers/screenReaderController');
const ReportGenerator = require('./controllers/reportController');
const Validator = require('./Validators');

/**
 * main function where the execution starts
 */

async function main() {
    console.log("\nMarmeto : Report Generation Tool");
    console.log("NOTE:- Put log file in folder", logFolder);
    console.log("\n");
    let startDate;
    let endDate;
    let startDateValid = false;
    let endDateValid = false;
    let dateRangeValid = false;
    do {
        do {
            startDate = await Reader.askQuestion("\nStart Date (DD-MM-YYYY) : ")
            startDateValid = Validator.dateValidator(startDate);
            if (!startDateValid) {
                console.log("Please provide date according to the format");
            }
        } while (!startDateValid)

        do {
            endDate = await Reader.askQuestion("\nEnd Date (DD-MM-YYYY) : ")
            endDateValid = Validator.dateValidator(endDate);
            if (!endDateValid) {
                console.log("Please provide date according to the format");
            }
        } while (!endDateValid)
        dateRangeValid = Validator.dateRangeValidator(startDate, endDate);
        if (!dateRangeValid) {
            console.log("Date Range is not Valid\nPlease provide correct details\n");
        }
    } while (!dateRangeValid);

    try {
        let dateList = Validator.dateListGenerator(startDate, endDate);
        let reports = await ReportGenerator.reportGenerator(dateList);
        for (let report in reports) {
            reports[report] = sortProperties(reports[report]);
        }
        // console.log(reports);
        reportPrinter(reports);
    } catch (err) {
        console.log("Some Error", err);
    }
}


/**
 * function to sort the object by changing into array
 */

function sortProperties(obj) {
    var sortable = [];
    for (var key in obj)
        if (obj.hasOwnProperty(key))
            sortable.push([key, obj[key]]);
    sortable.sort(function (a, b) {
        return a[1] - b[1];
    });
    return sortable.reverse();
}

/**
 * printing the generated report into terminal
 */

function reportPrinter(reportsObject) {
    for (let reports in reportsObject) {
        if (reports === 'dropCount') {
            console.log("\n\n");
            console.log("1. Computer Name, No. of Disconnects for that computer name in a specified date range in descending order")
            console.log("\nComputer Name \t\t No. of Disconnects");
            for (report in reportsObject[reports]) {
                console.log(reportsObject[reports][report][0] + "\t\t" + reportsObject[reports][report][1]);
            }
        }
        if (reports === 'disconnectCount') {
            console.log("\n\n");
            console.log("1. Computer Name, No. of Disconnects for that computer name in a specified date range in descending order")
            console.log("\nComputer Name \t\t No. of Disconnects");
            for (report in reportsObject[reports]) {
                console.log(reportsObject[reports][report][0] + " \t\t " + reportsObject[reports][report][1]);
            }
        }
        if (reports === 'avgLimitExceedCount') {
            console.log("\n\n");
            console.log("1. Computer Name, No. of Disconnects for that computer name in a specified date range in descending order")
            console.log("\nComputer Name \t\t No. of Disconnects");
            for (report in reportsObject[reports]) {
                console.log(reportsObject[reports][report][0] + " \t\t " + reportsObject[reports][report][1]);
            }
        }
    }
}

main();
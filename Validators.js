function dateValidator(date) {
    let regexExpr = new RegExp(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
    let result = regexExpr.test(date);
    return result;
}

function dateRangeValidator(startDate, endDate) {
    let start = startDate.split('-');
    let end = endDate.split('-');
    if (start[2] > end[2]) {
        return false;
    }
    return true;
}


function dateListParser(dateList) {
    let dates = new Array();
    for (let dateItem of dateList) {
        let temp = dateItem.toISOString();
        let tempDate = temp.split('T')[0];
        let tempList = tempDate.split('-');
        let date = tempList[1] + '/' + tempList[2];
        dates.push(date);
    }
    return dates;
}

function dateListGenerator(startDate, endDate) {
    let start = startDate.split('-');
    let end = endDate.split('-');
    startDate = start[2] + '-' + start[1] + '-' + start[0];
    endDate = end[2] + '-' + end[1] + '-' + end[0];

    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

    let currentDate = new Date(startDate);
    let stopDate = new Date(endDate);

    let dateArray = new Array();
    while (currentDate <= stopDate) {
        dateArray.push(new Date(currentDate));
        currentDate = currentDate.addDays(1);
    }
    dateList = dateListParser(dateArray);
    return dateList;
}

module.exports = {
    dateValidator,
    dateRangeValidator,
    dateListGenerator
}
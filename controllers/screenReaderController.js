const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function askQuestion(question) {
    return new Promise(function (resolve, reject) {
        rl.question(question, (answer) => {
            rl.pause();
            resolve(answer);
        })
    })
}

module.exports = {
    askQuestion
}
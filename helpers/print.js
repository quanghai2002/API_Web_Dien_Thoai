import chalk from "chalk";

const outputType = {
    INFORMATION: 'INFORMATION',
    SUCCESS: 'SUCCESS',
    WARNING: 'WARNING',
    ERROR: 'ERROR',

}
const print = (message, outputType) => {

    if (outputType === 'INFORMATION') {
        console.log(chalk.white(message));
    }
    else if (
        outputType === 'SUCCESS'
    ) {
        console.log(chalk.green(message));
    }
    else if (
        outputType === 'WARNING'
    ) {
        console.log(chalk.yellow(message));
    }
    else if (
        outputType === 'ERROR'
    ) {
        console.log(chalk.red(message));
    }
    else {
        console.log(chalk.white(message));
    }


}

export { print, outputType }
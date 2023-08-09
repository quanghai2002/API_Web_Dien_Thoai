import { print, outputType } from "../helpers/print.js";
export default class Exception extends Error {
    constructor(message) {
        super(message);
        print(message, outputType.ERROR)
    }
}
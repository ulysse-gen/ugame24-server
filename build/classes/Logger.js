"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//
// Modules Imports
//
const console_log_colors_1 = require("console-log-colors");
const moment_1 = __importDefault(require("moment"));
class Logger {
    constructor(DisplayTime = true, TimeFormat = "HH:MM:ss", DefaultType = undefined) {
        this.DisplayTime = DisplayTime;
        this.TimeFormat = TimeFormat;
        this.DefaultType = DefaultType || "INFO";
    }
    get TimeHeader() {
        if (!this.DisplayTime)
            return ``;
        return `[${(0, moment_1.default)().format(this.TimeFormat)}]`;
    }
    log(LogContent, LogType = this.DefaultType) {
        var LogString = `${this.TimeHeader}[${LogType}] ${LogContent}`;
        if (LogType == "INFO")
            return console.log(console_log_colors_1.color.gray(LogString));
        if (LogType == "WARN")
            return console.log(console_log_colors_1.color.yellow(LogString));
        if (LogType == "ERROR")
            return console.log(console_log_colors_1.color.red(LogString));
        if (LogType == "DEBUG")
            return console.log(console_log_colors_1.color.blue(LogString));
        return console.log(LogString);
    }
    INFO(LogContent) {
        return this.log(LogContent, "INFO");
    }
    WARN(LogContent) {
        return this.log(LogContent, "WARN");
    }
    ERROR(LogContent) {
        return this.log(LogContent, "ERROR");
    }
    DEBUG(LogContent) {
        return this.log(LogContent, "DEBUG");
    }
}
exports.default = Logger;

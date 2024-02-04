//
// Modules Imports
//
import { color } from "console-log-colors";
import moment from "moment";

//
// Types Import
//
import { uGameServer } from "../types/ugame-server.d";

export default class Logger {
    private DisplayTime: boolean;
    private TimeFormat: string;
    private DefaultType: string;

    constructor(DisplayTime = true, TimeFormat = "HH:MM:ss", DefaultType: uGameServer.LogType | undefined = undefined) {
        this.DisplayTime = DisplayTime;
        this.TimeFormat = TimeFormat;
        this.DefaultType = DefaultType || "INFO";
    }

    get TimeHeader() {
        if (!this.DisplayTime)return ``;
        return `[${moment().format(this.TimeFormat)}]`
    }

    log(LogContent: uGameServer.LogContent, LogType: uGameServer.LogType = this.DefaultType) {
        var LogString = `${this.TimeHeader}[${LogType}]${LogContent}`;
        if (LogType == "INFO")return console.log(color.gray(LogString));
        if (LogType == "WARN")return console.log(color.yellow(LogString));
        if (LogType == "ERROR")return console.log(color.red(LogString));
        if (LogType == "DEBUG")return console.log(color.blue(LogString));
        return console.log(LogString);
    }

    INFO(LogContent: uGameServer.LogContent) {
        return this.log(LogContent, "INFO");
    }

    WARN(LogContent: uGameServer.LogContent) {
        return this.log(LogContent, "WARN");
    }

    ERROR(LogContent: uGameServer.LogContent) {
        return this.log(LogContent, "ERROR");
    }

    DEBUG(LogContent: uGameServer.LogContent) {
        return this.log(LogContent, "DEBUG");
    }
}
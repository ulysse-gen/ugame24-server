"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//
// Classes Imports
//
const Logger_1 = __importDefault(require("../classes/Logger"));
//
// Init main variables & default objects
//
const MainLogger = new Logger_1.default();
function StartCheck() {
    return __awaiter(this, void 0, void 0, function* () {
        let EXIT = false;
        if (!process.env.MYSQL_DB) {
            MainLogger.ERROR('Missing environnement variable "MYSQL_DB"');
            EXIT = true;
        }
        if (!process.env.MYSQL_HOST) {
            MainLogger.ERROR('Missing environnement variable "MYSQL_HOST"');
            EXIT = true;
        }
        if (!process.env.MYSQL_PASSWD) {
            MainLogger.ERROR('Missing environnement variable "MYSQL_PASSWD"');
            EXIT = true;
        }
        if (!process.env.MYSQL_USER) {
            MainLogger.WARN('Missing environnement variable "MYSQL_USER", using default "ugame"');
        }
        if (!process.env.MYSQL_PORT) {
            MainLogger.WARN('Missing environnement variable "MYSQL_PORT", using default "3306".');
        }
        if (EXIT)
            process.exit(1);
    });
}
exports.default = StartCheck;

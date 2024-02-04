//
// Classes Imports
//
import Logger from "../classes/Logger";

//
// Init main variables & default objects
//
const MainLogger = new Logger();

export default async function StartCheck() {
    let EXIT = false;
    if (!process.env.MYSQL_DB){
        MainLogger.ERROR('Missing environnement variable "MYSQL_DB"');
        EXIT = true;
    }
    if (!process.env.MYSQL_HOST){
        MainLogger.ERROR('Missing environnement variable "MYSQL_HOST"');
        EXIT = true;
    }
    if (!process.env.MYSQL_PASSWD){
        MainLogger.ERROR('Missing environnement variable "MYSQL_PASSWD"');
        EXIT = true;
    }
    
    if (!process.env.MYSQL_USER){
        MainLogger.WARN('Missing environnement variable "MYSQL_USER", using default "ugame"');
    }
    if (!process.env.MYSQL_PORT){
        MainLogger.WARN('Missing environnement variable "MYSQL_PORT", using default "3306".');
    }

    if (EXIT)process.exit(1);
}
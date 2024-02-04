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
exports.queryTransaction = exports.execute = exports.query = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const MysqlConfig = {
    db: {
        /* don't expose password or any sensitive info, done only for demo */
        host: (process.env.MYSQL_HOST || "127.0.0.1"),
        port: parseInt(process.env.MYSQL_PORT || "3306"),
        user: process.env.MYSQL_USER || "ugame",
        password: process.env.MYSQL_PASSWD,
        database: process.env.MYSQL_DB || "ugame",
        connectTimeout: 60000
    }
};
function query(sql, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield promise_1.default.createConnection(MysqlConfig.db);
        const [results,] = yield connection.query(sql, params);
        yield connection.end();
        connection.destroy();
        return results;
    });
}
exports.query = query;
function execute(sql, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield promise_1.default.createConnection(MysqlConfig.db);
        const [results,] = yield connection.execute({ sql }, params);
        yield connection.end();
        connection.destroy();
        return results;
    });
}
exports.execute = execute;
function queryTransaction(queries) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield promise_1.default.createConnection(MysqlConfig.db);
        yield connection.beginTransaction();
        const query = queries.map((query) => __awaiter(this, void 0, void 0, function* () { return connection.query(query.sql, query.params); }));
        yield Promise.all(query);
        return connection.commit();
    });
}
exports.queryTransaction = queryTransaction;
exports.default = { query, execute, queryTransaction };

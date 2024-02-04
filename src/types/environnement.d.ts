declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            MYSQL_HOST: string | "localhost";
            MYSQL_PORT: string | "3306";
            MYSQL_DB: string | "ugame";
            MYSQL_USER: string | "ugame";
            MYSQL_PASSWD: string;
            Windows_NT?: string;
            BASE_URL?: string;
            SOCKET_PORT?: string;
            JWT_SECRET?: string;
        }
    }
}

export {}
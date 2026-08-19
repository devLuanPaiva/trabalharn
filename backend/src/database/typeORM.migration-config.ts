import { DataSource } from "typeorm";
import { config } from "dotenv";
import * as path from "node:path";

config();

const getDatabaseConfig = () => {
    const databaseUrl = process.env.DATABASE_URL;

    if (databaseUrl) {
        const url = new URL(databaseUrl);
        return {
            type: "postgres" as const,
            host: url.hostname,
            port: Number.parseInt(url.port || "5432", 10),
            username: url.username,
            password: url.password,
            database: url.pathname.slice(1),
            schema: "public",
            ssl: url.searchParams.get("sslmode") === "require",
        };
    }

    return {
        type: "postgres" as const,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        schema: "public",
        ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    };
};

const config_obj = getDatabaseConfig();

const dataSource = new DataSource({
    ...config_obj,
    entities: [path.join(__dirname, "..", "**", "*.entity.ts")],
    migrations: [path.join(__dirname, "migrations", "*.ts")],
    synchronize: false,
});

export default dataSource;
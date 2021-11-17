import mariadb from 'mariadb';
import {databaseConfig} from "../config/config";


export default class Connection {

    static pool = mariadb.createPool(databaseConfig);
    static conn = null;

    static async getConnection() {
        this.conn = await this.pool.getConnection();
    }

    static async query(string, args) {
        if (!this.conn) {
            try {
                await this.getConnection();
            } catch (e) {
                console.log(e)
                throw e;
            }
        }

        try {
            return await this.conn.query(string, args);
        } catch (e) {
            if (e.errno === 45013) {
                try {
                    await this.conn.release();
                    await this.getConnection();
                    return await this.conn.query(string, args);
                } catch (e) {
                    throw e;
                }
            } else {
                throw e;
            }
        }
    }

}

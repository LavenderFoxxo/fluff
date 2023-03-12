require('dotenv').config()
const mysql = require('mysql2/promise')

async function query(sql, params) {
    const connection = await mysql.createConnection(process.env.DATABASE_URL)

    try {
        const [results, ] = await connection.execute(sql, params);
        return results
    } finally {
        connection.destroy();
    }
}   

module.exports = {
    query
}

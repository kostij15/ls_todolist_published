const { Client } = require("pg");
const CLIENT_CREDENTIALS = {
  database: "todo-lists",
  user: "postgres",
  password: "",
};

const logQuery = (statement, parameters) => {
  let timestamp = new Date();
  let formattedTimestamp = timestamp.toString().substring(4, 24);
  console.log(formattedTimestamp, statement, parameters);
};

module.exports = {
  async dbQuery(statement, ...parameters) {
    let client = new Client(CLIENT_CREDENTIALS);

    await client.connect();
    logQuery(statement, parameters);
    let result = await client.query(statement, parameters);
    await client.end();

    return result;
  }
}
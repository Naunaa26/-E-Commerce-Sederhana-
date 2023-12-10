const mysql = require("mysql")

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "sekolah_rabbanii",
  password: "",
});

connection.connect((err) => {
  if (err) throw err ;
    console.log("Connect Database");
  });

module.exports = connection;
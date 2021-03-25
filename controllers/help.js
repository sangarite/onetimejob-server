//get data from help table
const GetHelp = (connection, sql) => (req, res) => {
  connection.connect()
  .then(() => {
    const request = new sql.Request(connection);
    request.query("SELECT * FROM help")
    .then((result) => {
      res.send(result.recordsets[0]);
      connection.close();
    })
    .catch(err => {
      res.send('could not access the help table');
      connection.close();
    })
  })
  .catch(err => console.log('could not connecto to database at GetHelp'))
}

module.exports = { GetHelp: GetHelp };

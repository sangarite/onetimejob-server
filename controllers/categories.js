//get categories
const GetCategories = (connection, sql) => (req, res) => {
  connection.connect()
  .then(() => {
    const request = new sql.Request(connection);
    request.query('SELECT * FROM categories')
    .then((result) => {
      res.send(result.recordset);
      connection.close();
    })
    .catch((err) => {
      console.log(err, 'could not get categories');
      connection.close();
    })
  })
  .catch((err) => console.log(err, 'could not connect to the database at GetCategories'))
}

module.exports = { GetCategories: GetCategories };

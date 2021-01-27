const Apply = (connection, sql) => (req, res) => {

  const { job_id, user, publisher_id, text } = req.body;

  connection.connect()
  .then(() => {
    const request = new sql.Request(connection);
    request.query(`INSERT INTO messages (user_id, text) VALUES (${publisher_id}, N'${text}')`)
    .then(() => {
      res.status(200);
      res.end('success');
      connection.close();
    })
    .catch((err) => {
      console.log(err, 'fail');
      connection.close();
    })
  })
  .catch((err) => console.log(err, 'could not connect to database'))
}

module.exports = { Apply: Apply };

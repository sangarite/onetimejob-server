//apply to a job - send a message to the job publisher
const Apply = (connection, sql) => (req, res) => {

  const { job_id, user, publisher_id, text } = req.body;

  connection.connect()
  .then(() => {
    const request = new sql.Request(connection);
    request.query(`INSERT INTO messages (user_id, text) VALUES (${publisher_id}, N'${text}')`)
    .then(() => {
      res.status(200);
      res.end('message was inserted');
      connection.close();
    })
    .catch((err) => {
      console.log(err, 'could not insert message at apply');
      connection.close();
    })
  })
  .catch((err) => console.log(err, 'could not connect to database at apply'))
}

module.exports = { Apply: Apply };

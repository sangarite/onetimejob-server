//delete expired jobs
const DeleteJobs = (connection, sql) => (req, res) => {
  connection.connect()
  .then(() => {
    const request = new sql.Request(connection);
    request.query('DELETE FROM jobs WHERE expiry_date < GETDATE()')
    .then((result) => {
      res.send(result);
      connection.close();
    })
    .catch((err) => {
      console.log(err);
      connection.close();
    })
  })
  .catch((err) => res.send('could not connect to database at DeleteJobs'))
}

module.exports = { DeleteJobs: DeleteJobs };

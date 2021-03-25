//get job detailes
const GetJob = (connection, sql) => (req, res) => {
  connection.connect()
  .then(() => {
    const id = req.params.id;
    const request = new sql.Request(connection);
    request.query(`SELECT * FROM jobs WHERE job_id=${id}`, (err, recordsets) => {
      if (err) console.log(err);
      res.send(recordsets.recordsets);
      connection.close();
    })
  })
  .catch(err => {
    console.log(err);
    res.send('connection failed, please try later');
  })
}

module.exports= { GetJob: GetJob }

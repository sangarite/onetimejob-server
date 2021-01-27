const GetMessage = (connection, sql) => (req, res) => {
  const id = req.params.id;
  connection.connect()
  .then(() => {
    const request = new sql.Request(connection);
    request.query(`select * from messages where user_id=${id}`)
    .then(result => {
      res.send(result.recordsets[0]);
      connection.close();
    })
    .catch(err => {
      res.send(err);
      connection.close();
    })
  })
  .catch(err => res.send(err))
}

const updateMessage = (connection, sql) => (req, res) => {
  const id = req.params.id;
  connection.connect()
  .then(() => {
    const request = new sql.Request(connection);
    request.query(`UPDATE messages SET seen=1 Where user_id=${id}`)
    .then((result) => {
      res.send(result);
      connection.close();
    })
    .catch((err) => {
      console.log(err, 'could not update messages status');
      connection.close();
    })
  })
  .catch((err) => console.log('could not connect to database'))
}
module.exports = { GetMessage: GetMessage, updateMessage: updateMessage }

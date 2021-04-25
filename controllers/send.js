//send email
const Send = (transporter, connection, sql) => (req, res) => {

  const { subject, message, email_to } = req.body;

  console.log(req.body);

  connection.connect()
  .then(() => {
    const request = new sql.Request(connection);
    request.query(`SELECT * FROM users WHERE user_id='${email_to}'`)
    .then(result => {
      var mail = {
        from: 'one11timejob@gmail.com',
        to: result.recordset[0].email,
        subject: subject,
        text: message
      }
      transporter.sendMail(mail, (err, data) => {
        if (err) {
          res.json({msg: 'fail'})
        } else {
          res.json({msg: 'success'})
        }
      })
    })
    .catch(err => {
      console.log('could not find email: ', err);
      res.status(500);
      connection.close();
    })
  })
  .catch(err => console.log('could not connect to database: ', err))
}

module.exports = { Send: Send };

const updateBasicSettings = (connection, sql) => (req, res) => {

  const { name, email, phone, city, country, neighborhood, id } = req.body;

  connection.connect()
  .then(() => {
    const request = new sql.Request(connection);
    request.query(`UPDATE users SET
      user_name='${name}', email='${email}', phone='${phone}', city='${city}', country='${country}', neighborhood='${neighborhood}'
      WHERE user_id=${id}`
    )
    .then((result) => {
      res.end("פרטיך נשמרו בהצלחה");
      connection.close();
    })
    .catch((err) => {
      console.log(err);
      connection.close();
    })
  })
  .catch((err) => console.log(err))
}

const updatePassword = (connection, sql, bcrypt) => (req, res) => {

  const { id, oldPassword, newPassword, confirmPassword } = req.body;

  connection.connect()
  .then(() => {
    const request = new sql.Request(connection);
    request.query(`SELECT password FROM users WHERE user_id=${id}`)
    .then((result) => {
      bcrypt.compare(oldPassword, result.recordset[0].password, (err, valid) => {
        if (err) console.log(err);
        if (valid === true) {
          if(confirmPassword === newPassword) {
            connection.close();
            connection.connect()
            .then(() => {
              const hash = bcrypt.hashSync(newPassword, 10);
              const update = new sql.Request(connection);
              update.query(`UPDATE users SET password='${hash}' WHERE user_id=${id}`)
              .then((result) => res.send(result))
              .catch((err) => console.log(err))
            })
            .catch(err => console.log(err))
          } else {
            res.send('{"message":"סיסמאת האימות אינה תואמת לסיסמה החדשה"}')
          }
        }
        else res.send('{"message":"incorrect password"}');
      })
      connection.close();
    })
    .catch((err) => {
      console.log(err);
      connection.close();
    })
  })
  .catch((err) => console.log('could not connect to server'))
}

const deleteAccount = (connection, sql) => (req, res) => {
  const { id } = req.body;
  connection.connect()
  .then(() => {
    const request = new sql.Request(connection);
    request.query(`DELETE FROM users WHERE user_id=${id}`)
    .then((result) => {
      res.send(result);
      connection.close();
    })
    .catch((err) => {
      console.log(err);
      connection.close();
    })
  })
  .catch((err) => res.send('could not connect to database'))
}

module.exports = {
  updateBasicSettings: updateBasicSettings,
  updatePassword: updatePassword,
  deleteAccount: deleteAccount
};

const handleRegister = (connection, sql, bcrypt) => (req, res) => {

  const { name, password, email } = req.body;

  connection.connect()
  .then(() => {
    const selectRequest = new sql.Request(connection);
    selectRequest.query(`SELECT * FROM users WHERE email='${email}'`)
    .then((result) => {
      if(result.recordset.length) res.json({"message": "יש כבר משתמש רשום עם מייל זה"})
      connection.close();
      connection.connect()
      .then(() => {
        const insertRequest = new sql.Request(connection);
        const hash = bcrypt.hashSync(password, 10);
        insertRequest.query(`INSERT INTO users (user_name, email, password) OUTPUT INSERTED.* VALUES (N'${name}', '${email}', '${hash}')`)
        .then((result) => res.send(result.recordset[0]))
        .catch((err) => console.log(err + 'error inserting user'))
      })
      .catch((err) => console.log(err + 'error connecting to database'))
    })
    .catch((err) => {
      console.log(err + 'error checking email');
      connection.close();
    })
  })
  .catch((err) => console.log(err + 'error connecting to database'))
}

module.exports = { handleRegister: handleRegister };

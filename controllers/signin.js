//sign in the app
const handleSignIn = (connection, sql, bcrypt) => (req, res) => {

  const { name, password } = req.body;

  if (!name || !password) {
    res.status(400);
    res.json({"message": "יש למלא את כל השדות"});
  }

  function notFound() {
    res.status(404);
    res.json({"message": "שם המשתמש או הסיסמה שגויים"});
  }

  connection.connect()
  .then(() => {
    const request = new sql.Request(connection);
    request.query(`SELECT * FROM users WHERE user_name='${name}'`)
    .then((result) => {
      if (result.recordset.length === 0) notFound();
      bcrypt.compare(password, result.recordset[0].password, (err, valid) => {
        if (valid === true) res.send(result.recordset[0])
        else notFound();
      })
      connection.close();
    })
    .catch((err) => {
      res.status(500);
      console.log(err);
      connection.close();
    })
  })
  .catch((err) => res.status(503))
}

module.exports = { handleSignIn: handleSignIn };

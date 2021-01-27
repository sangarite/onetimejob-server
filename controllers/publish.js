const handlePublish = (connection, sql) => (req, res) => {

  const { title, details, category, user, salary, date, area, city} = req.body;

  if (!title || !category || !area) {
    res.status(400);
    res.end('יש להכניס כותרת קטגוריה ואזור');
  }

  console.log(date);
  const ex_date = (date.length) ? date : 'DATEADD(month, 1, GETDATE())';

  const cat = (category.length === 1) ? '0' + category : category;

  connection.connect()
  .then(() => {
    const request = new sql.Request(connection);
    request.query(
      `INSERT INTO jobs (title, details, category, user_id, salary, expiry_date, area, city, publish_date)
       VALUES (N'${title}', N'${details}', 'cat${cat}', ${user}, ${salary}, '${ex_date}', N'${area}', N'${city}', GETDATE())`
    )
    .then(() => {
      res.status(200);
      res.end('המשרה נוספה למאגר. כשנמצא מועמד מתאים, נשלח אליך את הפרטים שלו.');
      connection.close();
    })
    .catch((err) => {
      console.log(err, 'could not insert job to database');
      connection.close();
    })
  })
  .catch((err) => console.log(err, 'could not connect to database'))
}

module.exports = { handlePublish: handlePublish };

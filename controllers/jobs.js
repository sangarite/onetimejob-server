const getJobs = (connection, sql) => (req, res) => {

  //creating a variable for every condition in the query string
  const salary = `salary BETWEEN ${req.query.min} AND ${req.query.max}`;
  const area = (req.query.area.length) ? ` AND area=N'${req.query.area}'` : '';
  const city = (req.query.city.length) ? ` AND city=N'${req.query.city}'` : '';
  let categories = '';
  if (req.query.categories.length) {
    var temp = req.query.categories.split(",");
     categories = ` AND (category='${temp[0]}'`;
    for (var i = 1; i < temp.length; i++) {
      categories = categories.concat(` OR category='${temp[i]}'`);
    }
    categories = categories.concat(')');
  }
  let date = '';
  switch(req.query.date) {
  case '1': date = ' AND publish_date >= DATEADD(day, -1, GETDATE())'
    break;
  case '3': date = ' AND publish_date >= DATEADD(day, -3, GETDATE())'
    break;
  case '7': date = ' AND publish_date >= DATEADD(day, -7, GETDATE())'
    break;
  default: date = ''
}

  connection.connect()
  .then(() => {
    const request = new sql.Request(connection);
    console.log(
      'SELECT * FROM jobs WHERE '
      + salary
      + area
      + city
      + categories
      + date
      + ` ORDER BY ${req.query.order} ${req.query.by}`
    )
    request.query(
      'SELECT * FROM jobs WHERE '
      + salary
      + area
      + city
      + categories
      + date
      + ` ORDER BY ${req.query.order} ${req.query.by}`
    )
    .then((result) => {
      res.send(result.recordset);
      connection.close();
    })
    .catch((err) => {
      console.log(err, 'could not access job list');
      connection.close();
    })
  })
  .catch((err) => console.log(err, 'could not connect to database'))
}

module.exports = { getJobs: getJobs };

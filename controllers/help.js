const GetHelp=(connection,sql)=>(req,res)=>
{
    connection.connect()
    .then(()=>
    {
    const request=new sql.Request(connection);
    request.query("select * from help")
    .then((result) => {
        res.send(result.recordsets[0]);
        connection.close();
      })
      .catch((err) =>
      {
        console.log(err);
        res.send('could not access the help list');
        connection.close();
      } )
    })
    .catch((err)=>
    {
        console.log(err,'could not connect to database')
    })
}

module.exports = { GetHelp: GetHelp };

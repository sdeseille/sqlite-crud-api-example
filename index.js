const express = require('express')
const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./data/MyDB.db')

db.serialize(function () {
  db.run('CREATE TABLE IF NOT EXISTS datas (id TEXT, firstname TEXT, lastname TEXT)')
   db.all('SELECT ID, FIRSTNAME, LASTNAME FROM datas', function (err, row) {
     if (err) {
       console.log(err)
     } else {
     if (row.length === 0) {
       let stmt=db.prepare('INSERT INTO datas VALUES (?, ?, ?)')
       let obj= [{ id:'1', firstname:'FirstName', lastname:'LastName' }]
       for (let i in obj) {
          stmt.run(obj[i].id, obj[i].firstname, obj[i].lastname)
       }
       stmt.finalize()
       } else {
        console.log('Database already exists')
       }
     }
  })
})

const app = express()
app.get('/database', function (req, res) {
  db.all('SELECT ID, FIRSTNAME, LASTNAME FROM datas', function (err, rows) {
    let output = []
    if (err) {
      console.log(err)
    } else {
      if (rows.length === 0) {
        res.send('Empty database')
      } else {
        rows.forEach(function (row) {
          output.push({ id: row.id, firstname: row.firstname, lastname: row.lastname })
        })
        res.send(output)
      }
    }
  })
})
app.use(express.json())
app.set('port', 4040)
console.log('Server listening on port', app.get('port'))
app.listen(app.get('port'))
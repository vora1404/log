var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const secret = 'panda';

app.use(cors())

const mysql = require('mysql2');
// create the connection to database
const connection = mysql.createConnection({
    host: '52.74.138.205',
    port: '3306',
    user: 'root',
    password: 'BwS5dnmDhd0y',
    database: 'comcen'
  });

app.post('/register', jsonParser, function (req, res, next) {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        connection.execute(
            'INSERT INTO users (email,password,fname,lname) VALUES (?, ?, ?, ?)',
            [req.body.email, hash, req.body.fname, req.body.lname],
            function(err, results, fields) {
              if (err) {
                  res.json({status: 'error', message: err})
                  return
              }
              res.json({status: 'ok'})
            }   
        );
    });
})


app.get('/jobs', function (req, res, next) {
      connection.execute(
          'SELECT * FROM jobs j LEFT JOIN officer o on j.jobs_officer = o.officerid LEFT JOIN jobs_type jt on j.jobs_type = jt.jobs_type_id',
          function(err, results, fields) {
            if (err) {
                res.json({status: 'error', message: err})
                return
            }
            res.json(results)
          }   
      );
})

app.get('/totaljobs', function (req, res, next) {
  connection.execute(
      'SELECT officername,count(*) as total FROM jobs j left join officer o on j.jobs_officer = o.officerid GROUP BY officername ORDER BY count(*) desc',
      function(err, results, fields) {
        if (err) {
            res.json({status: 'error', message: err})
            return
        }
        res.json(results)
      }   
  );
})



app.post('/login', jsonParser, function (req, res, next) {
    connection.execute(
        'SELECT * FROM users WHERE email=?',
        [req.body.email],
        function(err, users, fields) {
          if (err) {
            res.json({status: 'error', message: err})
            return
          }
          if (users.length == 0) {
            res.json({ststus: 'No User Found'})
            return
          }
          // Load hash from your password DB.
          bcrypt.compare(req.
            body.password, users[0].password, function(err, isLogin) {
            if (isLogin) {
                var token = jwt.sign({ email: users[0].email }, secret);
                res.json ({status: 'ok', message: 'login success', token})
            } else {
                res.json ({status: 'error', message: 'login failed'})
            }
          });
        }   
    );
})

app.post('/authen', jsonParser, function (req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1]
        var decoded = jwt.verify(token, secret);
        res.json({status: 'ok', decoded})
        res.json({decoded})
    } catch (err) {
        res.json({status: 'error', message: err.message})
    }
})

app.get('/job', function (req, res, next) {
  const page = parseInt(req.query.page);
  const per_page = parseInt(req.query.per_page);
  const sort_column = req.query.sort_column;
  const sort_direction = req.query.sort_direction;
  const search = req.query.search;
  
  const start_idx = (page - 1) * per_page;
  var parems = [];

  var sql = 'SELECT * FROM jobs j LEFT JOIN officer o on j.jobs_officer = o.officerid LEFT JOIN jobs_type jt on j.jobs_type = jt.jobs_type_id';
  if (search) {
    sql += ' WHERE jobs_problem LIKE ?'
    parems.push('%'+search+'%')
  }
  
  if (sort_column) {
    sql += ' ORDER BY '+sort_column+' '+sort_direction;
  }
  sql += ' LIMIT ?, ?'
  parems.push(start_idx)
  parems.push(per_page)
      connection.execute(sql, parems,
          function(err, results) {
            console.log(results);

            connection.query(
              'SELECT count(jobs_id) as total FROM jobs j LEFT JOIN officer o on j.jobs_officer = o.officerid LEFT JOIN jobs_type jt on j.jobs_type = jt.jobs_type_id',
              function(err, counts, fields) {
                const total = counts[0]['total'];
                const total_pages = Math.ceil(total/per_page)
                res.json({
                  page: page,
                  per_page: per_page,
                  total: total,
                  total_pages: total_pages,
                  data: results
                })
              }
            )
          }   
      );
})

app.listen(3333,  function () {
  console.log('CORS-enabled web server listening on port 3333')
})
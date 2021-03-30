const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  credentials: true,
  origin: "*"
}));

var userList = {
  "data": [
    {
      "id": 1,
      "email": "george.bluth@reqres.in",
      "first_name": "George",
      "last_name": "Bluth",
      "avatar": "https://reqres.in/img/faces/1-image.jpg"
    },
    {
      "id": 2,
      "email": "janet.weaver@reqres.in",
      "first_name": "Janet",
      "last_name": "Weaver",
      "avatar": "https://reqres.in/img/faces/2-image.jpg"
    },
    {
      "id": 3,
      "email": "emma.wong@reqres.in",
      "first_name": "Emma",
      "last_name": "Wong",
      "avatar": "https://reqres.in/img/faces/3-image.jpg"
    },
    {
      "id": 4,
      "email": "eve.holt@reqres.in",
      "first_name": "Eve",
      "last_name": "Holt",
      "avatar": "https://reqres.in/img/faces/4-image.jpg"
    },
    {
      "id": 5,
      "email": "charles.morris@reqres.in",
      "first_name": "Charles",
      "last_name": "Morris",
      "avatar": "https://reqres.in/img/faces/5-image.jpg"
    },
    {
      "id": 6,
      "email": "tracey.ramos@reqres.in",
      "first_name": "Tracey",
      "last_name": "Ramos",
      "avatar": "https://reqres.in/img/faces/6-image.jpg"
    },
    {
      "id": 7,
      "email": "michael.lawson@reqres.in",
      "first_name": "Michael",
      "last_name": "Lawson",
      "avatar": "https://reqres.in/img/faces/7-image.jpg"
    },
    {
      "id": 8,
      "email": "lindsay.ferguson@reqres.in",
      "first_name": "Lindsay",
      "last_name": "Ferguson",
      "avatar": "https://reqres.in/img/faces/8-image.jpg"
    },
    {
      "id": 9,
      "email": "tobias.funke@reqres.in",
      "first_name": "Tobias",
      "last_name": "Funke",
      "avatar": "https://reqres.in/img/faces/9-image.jpg"
    },
    {
      "id": 10,
      "email": "byron.fields@reqres.in",
      "first_name": "Byron",
      "last_name": "Fields",
      "avatar": "https://reqres.in/img/faces/10-image.jpg"
    },
    {
      "id": 11,
      "email": "george.edwards@reqres.in",
      "first_name": "George",
      "last_name": "Edwards",
      "avatar": "https://reqres.in/img/faces/11-image.jpg"
    },
    {
      "id": 12,
      "email": "rachel.howell@reqres.in",
      "first_name": "Rachel",
      "last_name": "Howell",
      "avatar": "https://reqres.in/img/faces/12-image.jpg"
    }
  ]
}

var SECRET_KEY = "38b41ce7f8bb2a0aeb695dfe3bcf8823383f41bdbd69296e96e2e4e2d14b9098d633bb8d0a145b322d735ffac0ff434f9569296676c6404771ff78cc80b86829";
var ACCESS_TOKEN_SECRET = "ea3f31ab31436991eb0c8a496a37d1a67dcf97dc52fe710fff4ec1c30d184fc5ecdbe9173b4dc32cb654f44ecd90c20d400e6a4dfc955391a094c9a1dd4da83c";
var REFRESH_TOKEN_SECRET = "a6574268882fd311666eadc17e00cc0a4bf88d9cd326f9f08d6db7297a467810f1a8412add1152b74144424476558008e1458222dc5aa77de75e206d6423b796";
var refreshTokenList = [];

app.get('/', (req, res) => {
  res.status(200).send('Server is Running ' + new Date())
});

app.get('/users', (req, res) => {
  res.status(200).send(userList)
});

app.get('/user/:id', (req, res) => {
  var id = req.params.id;
  var user = userList.data.find(value => value.id == id);
  if(user && user.hasOwnProperty('id')){
    res.status(200).send(user)
  }
  else{
    res.status(400).send({
      message : 'User not found'
    })
  }
});

app.post('/user/add', (req, res) => {
  var user = req.body;
  user.createdAt = new Date();
  user.id = userList.data.length + 1;
  userList.data.push(user);
  res.status(200).send(user);
});

app.put('/user/:id/edit', (req, res) => {
  var modifiedUser = req.body;
  var id = req.params.id;
  modifiedUser.updatedAt = new Date();
  var user = userList.data.find(value => value.id == id);
  user = {...user, ...modifiedUser}
  userList.data[user.id - 1] = user;
  res.status(200).send(user);
});

app.patch('/user/:id/update', (req, res) => {
  var modifiedUser = req.body;
  var id = req.params.id;
  modifiedUser.updatedAt = new Date();
  var user = userList.data.find(value => value.id == id);
  user = {...user, ...modifiedUser}
  userList.data[user.id - 1] = user;
  res.status(200).send(user);
});

app.delete('/user/:id/delete', (req, res) => {
  var id = req.params.id;
  var index = userList.data.findIndex(value => value.id == id);
  userList.data.splice(index, 1);
  res.status(200).send({
    message : 'User deleted successfully'
  });
});

app.post('/auth-cookie/login', (req, res) => {
  const { username, password } = req.body;
  const token = jwt.sign({user: username}, SECRET_KEY);

  res.cookie('authorization', token, {
      maxAge: 1000 * 60 * 60 * 5,
      httpOnly: true,
      sameSite: false
  });
  res.status(200).send({authenticated : true})
});

app.get('/auth-cookie/users', checkAuthToken, (req, res) => {
  res.status(200).send(userList)
});

app.get('/auth-cookie/logout', (req, res) => {
  res.clearCookie('authorization');
  res.status(201).send('Logout Successfully');
});

function checkAuthToken(req, res, next){
  const { authorization } = req.cookies;
  jwt.verify(authorization, SECRET_KEY, (err, user) => {
      if(err){
          res.status(403).send({
            message : "Forbidden to access"
          })
          return;
      }
      else{
          req.user = user;
          next();
      }
  })
}


app.post('/auth-token/login', (req, res) => {
  const username = req.body.username;
  const user = {
      name: username
  }
  const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, {expiresIn: '10m'});
  const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET);
  refreshTokenList.push(refreshToken);
  res.json({ accessToken : accessToken, refreshToken : refreshToken});
})

app.get('/auth-token/users', authenticateToken, (req, res) => {
  res.status(200).send(userList)
});

app.post('/auth-token/token', (req, res) => {
  const refreshToken = req.body.token;
  if(!refreshToken) return res.sendStatus(401);
  if(!refreshTokenList.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
      if(err) return res.sendStatus(403);
      const accessToken = jwt.sign({name: user.name}, ACCESS_TOKEN_SECRET, {expiresIn: '3d'});
      res.json({ accessToken : accessToken })
  })
})

function authenticateToken(req, res, next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(!token) {
      res.status(401).send({
        message : "Unauthorized to access"
      })
      
      return;
  }else{
      jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
          if(err) {
            res.status(403).send({
              message : "Forbidden to access"
            })
              return;
          }
          req.user = user;
          next();
      })
  }
}




const PORT = process.env.PORT || 8080;

http.listen(PORT, () => {
  console.log("Server is listening on port 8080")
})

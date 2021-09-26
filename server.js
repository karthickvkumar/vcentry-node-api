const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const sgMail = require('@sendgrid/mail');
const multer  = require('multer');

sgMail.setApiKey('');

const storage = multer.diskStorage({
  destination : (req, file, callback) => {
    callback(null, './public/images');
  },
  filename : (req, file, callback) => {
    let fileType;
    if(file.mimetype == 'image/gif'){
      fileType = '.gif';
    }
    if(file.mimetype == 'image/png'){
      fileType = '.png';
    }
    if(file.mimetype == 'image/jpeg'){
      fileType = '.jpg';
    }
    const fileName = 'image-'+Date.now()+fileType;
    callback(null, fileName);
  }
});
var upload = multer({storage : storage});

const agentRouter = require('./routes/agent-route');

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

app.use('/', agentRouter);

app.post('/api/upload', upload.single('file'), (req, res) => {
  if(!req.file){
    res.status(500).send({
      message : 'Server Error'
    })
  }

  res.status(200).send({
    url : 'http://localhost:8080/images/' + req.file.filename
  })
})

app.post('/api/uploads', upload.array('file', 12), (req, res) => {
  if(req.files.length == 0){
    res.status(500).send({
      message : 'Server Error'
    })
  }

  const images = req.files.map((file, index) => {
      return {
        url : 'http://localhost:8080/images/' + file.filename
      }
  })
  res.status(200).send(images);
})

app.get('/images/:filename', (req, res) => {
  const filePath = __dirname + '/public/images/'+req.params.filename;
  res.sendFile(filePath);
})

app.get('/api/news/stories', (req, res) => {
  const filePath = __dirname + '/news.json' 
  res.sendFile(filePath);
})

app.post('/api/register', async (req, res) => {
  var users = [];
  let foundUser = users.find((data) => req.body.email === data.email);
        if (!foundUser) {

        let hashPassword = await bcrypt.hash(req.body.password, 10);

        let newUser = {
            id: Date.now(),
            username: req.body.username,
            email: req.body.email,
            password: hashPassword,
        };
        users.push(newUser);

        sgMail.send({
          to : req.body.email,
          from : 'karthick.afx@gmail.com',
          subject : "Account Created Successfully!",
          html : '<h1>Successfully created the Account</h1>',
          templateId : "d-677fe7de83f6414ebad4f94c4366eca9"
        }).then(() => {
          res.send("Successfully Created");
        })
        
    } else {
        res.send("User account Already Exist");
    }
})

app.post('/api/login', async (req, res) => {
  let foundUser = users.find((data) => req.body.email === data.email);
    if (foundUser) {

      let submittedPass = req.body.password; 
      let storedPass = foundUser.password; 

      const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
      if (passwordMatch) {
          let usrname = foundUser.username;
          res.send("Login Successfull");
      } else {
          res.send("Invalid Passoword");
      }
  }
  else{
    res.send("Invalid Username");
  }
});

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: ""
});

// connection.connect((error) => {
//   if(error){
//     throw error;
//   }
//   console.log("SQL Database is Connected")
// })


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
var productList = [
  {
    id : 1,
    name: 'One Plus 9',
    price: 40000,
    cover_image: "https://static.toiimg.com/thumb/msid-77812222,width-240,resizemode-4/OnePlus-Clover.jpg",
    category: 06,
    description: "OnePlus Clover smartphone runs on Android v10 (Q) operating system. The phone is powered by Octa core (1.8 GHz, Quad core, Kryo 240 + 1.8 GHz, Quad core, Kryo 240) processor.It runs on the Qualcomm Snapdragon 460 Chipset. It has 4 GB, 4 GB RAM and 64 GB internal storage , expandable Yes, Upto 256 GB via microSD card."
  },
  {
    id : 2,
    name: 'Holy Bible',
    price: 500,
    cover_image: "https://holybooks-lichtenbergpress.netdna-ssl.com/wp-content/uploads/Downnload-the-Bible-PDF-King-James-Version1-202x300.jpg",
    category: 01,
    description: "The King James Holy Bible is also placed into the public domain. It was created directly from the public domain text and converted to PDF format using “DaVince Tools”, a software product that converts text files and other file formats into PDF."
  },
  {
    id : 3,
    name: 'Mens T-shirt',
    price: 1099,
    cover_image: "https://5.imimg.com/data5/PJ/DI/MY-3877854/round-neck-plain-tshirt-with-multi-color-design-500x500.png",
    category: 07,
    description: "Flairmart Online Services Private Limited - Offering Cotton Causal, Office Round Neck Plain Tshirt With Multi Color Design at Rs 135/piece"
  }
]

var  jobList = {
  page_count : 1,
  jobs : [
    {
      "job_title" : "React JS Developer",
      "job_id" : 1,
      "category": "reactjs",
      "company_name" : "Creative Agency",
      "location" : "Chennai",
      "min_salary" : "25000",
      "max_salary" : "30000",
      "experience" : "1-2",
      "company_logo" : "/img/icon/job-list1.png",
      "type" : "Full Time",
      "duration": "18-06-2021"
    },
    {
      "job_title" : ".Net Programming",
      "job_id" : 2,
      "category": ".net",
      "company_name" : "Creative Agency",
      "location" : "Delhi",
      "min_salary" : "15000",
      "max_salary" : "18000",
      "experience" : "2-5",
      "company_logo" : "/img/icon/job-list3.png",
      "type" : "Part Time",
      "duration": "17-06-2021"
    },
    {
      "job_title" : "AI and Machine Learning Engineer",
      "job_id" : 3,
      "category": "python",
      "company_name" : "Creative Agency",
      "location" : "Mumbai",
      "min_salary" : "30000",
      "max_salary" : "40000",
      "company_logo" : "/img/icon/job-list4.png",
      "experience" : "6-12",
      "type" : "Freelance",
      "duration": "15-06-2021"
    },
    {
      "job_title" : "React JS Developer",
      "job_id" : 4,
      "category": "reactjs",
      "company_name" : "Creative Agency",
      "location" : "Kochin",
      "min_salary" : "10000",
      "max_salary" : "12000",
      "experience" : "2-6",
      "company_logo" : "/img/icon/job-list1.png",
      "type" : "Remote",
      "duration": "16-06-2021"
    },
    {
      "job_title" : "Angular Developer",
      "job_id" : 5,
      "category": "angular",
      "company_name" : "Creative Agency",
      "location" : "Chennai",
      "min_salary" : "20000",
      "max_salary" : "25000",
      "experience" : "1-2",
      "company_logo" : "/img/icon/job-list2.png",
      "type" : "Full Time",
      "duration": "12-06-2021"
    },
    {
      "job_title" : ".Net Programming",
      "job_id" : 6,
      "category": ".net",
      "company_name" : "Creative Agency",
      "location" : "Mumbai",
      "min_salary" : "35000",
      "max_salary" : "40000",
      "experience" : "4-8",
      "company_logo" : "/img/icon/job-list3.png",
      "type" : "Part Time",
      "duration": "10-06-2021"
    },
    {
      "job_title" : "AI and Machine Learning Engineer",
      "job_id" : 7,
      "category": "python",
      "company_name" : "Creative Agency",
      "location" : "Delhi",
      "min_salary" : "25000",
      "max_salary" : "35000",
      "experience" : "1-4",
      "company_logo" : "/img/icon/job-list4.png",
      "type" : "Remote",
      "duration": "18-06-2021"
    },
]
}

var jobDetails = [
  {
    "job_title" : "React JS Developer",
    "job_id" : 1,
    "category": "reactjs",
    "company_name" : "Creative Agency",
    "location" : "Chennai",
    "min_salary" : "25000",
    "max_salary" : "30000",
    "experience" : "1-2",
    "company_logo" : "/img/icon/job-list1.png",
    "type" : "Full Time",
    "duration": "18-06-2021",
    "vacancy" : 20,
    "description" : "It is a long established fact that a reader will beff distracted by vbthe creadable content of a page when looking at its layout. The pointf of using Lorem Ipsum is that it has ahf mcore or-lgess normal distribution of letters, as opposed to using, Content here content here making it look like readable.",
    "skills": [
      {
        "title" : "Strong problem solving and debugging skills"
      },
      {
        "title" : "Mobile Applicationin iOS/Android/Tizen or other platform"
      },
      {
        "title" : "Research and code , libraries, APIs and frameworks"
      },
      {
        "title" : "Strong knowledge on software development life cycle"
      }
    ],
    "experience" : [
      {
        "title" : "3 or more years of professional design experience",
      },
      {
        "title" : "Direct response email experience",
      },
      {
        "title" : "Familiarity with mobile and web apps preferred",
      },
      {
        "title" : "Experience using Invision a plus",
      }
    ],
    "company_detail" : {
      "name" : "Creative Agency",
      "description" : "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
      "web" : "creative-agency.com",
      "email" : "carrier.colorlib@gmail.com"
    }
  },
  {
    "job_title" : ".Net Programming",
      "job_id" : 2,
      "category": ".net",
      "company_name" : "Creative Agency",
      "location" : "Delhi",
      "min_salary" : "15000",
      "max_salary" : "18000",
      "experience" : "2-5",
      "company_logo" : "/img/icon/job-list3.png",
      "type" : "Part Time",
      "duration": "17-06-2021",
    "vacancy" : 20,
    "description" : "It is a long established fact that a reader will beff distracted by vbthe creadable content of a page when looking at its layout. The pointf of using Lorem Ipsum is that it has ahf mcore or-lgess normal distribution of letters, as opposed to using, Content here content here making it look like readable.",
    "skills": [
      {
        "title" : "Strong problem solving and debugging skills"
      },
      {
        "title" : "Mobile Applicationin iOS/Android/Tizen or other platform"
      },
      {
        "title" : "Research and code , libraries, APIs and frameworks"
      },
      {
        "title" : "Strong knowledge on software development life cycle"
      }
    ],
    "experience" : [
      {
        "title" : "3 or more years of professional design experience",
      },
      {
        "title" : "Direct response email experience",
      },
      {
        "title" : "Familiarity with mobile and web apps preferred",
      },
      {
        "title" : "Experience using Invision a plus",
      }
    ],
    "company_detail" : {
      "name" : "Creative Agency",
      "description" : "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
      "web" : "creative-agency.com",
      "email" : "carrier.colorlib@gmail.com"
    }
  },
  {
    "job_title" : "AI and Machine Learning Engineer",
      "job_id" : 3,
      "category": "python",
      "company_name" : "Creative Agency",
      "location" : "Mumbai",
      "min_salary" : "30000",
      "max_salary" : "40000",
      "company_logo" : "/img/icon/job-list4.png",
      "experience" : "6-12",
      "type" : "Freelance",
      "duration": "15-06-2021",
    "vacancy" : 20,
    "description" : "It is a long established fact that a reader will beff distracted by vbthe creadable content of a page when looking at its layout. The pointf of using Lorem Ipsum is that it has ahf mcore or-lgess normal distribution of letters, as opposed to using, Content here content here making it look like readable.",
    "skills": [
      {
        "title" : "Strong problem solving and debugging skills"
      },
      {
        "title" : "Mobile Applicationin iOS/Android/Tizen or other platform"
      },
      {
        "title" : "Research and code , libraries, APIs and frameworks"
      },
      {
        "title" : "Strong knowledge on software development life cycle"
      }
    ],
    "experience" : [
      {
        "title" : "3 or more years of professional design experience",
      },
      {
        "title" : "Direct response email experience",
      },
      {
        "title" : "Familiarity with mobile and web apps preferred",
      },
      {
        "title" : "Experience using Invision a plus",
      }
    ],
    "company_detail" : {
      "name" : "Creative Agency",
      "description" : "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
      "web" : "creative-agency.com",
      "email" : "carrier.colorlib@gmail.com"
    }
  },
  {
    "job_title" : "React JS Developer",
      "job_id" : 4,
      "category": "reactjs",
      "company_name" : "Creative Agency",
      "location" : "Kochin",
      "min_salary" : "10000",
      "max_salary" : "12000",
      "experience" : "2-6",
      "company_logo" : "/img/icon/job-list1.png",
      "type" : "Remote",
      "duration": "16-06-2021",
    "vacancy" : 20,
    "description" : "It is a long established fact that a reader will beff distracted by vbthe creadable content of a page when looking at its layout. The pointf of using Lorem Ipsum is that it has ahf mcore or-lgess normal distribution of letters, as opposed to using, Content here content here making it look like readable.",
    "skills": [
      {
        "title" : "Strong problem solving and debugging skills"
      },
      {
        "title" : "Mobile Applicationin iOS/Android/Tizen or other platform"
      },
      {
        "title" : "Research and code , libraries, APIs and frameworks"
      },
      {
        "title" : "Strong knowledge on software development life cycle"
      }
    ],
    "experience" : [
      {
        "title" : "3 or more years of professional design experience",
      },
      {
        "title" : "Direct response email experience",
      },
      {
        "title" : "Familiarity with mobile and web apps preferred",
      },
      {
        "title" : "Experience using Invision a plus",
      }
    ],
    "company_detail" : {
      "name" : "Creative Agency",
      "description" : "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
      "web" : "creative-agency.com",
      "email" : "carrier.colorlib@gmail.com"
    }
  },
  {
    "job_title" : "Angular Developer",
      "job_id" : 5,
      "category": "angular",
      "company_name" : "Creative Agency",
      "location" : "Chennai",
      "min_salary" : "20000",
      "max_salary" : "25000",
      "experience" : "1-2",
      "company_logo" : "/img/icon/job-list2.png",
      "type" : "Full Time",
      "duration": "12-06-2021",
    "vacancy" : 20,
    "description" : "It is a long established fact that a reader will beff distracted by vbthe creadable content of a page when looking at its layout. The pointf of using Lorem Ipsum is that it has ahf mcore or-lgess normal distribution of letters, as opposed to using, Content here content here making it look like readable.",
    "skills": [
      {
        "title" : "Strong problem solving and debugging skills"
      },
      {
        "title" : "Mobile Applicationin iOS/Android/Tizen or other platform"
      },
      {
        "title" : "Research and code , libraries, APIs and frameworks"
      },
      {
        "title" : "Strong knowledge on software development life cycle"
      }
    ],
    "experience" : [
      {
        "title" : "3 or more years of professional design experience",
      },
      {
        "title" : "Direct response email experience",
      },
      {
        "title" : "Familiarity with mobile and web apps preferred",
      },
      {
        "title" : "Experience using Invision a plus",
      }
    ],
    "company_detail" : {
      "name" : "Creative Agency",
      "description" : "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
      "web" : "creative-agency.com",
      "email" : "carrier.colorlib@gmail.com"
    }
  },
  {
    "job_title" : ".Net Programming",
      "job_id" : 6,
      "category": ".net",
      "company_name" : "Creative Agency",
      "location" : "Mumbai",
      "min_salary" : "35000",
      "max_salary" : "40000",
      "experience" : "4-8",
      "company_logo" : "/img/icon/job-list3.png",
      "type" : "Part Time",
      "duration": "10-06-2021",
    "vacancy" : 20,
    "description" : "It is a long established fact that a reader will beff distracted by vbthe creadable content of a page when looking at its layout. The pointf of using Lorem Ipsum is that it has ahf mcore or-lgess normal distribution of letters, as opposed to using, Content here content here making it look like readable.",
    "skills": [
      {
        "title" : "Strong problem solving and debugging skills"
      },
      {
        "title" : "Mobile Applicationin iOS/Android/Tizen or other platform"
      },
      {
        "title" : "Research and code , libraries, APIs and frameworks"
      },
      {
        "title" : "Strong knowledge on software development life cycle"
      }
    ],
    "experience" : [
      {
        "title" : "3 or more years of professional design experience",
      },
      {
        "title" : "Direct response email experience",
      },
      {
        "title" : "Familiarity with mobile and web apps preferred",
      },
      {
        "title" : "Experience using Invision a plus",
      }
    ],
    "company_detail" : {
      "name" : "Creative Agency",
      "description" : "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
      "web" : "creative-agency.com",
      "email" : "carrier.colorlib@gmail.com"
    }
  },
  {
    "job_title" : "AI and Machine Learning Engineer",
      "job_id" : 7,
      "category": "python",
      "company_name" : "Creative Agency",
      "location" : "Delhi",
      "min_salary" : "25000",
      "max_salary" : "35000",
      "experience" : "1-4",
      "company_logo" : "/img/icon/job-list4.png",
      "type" : "Remote",
      "duration": "18-06-2021",
    "vacancy" : 20,
    "description" : "It is a long established fact that a reader will beff distracted by vbthe creadable content of a page when looking at its layout. The pointf of using Lorem Ipsum is that it has ahf mcore or-lgess normal distribution of letters, as opposed to using, Content here content here making it look like readable.",
    "skills": [
      {
        "title" : "Strong problem solving and debugging skills"
      },
      {
        "title" : "Mobile Applicationin iOS/Android/Tizen or other platform"
      },
      {
        "title" : "Research and code , libraries, APIs and frameworks"
      },
      {
        "title" : "Strong knowledge on software development life cycle"
      }
    ],
    "experience" : [
      {
        "title" : "3 or more years of professional design experience",
      },
      {
        "title" : "Direct response email experience",
      },
      {
        "title" : "Familiarity with mobile and web apps preferred",
      },
      {
        "title" : "Experience using Invision a plus",
      }
    ],
    "company_detail" : {
      "name" : "Creative Agency",
      "description" : "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
      "web" : "creative-agency.com",
      "email" : "carrier.colorlib@gmail.com"
    }
  },
]

var HR_USER_LIST = [];

app.post('/api/db/create', (req, res) => {
  var dbName = req.body.db_name;
  if(!dbName){
    res.status(401).send({
      message : 'Invalid Database Name',
    }); 
    return;
  }

  connection.query("CREATE DATABASE " + dbName , (error, result) => {
    if(error){
      res.status(500).send({
        message : error
      })
      throw error;
    }

    console.log(result);
    res.status(200).send({
      message : "Database created successfully"
    })
  })

})

app.get('/', (req, res) => {
  res.status(200).send('Server is Running ' + new Date())
});

app.post('/api/login', (req, res) => {
  var user = req.body;
  if(!user.email || !user.password){
    res.status(200).send({
      message : 'Invalid Username / Password',
      authenticate : false
    });
    return;
  }
  res.status(200).send({
    message : 'Login successfully',
    authenticate : true
  });
});

// API Job Finder

app.get('/api/job-list', (req, res) => {
  res.status(200).send(jobList);
});


app.get('/api/job/:id', (req, res) => {
  var id = req.params.id;
  var job = jobDetails.find(value => value.job_id == id);
  if(job && job.hasOwnProperty('job_id')){
    res.status(200).send(job)
  }
  else{
    res.status(400).send({
      message : 'Job Not Found'
    })
  }
});


app.post('/api/employee/add', (req, res) => {
  var user = req.body;
  user.createdAt = new Date();
  user.id = HR_USER_LIST.length + 1;
  HR_USER_LIST.push(user);
  res.status(200).send({
    message : 'User created successfully'
  });
});

app.get('/api/products', (req, res) => {
  res.status(200).send(productList);
});

app.post('/api/product/add', (req, res) => {
  var product = req.body;
  product.createdAt = new Date();
  product.id = productList.length + 1;
  productList.push(product);
  res.status(200).send({
    message : 'Product added successfully'
  });
});

app.put('/api/product/:id/edit', (req, res) => {
  var modifyProduct = req.body;
  var id = req.params.id;
  modifyProduct.updatedAt = new Date();
  var product = productList.find(value => value.id == id);
  product = {...product, ...modifyProduct}
  productList[product.id - 1] = product;
  res.status(200).send({
    message : 'Product updated successfully'
  });
});

app.delete('/api/product/:id/delete', (req, res) => {
  var id = req.params.id;
  var index = productList.findIndex(value => value.id == id);
  productList.splice(index, 1);
  res.status(200).send({
    message : 'Product deleted successfully'
  });
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

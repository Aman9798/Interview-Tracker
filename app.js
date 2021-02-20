const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const {requireAuth, checkUser}  = require('./middleware/authMiddleware');
const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroMongoose = require('@admin-bro/mongoose');
const User = require('./models/Users');
const homeRoutes = require('./routes/homeRoutes');
const bcrypt = require('bcrypt');
//var flash = require('req-flash');
//var session = require('express-session');

const app = express();

AdminBro.registerAdapter(AdminBroMongoose);

// app.use(session({
//   secret: "cookie_secret",
//   resave: true,
//   saveUninitialized: true
// }));

// middleware
app.use(express.static('public'));
//app.use('/uploads', express.static('uploads'));
app.use(express.static('uploads'));
app.use(express.json());     // takes json data that comes along the request and parses itno js object to use inside the code
app.use(cookieParser());
//app.use(session({ secret: '123' }));
//app.use(flash());


// view engine
app.set('view engine', 'ejs');

const dbURI = 'mongodb+srv://Aman:test123@cluster0.wpcte.mongodb.net/node-auth';
const port = 3000;

const ADMIN = require('./admin_list/admin');
const run = async() => {
  const connection = await mongoose.connect(dbURI,{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true });
  app.listen(port);
  

  const AdminBroOptions = {
    databases : [connection],
    roothPath: '/admin',
    resources: []
  }
  const adminBro = new AdminBro(AdminBroOptions);
  const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, password) => {

      var found_email=0;
      for(var i=0;i<ADMIN.length;i++){
        if(ADMIN[i].email==email){
          found_email=1;
        }
      }
      
      var found_password=0;
      if(found_email){
        const user = await User.findOne({email});
        if(user){
          const auth = await bcrypt.compare(password, user.password);
          if(auth){
            found_password=1;
          }
        }
      }

      if (found_email && found_password) {
        return {
          email : email,
          password: password
        }
      }
      return null
    },
    cookiePassword: 'aman secret',
  })  

  app.use(adminBro.options.roothPath, router);
}


run()
.then(()=>{
  console.log(`Connected : listening at http://localhost:${port}`)
})
.catch(error => console.log(error));

app.locals.status1 = 'a';


app.get('*', checkUser);
app.get('/', (req, res) => {    
    res.redirect('home')
  });
app.get('/home', requireAuth, (req, res) => {res.render('home')});

app.use(authRoutes); 
app.use(homeRoutes);
//app.use('home/', homeRoutes);


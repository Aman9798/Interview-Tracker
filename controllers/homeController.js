const Question = require('../models/Question');
const Topic = require('../models/topic');
const {requireAdmin} = require('../middleware/adminMiddleware');
const Company= require('../models/company');
const Experience= require('../models/experience');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const multer  = require('multer');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const Person = require('../models/person');
//require('dotenv/config');

//var app = require('../app');


module.exports.handleTopicsList = (req, res) => {
  // console.log(req.app.locals.status1);
  // req.app.locals.status1 = 'b';
  // console.log(req.app.locals.status1);
    Topic.find({}, function(err, data){
        if(err) throw err;
        res.render('topic', {top: data});
    });  
};


module.exports.handleQuestionList = (req, res) => {
  var url = req._parsedOriginalUrl.path.split('/')
  var name = url[2];
  var id;
  Topic.find({name: name},function(err, data){
    if(err) throw err;
    id = data[0]._id;
    Question.find({topic: id}, function(err, data1){
      if(err) throw err;
     res.render('question', {ques: data1, name: name});
    })
  })
};


module.exports.handleAddQuestion = async (req, res) => {
  const {topic, name, link, topic_new, logo} = req.body;

  var err = { topic:'', name: '', link: '', topic_new: ''};

  var isAdmin=0;
  isAdmin =  await requireAdmin(req, res);
  isAdmin = Boolean(isAdmin);
  
  var ok = 0;

  if(topic=='topic' && topic_new==''){
    err.topic = 'select a present topic';
    err.topic_new = 'Or select a new topic';
    ok=0;
  }

  if(topic!='topic' && topic_new!=''){
    err.topic = 'select a present or new topic';
    err.topic_new = 'select a present or new topic';
    ok=0;
  }

  var res_topic;
  var new_top = 0;
  if(topic=="topic" && topic_new!=''){
    res_topic=topic_new;
    new_top=1;
    ok=1;
  }
  else if(topic!="topic" && topic_new==''){
    res_topic=topic;
    new_top=0;
    ok=1;
  }

  const ques1 = await Question.findOne({name:name});
  const ques2 = await Question.findOne({link:link});
  const top1 = await Topic.findOne({name: res_topic});
  if(ques1){
    err.name = 'Question with that name already exists';
    ok=0;
  }
  if(ques2){
    err.link = 'Same question already exists';
    ok=0;
  }
  if(top1 && new_top){
    err.topic_new = err.topic_new + ', this topic already exists above'
    ok=0;
  }

  if(ok){
      var Top;
      if(new_top){

              Top = new Topic({
                  name: res_topic,
                  image: logo,
                  verify: isAdmin
              });

              await Top.save(function(err){
                  if(err){console.log(err)}

                  const Ques = new Question({
                    name: name,
                    link: link,
                    topic: Top._id,
                    verify: isAdmin
                  })

                  Ques.save(function(err){
                      if(err){console.log(err)}
                  })
              })
      }else{

              await Topic.find({name: res_topic}, function(err, data){
                  if(err){console.log(err)}
  
                  var id = data[0]._id;
                  
                  var Ques = new Question({
                      name: name,
                      link: link,
                      topic: id,
                      verify: isAdmin
                  })
                  Ques.save(function(err){
                      if(err){console.log(err)}
                  })
  
              })
    
      }
      
      var msg = 'done'
      console.log(msg);
      res.json({ msg: msg })
  }
  else{
      res.json({ error: err });
  }

};

module.exports.handleCompaniesList = (req, res) => {
  req.app.locals.status1 = "";
  //console.log(status1);
  Company.find({}, function(err, data){
      if(err) throw err;
      res.render('companies', {comp: data, msg:''});
  });  
};


module.exports.handleExperienceList = async (req, res) => {
  var url = req._parsedOriginalUrl.path.split('/')
  var name = url[2];
  var id;
  //console.log(__dirname);
 // let pers= new Array();
  await Company.find({name: name},async function(err, data){
    if(err) throw err;
    id = data[0]._id;
    await Experience.find({company: id}, async function(err, data1){
      if(err) throw err;
      console.log("exp",data1);
      let pers= new Array();
      var idd;
      /*await async function() {*/
      //   for(var i=0;i<data1.length;i++){
      //   idd=data1[i].Person;
      //   // await Person.findById(idd, function(err, data2){
      //   await Person.find({_id: idd}, function(err, data2){
      //     if(err) throw err;
      //     pers[i]=data2[0];
      //     console.log("1",data2);
      //   })
      // }//}

      function delay() {
        return new Promise(resolve => setTimeout(resolve, 1500));
      }
      function delay1() {
        return new Promise(resolve => setTimeout(resolve, 500));
      }
     var i=0;
     // await async function processarray(data1){
        for(var item of data1){
          idd = item.Person;
          //await delay();
          console.log(idd);
          await Person.findById(idd, async function(err, data2){
            if(err) throw err;
            await delay1();
            pers[i]=data2;
            i++;
            console.log("1",data2);
          })
        }
    //  }
    await delay();
    console.log("pers",pers);
    res.render('experiences', {exp: data1, person: pers, name:name});
    });
  });
};

/*
module.exports.handleAddExperience = async (req, res) => {
  const {company, name, branch, company_new, year, description} = req.body;

  var err = { company:'', name: '', branch: '', company_new: '', year: '', description: ''};

  var isAdmin=0;
  isAdmin =  await requireAdmin(req, res);
  isAdmin = Boolean(isAdmin);
  console.log(isAdmin);
  
  var ok = 0;

  if(company=='company' && company_new==''){
    err.company = 'select a present company';
    err.company_new = 'Or add a new company';
    ok=0;
  }

  if(company!='company' && company_new!=''){
    err.company = 'select a present or new company';
    err.company_new = 'select a present or new company';
    ok=0;
  }

  var res_company;
  var new_comp = 0;
  if(company=="company" && company_new!=''){
    res_company=company_new;
    new_comp=1;
    ok=1;
  }
  else if(company!="company" && company_new==''){
    res_company=company;
    new_comp=0;
    ok=1;
  }

  if(name==''){
    err.name = 'Enter your name';
    ok=0;
  }
  if(branch==''){
    err.branch = 'Enter your branch';
    ok=0;
  }
  if(year==''){
    err.year = 'Enter the year';
    ok=0;
  }
  if(description==''){
    err.description = 'Enter your experience';
    ok=0;
  }

  const comp1 = await Company.findOne({name :res_company});
  // const ques2 = await Experience.findOne({link:link});
  // const top1 = await Company.findOne({name: res_topic});
  if(comp1  && new_comp){
    err.company_new = err.company_new +', Company with that name already exists';
    ok=0;
    //console.log('ins', ok);
  }
  //console.log('out', ok);
  // if(ques2){
  //   err.link = 'Same company already exists';
  //   ok=0;
  // }
  // if(top1 && new_top){
  //   err.topic_new = err.topic_new + ', this company already exists above'
  //   ok=0;
  // }
console.log('new comp', new_comp);
  if(ok){
     // var Comp;
      if(new_comp){
              //console.log('1');

              const Comp = new Company({
                  name: res_company,
                  verify: isAdmin
              });
              //console.log('2');

              await Comp.save(function(err){
                  if(err){console.log('er_new_comp' , err)}

                  //console.log('3');

                  const Exp = new Experience({
                    name: name,
                    branch: branch,
                    year: year,
                    company: Comp._id,
                    experience: description,
                    verify: isAdmin
                  })
                  //console.log('4');
                  Exp.save(function(err){
                      if(err){console.log('er_new_exp' , err)}
                      //console.log('5');
                  })
                  //console.log('6');
              })
      }else{

              await Company.find({name: res_company}, function(err, data){
                  if(err){console.log(err)}
  
                  var id = data[0]._id;
                  
                  var Exp = new Experience({
                      name: name,
                      branch: branch,
                      year: year,
                      company: id,
                      experience: description,
                      verify: isAdmin
                  })
                  Exp.save(function(err){
                      if(err){console.log(err)}
                  })
  
              })
    
      }
      
      var msg = 'done'
      console.log(msg);
      res.json({ msg: msg });
  }
  else{
      res.json({ error: err });
  }

};
*/

// const imgTypes = ['image/jpeg', 'image/png', 'image/gif'];

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image.webp') {
//       cb(null, true);
//   } else {
//       cb(null, false);
//   }
// }


const storage = multer.diskStorage({
  // destination: (req, file, cb) => {
  //     cb(null, 'uploads');
  // },
  destination: 'uploads/',
  filename: (req, file, cb) => {
      //console.log(file);
      cb(null, file.fieldname + '-' + Date.now()+'.jpg');
  }
});

module.exports.upload = multer({ storage: storage });

module.exports.handleAddExperience = async (req, res, next) => {
  // const {company, company_new, logo, name, branch,  year, description} = req.body;
  const {company, company_new, logo, description} = req.body;

  var err = { company:'', company_new: ''};

  var isAdmin=0;
  isAdmin =  await requireAdmin(req, res);
  isAdmin = Boolean(isAdmin);
  //console.log(isAdmin);
  
  var ok = 0;

  if(company=='company' && company_new==''){
    err.company = 'select a present company';
    err.company_new = 'Or add a new company';
    ok=0;
  }

  if(company!='company' && company_new!=''){
    err.company = 'select a present or new company';
    err.company_new = 'select a present or new company';
    ok=0;
  }

  var res_company;
  var new_comp = 0;
  if(company=="company" && company_new!=''){
    res_company=company_new;
    new_comp=1;
    ok=1;
  }
  else if(company!="company" && company_new==''){
    res_company=company;
    new_comp=0;
    ok=1;
  }

  // if(description==''){
  //   err.description = 'Experience show not be empty';
  //   ok=0;
  // }
/*
  if(name==''){
    err.name = 'Enter your name';
    ok=0;
  }
  if(branch==''){
    err.branch = 'Enter your branch';
    ok=0;
  }
  if(year==''){
    err.year = 'Enter the year';
    ok=0;
  }
  if(description==''){
    err.description = 'Enter your experience';
    ok=0;
  }
*/
  const comp1 = await Company.findOne({name :res_company});
 
  if(comp1  && new_comp){
    err.company_new = err.company_new +', Company with that name already exists';
    ok=0;
    //console.log('ins', ok);
  }

  const token = req.cookies.jwt;
  let pers;
  if(token){
    await jwt.verify(token, 'aman secret', async (err, decodedToken) => {     // checks the token and fires the function in 3rd argument if matches
      if(err){
        console.log(err.message);
      }
      else{
        let user = await User.findById(decodedToken.id);
        pers = user.Person;
      }
      })
  }
  //console.log(pers);
console.log(pers);
//console.log('new comp', new_comp);
  if(ok){
     // var Comp;
      if(new_comp){
              //console.log('1');

              const Comp = new Company({
                  name: res_company,
                  image: logo,
                  verify: isAdmin
              });
              //console.log('2');

              await Comp.save(function(err){
                  if(err){console.log('er_new_comp' , err)}

                  //console.log('3');

                  const Exp = new Experience({
                    Person: pers,
                    company: Comp._id,
                    experience: description,
                    verify: isAdmin,
                    img:{
                      data: fs.readFileSync(req.file.path),
                      contentType : 'image/png'
                    }
                  })

                  Exp.save(function(err){
                      if(err){console.log('er_new_exp' , err)}
                      //console.log('5');
                  })
                  console.log(Exp);
                  //console.log('6');
              })
      }else{

              await Company.find({name: res_company}, function(err, data){
                  if(err){console.log(err)}
  
                  var id = data[0]._id;
                  
                  var Exp = new Experience({
                      Person: pers,
                      company: id,
                      experience: description,
                      verify: isAdmin,
                      img:{
                        data: fs.readFileSync(req.file.path),
                        contentType : 'image/png'
                      }
                  });

                

                  Exp.save(function(err){
                      if(err){console.log(err)}
                  });
                  console.log(Exp);
  
              })
    
      }

      try {
        fs.unlinkSync(req.file.path)
        //file removed
      } catch(err) {
        console.error(err)
      }

      
     
      var msg = 'Saved'
      console.log(msg);
      //res.redirect("/companies");
      res.render('submission', {msg: msg, err: err});
     
  }
  else{
       var msg = 'Not Saved'
       console.log(msg);
       //res.json({ msg: msg });
       res.render('submission', {msg:msg ,err: err});
      
  }
};
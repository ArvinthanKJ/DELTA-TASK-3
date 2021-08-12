delete require.cache['/controllers/controller.js']

const { json } = require("body-parser")
const bodyParser= require("body-parser")
let ejs = require('ejs');
const express=require('express')
//const bcrypt=require('bcrypt')
app.use(bodyParser.urlencoded({
    extended: false
 }))

module.exports=function(app){
 app.use(express.urlencoded({extended:false}))

//Database MongoDB

const mongoose = require('mongoose');
const Members = require('../models/members');
const Teams = require('../models/teams');
mongoose.connect('mongodb://localhost/d3',{useNewUrlParser:true, useUnifiedTopology: true});

mongoose.connection.once('open', function(){
    console.log('Connection has been made with the databse');
    
}).on('error', function(error){
    console.log('Connection error:', error);
});
var p
var userId
let tempId
let currentTeam
var currentPoll
//Routes
var tempTeam
var tempRegister
var options1
var tempPoll
var poll
var flag=0
var flag2=1
    app.get('/',(req,res)=>{
        res.end('root page')
    })

    app.get('/login',(req,res)=>{
        userId=null
        tempId=null
        currentTeam=null
        currentPoll=null
        tempTeam=null
        tempRegister=null
        options1=null
        tempPoll=null
        poll=null
        flag=0
        flag2=1 
        p=null
        res.render('login.ejs')
    })

    app.post('/login',async(req,res)=>{
        var email1=req.body.email
        await Members.findOne({email:email1},function(err,docs){
            if(err)console.log("dsjfbkjwbshjkbwdkjbvhbw")
            
            if (docs==null) {
                console.log('failure')
            
            res.redirect('/error')  
                
            } else
            if(docs.password===req.body.password){
            console.log('Sucess')
                userId=docs._id
            res.redirect('/dashboard')
               
        }
            else{
            console.log('failure')
            
            res.redirect('/login')    
        }
        })
        
             })

    app.get('/register',(req,res)=>{
    
        res.render('register.ejs')
    })

    app.post('/register',async(req,res)=>{
    //const hashedPassword=await bcrypt.hash(req.body.password,10)
    tempRegister=await new Members( {
        name:req.body.name,
        email:req.body.email,
        roll:req.body.roll,
        password:req.body.password
    })
    tempRegister.save()
        
        res.redirect('/login')
    })
    
    app.get('/dashboard',async(req,res)=>{
        if(userId!=null){
        await Members.findOne({_id:userId},function(err,docs){
            if(err)console.log("error");
              
            res.render('dashboard.ejs',{docs:docs})
        })
    }else
    res.redirect('/error')  
})
    app.post('/dashboard',async(req,res)=>{
        currentTeam=req.body.but
        console.log(req.body.but)
        res.redirect('/teamDashboard')
    })

    
    app.get('/teamInvites',async (req,res)=>{var q
        if(userId!=null){
            await Teams.find({},async (err,docs)=>{
                 function filterByID(item) {
                    item.groupMembers.forEach(async(element)=>{q=null
                        console.log(element)
                        console.log(userId)
                        if(JSON.stringify(element)==JSON.stringify(userId)){
                        q=0
                        }
                        if(q!=0)
                        q=1
                    })
                    console.log(q)
                    if(q==0)
                    return false;
                    else if(q==1)
                    return true;
                  }
                  
                  var doc = docs.filter(filterByID)
                  console.log(doc)

            res.render('teamInvites.ejs',{doc:doc,id:userId})
    })}else
        res.redirect('/error')})


    app.post('/teamInvites',async(req,res)=>{
        var j =req.body.j
        var k
        var flag1=0
        console.log(j)
        await Members.findOne({_id:userId},async(err,doc)=>{
            doc.teams.forEach(element => {
                console.log('lk'+element)
                console.log('lk'+j)
                if(element==j){
                  flag1=1 
            } 
            });
            if(flag1==0){
                await Teams.updateOne({_id:j},{$push:{groupMembers:userId}});
               await Members.findOne({_id:userId},(err,docs)=>{
                 k=docs.teamCount+1
                })
         
                await Members.updateOne({_id:userId},{$set:{teamCount:k},$push:{teams:j}});
                 
             }


        });
        res.redirect('/dashboard')
       
    })  
    app.get('/createTeam',(req,res)=>{
        if(userId!=null){
        res.render('createTeam.ejs')
        }else
        res.redirect('/error')  
    })
    app.post('/createTeam',async(req,res)=>{
        tempTeam=new Teams({
            name:req.body.teamName,
            description:req.body.description,
            adminId:userId
        })
        
        tempTeam.save(async function(err,doc){
            if(err)console.log("error");
            tempId=doc.id
        console.log('1'+tempId)  
     await Members.findOne({_id:userId},async(err,docs)=>{
            if(err)console.log("error");
            var x=docs.teamCount+1
            console.log('2'+tempId)
          await   Members.updateOne({_id:userId}, { $set: { teamCount: x },$push: {teams:tempId} });
           await  Teams.updateOne({name:req.body.teamName},{ $push:{groupMembers:userId}});
        
        })
         
            
    }) 
       // tempTeam.adminId.push(userId)
        console.log(tempTeam.name)
        res.redirect('/dashboard')
        
    })  
    app.get('/createPoll',(req,res)=>{
        if(userId!=null){
        res.render('createPoll.ejs',{flag2})
        }else
        res.redirect('/error')  
    })
    app.post('/createPoll',async(req,res)=>{
        var votes1=[{Number,Number}]
        if(req.body.commit){
          for(var i=0;i<flag2;i++){
              votes1[i]={Number:0,Number:0}
          }
          var temp= { 
            question:req.body.question,
            options:req.body.i,
            votes:votes1
         } 
         console.log(temp)
         console.log(currentTeam)
         await Teams.updateOne({_id:currentTeam},{$push:{polls:temp}})
         res.redirect('/teamDashboard')

        }else 
        if(req.body.addOption){
            flag2++
        }else{
        flag2=1
        }
        res.redirect('/createPoll')
    }) 

    app.get('/teamDashboard',async(req,res)=>{
        if(userId!=null){ flag=0
            if(currentTeam!=null){
            
            console.log("1"+currentTeam)
            await Teams.findOne({_id:currentTeam},async function(err,docs){
                if(err)console.log("error");
                console.log(docs)
                poll=docs.polls.length
                if(docs.adminId==userId)flag=1;
               res.render('teamDashboard.ejs',{docs:docs,flag:flag})
            })
        
    }}else
    res.redirect('/error')
})
    app.post('/teamDashboard',async(req,res)=>{
        
        poll=Number(req.body.l)
        console.log(req.body.l)
        console.log(poll)
        console.log("vbbbbb"+currentTeam)
        await Teams.findOne({_id:currentTeam},async function(err,docs){
         console.log("bbbbbb"+docs)   
         console.log("kj"+docs[poll])
         currentPoll=docs.polls[poll]._id

        console.log("9999999"+currentPoll)
        })
        res.redirect('/vote')

    })   
    app.get('/error',(req,res)=>{
       
        res.render('error.ejs')

    })
    app.get('/vote',async(req,res)=>{
        if(userId!=null){
            var j
            p =0
            var t=[]
            await Teams.findOne({_id:currentTeam},async(err,docs)=>{
                console.log("ppppppp"+docs)
                docs.polls.forEach(async function(element){
                    j=0
                    if(JSON.stringify(element._id)==JSON.stringify(currentPoll)){
                       console.log(docs) 
                       t=element
                       j=1
                       if(element.votedIds!=null&&j==1){
                        console.log("zzzzz"+element)
                    element.votedIds.forEach(async function(element1){
                        console.log("yyyyy"+element1)
                        if(JSON.stringify(element1)==JSON.stringify(userId))p=1

                    })}
                    }
                   
                })

            })
        res.render('vote.ejs',{currentPoll:currentPoll,t:t,p:p,flag:flag})
    }else
    res.redirect('/error')})  
    
    app.post('/vote',async (req,res)=>{
        console.log(currentPoll)
        
        if(req.body.end!=null)
       {    console.log("ccccccc"+req.body.end)
       var y=1
        await Teams.updateOne({_id:currentTeam,'polls._id':currentPoll},{$set:{"polls.$.done":y}})}

      if(req.body.fun!=null){
        var c =Number(req.body.fun);console.log(c)
        //var v=(`votes.$.vote`)
        var l=[]
        var k=[]

        await Teams.findOne({_id:currentTeam},async(err,docs)=>{
            console.log("bbbbbbbbbbbbbbbbbb")
            docs.polls.forEach(async(element)=>{
                if(JSON.stringify(element._id)==JSON.stringify(currentPoll)){
                    l=element.votes
                    for(var b=0;b<l.length;b++){
                        k.push(l[b]._id)
                    }
                    console.log(k[c])
                }
            })
            console.log(docs)
            console.log(l)
        })

        //console.log(v)
        await Teams.updateOne({_id:currentTeam,'polls._id':currentPoll},{$push:{"polls.$.votedIds":userId}})
        await Teams.updateOne({_id:currentTeam,'polls._id':currentPoll,'polls.$.votes.$._id':k[c],},{$inc:{"polls.votes.$.vote":1}})
    }
    if(req.body.delete!=null)
    {   console.log(currentPoll)
        await Teams.updateOne({_id:currentTeam},{$pull:{polls:{_id:currentPoll} } })
    }
       
       res.redirect('/dashboard') 
    })  
}

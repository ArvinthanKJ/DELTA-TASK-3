
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
const Polls= require('../models/polls');
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
var temp
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
        temp=null
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
    
    app.get('/dashboard',(req,res)=>{
        if(userId!=null){
        Members.findOne({_id:userId},async (err,docs)=>{
            
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
                 function filterByID(item) {q=[]
                    item.groupMembers.forEach(async(element)=>{
                        console.log(element)
                        console.log(userId)
                        if(JSON.stringify(element)==JSON.stringify(userId)){
                            q.push(0)
                        }else
                        q.push(1)
                    })
                    var t=1
                    console.log("bbbbbbbbbb"+q)
                    for(var u=0;u<q.length;u++){
                        if(q[u]==0){
                        return false;}else
                            t++
                            if(t==q.length+1)
                            return true;
                    }

                    
                  }
                  
                  var doc = docs.filter(filterByID)
                  console.log(doc)

            res.render('teamInvites.ejs',{doc:doc,id:userId})
    })}else
        res.redirect('/error')})


    app.post('/teamInvites',async(req,res)=>{
        var j =req.body.j
        var k
        var q
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
                await Teams.findOneAndUpdate({_id:j},{$push:{groupMembers:userId}},(err,docs)=>{q=docs.name});
               await Members.findOne({_id:userId},(err,docs)=>{
                 k=docs.teamCount+1
                })
                console.log("iiiiiiiiiiiiii"+q)
                await Members.updateOne({_id:userId},{$set:{teamCount:k},$push:{teams:j,teamNames:q}});
                 
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
          await   Members.updateOne({_id:userId}, { $set: { teamCount: x },$push: {teams:tempId,teamNames:req.body.teamName} });
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
        var votes1=[]
        if(req.body.commit){
          for(var i=0;i<flag2;i++){
              votes1[i]={vote:0}
          }
          
          temp= await new Polls({ 
            question:req.body.question,
            options:req.body.i,
            teamID:currentTeam,
            votes:votes1
         } )
         temp.save()
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
            flag2=0
            if(currentTeam!=null){
                await Teams.findOne({_id:currentTeam},async(err,docs)=>{
                if(docs.adminId==userId)flag=1
                })
                await Polls.find({teamID:currentTeam},async(err,docs)=>{
                var doc=Array.from(docs)
                res.render('teamDashboard.ejs',{doc:doc,flag:flag})
            })
            
    }}else
    res.redirect('/error')
})
    app.post('/teamDashboard',async(req,res)=>{
        
        poll=Number(req.body.l)
        await Polls.find({teamID:currentTeam},async(err,docs)=>{
            var doc=Array.from(docs)
         currentPoll=doc[poll]._id

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
            var t
            await Polls.find({_id:currentPoll},async(err,docs)=>{
                console.log("ppppppp"+docs)
                docs.forEach(async function(element){
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
            console.log("oooooooooooooooooo"+p)
            
        res.render('vote.ejs',{currentPoll:currentPoll,t:t,p:p,flag:flag})
    }else
    res.redirect('/error')})  
    
    app.post('/vote',async (req,res)=>{
        console.log("nnnnnnnnnn"+currentPoll)
        
        if(req.body.end!=null)
       {    console.log("ccccccc"+req.body.end)
       var y=1
        await Polls.updateOne({_id:currentPoll},{$set:{"done":y}})}

      if(req.body.fun!=null){
        var c =Number(req.body.fun);console.log(c)
        var v=`votes.$.[${c}].$`
        var b=[]
        console.log(v)
        await Polls.findOne({_id:currentPoll},async(err,docs)=>{
            docs.votes.forEach(async(element)=>{
                b.push(element._id)

            })
            console.log("........."+b)
            b=b[c]
            console.log("........."+b)

        })
        await Polls.updateOne({_id:currentPoll},{$push:{votedIds:userId}})
        await Polls.updateOne({_id:currentPoll,'votes._id':b},{$inc:{'votes.$.vote':1}})
    }
    if(req.body.delete!=null)
    {   console.log(currentPoll)
        await Polls.deleteOne({_id:currentPoll})
    }
       
       res.redirect('/teamDashboard') 
    })  
}

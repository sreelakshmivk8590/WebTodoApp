const express=require('express')
const cors=require('cors')
const mongoose=require('mongoose')
const User=require('./model/userModel')
const Todo=require('./model/todoModel')

const app=express()
app.use(express.json())
app.use(cors())

app.listen(4000, (res, req)=>{
    console.log('Server started.')
})

const connect=async()=>{
    await mongoose.connect('mongodb+srv://HamiYasir:hamihami@hamicluster01.e8thkdr.mongodb.net/?retryWrites=true&w=majority')
    console.log('Database connected.')
}

connect()

//route is used for creating a new user
app.post('/signup', async(req, res)=>{
    console.log('Signup Page reached.[POST]')
    const user=await User.findOne({email:req.body.email})
    if(!user){
        const result=await User.insertMany([req.body])
        res.json(result)
    }else{
        res.json({status:false})
    }
})

//route is used for logging in a user
app.post('/login', async(req, res)=>{
    console.log('Login Page reached.[POST]')
    const coll_user=await User.findOne({email:req.body.email})
    if(coll_user==null){
        res.json({status:false})
    }else if(req.body.password===coll_user.password){
        res.json({status:true, email:req.body.email})
    }else{
        res.json({status:false})
    }
})

//route is used to add a new todo
app.post('/newtodo', async(req, res)=>{
    console.log('newtodo Page reached.[POST]')
    //Executes if both title and description are empty
    if(req.body.title.length==0 && req.body.description.length==0){
        res.json({flag:1})
        console.log("Block 1 executed")
    //Executes if description is empty
    }else if(req.body.title.length>0 && req.body.description.length==0){
        res.json({flag:2})
        console.log("Block 2 executed")
    //Executes if title is empty
    }else if(req.body.title.length==0 && req.body.description.length>0){
        res.json({flag:3})
        console.log("Block 3 executed")
    //Executes both of them are not empty
    }else if(req.body.title.length>0 && req.body.description.length>0){
        res.json({flag:4})
        await Todo.insertMany([req.body])
        console.log("Inserted "+req.body.title+" & "+req.body.description+ " to ToDo list.")
    //Error handling
    }else{
        console.log("Error ocurred while adding the task.")
        console.log("Block 5 executed")
    }
})

//route to identify the todo and retrive it from the database
app.put('/idTodo/:id/:user', async(req, res)=>{
    console.log('edit page reached.[PUT]')
    const task=await Todo.findOne({taskId:req.params.id, user_id:req.params.user})
    res.json({id:task.taskId, title:task.title, description:task.description, mode:'edit'})
})

//route to edit the corresponding todo title,description
app.put('/edit/:currentTaskId/:user', async(req, res)=>{
    console.log('edit page reached.[PUT]')
    const test=await Todo.findOneAndUpdate({taskId:req.params.currentTaskId, user_id:req.params.user}, req.body)
    console.log("Edited and inserted "+req.body.title+" & "+req.body.description+ " to ToDo list.")
    res.json({completed:'true'})
})

//route to mark the todo as completed
app.put('/completed/:id', async(req, res)=>{
    console.log('completed page reached.[PUT]')
    const markedTask=await Todo.findOneAndUpdate({taskId:req.params.id, user_id:req.body.user_id}, {isDone:req.body.isDone})
    res.json(markedTask)
})

//route to delete corresponding todo
app.delete('/delete/:id/:user', async(req, res)=>{
    console.log(`Delete request received for id ${req.params.id} of user ${req.params.user}.[DELETE]`)
    await Todo.findOneAndDelete({taskId:req.params.id, user_id:req.params.user})
    res.json({deletion:'success'})
})

//route to display the todos in the homepage
app.get('/display', async(req, res)=>{
    console.log('display page reached.[GET]')
    const items=await Todo.find({user_id:req.query.user_id})
    res.json(items.map(item=>({taskId:item.taskId, title:item.title, description:item.description, isDone:item.isDone})))
})
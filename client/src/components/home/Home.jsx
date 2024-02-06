import React, { useState, useEffect } from 'react'
import { Box, Card, CardContent, Typography, Button, Input, TextareaAutosize } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

var taskId=1;

const Home=()=>{
    const [email, setEmail]=useState('')
    const [currentTaskId, setCurrentTaskId]=useState('0')
    const [title, setTitle]=useState('')
    const [description, setDescription]=useState('')
    const [todos, setTodos]=useState([])
    const [taskMode, setTaskMode]=useState('add')
    const [isDone, setIsDone]=useState()
    const [btnVariant, setBtnVariant] = useState('contained')
    const navigate=useNavigate()

    useEffect(()=>{
        const userEmail=localStorage.getItem('userEmail')
        if(!userEmail){
            navigate('/login')
        }else{
            setEmail(userEmail)
        }
        loadDisplayAPI()
    }, [title, description])

    const handleTitle=(event)=>{
        setTitle(event.target.value)
    }

    const handleDescription=(event)=>{
        setDescription(event.target.value)
    }

    const logout=()=>{
        localStorage.removeItem('userEmail')
        navigate('/')
    }

    const loadDisplayAPI=async()=>{
        console.log('triggered')
        const result=await axios.get("http://localhost:4000/display", {params:{user_id:localStorage.getItem('userEmail')}})
        setTodos(result.data)
    }

    const submitToDo=async()=>{
        const Todo=await axios.post('http://localhost:4000/newtodo', {taskId:todos.length+1, user_id:localStorage.getItem('userEmail'), title:title, description:description, isDone:isDone})
        if(Todo.data.flag===1){
            alert("Please enter a title and description for the todo")
        }else if(Todo.data.flag===2){
            alert("Please enter a description for the todo")
        }else if(Todo.data.flag===3){
            alert("Please enter a title for the todo")
        }else if(Todo.data.flag===4){
            alert("Todo successfully added to do list!")
        }else{
            alert("Some error occured!:/")
        }
        setTitle('')
        setDescription('')
    }

    function editTask(id){
        const edit=async()=>{
           const identifiedTodo=await axios.put(`http://localhost:4000/idTodo/${id}/${localStorage.getItem('userEmail')}`)
           setTaskMode(identifiedTodo.data.mode)
           taskId=identifiedTodo.data.id
           setCurrentTaskId(identifiedTodo.data.id)
           setTitle(identifiedTodo.data.title)
           setDescription(identifiedTodo.data.description)
        }
        return()=>{
            edit()
        }
    }

    const editTodo=async()=>{
        const currentTodo=await axios.put(`http://localhost:4000/edit/${currentTaskId}/${localStorage.getItem('userEmail')}`, {taskId:currentTaskId, title:title, description:description})
        if(currentTodo.data.completed=='true'){
            alert("Todo successfully edited!")
            setTaskMode('add')
            setTitle('')
            setDescription('')
        }else{
            alert("Todo edit failed :(")
            setTaskMode('add')
            setTitle('')
            setDescription('')
        }
    }

    function markTask(id){
        const markAsCompleted=async()=>{
           await axios.put(`http://localhost:4000/completed/${id}`, {user_id:localStorage.getItem('userEmail'), isDone:true})
           loadDisplayAPI()
        }
        return()=>{
            markAsCompleted()
        }
    }
    
    function deleteTask(id){
        const deleteTodo=async()=>{
            const deletedTodo=await axios.delete(`http://localhost:4000/delete/${id}/${localStorage.getItem('userEmail')}`, {deleted:true})
            if(deletedTodo.data.deletion=='success'){
                taskId=todos.length
            }else{
                alert('Delete failed')
            }
            loadDisplayAPI()
        }
        return()=>{
            deleteTodo()
        }
    }

    const changeColor=(event)=>{
        event.target.style.backgroundColor='#0078FF'
    }
   
    const defaultColorLogout=(event)=>{
        event.target.style.backgroundColor='white'
    }

    const defaultColorSubmit=(event)=>{
        event.target.style.backgroundColor='#282828'
    }

    return(
        <Box>
            <Box sx={{position:'fixed', width:'100vw', height:'10vh', backgroundColor:'black', display:'flex', alignItems:'center' , justifyContent:'space-evenly'}}>
                <Card sx={{backgroundColor:'transparent'}}>
                    <CardContent sx={{display:'flex', justifyContent:'space-evenly', alignItems:'center'}}>  
                        <Typography sx={{color: 'white', marginRight:'80vw', }}>TO-DO LIST</Typography>
                        <Button onMouseOver={changeColor} onMouseOut= {defaultColorLogout} onClick={logout} variant='contained' sx={{backgroundColor:'white', color:'black', marginRight:'30px', fontFamily:'verdana', boxShadow:'2px 2px 10px #4F4F4F', borderRadius: 9, width:120, left:'1vw'}}>Logout</Button>
                    </CardContent>  
                </Card>
            </Box>
        
            <Box sx={{display:'flex', justifyContent:'center', flexDirection:'column', backgroundImage:"url(/bg3.jpg)", backgroundRepeat: 'no-repeat', backgroundSize: 'cover', paddingTop:'7vh'}}>
                <Box sx={{display:'flex', justifyContent:'center', backgroundColor:'transparent', alignItems:'center', minHeight:'30vh'}}>
                    <Card sx={{backgroundColor:'transparent', boxShadow:'none',}}>
                        <CardContent>  
                            <Typography variant='h2' sx={{display:'flex', justifyContent:'center', fontFamily:'helvetica', fontStyle:'bold', fontSize:30, color: 'white'}}>Welcome Home!</Typography>
                            <Typography variant='h3' component='div' sx={{display:'flex', justifyContent:'center', fontSize:20, color: 'white'}}>{email}</Typography>
                        </CardContent>
                    </Card>
                </Box>

                <Box sx={{display:"flex", justifyContent:'space-between', marginTop:'-8vh', backgroundColor: 'transparent'}}>
                    {taskMode=='add'?
                        <Box sx={{display:'flex', justifyContent:'center', backgroundColor:'transparent', alignItems:'center', minHeight:'100vh', marginRight:'5vw', marginLeft: '2vw'}}>
                            <Card sx={{width:'50vw', height:'75vh', backgroundColor:'#242323', borderRadius: 5, marginTop: '-20vh'}}>
                                <CardContent>
                                <Typography variant='h3' sx={{display:'flex', justifyContent:'center', color:'white',backgroundColor:'black',  borderRadius: 3,paddingTop: 1.5, paddingBottom: 1.5, fontStyle: 'bold', fontFamily: 'Verdana', fontSize: 15}}>To-Do List</Typography>
                                    <Input onChange={handleTitle} type='text' value={title} placeholder=' Enter the to do title here:' sx={{backgroundColor:'darkgrey', color:'black',width:'48vw', height:'5vh',marginRight:'1vw', marginTop:'5vh',marginLeft:'0vw', border:'1px solid lightgrey', borderRadius:'8px', paddingLeft:'10px'}}/><br/>
                                    <TextareaAutosize onChange={handleDescription} value={description} minRows={5} placeholder=' Enter the to do here:'
                                        onFocus={(event)=>{
                                            event.target.style.borderBottomColor='#0018D5'
                                        }}

                                        onBlur={(event)=>{
                                            event.target.style.borderBottomColor='lightgrey'
                                        }}

                                        onMouseOver={(event)=>{
                                            event.target.style.borderBottomColor='black'
                                        }}

                                        onMouseOut={(event)=>{
                                            event.target.style.borderBottomColor='lightgrey'
                                        }}
                                    style={{backgroundColor:'darkgrey', width:'47vw', height:'20vh', resize:'none', border:'1px solid lightgrey', borderRadius:'8px', paddingLeft:'10px', paddingRight:'8px', borderBottom:'2px solid lightgrey', transition:'border-color 0.3s', outline:'none', fontFamily:'sans-serif', fontSize:16, color:'black', marginTop: '2vh' }}/><br />
                                    
                                    <Button onClick={submitToDo} variant='contained' onMouseOver={changeColor} onMouseOut= {defaultColorSubmit} sx={{ borderRadius:'20px', width:'120px', backgroundColor:'black', marginTop:'1vh'}}>Add To Do</Button>
                                </CardContent>
                            </Card>
                        </Box>
                        :
                        <Box sx={{display:'flex', justifyContent:'center', backgroundColor:'transparent', alignItems:'center', minHeight:'100vh', marginRight:'5vw', marginLeft: '2vw'}}>
                            <Card sx={{width:'50vw', height:'75vh', backgroundColor:'#242323', borderRadius: 5, marginTop: '-20vh'}}>
                                <CardContent>
                                <Typography variant='h3' sx={{display:'flex', justifyContent:'center', color:'white',backgroundColor:'black',  borderRadius: 3,paddingTop: 1.5, paddingBottom: 1.5, fontStyle: 'bold', fontFamily: 'Verdana', fontSize: 15}}>To-Do List</Typography>
                                    <Input onChange={handleTitle} type='text' value={title} placeholder=' Enter the to do title here:' sx={{backgroundColor:'darkgrey', color:'black',width:'48vw', height:'5vh',marginRight:'1vw', marginTop:'5vh',marginLeft:'0vw', border:'1px solid lightgrey', borderRadius:'8px', paddingLeft:'10px'}}/><br/>
                                    <TextareaAutosize onChange={handleDescription} value={description} minRows={5} placeholder=' Enter the to do here:'       
                                        onFocus={(event)=>{
                                            event.target.style.borderBottomColor='#0018D5'
                                        }}
                                        onBlur={(event)=>{
                                            event.target.style.borderBottomColor='lightgrey'
                                        }}
                                        onMouseOver={(event)=>{
                                            event.target.style.borderBottomColor='black'
                                        }}
                                        onMouseOut={(event)=>{
                                            event.target.style.borderBottomColor='lightgrey'
                                        }}
                                    style={{backgroundColor:'darkgrey', width:'47vw', height:'20vh', resize:'none', border:'1px solid lightgrey', borderRadius:'8px', paddingLeft:'10px', paddingRight:'8px', borderBottom:'2px solid lightgrey', transition:'border-color 0.3s', outline:'none', fontFamily:'sans-serif', fontSize:16, color:'black', marginTop: '2vh' }}/><br />
                                    <Button onClick={editTodo} variant='contained' onMouseOver={changeColor} onMouseOut= {defaultColorSubmit} sx={{ borderRadius:'20px', width:'120px', backgroundColor:'black', marginTop:'1vh'}}>Edit To Do</Button>
                                </CardContent>
                            </Card>
                        </Box>
                    }
                    
                    <Box sx={{display:'flex', justifyContent:'center', backgroundColor:'transparent', alignItems:'center', minHeight:'100vh', marginRight:'5vw', marginTop: '-20vh', marginLeft: '-2vw'}}>
                        <Card sx={{width:'42vw', height:'75vh', borderRadius:5, display:'flex', justifyContent:'center', backgroundImage: "url(/taskpad.jpg)", backgroundRepeat:'no-repeat', backgroundSize:'cover'}}>  
                            <CardContent sx={{backgroundColor:'transparent', boxShadow:'none', overflow:'auto', overflow:'auto', scrollbarWidth:'thick', scrollbarColor:'rgba(51, 153, 255, 0.5) transparent', overflowX:'overlay', width: '100%'}}>
                                <ul>
                                    {todos.map((todo)=>(
                                        <li key={todo.title} style={{backgroundColor:'rgb(253, 253, 253, 0.700)', width:'37vw', fontFamily:'sans-serif', listStyle:'none', borderRadius:'5px', marginLeft:'-1vw'}}>
                                            {todo.isDone==true?<h2 style={{textDecoration:'line-through', paddingLeft:'1vw', paddingTop:'1vh'}}>{todo.title}</h2>:<h2 style={{paddingLeft:'1vw', paddingTop:'1vh'}}>{todo.title}</h2>}
                                            {todo.isDone==true?<p style={{textDecoration:'line-through', paddingLeft:'1vw', paddingTop:'1vh'}}>{todo.description}</p>:<p style={{paddingLeft:'1vw', paddingTop:'0vh'}}>{todo.description}</p>}
                                            {todo.isDone==true?<Button disabled startIcon={<EditIcon/>} variant='contained' sx={{marginLeft:'1vw', marginTop:'1vh', marginRight:'1vw', marginBottom:'1vh', borderRadius:'10px', border:'0px', paddingLeft:'1vw', paddingRight:'1vw', paddingTop:'0.5vh', paddingBottom:'0.5vh'}}>Edit</Button>:<Button onClick={editTask(todo.taskId)} startIcon={<EditIcon/>} variant={btnVariant} sx={{marginLeft:'1vw', marginTop:'1vh',  marginRight:'0.3vw', marginBottom:'1vh', borderRadius:'10px', paddingLeft:'1vw', paddingRight:'1vw', paddingTop:'0.5vh', paddingBottom:'0.5vh'}}>Edit</Button>}
                                            {todo.isDone==true?<Button disabled startIcon={<CheckIcon/>} variant='contained' color='success' sx={{marginLeft:'0.1vw', marginTop:'1vh', marginRight:'1vw', marginBottom:'1vh', borderRadius:'10px', border:'0px', paddingLeft:'1vw', paddingRight:'1vw', paddingTop:'0.5vh', paddingBottom:'0.5vh'}}>Mark as Completed</Button>:<Button onClick={markTask(todo.taskId)} startIcon={<CheckIcon/>} color='success' variant={btnVariant} sx={{marginLeft:'0.1vw', marginTop:'1vh',  marginRight:'0.3vw', marginBottom:'1vh', borderRadius:'10px',  paddingLeft:'1vw', paddingRight:'1vw', paddingTop:'0.5vh', paddingBottom:'0.5vh'}}>Mark as Completed</Button>}
                                            {todo.isDone==true?<Button onClick={deleteTask(todo.taskId)} startIcon={<DeleteIcon/>} variant='outlined' color='error' sx={{marginLeft:'0.1vw', marginTop:'1vh', marginRight:'1vw', marginBottom:'1vh', borderRadius:'10px', paddingLeft:'1vw', paddingRight:'1vw', paddingTop:'0.5vh', paddingBottom:'0.5vh'}}>Delete</Button>:<Button disabled startIcon={<DeleteIcon/>} sx={{marginLeft:'0.1vw', marginTop:'1vh',  marginRight:'0.3vw', marginBottom:'1vh', border:'0px', borderRadius:'10px',  paddingLeft:'1vw', paddingRight:'1vw', paddingTop:'0.5vh', paddingBottom:'0.5vh'}}>Delete</Button>}
                                        </li>
                                    ))} 
                                </ul>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default Home
import React,{ useState, useEffect } from 'react'
import { Box, Paper, Typography, Stack, Button, Input, InputLabel, Card } from '@mui/material'
import { useNavigate} from 'react-router-dom'
import axios from 'axios'

const Signup=()=>{
    const [username,setUsername]=useState('')
    const [email,setEmail]=useState('')
    const [password, setPassword]=useState('')
    const [err,setErr]=useState('')
    const navigate=useNavigate()
     
    useEffect(()=>{
        const userEmail=localStorage.getItem('userEmail')
        if(userEmail){
            navigate('/home')
        }
    }, [])

    const handleUser=(event)=>{
        setUsername(event.target.value)
    }

    const handleEmail=(event)=>{
        setEmail(event.target.value)
    }
    
    const handlePassword=(event)=>{
        setPassword(event.target.value)
    }

    const send=async()=>{
        const result=await axios.post('http://localhost:4000/signup', {username:username, email:email, password:password})
        if(result.data.status===false){
            setErr('Invalid user/User already exists.')
        }else{
            localStorage.setItem('userEmail', result.data[0].email)
            navigate('/home')
        }
    }

    const changeLinkColor = (event) => {
        event.target.style.color='blue'
        event.target.style.textDecoration='underline'
    }

    const resetLinkColor = (event) => {
        event.target.style.color='inherit'
        event.target.style.textDecoration='none'
    }

    const gotoLogin=()=>{
        navigate('/')
    }

    const changeBtnColor=(event)=>{
        event.target.style.backgroundColor= "#0173DC"
    }

    const defaultBtnColor=(event)=>{
        event.target.style.backgroundColor ="black"
    }

    return (
        <Box sx={{display:'flex', justifyContent:'left', alignItems:'center', minHeight:'100vh', backgroundColor:'#282828', backgroundImage:'url(/bg2.jpg)', backgroundSize:'cover', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}>
            <Paper sx={{backgroundColor:'ButtonFace', marginLeft:'5vw', padding:'4vh 5vw 4vh 4vw', borderRadius:'30px'}}>
                <Typography variant='h3' sx={{marginBottom:'30px'}}>Signup</Typography>
                <Stack width='300px' spacing='1vh'>
                    <InputLabel htmlFor='username'>Username</InputLabel>
                    <Input onChange={handleUser} id='username' type='text'/>

                    <InputLabel htmlFor='email'>Email</InputLabel>
                    <Input onChange={handleEmail} id='email' type='text'/>

                    <InputLabel htmlFor='password'>Password</InputLabel>
                    <Input onChange={handlePassword} id='password' type='password'/>

                    <Button onClick={send} variant='contained' onMouseOver={changeBtnColor} onMouseOut={defaultBtnColor} style={{marginTop:'60px', borderRadius:'20px', backgroundColor:'black'}}>Sign Up</Button>
                    
                    <Typography onMouseOver={changeLinkColor} onMouseOut={resetLinkColor} onClick={gotoLogin} variant='h6' sx={{textAlign:'right', fontSize:'15px'}}>Already own an Account? Login</Typography>
                    <Typography variant='h5' sx={{color:'red'}}>{err}</Typography>
                </Stack>
            </Paper>

            <Card sx={{backgroundColor:'#CCCCCC', height:'90vh', margin:'0vh 5vw'}}>&nbsp;</Card>

            <Box sx={{backgroundColor:'rgba(255, 255, 255, 0)'}}>
                <Typography variant='h1' sx={{color:'#F2F2F2', textAlign:'center', fontFamily:'verdana', fontSize:'120px'}}>Welcome to the Signup Page!</Typography>
            </Box>
        </Box>
    )
}

export default Signup
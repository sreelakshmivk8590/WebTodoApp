import React, { useEffect, useState } from 'react'
import { Box, Input, Stack, Button, Typography, Card, InputLabel, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


const Login=()=>{
    const [email, setEmail]=useState('')
    const [password, setPassword]=useState('')
    const [err, setErr]=useState('')
    const navigate=useNavigate()

    useEffect(()=>{
        const userEmail=localStorage.getItem('userEmail')
        if(userEmail){
            navigate('/home')
        }
    }, [])

    const handleEmail=(event)=>{
        setEmail(event.target.value)
    }

    const handlePassword=(event)=>{
        setPassword(event.target.value)
    }

    const send=async()=>{
        const result = await axios.post('http://localhost:4000/login',{email:email, password:password})
        if(result.data.status===false){
            setErr('Invalid user.')
        }else{
            localStorage.setItem('userEmail', result.data.email)
            navigate('/home')
        }
    }

    const gotoSignup=()=>{
        navigate('/signup')
    }

    const changeLinkColor=(event)=>{
        event.target.style.color='blue'
        event.target.style.textDecoration='underline'
    }

    const resetLinkColor=(event)=>{
        event.target.style.color='inherit';
        event.target.style.textDecoration='none'
    }

    const changeBtnColor=(event)=>{
        event.target.style.backgroundColor= "#0173DC"
    }

    const defaultBtnColor=(event)=>{
        event.target.style.backgroundColor ="black"
    }

    return(
        
        <Box sx={{display:'flex', justifyContent:'left', alignItems:'center', minHeight:'100vh', backgroundColor:'#282828', backgroundImage:'url(/bg2.jpg)', backgroundSize:'cover', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}>
            <Paper sx={{backgroundColor:'ButtonFace', padding:'50px', marginLeft:'5vw', padding:'8vh 5vw 8vh 4vw', borderRadius:'30px'}}>
                <Typography variant='h3' sx={{marginBottom:'30px'}}>Login</Typography>
                <Stack width='300px' spacing='1vh'>
                    <InputLabel htmlFor='email'>Email</InputLabel>
                    <Input onChange={handleEmail} id='email' type='text'/>

                    <InputLabel htmlFor='password'>Password</InputLabel>
                    <Input onChange={handlePassword} id='password' type='password'/>

                    <Button onClick={send} variant='contained' onMouseOver={changeBtnColor} onMouseOut={defaultBtnColor} style={{marginTop:'60px', borderRadius:'20px', backgroundColor:'black'}}>Login</Button>
                   
                    <Typography onMouseOver={changeLinkColor} onMouseOut={resetLinkColor} onClick={gotoSignup} variant='h6' sx={{textAlign:'right', fontSize:'15px'}}>No Account? Signup</Typography>
                    <Typography variant='h5' sx={{color:'red'}}>{err}</Typography>
                </Stack>
            </Paper>

            <Card sx={{backgroundColor:'#CCCCCC', height:'90vh', margin:'0 5vw'}}>&nbsp;</Card>

            <Box>
                <Typography variant='h1' sx={{color:'#F2F2F2', textAlign:'center', fontFamily:'verdana', fontSize:'120px'}}>Welcome to the Login Page!</Typography>
            </Box>
        </Box>
    )
}

export default Login
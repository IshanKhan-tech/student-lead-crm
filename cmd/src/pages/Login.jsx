import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";
const Login = () => {

  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {

    e.preventDefault()

    try {

      const res = await axios.post(

        `${import.meta.env.VITE_API_URL}/login`,

        {
          email,
          password
        }

      )

      localStorage.setItem(
        'token',
        res.data.token
      )

      localStorage.setItem(
        'user',
        JSON.stringify(res.data.user)
      )

      navigate('/')

    }

    catch (error) {

      toast.error(
        error.response?.data?.message ||
        'Login Failed'
      )

    }

  }

  return (

    <div className='min-h-screen flex items-center justify-center bg-[#ECE8E0] p-4'>

      <form
        onSubmit={handleLogin}
        className='w-full max-w-[420px] bg-[#F8F6F2] border border-[#DDD6CB] rounded-[32px] p-8 shadow-sm'
      >

        <h2 className='text-4xl font-bold text-[#2B2B2B] mb-2'>
          Welcome Back
        </h2>

        <p className='text-[#777] mb-8'>
          Login to continue
        </p>

        <div className='flex flex-col gap-4'>

          <input
            type="email"
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='h-14 rounded-2xl border border-[#DDD6CB] bg-white px-5 outline-none'
            required
          />

          <input
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='h-14 rounded-2xl border border-[#DDD6CB] bg-white px-5 outline-none'
            required
          />

          <button
            className='h-14 rounded-2xl bg-[#2F3A2F] hover:bg-[#3B473B] transition-all text-white font-semibold mt-2'
          >

            Login

          </button>

        </div>

      </form>

    </div>

  )

}

export default Login
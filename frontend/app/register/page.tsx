'use client'
import RegisterForm from '@/components/register/RegisterForm'
import './registerpage.css'

const register =() => {
  return (
    <div className='register_container'>
      <div className='register_form'>
         <img
          src="https://imgs.search.brave.com/gtEqWi7RJOX_WMq88-Soryp4wbWAqsE7fUIOIAnbBMg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMTcv/Mzk2LzgxNC9zbWFs/bC9uZXRmbGl4LW1v/YmlsZS1hcHBsaWNh/dGlvbi1sb2dvLWZy/ZWUtcG5nLnBuZw"
          alt="Logo" className='logo'
        />
        <div>
          <RegisterForm/>
        </div>
      </div>
    </div>
  )
}

export default register


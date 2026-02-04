'use client'
import RegisterForm from '@/components/register/RegisterForm'
import './registerpage.css'

const register =() => {
  return (
    <div className='register_container'>
      <div className='register_form'>
         <img
          src="https://cdn.sstatic.net/Sites/stackoverflow/company/img/logos/so/so-icon.svg"
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


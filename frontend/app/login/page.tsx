'use client';
import LoginForm from '../../components/Login/LoginForm';
import './login.css';

const login = () => {
  return (
    <div className='login_container'>
      <div className='login_form'>
         <img
          src="https://cdn.sstatic.net/Sites/stackoverflow/company/img/logos/so/so-icon.svg"
          alt="Logo" className='logo'
        />
        <div>
          <LoginForm/>
        </div>
      
      </div>
    </div>
  )
}

export default login
import { useState,useContext } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { Button,TextField,Backdrop,Alert,CircularProgress } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import style from './signUp.module.css'

function SignUp () {
  const [inputValues, setInputValues] = useState({
    name: '',
    email:'',
    password: '',
    confirmpassword:'',
  });
  const [inputErrors, setInputErrors] = useState({
    name: false,
    email:false,
    passwords: false,
    confirmpasswords:false,
    nameErrorMessage:'',
    emailErrorMessage:'',
    passwordsErrorMessage:'',
    confirmpasswordsErrorMessage:'',
  });
  const navigate = useNavigate();
  const { data,mutate,isSuccess,isLoading } = useMutation({
    mutationFn: signUp,
    onSuccess: () => { 
      setTimeout(() => navigate('/postList'),1000); 
    }//接受回調成功發送以後執行操作
  })

  function setInputField(event) {
    const { name, value } = event.target;

    if ( value.trim() !== '' ) {
      setInputErrors({
        ...inputErrors,
        [name]: false,
        [`${name}ErrorMessage`]: '',
      });
    };

    setInputValues({
      ...inputValues,
      [name]: value,
    });
  }

  async function signUpHandler(event) {
    event.preventDefault();

    if ( inputValues.name === '' ) {
      setInputErrors({
        ...inputErrors,
        name: true,
        nameErrorMessage: '輸入欄位不得為空白'
      });
      return
    } else if ( inputValues.email === '' ) {
      setInputErrors({
        ...inputErrors,
        email:true,
        emailErrorMessage: '輸入欄位不得為空白'
      });
      return
    } else if ( inputValues.password === '' ) {
      setInputErrors({
        ...inputErrors,
        password:true,
        passwordErrorMessage: '輸入欄位不得為空白'
      });
      return
    } else if ( inputValues.confirmpassword === '' ) {
      setInputErrors({
        ...inputErrors,
        confirmpassword:true,
        confirmpasswordErrorMessage: '輸入欄位不得為空白'
      });
      return
    };

    try {
      mutate({ signUpData:inputValues })
    } catch (err) {
      console.error('Error signUp data:', err);
    }

  }

  return (
    <>
    <div className={style.formContainer}>
      <form  className={style.logInformstyle} onSubmit={signUpHandler}>
        <div className={style.formInputContainer}>
        <TextField
            label="User Name"
            color="primary"
            focused
            variant="standard"
            margin="normal"
            error={inputErrors.name}
            helperText={ inputErrors.name ? inputErrors.nameErrorMessage : '請輸入用戶名稱'}
            //
            name="name"
            value={inputValues.name}
            onChange={(event) => setInputField(event)}
            onBlur={() => {
              if (inputValues.name === '') {
                setInputErrors({
                  ...inputErrors,
                  name: true,
                  nameErrorMessage: '輸入欄位不得為空白'
                })}}
            }
          />

          <TextField
            label="E-mail"
            color="primary"
            focused
            variant="standard"
            margin="normal"
            error={inputErrors.email}
            helperText={ inputErrors.email ? inputErrors.emailErrorMessage : '請輸入電子郵件'}
            //
            name="email"
            value={inputValues.email}
            onChange={(event) => setInputField(event)}
            onBlur={() => {
              if (inputValues.email === '') {
                setInputErrors({
                  ...inputErrors,
                  email: true,
                  emailErrorMessage: '輸入欄位不得為空白'
                })}}
            }
          />

        <TextField
          label="Passwords"
          color="primary"
          focused
          variant="standard"
          margin="normal"
          error={inputErrors.password}
          helperText={ inputErrors.password ? inputErrors.passwordErrorMessage : '請輸入密碼'}
          //
          name="password"
          type='password'
          value={inputValues.password}
          onChange={(event) => setInputField(event)}
          onBlur={() => {
            if (inputValues.password === '') {
              setInputErrors({
                ...inputErrors,
                password: true,
                passwordErrorMessage: '輸入欄位不得為空白'
              })}}
          }
        />

        <TextField
          label="Confirm password"
          color="primary"
          focused
          variant="standard"
          margin="normal"
          error={inputErrors.confirmpassword}
          helperText={ inputErrors.confirmpassword ? inputErrors.confirmpasswordErrorMessage : '再次輸入密碼'}
          //
          name="confirmpassword"
          type='password'
          value={inputValues.confirmpassword}
          onChange={(event) => setInputField(event)}
          onBlur={() => {
            if (inputValues.confirmpasswords === '') {
              setInputErrors({
                ...inputErrors,
                confirmpassword: true,
                confirmpasswordErrorMessage: '輸入欄位不得為空白'
              })}
            if (inputValues.confirmpassword !== inputValues.password) {
              setInputErrors({
                ...inputErrors,
                confirmpassword: true,
                confirmpasswordErrorMessage: '與輸入密碼不相符'
              })}
          }
          }
        />
        </div>
        <Button 
          className={style.formSubmitBtn}
          type='submit' 
          variant="contained"
        >
          Sign Up
        </Button>
      </form>
    </div>
    </>
  )
}

export default SignUp

export const signUp = async ({ signUpData }) => {
  const response = await fetch('https://post-list-backend.vercel.app/api/users/signup',{
    method: 'POST',
    headers: {
      'Content-Type':'application/json',//讓後端接收JSON數據並parsing
    },
    body: JSON.stringify({
      name: signUpData.name,
      email: signUpData.email,
      password: signUpData.password
    })
  });

  if (!response.ok) {
    throw new Error('Failed to post data')
  };

  return response.json();
}
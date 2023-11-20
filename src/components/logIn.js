import { useState,useContext,useEffect } from 'react';
import { Context } from '../context/context';
import { useMutation } from 'react-query';
import { useNavigate,Link } from 'react-router-dom';
import { Button,TextField,Backdrop,Alert,CircularProgress } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import style from './logIn.module.css'

function Login () {
  const Ctx = useContext(Context)
  const [inputValues, setInputValues] = useState({
    email: '',
    password: '',
  });
  const [inputErrors, setInputErrors] = useState({
    email: false,
    password: false,
    emailErrorMessage:'',
    passwordErrorMessage:'',
  });
  const navigate = useNavigate();
  const { data,mutate,isSuccess,isLoading,error } = useMutation({
    mutationFn: logIn,
    onSuccess: () => { 
      setTimeout(() => navigate('/postList'),1000); 
    },//接受回調成功發送以後執行操作
    onError: () => {
      if (error) {
        setInputErrors({
          ...inputErrors,
          email: true,
          emailErrorMessage: '請輸入有效電子郵件',
        })
      }
    },
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
  };

  async function logInHandler(event) {
    event.preventDefault();

    if ( inputValues.email === '' ) {
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
    };

    try {
      mutate({ logInData:inputValues })
    } catch (err) {
      console.error('Error signUp data:', err);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      Ctx.setToken(data.token)
      Ctx.setUser(data.name)
      Ctx.setUserId(data.userId)
    }
  }, [isSuccess]);

  return (
    <>
    { isLoading &&     
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <CircularProgress />
    </Backdrop>}
    {isSuccess &&  
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <Alert severity="success">成功登入！</Alert>
    </Backdrop>}


    <div className={style.formContainer}>
      <form  className={style.logInformstyle} onSubmit={logInHandler}>
        <div className={style.formInputContainer}>
        <TextField
            label="Email"
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
                  emailErrorMessage: '用戶名稱不得為空白'
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
                passwordErrorMessage: '密碼不得為空白'
              })}}
          }
        />
        <Button 
          className={style.formSubmitBtn}
          type='submit' 
          variant="contained"
        >
          Log In
        </Button>
        </div>

        <section className={style.signUpSection}>
          <p className={style.signUpSectionText}>Don't have an account ?</p>
          <div className={style.signUpButtons}>
            <Button 
            className={style.signUpButton}
            type='button' 
            variant="contained"
            >
              <Link to='/signUp'>
                Sign Up
              </Link>
            </Button>
            <span>or</span>
            <button className={style.signUpWithGoogleButton}>Log in with<GoogleIcon style={{marginLeft:'5px'}}/></button>
          </div>

        </section>
      </form>
    </div>
    </>
  );
};

export default Login

export const logIn = async ({ logInData }) => {
  const response = await fetch('https://post-list-backend.vercel.app/api/users/login',{
    method: 'POST',
    headers: {
      'Content-Type':'application/json',//讓後端接收JSON數據並parsing
    },
    body: JSON.stringify({
      email: logInData.email,
      password: logInData.password
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to log in, status ${response.status}`)
  };
  const userData = await response.json();
  console.log('Hello user ',userData.name)
  console.log(userData)
  return userData;
}
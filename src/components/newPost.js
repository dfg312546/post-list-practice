import { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { Button,TextField,Backdrop,Alert,CircularProgress } from '@mui/material';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import style from './newPost.module.css'
import { Context } from '../context/context';


function NewPost () {
  const Ctx = useContext(Context);
  const [inputValues, setInputValues] = useState({
    title: '',
    description: '',
    date: dayjs(),
  });
  const navigate = useNavigate();
  const { mutate,isSuccess,isLoading } = useMutation({
    mutationFn: sendNewPost,
    onSuccess: () => { 
      setTimeout(() => navigate('/postList'),1000); 
    }//接受回調成功發送以後執行操作
  })

  const [inputErrors, setInputErrors] = useState({
    title: false,
    description: false,
    titleErrorMessage:'',
    descriptionErrorMessage:'',
  });

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

  function checkTitleInput (event,maxLength) {
    setInputField(event);
    if ( event.target.value.length > maxLength )  {
      setInputErrors({
        ...inputErrors,
        title: true,
        titleErrorMessage:'字數不得超過20位'
      })
    };
  }

  async function submitHandler(event) {
    event.preventDefault();
    if ( inputValues.title === '' ) {
      setInputErrors({
        ...inputErrors,
        title: true,
        titleErrorMessage: '標題不得為空白'
      });
      return
    } else if ( inputValues.description === '' ) {
      setInputErrors({
        ...inputErrors,
        description:true,
        descriptionErrorMessage: '內容不得為空白'
      });
      return
    };

    try {
      mutate({ newPost: inputValues });//只接受單一變數或物件
      const updatedSubmittedPost = [...Ctx.submittedPost, inputValues];
      console.log(updatedSubmittedPost)
      Ctx.setSubmittedPost(updatedSubmittedPost);

      setInputValues({
        title: '',
        description: '',
        date: dayjs(),
      });

      
    } catch (error) {
      console.error('Error posting data:', error);
    }
  }

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
      <Alert severity="success">成功發送！</Alert>
    </Backdrop>}
    
    <div className={style.formContainer}>
      <form onSubmit={submitHandler} className={style.formstyle}>
        <div className={style.formInputContainer}>
          <TextField
            label="Title"
            color="primary"
            focused
            variant="standard"
            margin="normal"
            error={inputErrors.title}
            helperText={inputErrors.title ? inputErrors.titleErrorMessage : '請輸入標題'}
            //
            name="title"
            value={inputValues.title}
            onChange={(event) => checkTitleInput(event,20)}
            onBlur={() => {
              if (inputValues.title === '') {
                setInputErrors({
                  ...inputErrors,
                  title: true,
                  titleErrorMessage: '標題不得為空白'
                })}}
            }
          />
          <TextField 
            label="Description"
            color="primary"
            focused
            variant="standard"
            margin="normal"
            multiline
            maxRows={4}
            sx={{ width: '300px' }}
            error={inputErrors.description}
            helperText={inputErrors.description ? inputErrors.descriptionErrorMessage : '請輸入內容'}
            //
            name="description"
            value={inputValues.description}
            onChange={(event) => {
              setInputField(event);
            }}
            onBlur={() => {
              if (inputValues.description === '') {
                setInputErrors({
                  ...inputErrors,
                  description:true,
                  descriptionErrorMessage: '內容不得為空白'
                })}}
            }
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker 
              value={inputValues.date} 
              onChange={(newDate) => setInputValues({ ...inputValues, date: newDate })}
            />
          </LocalizationProvider>
        </div>



        <Button 
          className={style.formSubmitBtn}
          type='submit' 
          variant="contained"
        >
          Submit
        </Button>
      </form>
    </div>
    </>
  )
}

export default NewPost;

export const sendNewPost = async ({ newPost }) => {
  const response = await fetch('https://post-list-backend.vercel.app/api/posts',{
    method: 'POST',
    headers: {
      'content-type':'application/json',//讓後端接收JSON數據並parsing
    },
    body: JSON.stringify({
      title: newPost.title,
      description: newPost.description,
      date: newPost.date,
    })
  });

  if (!response.ok) {
    throw new Error('Failed to post data')
  };

  return response.json();
};
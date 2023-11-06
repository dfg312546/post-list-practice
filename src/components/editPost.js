import { useState,useContext,useEffect } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { useMutation,useQuery } from 'react-query';
import { Button,TextField,Backdrop,Alert,CircularProgress } from '@mui/material';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import style from './editPost.module.css'
import { Context } from '../context/context';

function EditPost() {
  const Ctx = useContext(Context);
  const { id } = useParams();
  const result = useQuery(['post-id',id], () => fetchPost(id));
  const [inputValues, setInputValues] = useState({
    title: '',
    description: '',
    date: dayjs(),
  });

  useEffect(() => {
    if (result.isSuccess) {
      setInputValues({
        title: result.data[0].title,
        description: result.data[0].description,
        date: dayjs(),
      });
    }
  }, [result.data, result.status,id]);



  const navigate = useNavigate();
  const { mutate,isSuccess,isLoading } = useMutation({
    mutationFn: editPost,
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
    setInputValues({
      ...inputValues,
      [name]: value,
    });
  }

  function checkTitleInput (event,maxLength) {
    if ( event.target.value.length > maxLength )  {
      setInputErrors({
        ...inputErrors,
        title: true,
        titleErrorMessage:'字數不得超過20位'
      })
    } else {
      setInputErrors({
        ...inputErrors,
        title: false,
      })
    };

    setInputField(event);
  }

  async function submitHandler(event) {
    console.log(result.data)
    event.preventDefault();
    if (inputValues.title === '' || inputValues.description === '') {
      return
    };

    try {
      mutate({
        id: id,
        updatedData: inputValues
      });

      const updatedSubmittedPost = Ctx.submittedPost.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            title: inputValues.title,
            description: inputValues.description,
            date: inputValues.date,
          };
        }
        return post;
      });

      Ctx.setSubmittedPost(updatedSubmittedPost);
      
    } catch (error) {
      console.error('Error posting data:', error);
    } 
  }
  


  return (
    <>
    { result.isLoading && 
      <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
      >
        <CircularProgress />
      </Backdrop> }

      { isLoading && 
      <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
      >
        <CircularProgress />
      </Backdrop> }

    {isSuccess &&  
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <Alert severity="success">修改成功！</Alert>
    </Backdrop>}
    
    {result.isSuccess && 
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
              setInputField(event)
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
          Edit
        </Button>
      </form>
    </div>}
    </>
  )
}

export default EditPost;

const fetchPost = async (id) => {
  const response = await fetch(`https://post-list-backend.vercel.app/api/posts/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch data')
  };

  const data = await response.json();

  const dataArray = Object.keys(data).map((key) => data[key]);
  return  dataArray;
}

const editPost = async ({ id,updatedData }) => {
  const response = await fetch(`https://post-list-backend.vercel.app/api/posts/${id}`,{
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json', // 根据服务器要求设置正确的内容类型
    },
    body: JSON.stringify({
      title: updatedData.title,
      description: updatedData.description,
      date: updatedData.date,
      id: id,
    }),
  });

  console.log(id,updatedData)

  return response.json();
}
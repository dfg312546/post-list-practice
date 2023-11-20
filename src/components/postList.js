import { useContext,useEffect,useState } from "react";
import { useQuery,useQueryClient } from "react-query";
import { useNavigate } from 'react-router-dom';
import { Context } from "../context/context";
import { CircularProgress,Backdrop } from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import dayjs from "dayjs";
import style from './postList.module.css'


function PostList() {
  const Ctx = useContext(Context);
  const [isDeleting, setIsDeleting] = useState(false);
  const result = useQuery(['queryKey-post'], fetchPosts);
  const queryClient = useQueryClient();
  queryClient.invalidateQueries(['queryKey-post']);//讓組件每次渲染時，都重新query['queryKey-post']
  const navigate = useNavigate();
  

  useEffect(() => {
    if (result.isSuccess) {
      console.log(result.data)
      const formattedData = result.data[0].map((item) => ({
        ...item,
        name: item.name,
        title: item.title,
        description: item.description,
        date: dayjs(item.date) // 將日期字符串轉換為 dayjs 對象
      }));
      const sortedPosts = [...formattedData].sort((a, b) => b.date - a.date);      
      Ctx.setSubmittedPost(sortedPosts);
    }
  }, [result.data, result.status]);

  const deletePost = async (id) => {
    setIsDeleting(true);
    let response;
    try {
      response = await fetch(`https://post-list-backend.vercel.app/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${Ctx.token}`,
        },
      });
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setIsDeleting(false);
    }
  
    return response
  }
  

  const handleEdit = (id) => {
    navigate(`/editPost/${id}`);
  }

  return (
    <>
      { isDeleting && 
        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
        >
          <CircularProgress />
        </Backdrop> }
      { result.isLoading ? 
        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
        >
          <CircularProgress />
        </Backdrop> : 
        <ul className={style.postListUl}>
        {Ctx.submittedPost.map((item) => (
          <li
            key={item.date.format('YY-MM-DD HH:mm:ss')}
            className={style.postListLi}
          >
            <h2 className={style.postListTitle}>{item.title}</h2>
            <p className={style.postListContent}>{item.description}</p>
            <footer className={style.postListFooter}>
              <span className={style.postListTime}>
                Time: {item.date.format('YY-MM-DD HH:mm:ss')}
              </span>
              <span className={style.postListTime}>
                Created by: {item.name}
              </span>
              <div className={style.postListFooterBtnSection}>
                <CreateOutlinedIcon className={style.postListEditBtn} onClick={() => handleEdit(item.id)}/>
                <DeleteOutlinedIcon className={style.postListDeleteBtn} onClick={() => deletePost(item.id)} />
              </div>
            </footer>
          </li>
        ))}
        </ul>
      }
    </>
  );

}

export default PostList;


const fetchPosts = async () => {
  const response = await fetch('https://post-list-backend.vercel.app/api/posts');

  if (!response.ok) {
    throw new Error('Failed to fetch data')
  };

  const data = await response.json();

  const dataArray = Object.keys(data).map((key) => data[key]);
  return  dataArray;
}


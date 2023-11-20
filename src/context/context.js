import { createContext,useState } from 'react';

export const Context = createContext({
  submittedPost:[],
  setSubmittedPost:() => {},
  token:null,
  setToken:() => {},
  user:'',
  setUser:() => {},
  userId: '',
  setUserId: () => {},
});

function ContextProvider(props) {
  const [submittedPost,setSubmittedPost] = useState([])
  const [token,setToken] = useState('')
  const [user,setUser] = useState('')
  const [userId,setUserId] = useState('')

  const context = {
    submittedPost: submittedPost,
    setSubmittedPost: setSubmittedPost,
    token: token,
    setToken: setToken,
    user: user,
    setUser: setUser,
    userId: userId,
    setUserId: setUserId,
  }

  return (
    <>
      <Context.Provider value={context}>
        {props.children}
      </Context.Provider>
    </>
  )
}

export default ContextProvider;
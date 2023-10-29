import { createContext,useState } from 'react';

export const Context = createContext({
  submittedPost:[],
  setSubmittedPost:() => {},
});

function ContextProvider(props) {
  const [submittedPost,setSubmittedPost] = useState([])

  const context = {
    submittedPost: submittedPost,
    setSubmittedPost: setSubmittedPost,
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
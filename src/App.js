import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import ContextProvider from './context/context';
import RootPage from './components/rootPage';
import NewPost from './components/newPost';
import PostList from './components/postList';
import EditPost from './components/editPost';
import Login from './components/logIn';
import SignUp from './components/signUp';

const router = createBrowserRouter([{
  path: '/',
  element: <RootPage />,
  children: [
    { path: '/' ,element: <NewPost />},
    { path: '/postList' ,element: <PostList />},
    { path: '/editPost/:id',element: <EditPost />},
    { path: '/logIn' ,element: <Login />},
    { path: '/signUp' ,element: <SignUp />},
  ]
}]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ContextProvider>
        <RouterProvider router={router} />
      </ContextProvider>
    </QueryClientProvider>
  );
}

export default App;

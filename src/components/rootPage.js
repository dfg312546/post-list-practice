import { Outlet,Link } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';

function RootPage () {
  return (
    <>
    <MainNavigation />
    <main>
      <Outlet />
    </main>
    </>
  )
};

export default RootPage;

export const MainNavigation = () => {
  const linkStyle = {
    textDecoration: 'none',
    fontWeight: 'bold',
    color: '#1976D2',
    margin: '5px',
  }
  const navStyle = {
    backgroundColor: 'rgba(99, 164, 255, 0.2)',
    display: 'flex',
    justifyContent: 'center',
    padding: '10px',
  }
  return (
    <Breadcrumbs style={navStyle}>
      <Link style={linkStyle} to='/'>Home</Link>
      <Link style={linkStyle} to='/postList'>Post List</Link>
    </Breadcrumbs>
  )
}
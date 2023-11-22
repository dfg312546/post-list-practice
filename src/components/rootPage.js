import { useContext,useEffect } from 'react';
import { Context } from '../context/context';
import { Outlet,Link } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import style from './rootPage.module.css'

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
  const Ctx = useContext(Context);
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData && storedData.token) {
      Ctx.setToken(storedData.token);
      Ctx.setUser(storedData.name);
      Ctx.setUserId(storedData.userId);
    }
  }, []);

  function logOut() {
    Ctx.setToken(null);
    Ctx.setUserId(null);
    Ctx.setUser(null);
    localStorage.removeItem('userData');
  }

  return (
    <nav className={style.navContainer}>
    <span className={style.logOutStyle} onClick={logOut}>
      Log out
    </span>
    <Breadcrumbs className={style.navStyle}>
      <Link className={style.linkStyle} to='/'>Home</Link>
      <Link className={style.linkStyle} to='/postList'>Post List</Link>
    </Breadcrumbs>
    <span className={style.logInStyle}>
      {Ctx.user ? <span className={style.logInTextStyle}>Hello! {Ctx.user}</span> : <Link to='/logIn' className={style.logInTextStyle}>Log in</Link>}
    </span>
    
    </nav>

  )
}
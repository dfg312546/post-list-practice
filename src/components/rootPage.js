import { useState,useContext } from 'react';
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
  return (
    <nav className={style.navContainer}>
    <Breadcrumbs className={style.navStyle}>
      <Link className={style.linkStyle} to='/'>Home</Link>
      <Link className={style.linkStyle} to='/postList'>Post List</Link>
    </Breadcrumbs>
    <span className={style.logInStyle}>
      {Ctx.user ? `Hello! ${Ctx.user}` : <Link to='/logIn'>Log in</Link>}
    </span>
    
    </nav>

  )
}
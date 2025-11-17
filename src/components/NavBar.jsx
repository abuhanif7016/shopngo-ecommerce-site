import React from 'react';

const NavBar = () => {
    const link = (
        <>
            <li><a onClick={() => window.location.href = '/'} className="hover:text-blue-500 rounded-2xl cursor-pointer">Home</a></li>
            <li><a onClick={() => window.location.href = '/electronics'} className="hover:text-blue-500 rounded-2xl cursor-pointer">Electronics</a></li>
            <li><a onClick={() => window.location.href = '/apparel'} className="hover:text-blue-500 rounded-2xl cursor-pointer">Apparel</a></li>
            <li><a onClick={() => window.location.href = '/beauty'} className="hover:text-blue-500 rounded-2xl cursor-pointer">Beauty</a></li>
            <li><a onClick={() => window.location.href = '/bags'} className="hover:text-blue-500 rounded-2xl cursor-pointer">Bags</a></li>
            <li><a className="hover:text-blue-500 rounded-2xl cursor-pointer">About</a></li>
            <li><a className="hover:text-blue-500 rounded-2xl cursor-pointer">Services</a></li>
            <li><a className="hover:text-blue-500 rounded-2xl cursor-pointer">Contact</a></li>
        </>
    );    return (
        <div>
            <div className="navbar bg-base-100 shadow-sm fixed top-0 z-50">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
      </div>
      <ul
        tabIndex="-1"
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        {link}
      </ul>
    </div>
    <a onClick={() => window.location.href = '/'} className="btn btn-ghost cursor-pointer hover:cursor-pointer text-xl rounded-2xl hover:text-blue-500">ShopNGo</a>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
        {link}
    </ul>
  </div>
  <div className="navbar-end">
    <a className="btn hover:text-blue-500">Log In</a>
  </div>
</div>
        </div>
    );
};

export default NavBar;
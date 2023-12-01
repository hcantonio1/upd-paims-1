import * as React from 'react'
import { Link } from 'gatsby'



const Navbar = () => {
  return (
    <nav>
      <div className='links'>
        <Link to="/">Home</Link>
        <Link to="/inventory">Inventory</Link>
        <Link to="/about">About</Link>
        <Link to="/submitform">Submit Form</Link>
      </div>
    </nav>
  );
}


export default Navbar
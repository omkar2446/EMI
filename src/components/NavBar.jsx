import React from 'react'
import { NavLink } from 'react-router-dom'

export default function NavBar() {
  return (
    <nav className="nav">
      <div className="logo">EMI Calculator</div>
      <ul>
        <li>
          <NavLink to="/" end>
            Home
          </NavLink>
        </li>
       
      </ul>
    </nav>
  )
}

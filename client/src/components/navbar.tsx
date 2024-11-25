import { Link } from "react-router";

function Navbar () {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">HOME</Link>
        </li>
        <li>
          <Link to="/report">REPORT</Link>
        </li>
        <li>
          <Link to="/chat">CHAT</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar;
import { Link } from "react-router";

function Navbar () {
  return (
    <nav className="flex bg-dark text-gray-200 p-3">
          <h1 className="text-xl font-bold mx-5">AQUEOUS</h1>
      <ul className="flex ml-12">
        <li className="mx-4">
          <Link to="/">HOME</Link>
        </li>
        <li className="mx-4">
          <Link to="/report">REPORT</Link>
        </li>
        <li className="mx-4">
          <Link to="/chat">CHAT</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar;
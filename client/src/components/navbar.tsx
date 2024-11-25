import { Link } from "react-router";

function Navbar ({ isReporter, setIsReporter }: { isReporter: boolean; setIsReporter: (value: boolean) => void }) {
  return (
    <nav className="flex bg-dark text-gray-200 p-4 items-center justify-between">
          <h1 className="text-xl font-bold mx-5">AQUEOUS</h1>
      <ul className="flex mr-auto">
        <li className="mx-4">
          <Link to="/">HOME</Link>
        </li>
        {isReporter ? 
         <li className="mx-4">
         <Link to="/report">REPORT</Link>
       </li> :
        <li className="mx-4">
        <Link to="/incidents">INCIDENTS</Link>
      </li>}
        <li className="mx-4">
          <Link to="/chat">CHAT</Link>
        </li>
      </ul>
          <button
            className="bg-light text-dark p-2 rounded-lg shadow-emerald-50 "
            onClick={() => setIsReporter(!isReporter)}
          >
            SWITCH TO {isReporter ? 'RESPONDER' : 'REPORTER'}
          </button>
    </nav>
  )
}

export default Navbar;
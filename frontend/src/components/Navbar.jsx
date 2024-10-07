import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const BACKEND_URL = "http://localhost:8888"; 

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-emerald-400 items-center space-x-2 flex"
          >
            VearShot
          </Link>

          <nav className="flex flex-wrap items-center gap-4">
            <Link
              to={"/"}
              className="text-gray-300 hover:text-emerald-400 transition duration-300
					 ease-in-out"
            >
              Home
            </Link>
            <Link to="/about" className="text-white mx-4">
              About
            </Link>
			<Link to="/services" className="text-white mx-4">
              Services
            </Link>
            <Link to="/contact" className="text-white">
              Contact
            </Link>
            {user ? (
              <>
                
                <Link
                  to={
                    user.role === "admin" ? "/dashboard" : "/client/dashboard"
                  }
                  className="text-white mx-4"
                >
					<img src={`${BACKEND_URL}/uploads/${user.profileImage}`} className="w-9 object-cover object-center rounded-full inline-block"/>
                  <span className="text-white mx-4">{user.name}</span>
                </Link>
              </>
            ) : (
              <Link to="/login" className="text-white">
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
export default Navbar;

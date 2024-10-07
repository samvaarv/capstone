import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="text-center mt-10">
      <h1 className="text-4xl font-bold mb-4">Welcome to Our Site</h1>
      <nav className="space-x-4">
        <Link to="/" className="text-blue-500 hover:underline">
          Home
        </Link>
        <Link to="/about" className="text-blue-500 hover:underline">
          About
        </Link>
        <Link to="/contact" className="text-blue-500 hover:underline">
          Contact
        </Link>
        <Link to="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </nav>
    </div>
  );
};

export default HomePage;

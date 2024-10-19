import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto"
    >
      <div className="p-10 md:py-20">
        <h2 className="text-3xl md:text-5xl font-bold mb-8 text-center font-main tracking-widest">
          LOGIN
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col justify-center">
          <Input
            icon={Mail}
            label="EMAIL"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            icon={Lock}
            label="PASSWORD"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-dark traking-widest underline underline-offset-2 hover:no-underline transition"
            >
              Forgot password?
            </Link>
          </div>
          {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}

          <button
            className="w-52 mx-auto py-3 px-16 text-dark hover:text-white border-2 border-dark font-semibold text-xs hover:bg-dark tracking-2 transition duration-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin  mx-auto" />
            ) : (
              "LOGIN"
            )}
          </button>
        </form>
        <div className="flex justify-center pt-8">
          <p className="text-sm text-dark tracking-2 text-center">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-dark font-semibold hover:underline underline-offset-2"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </motion.section>
  );
};
export default LoginPage;

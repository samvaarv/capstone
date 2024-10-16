import { motion } from "framer-motion";
import Input from "../components/Input";
import { Loader, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { signup, error, isLoading } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await signup(email, password, name);
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto"
    >
      <div className="p-10 md:py-20">
        <h2 className="text-3xl md:text-5xl font-bold mb-8 text-center font-light tracking-widest">
          CREATE AN ACCOUNT
        </h2>

        <form onSubmit={handleSignUp}>
          <Input
            icon={User}
            label="FULL NAME"
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          {error && <p className="text-red-500 font-semibold my-2">{error}</p>}
          <PasswordStrengthMeter password={password} />

          <div className="flex justify-center mt-6">
            <button
              className="w-52 mx-auto py-3 px-16 text-dark hover:text-white border-2 border-dark font-semibold text-xs hover:bg-dark tracking-2 transition duration-200"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="w-6 h-6 animate-spin  mx-auto" />
              ) : (
                "SIGNUP"
              )}
            </button>
          </div>
        </form>
        <div className="flex justify-center pt-8">
          <p className="text-sm text-dark tracking-2 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-dark font-semibold hover:underline underline-offset-2"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};
export default SignUpPage;

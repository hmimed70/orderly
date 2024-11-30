import Logo from "../components/shared/Logo";
import LoginForm from "../components/shared/LoginForm";

function Login() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900">
      {/* Left Section - Logo */}
      <div className="w-full md:w-2/3 bg-white dark:bg-gray-800 flex flex-col items-center justify-center p-10 text-center">
        <Logo text />
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full md:w-1/3 bg-gray-50 dark:bg-gray-700 flex flex-col items-center justify-center p-10">
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;

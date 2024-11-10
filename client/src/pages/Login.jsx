import Logo from "../components/shared/Logo";
import LoginForm from "../components/shared/LoginForm";

function Login() {
  return (
    <div className="min-h-screen flex justify-center items-center flex-col  gap-12 bg-white dark:bg-gray-900 text-black dark:text-white p-6">
      <Logo />
      <h1 className="text-5xl font-bold text-center">Log in to your account</h1>
      <LoginForm />
    </div>
  );
}

export default Login;

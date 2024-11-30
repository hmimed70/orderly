import { useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import FormRowVertical from "./FormRowVertical";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";

function LoginForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading: loading } = useLogin();
  const { t } = useTranslation();

  useEffect(() => {
    if (user) navigate("/orders", { replace: true });
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    login(
      { email, password },
      {
        onSettled: () => {
          setEmail("");
          setPassword("");
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-sm w-full bg-white dark:bg-gray-800 rounded-md shadow-md"
    >
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-6">
        {t("loginText")}
      </h2>

      <FormRowVertical label={t("email")}>
        <input
          className="outline-none focus:ring-2 focus:ring-orange-500 bg-white border border-gray-300 rounded-md py-2 px-3 w-full dark:bg-gray-700 dark:text-gray-200"
          type="email"
          id="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
      </FormRowVertical>

      <FormRowVertical label={t("password")}>
        <input
          className="outline-none focus:ring-2 focus:ring-orange-500 bg-white border border-gray-300 rounded-md py-2 px-3 w-full dark:bg-gray-700 dark:text-gray-200"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
      </FormRowVertical>

      <div className="mt-6">
        <button
          className="w-full px-5 py-3 rounded-md text-white bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {!loading ? t("btnLogin") : <BiLoaderAlt className="w-6 h-6 animate-spin" />}
        </button>
      </div>
    </form>
  );
}

export default LoginForm;

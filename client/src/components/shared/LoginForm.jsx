import { useEffect, useState, useCallback } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import FormRowVertical from "./FormRowVertical";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";

function LoginForm() {
  const navigate = useNavigate();
  const { isAdmin, isUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading: loading } = useLogin();
  const { t } = useTranslation();
  useEffect(
    function () {
      if (isUser) navigate("/dashboard", { replace: true });
      if(isAdmin) navigate("/admin/dashboard", { replace: true });
    },
    [isAdmin,isUser, navigate]
  );
  function handleSubmit(e) {
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
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-800 rounded-md shadow-md w-full md:w-2/3 lg:w-1/2">
      <h2 className="text-2xl font-semibold text-gray-950 dark:text-gray-200 mb-4">{t("loginTitle")}</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-6">{t("loginText")}</p>

      <FormRowVertical label={t("email")}>
        <input
          className="border border-solid border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-gray-200 px-4 py-2 rounded-sm shadow-md"
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
          className="border border-solid border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-gray-200 px-4 py-2 rounded-sm shadow-md"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
      </FormRowVertical>

      <FormRowVertical>
        <button
          className="py-3 rounded-md text-white my-2 bg-indigo-500 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-800 disabled:opacity-50"
          size="large"
          disabled={loading}
        >
          {!loading ? t("btnLogin") : <BiLoaderAlt className="w-6 h-6 animate-spin" />}
        </button>
      </FormRowVertical>
    </form>
  );
}

export default LoginForm;

import FormInput from "../components/shared/FormInput";
import Row from "../components/shared/Row";
import { useAuth } from "../hooks/useAuth";
import { useUpdatePassword } from "../hooks/useUSer";
import { updatePasswordSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"; 
import { useTranslation } from "react-i18next";

const UpdatePassword = () => {

  const { t } = useTranslation(); // Hook for translations
  const { isEditing, editPassword } = useUpdatePassword();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(updatePasswordSchema), // Assuming userSchema exists for validation
  });

  const onSubmit = (data) => {
    const userData = {
      passwordCurrent: data.password,
      password: data.newPassword,
    };
    editPassword(userData, {
      onSuccess: () => {
        reset();
      },
      onError: (error) => {
        console.error("Update failed", error);
      },
    });
  };

  return (
    <div className="orderContainer flex flex-col lg:flex-row justify-center items-center dark:bg-gray-900">
      <div className="mainContainer bg-white dark:bg-gray-800 m-2 rounded-lg shadow-md p-4 w-full">
        <h1 className="text-gray-950 dark:text-gray-100 font-semibold text-3xl mb-8">
          {t("updatePassword")}
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Row>
            <FormInput
              type="password"
              placeholder={t("currentPassword")}
              name="password"
              disabled={isEditing}
              register={register}
              errors={errors.password}
              className="dark:bg-gray-700 dark:text-gray-200"
            />
          </Row>
          <Row>
            <FormInput
              type="text"
              placeholder={t("newPassword")}
              name="newPassword"
              disabled={isEditing}
              register={register}
              errors={errors.newPassword}
              className="dark:bg-gray-700 dark:text-gray-200"
            />
            <FormInput
              disabled={isEditing}
              type="text"
              placeholder={t("confirmNewPassword")}
              name="confirmNewPassword"
              register={register}
              errors={errors.confirmNewPassword}
              className="dark:bg-gray-700 dark:text-gray-200"
            />
          </Row>

          <button
            type="submit"
            disabled={isEditing}
            className="py-3 px-6 rounded-md bg-indigo-600 cursor-pointer text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
          >
            {t("updatePasswordButton")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;

import { useEffect } from "react";
import FormInput from "../components/shared/FormInput";
import { useUpdateMe } from "../hooks/useUSer";
import { updatedMeSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import Row from "../components/shared/Row";
import { useAuth } from "../hooks/useAuth";

const Account = () => {
  const { t } = useTranslation();

  const { isLoading, user } = useAuth();
  const { isEditing, editMe } = useUpdateMe();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(updatedMeSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        fullname: user.fullname || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        state: user.state || "",
      });
    }
  }, [user, reset]);

  const onSubmit = (data) => {
    const userData = {
      fullname: data.fullname,
      username: data.username,
      email: data.email,
      phone: data.phone,
      state: data.state,
    };
    editMe(userData, {
      onError: (error) => {
        console.error("Update failed", error);
      },
    });
  };

  if (isLoading) {
    return <div>{t('loading')}</div>;
  }

  return (
    <div className="orderContainer flex flex-col lg:flex-row justify-center items-center dark:bg-gray-900">
      <div className="mainContainer bg-white dark:bg-gray-800 m-2 rounded-lg shadow-md p-4 w-full">
        <h1 className="text-gray-950 dark:text-gray-100 font-semibold text-3xl mb-8">{t('update_profile')}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Row>
            <FormInput
              type="text"
              placeholder={t('fullname')}
              name="fullname"
              disabled={isEditing}
              register={register}
              errors={errors.fullname}
              className="dark:bg-gray-700 dark:text-gray-200"
            />
            <FormInput
              type="email"
              placeholder={t('email')}
              name="email"
              disabled={isEditing}
              register={register}
              errors={errors.email}
              className="dark:bg-gray-700 dark:text-gray-200"
            />
          </Row>
          <Row>
            <FormInput
              type="text"
              placeholder={t('username')}
              name="username"
              disabled={isEditing}
              register={register}
              errors={errors.username}
              className="dark:bg-gray-700 dark:text-gray-200"
            />
            <FormInput
              disabled={isEditing}
              type="text"
              placeholder={t('phone')}
              name="phone"
              register={register}
              errors={errors.phone}
              className="dark:bg-gray-700 dark:text-gray-200"
            />
          </Row>
          <Row>
            <FormInput
              type="text"
              placeholder={t('state')}
              name="state"
              disabled={isEditing}
              register={register}
              errors={errors.state}
              className="dark:bg-gray-700 dark:text-gray-200"
            />
          </Row>
          <div className="flex justify-center my-6 gap-16">
            <button type="submit" className="py-3 px-6 rounded-md bg-indigo-600 cursor-pointer text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600">
              {t('update_info_button')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Account;

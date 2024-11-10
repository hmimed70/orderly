import { Fragment } from "react";
import FormInput from "../../components/shared/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userSchema } from "../../schema/index";
import Row from "../../components/shared/Row";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { useCreateUser } from "../../hooks/useUSer";

const AddUser = () => {
  const { t } = useTranslation(); // Initialize the translation hook
  const { isCreating, createUser } = useCreateUser();
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema),
  });

  function onError(errors) {
  }

  function onSubmit(data) {
    const userData = {
      fullname: data.fullname,
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role,
      phone: data.phone,
      state: data.state,
      gender: data.gender,
      handleLimit: data.handleLimit,
      orderConfirmedPrice: data.orderConfirmedPrice,
    };
    createUser(
      { ...userData },
      {
        onSuccess: () => {
          reset();
          navigate('/admin/users');
        },
      }
    );
  }

  return (
    <Fragment>
      <div className="orderContainer flex flex-col lg:flex-row justify-center items-center dark:bg-gray-900">
        <div className="mainContainer bg-white dark:bg-gray-800 m-2 rounded-lg shadow-md p-4 w-full">
          <h1 className="text-gray-950 dark:text-gray-100 font-semibold text-3xl mb-8">{t('addUser.title')}</h1>
          <form onSubmit={handleSubmit(onSubmit, onError)} className="w-full">
            <Row>
              <FormInput
                type="text"
                placeholder={t('addUser.fullnamePlaceholder')}
                name="fullname"
                disabled={isCreating}
                register={register}
                errors={errors.fullname}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <FormInput
                type="email"
                placeholder={t('addUser.emailPlaceholder')}
                name="email"
                disabled={isCreating}
                register={register}
                errors={errors.email}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Row>
            <Row>
              <FormInput
                type="text"
                placeholder={t('addUser.usernamePlaceholder')}
                name="username"
                disabled={isCreating}
                register={register}
                errors={errors.username}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <FormInput
                type="text"
                placeholder={t('addUser.passwordPlaceholder')}
                name="password"
                disabled={isCreating}
                register={register}
                errors={errors.password}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Row>
            <Row>
              <div className="w-full text-left rtl:text-right flex justify-center items-center my-2">
                <label htmlFor="role" className="text-slate-800 dark:text-gray-100 px-2 w-3/5 text-left rtl:text-right">{t('addUser.roleLabel')}</label>
                <select
                  disabled={isCreating}
                  name="role"
                  value="confirmatrice"
                  {...register("role", { required: t('addUser.roleRequired') })}
                  className="outline-none bg-white border rounded-md py-2 px-2 w-4/5 dark:bg-gray-700 dark:text-gray-200"
                >
                  <option className="dark:bg-gray-700 dark:text-gray-200  text-gray-700" value="confirmatrice">{t('addUser.roleConfirmatrice')}</option>
                  <option className="dark:bg-gray-700 dark:text-gray-200  text-gray-700" value="admin">{t('addUser.roleAdmin')}</option>
                </select>
                {errors.role && <p className="text-red-600">{errors.role.message}</p>}
              </div>
              <FormInput
                disabled={isCreating}
                type="text"
                placeholder={t('addUser.phonePlaceholder')}
                name="phone"
                register={register}
                errors={errors.phone}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Row>
            <Row>
              <FormInput
                disabled={isCreating}
                type="number"
                placeholder={t('addUser.handleLimitPlaceholder')}
                name="handleLimit"
                register={register}
                errors={errors.handleLimit}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <FormInput
                disabled={isCreating}
                type="number"
                placeholder={t('addUser.orderConfirmedPricePlaceholder')}
                name="orderConfirmedPrice"
                register={register}
                errors={errors.orderConfirmedPrice}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Row>
            <Row>
              <FormInput
                disabled={isCreating}
                type="text"
                placeholder={t('addUser.statePlaceholder')}
                name="state"
                register={register}
                errors={errors.state}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <div className="text-left rtl:text-right w-full flex justify-center items-center my-2">
                <span className="text-slate-800 dark:text-gray-100 w-2/3 text-left pr-1">{t('addUser.genderLabel')}</span>
                <div className="flex w-full">
                  <label className="flex items-center mr-4 w-2/5">
                    <input
                      disabled={isCreating}
                      type="radio"
                      value="male"
                      {...register("gender", { required: t('addUser.genderRequired') })}
                      className="mr-2"
                    />
                    {t('addUser.genderMale')}
                  </label>
                  <label className="flex items-center">
                    <input
                      disabled={isCreating}
                      type="radio"
                      value="female"
                      {...register("gender", { required: t('addUser.genderRequired') })}
                      className="mr-2"
                    />
                    {t('addUser.genderFemale')}
                  </label>
                </div>
              </div>
            </Row>
            <div className="flex justify-center my-6">
              <button type="submit" className="py-3 px-6 rounded-md bg-indigo-600 cursor-pointer text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600">
                {t('addUser.addButton')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default AddUser;

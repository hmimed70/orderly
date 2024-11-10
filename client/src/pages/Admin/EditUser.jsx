import { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import FormInput from "../../components/shared/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updatedUserSchema } from "../../schema/index"; 
import Row from "../../components/shared/Row";
import { useNavigate, useParams } from "react-router-dom";
import { useEditUser, useGetSingleUser } from "../../hooks/useUser";

const EditUser = () => {
  const { t } = useTranslation(); // Initialize translation function
  const { id } = useParams();
  const { data, isLoading } = useGetSingleUser(id); 
  const { user } = data || {};
  const { isEditing, editUser } = useEditUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(updatedUserSchema), 
  });

  useEffect(() => {
    if (user) {
      reset({
        fullname: user.fullname || "",
        username: user.username || "",
        email: user.email || "",
        password: "", 
        role: user.role || "confirmatrice",
        phone: user.phone || "",
        state: user.state || "",
        gender: user.gender || "male", 
        handleLimit: user.handleLimit?.toString() || 0,
        orderConfirmedPrice: user.orderConfirmedPrice?.toString() || 0,
      });
    }
  }, [user, reset]);

  const onSubmit = (data) => {
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

    editUser({ id, userData }, {
      onSuccess: () => {
        navigate('/admin/users');
      },
      onError: (error) => {
        console.error("User update failed", error);
      }
    });
  };

  if (isLoading) return <div>{t('loading')}</div>;

  return (
    <Fragment>
      <div className="orderContainer flex flex-col lg:flex-row justify-center items-center dark:bg-gray-900">
        <div className="mainContainer bg-white dark:bg-gray-800 m-2 rounded-lg shadow-md p-4 w-full">
          <h1 className="text-gray-950 dark:text-gray-100 font-semibold text-3xl mb-8">{t('editUser.title')}</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <Row>
              <FormInput
                type="text"
                placeholder={t('editUser.fullname')}
                name="fullname"
                disabled={isEditing}
                register={register}
                errors={errors.fullname}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <FormInput
                type="email"
                placeholder={t('editUser.email')}
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
                placeholder={t('editUser.username')}
                name="username"
                disabled={isEditing}
                register={register}
                errors={errors.username}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <FormInput
                type="password"
                placeholder={t('editUser.password')}
                name="password"
                disabled={isEditing}
                register={register}
                errors={errors.password}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Row>
            <Row>
              <div className="w-full flex justify-center items-center my-2 text-left rtl:text-right">
                <label htmlFor="role" className="text-slate-800 dark:text-gray-100 px-2 w-3/5 text-left rtl:text-right">{t('editUser.role')}</label>
                <select
                  disabled={isEditing}
                  name="role"
                  {...register("role", { required: "Role is required" })}
                  className="outline-none bg-white border rounded-md py-2 px-2 w-4/5 dark:bg-gray-700 dark:text-gray-200"
                >
                  <option className="dark:bg-gray-700 dark:text-gray-200  text-gray-700" value="confirmatrice">{t('editUser.confirmatrice')}</option>
                  <option className="dark:bg-gray-700 dark:text-gray-200  text-gray-700" value="admin">{t('editUser.admin')}</option>
                </select>
                {errors.role && <p className="text-red-600">{errors.role.message}</p>}
              </div>
              <FormInput
                disabled={isEditing}
                type="text"
                placeholder={t('editUser.phone')}
                name="phone"
                register={register}
                errors={errors.phone}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Row>
            <Row>
              <FormInput
                disabled={isEditing}
                type="text"
                placeholder={t('editUser.handleLimit')}
                name="handleLimit"
                register={register}
                errors={errors.handleLimit}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <FormInput
                disabled={isEditing}
                type="text"
                placeholder={t('editUser.orderConfirmedPrice')}
                name="orderConfirmedPrice"
                register={register}
                errors={errors.orderConfirmedPrice}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Row>
            <Row>
              <FormInput
                disabled={isEditing}
                type="text"
                placeholder={t('editUser.state')}
                name="state"
                register={register}
                errors={errors.state}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
              <div className=" text-left rtl:text-right w-full flex justify-center items-center my-2">
                <span className="text-slate-800 dark:text-gray-100 w-2/3 text-left rtl:text-right  pr-1">{t('editUser.gender')}</span>
                <div className="flex w-full">
                  <label className="flex items-center mr-4 w-2/5">
                    <input
                      disabled={isEditing}
                      type="radio"
                      value="male"
                      {...register("gender", { required: "Gender type is required" })}
                      className="mr-2"
                    />
                    {t('editUser.male')}
                  </label>
                  <label className="flex items-center">
                    <input
                      disabled={isEditing}
                      type="radio"
                      value="female"
                      {...register("gender", { required: "Gender type is required" })}
                      className="mr-2"
                    />
                    {t('editUser.female')}
                  </label>
                </div>
                {errors.gender && <p className="text-red-600">{errors.gender.message}</p>}
              </div>
            </Row>
            <div className=" my-6 w-1/2 mx-auto">
              <button type="submit" className="py-3 px-6 rounded-md bg-indigo-600 text-white text-sm w-5/6">{t('editUser.updateUser')}</button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default EditUser;

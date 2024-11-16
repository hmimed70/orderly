import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FormInput from "../../components/shared/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updatedUserSchema } from "../../schema/index"; 
import Row from "../../components/shared/Row";
import { useNavigate, useParams } from "react-router-dom";
import { useEditUser, useGetSingleUser } from "../../hooks/useUser";
import SelectInput from "../../components/shared/SelectInput";
import RadioGroup from "../../components/shared/RadioGroup";
import { MdOutlineMan2, MdOutlineWoman2 } from "react-icons/md";

const EditUser = ({id, onClose}) => {
  const { t } = useTranslation(); // Initialize translation function
  const { data, isLoading } = useGetSingleUser(id); 
  const { user } = data || {};
  console.log(user);

  const [userRole, setUserRole] = useState(user?.role || "");
  console.log(userRole); // Initialize userRole with the user's role or default to "confirmatrice" if not available in the user datuser?.role || "confirmatrice";
  const { isEditing, editUser } = useEditUser();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(updatedUserSchema), 
  });

  useEffect(() => {
    if (user) {
      setUserRole(user.role || "confirmatrice");
      reset({
        fullname: user.fullname || "",
        username: user.username || "",
        email: user.email || "",
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
      role: userRole,
      phone: data.phone,
      state: data.state,
      gender: data.gender,
      handleLimit: data.handleLimit,
      orderConfirmedPrice: data.orderConfirmedPrice,
    };

    editUser({ id, userData }, {
      onSuccess: () => {
       onClose();
      },
      onError: (error) => {
        console.error("User update failed", error);
      }
    });
  };

  if (isLoading) return <div>{t('loading')}</div>;

  return (
    <Fragment>
        <div className="mainContainer bg-white dark:bg-gray-800  rounded-lg shadow-md p-1 w-full">
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
              <FormInput
                type="text"
                placeholder={t('editUser.username')}
                name="username"
                disabled={isEditing}
                register={register}
                errors={errors.username}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
       <SelectInput
  label={t('editUser.role')}
  name="role"
  disabled={isEditing}
  value={userRole}
  onChange={(e) => setUserRole(e.target.value)}
  register={register}
  errors={errors.role}
>
  <option
    className="dark:bg-gray-700 dark:text-gray-200 text-gray-700"
    value="confirmatrice"
  >
    {t('editUser.confirmatrice')}
  </option>
  <option
    className="dark:bg-gray-700 dark:text-gray-200 text-gray-700"
    value="admin"
  >
    {t('editUser.admin')}
  </option>
</SelectInput>

              </Row>
              <Row>
              <FormInput
                disabled={isEditing}
                type="text"
                placeholder={t('editUser.phone')}
                name="phone"
                register={register}
                errors={errors.phone}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
      
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
              <RadioGroup  
              label={t('editUser.gender')}
              name="gender"
              watch={watch}
              options={[
                { value: 'male', label: <div className="flex flex-col justify-center items-center"><MdOutlineMan2 size={30} /><span>{t('editUser.male')}</span></div>  },
                { value: 'female', label: <div className="flex flex-col justify-center items-center"><MdOutlineWoman2 size={30} /><span>{t('editUser.female')}</span></div>  },
              ]}
              register={register}
              errors={errors.gender}
              disabled={isEditing}
              />
            </Row>
            <div className=" flex justify-center items-center gap-4">
            <button
                type="button"
                className="py-3 px-6 rounded-md bg-red-600 text-white text-sm"
                onClick={onClose}
              >
                {t('cancel')}
              </button>
              <button type="submit" className="py-3 px-6 rounded-md bg-orange-600 text-white text-sm"> {isEditing ? t('editOrder1.saving') : t('editOrder1.save')}
              </button>
            </div>
          </form>
        </div>
    </Fragment>
  );
};

export default EditUser;

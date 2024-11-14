import { Fragment, useState } from "react";
import FormInput from "../../components/shared/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userSchema } from "../../schema/index";
import Row from "../../components/shared/Row";
import PropTypes from 'prop-types';
import { useTranslation } from "react-i18next";
import { useCreateUser } from "../../hooks/useUser";
import RadioGroup from "../../components/shared/RadioGroup";
import SelectInput from "../../components/shared/SelectInput";
import { MdOutlineMan2, MdOutlineWoman2 } from "react-icons/md";
const AddUser = ({onClose}) => {
  const { t } = useTranslation(); // Initialize the translation hook
  const { isCreating, createUser } = useCreateUser();
  const [userRole, setUserRole] = useState("confirmatrice");
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
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
          onClose();
        },
      }
    );
  }

  return (
    <Fragment>
        <div className="mainContainer bg-white dark:bg-gray-800  rounded-lg shadow-md p-1 w-full">
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
                <SelectInput label={t('addUser.roleLabel')} name="role" 
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)} 
                errors={errors.role}
                register={register}
                disabled={isCreating}
                >
                  <option className="dark:bg-gray-700 dark:text-gray-200  text-gray-700" value="confirmatrice">{t('addUser.roleConfirmatrice')}</option>
                  <option className="dark:bg-gray-700 dark:text-gray-200  text-gray-700" value="admin">{t('addUser.roleAdmin')}</option>
                </SelectInput>
              <FormInput
                disabled={isCreating}
                type="text"
                placeholder={t('addUser.phonePlaceholder')}
                name="phone"
                register={register}
                errors={errors.phone}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
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
              disabled={isCreating}
              />
            </Row>
            <div className="flex justify-center items-center gap-4">
            <button
                type="button"
                className="py-3 px-6 rounded-md bg-red-600 text-white text-sm"
                onClick={onClose}
              >
                {t('cancel')}
              </button>
              <button type="submit" className="py-3 px-6 rounded-md bg-orange-600 cursor-pointer text-white hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600">
                {t('addUser.addButton')}
              </button>
            </div>
          </form>
        </div>
    </Fragment>
  );
};
AddUser.propTypes = {
  onClose: PropTypes.func,
}
export default AddUser;

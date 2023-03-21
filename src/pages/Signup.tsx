import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Link, useNavigate } from 'react-router-dom';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { signup } from '../services/auth.service';
import { useUserContext } from '../context/userContext';
import { ApiRoutes, Exception } from '../utils/constant';
import { SignupBody } from '../types/auth.type';
import classNames from 'classnames';
import { useRef } from 'react';
import { Messages } from 'primereact/messages';

type SignupForm = {
  email: string,
  name: string,
  password: string,
  confirmPassword: string,
}

const signupFormDefaultValues: SignupForm = {
  email: '',
  name: '',
  password: '',
  confirmPassword: '',
}

export const Signup = () => {
  const { setUser } = useUserContext();
  const navigate = useNavigate();

  const { control, formState: { errors }, handleSubmit, watch, trigger } = useForm<SignupForm>({
    defaultValues: signupFormDefaultValues
  });
  const serverValidError = useRef<Messages>(null);

  const onSubmit: SubmitHandler<SignupForm> = async (data) => {
    try {
      const response = await signup({
        email: data.email,
        name: data.name,
        password: data.password,
      } as SignupBody);
      setUser(response.data);
      navigate(ApiRoutes.USER_MANAGEMENT);
    } catch (error: any) {
      if (error.response.data.message == Exception.USER_EMAIL_EXISTS) {
        serverValidError.current?.show(
          { severity: 'error', summary: 'Email already exists', sticky: true, closable: true }
        );
      }
    }
  }

  return (
    <>
      <div className='flex justify-content-center align-items-center flex-grow-1'>
        <form className='col-4 flex flex-column p-fluid border-1 border-primary-100 border-round-md px-6 pb-5 surface-0 shadow-2' onSubmit={handleSubmit(onSubmit)}>

          <h1 className='align-self-center'>Signup</h1>

          <Messages ref={serverValidError} />

          <label htmlFor='email' className='mb-1'>Email</label>
          <span className='p-input-icon-right'>
            <i className='pi pi-envelope' />
            <Controller name='email' control={control}
              rules={{
                required: 'Email is required.',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: 'Invalid email address. E.g. user@email.com'
                },
                maxLength: {
                  value: 50,
                  message: 'Max length exceeded. Length must be less than 50.'
                }
              }}
              render={({ field, fieldState }) => (
              <InputText id={field.name} {...field} placeholder='user@gmail.com' className={classNames({ 'p-invalid': fieldState.invalid })} />
            )} />
          </span>
          {errors.email && <small className="p-error">{errors.email.message}</small>}

          <label htmlFor='name' className='mb-1 mt-3'>Name</label>
          <span className='p-input-icon-right'>
            <i className='pi pi-user' />
            <Controller name='name' control={control}
              rules={{
                required: 'Name is required.',
                maxLength: {
                  value: 75,
                  message: 'Max length exceeded. Length must be less than 75.'
                }
              }}
              render={({ field, fieldState }) => (
              <InputText id={field.name} {...field} placeholder='Your username' className={classNames({ 'p-invalid': fieldState.invalid })} />
            )} />
          </span>
          {errors.name && <small className="p-error">{errors.name.message}</small>}

          <label htmlFor='password' className='mb-1 mt-3'>Password</label>
          <Controller name='password' control={control}
            rules={{
              required: 'Password is required.',
              pattern: {
                value: /^\S+$/i,
                message: 'Password must not contain whitespaces.'
              },
              validate: () => {
                trigger('confirmPassword');
                return true;
              }
            }}
            render={({ field, fieldState }) => (
            <Password id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} feedback={false} toggleMask />
          )} />
          {errors.password && <small className="p-error">{errors.password.message}</small>}

          <label htmlFor='confirmPassword' className='mb-1 mt-3'>Confirm password</label>
          <Controller name='confirmPassword' control={control}
            rules={{
              required: 'Confirm password is required.',
              pattern: {
                value: /^\S+$/i,
                message: 'Confirm password must not contain whitespaces.'
              },
              validate: (value: string) => {
                return value === watch('password') || 'Password and confirm password should match.';
              }
            }}
            render={({ field, fieldState }) => (
            <Password id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} feedback={false} toggleMask />
          )} />
          {errors.confirmPassword && <small className="p-error">{errors.confirmPassword.message}</small>}

          <Button type='submit' className='my-3' label='Submit' />

          <div className='align-self-center'>
            <span>Already have an account?</span>&nbsp;<Link to='/login' className='p-component'>Login</Link>
          </div>
        </form>
      </div>
    </>
  );
}

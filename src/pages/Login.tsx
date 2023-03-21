import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Link, useNavigate } from 'react-router-dom';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { login } from '../services/auth.service';
import { ApiRoutes, Exception } from '../utils/constant';
import { LoginBody } from '../types/auth.type';
import { useUserContext } from '../context/userContext';
import classNames from 'classnames';
import { useRef } from 'react';
import { Messages } from 'primereact/messages';

const loginFormDefaultValues: LoginBody = {
  email: '',
  password: '',
}

export const Login = () => {
  const { setUser } = useUserContext();
  const navigate = useNavigate();

  const { control, formState: { errors }, handleSubmit } = useForm<LoginBody>({
    defaultValues: loginFormDefaultValues
  });
  const serverValidError = useRef<Messages>(null);

  const onSubmit: SubmitHandler<LoginBody> = async (data) => {
    try {
      const response = await login(data);
      setUser(response.data);
      navigate(ApiRoutes.USER_MANAGEMENT);
    } catch (error: any) {
      const errorMessage = error.response.data.message;
      if (errorMessage == Exception.USER_CREDENTIAL_INVALID) {
        serverValidError.current?.show(
          { severity: 'error', summary: 'Invalid email or password', sticky: true, closable: true }
        );
      } else if (errorMessage == Exception.USER_IS_LOCK) {
        serverValidError.current?.show(
          { severity: 'error', summary: 'Your account is locked', sticky: true, closable: true }
        );
      }
    }
  }

  return (
    <>
      <div className='flex justify-content-center align-items-center flex-grow-1'>
        <form className='col-4 flex flex-column p-fluid border-1 border-primary-100 border-round-md px-6 pb-5 surface-0 shadow-2' onSubmit={handleSubmit(onSubmit)}>

          <h1 className='align-self-center'>Login</h1>

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

          <label htmlFor='password' className='mb-1 mt-3'>Password</label>
          <Controller name='password' control={control}
            rules={{
              required: 'Password is required.',
              pattern: {
                value: /^\S+$/i,
                message: 'Password must not contain whitespaces.'
              }
            }}
            render={({ field, fieldState }) => (
            <Password id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} feedback={false} toggleMask />
          )} />
          {errors.password && <small className="p-error">{errors.password.message}</small>}

          <Button type='submit' className='my-3' label='Submit' />

          <div className='align-self-center'>
            <span>Don't have an account?</span>&nbsp;<Link to='/signup' className='p-component'>Signup</Link>
          </div>
        </form>
      </div>
    </>
  );
}

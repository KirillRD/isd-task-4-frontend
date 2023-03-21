export type SignupBody = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export type LoginBody = {
  email: string;
  password: string;
}
export type User = {
  id: number;
  email?: string;
  password?: string;
  name?: string;
  signupDate?: Date;
  lastLoginDate?: Date;
  isLock?: boolean;
}

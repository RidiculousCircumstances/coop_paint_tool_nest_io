export interface UserResponseInterface {
  id?: number;
  email: string;
  nickname: string;
  createdAt: Date;
  avatar?: string;
  token?: string;
}

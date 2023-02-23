import { UserDataInterface } from '../interfaces/userData.interface';
import { User } from '../models/user.model';

export class UserData {
  public static getData(user: User): UserDataInterface {
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      createdAt: user.createdAt,
    };
  }
}

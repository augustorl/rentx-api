import { ICreateUserTokenDTO } from "../dtos/ICreateUserTokenDTO";
import { UserTokens } from "../infra/typeorm/entities/UserTokens";

export interface IUsersTokensRepository {
  create({
    expire_date,
    refresh_token,
    user_id,
  }: ICreateUserTokenDTO): Promise<UserTokens>;

  findUserByIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserTokens>;

  deleteById(id: string): Promise<void>;
}

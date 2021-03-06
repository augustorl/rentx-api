import { verify, sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { AppError } from "@errors/AppError";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";

interface IPayLoad {
  sub: string;
  email: string;
}
interface ITokenResponse {
  token: string;
  refresh_token: string;
}
@injectable()
export default class RefreshTokenUseCase {
  constructor(
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}
  async execute(token: string): Promise<ITokenResponse> {
    const { email, sub } = verify(token, auth.secret_refresh_token) as IPayLoad;

    const user_id = sub;

    const userToken = await this.usersTokensRepository.findUserByIdAndRefreshToken(
      user_id,
      token
    );

    if (!userToken) {
      throw new AppError("missing_auth_token");
    }

    await this.usersTokensRepository.deleteById(userToken.id);

    const refresh_token = sign({ email }, auth.secret_refresh_token, {
      subject: sub,
      expiresIn: auth.expires_in_refresh_token,
    });
    const expire_date = this.dateProvider.addDays(
      auth.expires_refresh_token_days
    );

    await this.usersTokensRepository.create({
      expire_date,
      refresh_token,
      user_id,
    });

    const newToken = sign({}, auth.secret_token, {
      subject: user_id,
      expiresIn: auth.expires_in_token,
    });
    return {
      refresh_token,
      token: newToken,
    };
  }
}

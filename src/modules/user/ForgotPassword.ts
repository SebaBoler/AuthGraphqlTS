import { forgotPasswordPrefix } from "./../constants/redisPrefixes";
import { Resolver, Mutation, Arg } from "type-graphql";
import { User } from "../../entity/User";
import { redis } from "../../redis";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";

@Resolver(User)
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return true;
    }

    const token = v4();
    await redis.set(
      forgotPasswordPrefix + token,
      user.userId,
      "ex",
      60 * 60 * 1000 * 2  
    );

    await sendEmail(
      email,
      `http://localhost:3000/user/forgot-password/${token}`
    ); //potwierdzenie email

    return true;
  }
}

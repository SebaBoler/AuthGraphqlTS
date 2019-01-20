import { MyContext } from "src/types/MyContext";
import { forgotPasswordPrefix } from "./../constants/redisPrefixes";
import { ChangePasswordInput } from "./changePassword/ChangePasswordInput";
import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { User } from "../../entity/User";
import { redis } from "../../redis";
import bcrypt from "bcryptjs";

@Resolver()
export class ChangePasswordResolver {
  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg("data")
    { token, password }: ChangePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const userId = await redis.get(forgotPasswordPrefix + token);
    if (!userId) {
      return null;
    }

    const user = await User.findOne(userId);

    if (!user) {
      return null;
    }

    user.password = await bcrypt.hash(password, 12);
    await user.save();
    await redis.del(forgotPasswordPrefix + token);

    ctx.req.session!.userId = user.userId;

    return user;
  }
}

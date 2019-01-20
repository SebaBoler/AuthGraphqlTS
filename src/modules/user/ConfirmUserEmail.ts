import { confirmUserPrefix } from "./../constants/redisPrefixes";
import { Resolver, Mutation, Arg } from "type-graphql";
import { User } from "../../entity/User";
import { redis } from "../../redis";

@Resolver(User)
export class ConfirmUserEmailResolver {
  @Mutation(() => Boolean)
  async confirmUser(@Arg("token") token: string): Promise<boolean> {
    const userId = await redis.get(confirmUserPrefix + token);

    if (!userId) {
      return false;
    }

    await User.update({ userId: parseInt(userId, 10) }, { isConfirm: true });
    await redis.del(token);

    return true;
  }
}

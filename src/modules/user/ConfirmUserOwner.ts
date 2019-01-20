import { Resolver, Mutation, Arg } from "type-graphql";
import { User } from "../../entity/User";
import { redis } from "../../redis";

@Resolver(User)
export class ConfirmUserOwner {
  @Mutation(() => Boolean)
  async confirmUserOwner(@Arg("token") token: string): Promise<boolean> {
    const userId = await redis.get(token);

    if (!userId) {
      return false;
    }

    await User.update({ userId: parseInt(userId, 10) }, { isActive: true });
    await redis.del(token);

    return true;
  }
}

//do zrobienia kopia ConfirmUserEmail

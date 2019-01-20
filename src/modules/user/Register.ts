import { createConfirmationUrl } from "./../utils/createConfirmationUrl";
import { isLogin } from "../middleware/isLogin";
import { isAuth } from "../middleware/isAuth";
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  FieldResolver,
  Root,
  UseMiddleware
} from "type-graphql";
import * as bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import { RegisterInput } from "../user/register/RegisterInput";
import { sendEmail } from "../utils/sendEmail";

@Resolver(User)
export class RegisterResolver {
  //@Authorized()
  @UseMiddleware(isAuth, isLogin)
  @Query(() => String)
  async hello() {
    return await "Hello world";
  }

  @FieldResolver()
  async name(@Root() parent: User) {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Mutation(() => User)
  async register(@Arg("data")
  {
    email,
    firstName,
    lastName,
    password
  }: RegisterInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    }).save();

    await sendEmail(email, await createConfirmationUrl(user.userId)); //potwierdzenie email
    //await sendEmail(emailOwner, await createConfirmationUrl(user.userId));

    return user;
  }
}

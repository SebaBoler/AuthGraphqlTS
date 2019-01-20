import { Length, IsEmail, MinLength } from "class-validator"; //super validator
import { InputType, Field } from "type-graphql";
import { isEmailAlreadyExist } from "./isEmailAlreadyExist";

@InputType()
export class RegisterInput {
  @Field()
  @Length(1, 255) //moliwośc dodania Custom error {message: ""}
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;

  @Field()
  @IsEmail()
  @isEmailAlreadyExist({ message: "Email already use" })
  email: string;

  @Field()
  @MinLength(6)
  password: string;
}

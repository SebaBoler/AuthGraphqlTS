import { MiddlewareFn } from "type-graphql";
import { MyContext } from "src/types/MyContext";

export const isLogin: MiddlewareFn<MyContext> = async ({ args }, next) => {
  console.log("args: ", args);

  return next();
};

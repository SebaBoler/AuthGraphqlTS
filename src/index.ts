//import { ConfirmUserEmailResolver } from "./modules/user/ConfirmUserEmail";
//import { MeResolver } from "./modules/user/Me";
//import { LoginResolvers } from "./modules/user/Login";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema, formatArgumentValidationError } from "type-graphql";
import { createConnection } from "typeorm";
//import { RegisterResolver } from "./modules/user/Register";
import session from "express-session";
import connectRedis from "connect-redis";
import { redis } from "./redis";
import cors from "cors";
//import { sendEmail } from "./modules/utils/sendEmail";
import chalk from "chalk";

const main = async () => {
  //await sendEmail(); //probne wyslanie test mail
  //const connection = await createConnection("myserverOVH");
  const connection = await createConnection();

  //await createConnection("myserverOVH");
  await connection.synchronize();

  const schema = await buildSchema({
    resolvers: [__dirname + "/modules/**/*.ts"],
    authChecker: ({ context: { req } }) => {
      if (req.session.userId) {
        return true;
      }
      return false;
    }
  });

  const apolloServer = new ApolloServer({
    schema,
    formatError: formatArgumentValidationError,
    context: ({ req, res }: any) => ({ req, res })
  });

  const app = Express();

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000"
    })
  );

  //const hour = 3600000;

  app.use(
    session({
      store: new RedisStore({
        client: redis as any
      }),
      name: "SebaEatAllCookie",
      secret: "1234",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        //expires: new Date(Date.now() + hour), //jesli z maxAge wtedy maxAge jest uzywany
        maxAge: 60 * 60 * 1000 * 2  //1 godzina
      }
    } as any)
  );

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(chalk.red(`Server started on http://localhost:4000/graphql`));
  });
};

main();

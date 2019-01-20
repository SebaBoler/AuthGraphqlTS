import Redis from "ioredis";

export const redis = new Redis({
  port: 56379,
  host: "192.168.1.199",
  family: 4
});

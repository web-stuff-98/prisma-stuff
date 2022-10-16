import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import redisClient from "./redis";

import getIP from "./getIp";

/**
 * really basic rate limiter middleware made using redis.
 * cannot use it on next-auth route ...
 * 
 * Wrap it over your api handler. need to find out how to
 * do middleware the other way with applyMiddleware.ts
 */

interface IBasicRateLimitOpts {
  /** Number of requests allowed during key expiration time */
  numReqs: number;
  /** Redis key expiration time in seconds */
  exp: number;
  /** Redis key name */
  key: string;
}

const customRateLimit = (
  next: NextApiHandler,
  { numReqs, exp, key }: IBasicRateLimitOpts
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const ip = getIP(req);
    try {
      await redisClient?.connect();

      let reqs = 0;
      const keyVal = await redisClient?.get(`${ip}-${key}`);
      if (keyVal) {
        const val = JSON.parse(keyVal);
        reqs = val.reqs;
        if (val.reqs >= numReqs) {
          if (val.reqs === numReqs) {
            await redisClient?.setEx(
              `${ip}-${key}`,
              exp,
              JSON.stringify({
                reqs: reqs + 1,
              })
            );
          }
          await redisClient?.disconnect();
          throw new Error("Too many requests");
        }
      }

      await redisClient?.setEx(
        `${ip}-editor-requests`,
        86400,
        JSON.stringify({
          reqs: reqs + 1,
        })
      );

      await redisClient?.disconnect();
    } catch (e) {
      res.status(429).json({ msg: `${e}` });
    }
    next(req, res);
  };
};

export { customRateLimit };

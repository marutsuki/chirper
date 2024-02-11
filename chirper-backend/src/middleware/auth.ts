import { JWT_ISSUER, JWT_SECRET } from "@/config/auth-config";
import User from "@/model/user";
import { getUserById } from "@/service/user-service";
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

const jwtOptions = {
    issuer: JWT_ISSUER,
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use("jwt",
    new JwtStrategy(jwtOptions, async (payload, done) => {
        try {
            const user = await getUserById(payload.sub);
            if (user !== null) {
                return done(null, user);
            }
            return done(null, false);
        } catch (error: unknown) {
            return done(error, false);
        }
    })
);

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("jwt", { session: false }, (err: Error, user: User) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        console.debug("Authenticated user: ", user.id);
        req.user = user;
        next();
    })(req, res, next);
};
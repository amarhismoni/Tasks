const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { Users: User } = require("../models/model");

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: "secret", // Replace with an environment variable for security
        },
        async (jwt_payload, done) => {
            try {
                console.log(jwt_payload.sub);
                const user = await User.findOne({ where: { id: jwt_payload.sub } });
                
                return user ? done(null, user) : done(null, false);
            } catch (err) {
                return done(err, false);
            }
        }
    )
);

module.exports = passport;

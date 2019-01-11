const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('../model/userModel');

const localStrategySetup = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email'
      },
      (email, password, done) => {
        if (!email || !password) return done(null, false);

        return User.findOne(
          {
            email
          },
          (err, haveUser) => {
            if (err) return done(err);
            if (!haveUser) return done(null, false);

            const user = new User(haveUser);

            return user.comparePassword(password).then(isLogined => {
              if (err) return done(err);
              if (!isLogined) return done(null, false);

              return done(null, haveUser);
            });
          }
        );
      }
    )
  );
};

const jwtStrategySetup = () => {
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.TOKEN_SECRETKEY
      },
      (jwtPayload, done) => {
        const now = new Date().getTime();
        const expiration = Number(jwtPayload.exp) * 1000;
        if (now > expiration) return done(null, false);

        return User.findById(jwtPayload.sub, (err, user) => {
          if (err) return done(err, false);
          if (user) return done(null, user);

          return done(null, false);
        });
      }
    )
  );
};

const passportSetup = () => {
  localStrategySetup();
  jwtStrategySetup();
};

module.exports = passportSetup;

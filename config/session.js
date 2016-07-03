/**
 * Session Configuration
 * (app.config.session)
 *
 * @see http://trailsjs.io/doc/config/session.js
 */

'use strict'

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const EXPIRES_IN_SECONDS = 60 * 60 * 24
const SECRET = process.env.tokenSecret || 'mysupersecuretoken'
const ALGORITHM = 'HS256'
const ISSUER = 'localhost'
const AUDIENCE = 'localhost'

module.exports = {
  secret: SECRET,//secret use by express for his sessions
  redirect: {
    login: '/',//Login successful
    logout: '/'//Logout successful
  },
  //Called when user is logged, before returning the json response
  onUserLogged: (app, user) => {
    return Promise.resolve(user)
  },
  strategies: {
    jwt: {
      strategy: JwtStrategy,
      tokenOptions: {
        expiresInSeconds: EXPIRES_IN_SECONDS,
        secret: SECRET,
        algorithm: ALGORITHM,
        issuer: ISSUER,
        audience: AUDIENCE
      },
      options: {
        secretOrKey: SECRET,
        issuer: ISSUER,
        audience: AUDIENCE,
        jwtFromRequest: ExtractJwt.fromAuthHeader()
      }
    },

    local: {
      strategy: require('passport-local').Strategy,
      options: {
        usernameField: 'username'
      }
    }
  }
}

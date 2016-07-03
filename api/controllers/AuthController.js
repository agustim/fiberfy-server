'use strict'

const Controller = require('trails-controller')
const _ = require('lodash')
const crypto = require('crypto')


/**
 * @module AuthController
 * @description Generated Trails.js Controller.
 */
module.exports = class AuthController extends Controller {
  provider(req, res) {
    this.app.services.PassportService.endpoint(req, res, req.params.provider)
  }

  callback(req, res) {
    this.app.services.PassportService.callback(req, res, (err, user, challenges, statuses) => {
      if (err) {
        if (err.message === 'E_USER_NOT_FOUND') {
          return res.json({flag: false, data: err.message, message: 'User not found!'});
          //res.notFound(req, res)
        }
        else if (err === 'Not a valid BCrypt hash.' ||
          err.message === 'E_WRONG_PASSWORD' ||
          err.message === 'E_USER_NO_PASSWORD') {
          res.status(401).json({error: err.message || err})
        }
        else {
          this.app.log.error(err)
          res.serverError(err, req, res)
        }
      }
      else {
        req.login(user, err => {
          if (err) {
            this.app.log.error(err)
            res.serverError(err, req, res)
          }
          else {
            // Mark the session as authenticated to work with default Sails sessionAuth.js policy
            req.session.authenticated = true

            // Upon successful login, send the user to the homepage were req.user
            // will be available.
            if (req.wantsJSON) {
              const result = {
                redirect: this.app.config.session.redirect.login,
                user: user
              }

              if (this.app.config.session.strategies.jwt) {
                result.token = this.app.services.PassportService.createToken(user)
              }
              res.json(result)
            }
            else {
              res.redirect(this.app.config.session.redirect.login)
            }
          }
        })
      }
    })
  }


  login(req, res) {

    let model = req.body;
    if (!model
      || !model.username
      || !model.password) {
      res.json({flag: false, data: '', message: 'Validation error!'});
    }
    else {
      //convert password to string if not in string
      if (!_.isString(model.password)) {
        model.password = model.password.toString();
      }
      const criteria = {}
      criteria[_.get(this.app, 'config.session.strategies.local.options.usernameField') || 'username'] = model.username

      this.app.orm
        .User.findOne(criteria)
        .then(user => {
          if (!user) {
            res.json({flag: false, data: {}, message: 'User is not register ! Please register first'})
          }
          else {
            const onUserLogged = _.get(this.app, 'config.session.onUserLogged')

            /**
             * Compare user password hash with unhashed password
             * @returns boolean indicating a match
             */

            model.password = crypto.createHash('md5').update(model.password).digest('hex');

            if (model.password == user.password) {
              req.login(user, err => {

                if (err) {
                  res.json({flag: false, data: err, message: 'Error!'})
                }
                else {
                  // Mark the session as authenticated to work with default Sails sessionAuth.js policy
                  req.session.authenticated = true

                  // Upon successful login, send the user to the homepage were req.user
                  // will be available.
                  //never display password
                  delete user.password
                  res.json({flag: true, data: user, message: 'Logged in user!'})

                }
              })
            }
            else {
              res.json({flag: false, data: user, message: 'Please enter right password!'})
            }
          }
        })
    }
  }

  register(req, res) {

    let model = req.body;
    if (!model
      || !model.username
      || !model.password) {
      res.json({flag: false, data: '', message: 'Validation error!'});
    }
    else {

      const onUserLogged = _.get(this.app, 'config.session.onUserLogged')

      //convert password into md5
      if (model.password) {
        model.password = crypto.createHash('md5').update(model.password).digest('hex');
      }

      this.app.orm.User
        .create(model).then(user => {
        if (!user) {
          res.json({flag: false, data: {}, message: 'No user registered'});
        } else {
          onUserLogged(this.app, user)
          //never display password
          res.json({flag: true, data: user, message: 'User registered successfully'});
        }
      }).catch(err => {
        res.json({flag: false, data: {}, message: err.message});
      })
      //   return this.app.orm.Passport.create({
      //     protocol: 'local',
      //     password: password,
      //     user: user.id,
      //     accessToken: accessToken,
      //     tokens: token
      //   }).then(passport => onUserLogged(this.app, user))
      // })
    }
  }


  /**
   * Log out a user and return them to the homepage
   *
   * Passport exposes a logout() function on req (also aliased as logOut()) that
   * can be called from any route handler which needs to terminate a login
   * session. Invoking logout() will remove the req.user property and clear the
   * login session (if any).
   *
   * For more information on logging out users in Passport.js, check out:
   * http://passportjs.org/guide/logout/
   *
   * @param {Object} req
   * @param {Object} res
   */
  logout(req, res) {
    req.logout()

    // mark the user as logged out for auth purposes
    if (req.session)
      req.session.authenticated = false

    res.json({flag: true, data: '', message: 'Logout successfully'});
  }
}


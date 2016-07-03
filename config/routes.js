/**
 * Routes Configuration
 * (trails.config.routes)
 *
 * Configure how routes map to views and controllers.
 *
 * @see http://trailsjs.io/doc/config/routes.js
 */

'use strict'

module.exports = [


    /**
     * Authcontroller route
     */
  {
    method: 'POST',
    path: '/auth/login',
    handler: 'AuthController.login'
  },
  {
    method: 'POST',
    path: '/auth/register',
    handler: 'AuthController.register'
  },
  {
    method: 'GET',
    path: '/auth/logout',
    handler: 'AuthController.logout'
  },

  /**
   * Render the HelloWorld view
   */
  {
    method: 'GET',
    path: '/',
    handler: 'ViewController.index'
  },

  /**
   * Constrain the DefaultController.info handler to accept only GET requests.
   */
  {
    method: [ 'GET' ],
    path: '/api/v1/default/info',
    handler: 'DefaultController.info'
  }
]

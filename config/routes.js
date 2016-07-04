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
   * Render the view Controller
   */
  {
    method: 'GET',
    path: '/',
    handler: 'ViewController.index'
  },

  {
    method: 'GET',
    path: '/map',
    handler: 'ViewController.map'
  },


  /**
   * Constrain the DefaultController.info handler to accept only GET requests.
   */
  /*
  {
    method: [ 'GET' ],
    path: '/api/v1/site',
    handler: 'SiteController.list'
  },
  {
    method: [ 'POST' ],
    path: '/api/v1/site',
    handler: 'SiteController.post'
  },
  {
    method: [ 'GET' ],
    path: '/api/v1/site/{id}',
    handler: 'SiteController.get'
  },
  */

  {
    method: [ 'GET' ],
    path: '/api/v1/project/{id?}',
    handler: 'ProjectController.find'
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

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
   * Projects.
   */

  {
    method: [ 'GET' ],
    path: '/api/v1/project/{id?}',
    handler: 'ProjectController.find'
  },
  {
    method: [ 'POST' ],
    path: '/api/v1/project',
    handler: 'ProjectController.create'
  },
  {
    method: [ 'PUT', 'PATCH' ],
    path: '/api/v1/project/{id?}',
    handler: 'ProjectController.update'
  },
  {
    method: [ 'DELETE' ],
    path: '/api/v1/project/{id?}',
    handler: 'ProjectController.destroy'
  },
 /**
   * Site.
   */
  {
    method: [ 'GET' ],
    path: '/api/v1/site/{id?}',
    handler: 'SiteController.find'
  },
  {
    method: [ 'POST' ],
    path: '/api/v1/site',
    handler: 'SiteController.create'
  },
  {
    method: [ 'PUT', 'PATCH' ],
    path: '/api/v1/site/{id?}',
    handler: 'SiteController.update'
  },
  {
    method: [ 'DELETE' ],
    path: '/api/v1/site/{id?}',
    handler: 'SiteController.destroy'
  },

  /**
    * Path.
    */
   {
     method: [ 'GET' ],
     path: '/api/v1/path/{id?}',
     handler: 'PathController.find'
   },
   {
     method: [ 'POST' ],
     path: '/api/v1/path',
     handler: 'PathController.create'
   },
   {
     method: [ 'PUT', 'PATCH' ],
     path: '/api/v1/path/{id?}',
     handler: 'PathController.update'
   },
   {
     method: [ 'DELETE' ],
     path: '/api/v1/path/{id?}',
     handler: 'PathController.destroy'
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

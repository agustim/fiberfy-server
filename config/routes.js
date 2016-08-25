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
  {
    method: [ 'GET' ],
    path: '/api/v1/site/{id}/boxes',
    handler: 'SiteController.getBoxes'
  },
  {
    method: [ 'GET' ],
    path: '/api/v1/site/{id}/merger',
    handler: 'SiteController.getMerger'
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
   * Box.
   */
  {
    method: [ 'GET' ],
    path: '/api/v1/box/{id?}',
    handler: 'BoxController.find'
  },
  {
    method: [ 'POST' ],
    path: '/api/v1/box',
    handler: 'BoxController.create'
  },
  {
    method: [ 'PUT', 'PATCH' ],
    path: '/api/v1/box/{id?}',
    handler: 'BoxController.update'
  },
  {
    method: [ 'DELETE' ],
    path: '/api/v1/Box/{id?}',
    handler: 'BoxController.destroy'
  },

  /**
    * Fiber
    */
  {
    method: [ 'GET' ],
    path: '/api/v1/fiber/{id?}',
    handler: 'FiberController.find'
  },
  {
    method: [ 'POST' ],
    path: '/api/v1/fiber',
    handler: 'FiberController.create'
  },
  {
    method: [ 'PUT', 'PATCH' ],
    path: '/api/v1/fiber/{id?}',
    handler: 'FiberController.update'
  },
  {
    method: [ 'DELETE' ],
    path: '/api/v1/fiber/{id?}',
    handler: 'FiberController.destroy'
  },

  /**
    * FiberTemplate
    */
  {
    method: [ 'GET' ],
    path: '/api/v1/fibertemplate/{id?}',
    handler: 'FiberTemplateController.find'
  },
  {
    method: [ 'POST' ],
    path: '/api/v1/fibertemplate',
    handler: 'FiberTemplateController.create'
  },
  {
    method: [ 'PUT', 'PATCH' ],
    path: '/api/v1/fibertemplate/{id?}',
    handler: 'FiberTemplateController.update'
  },
  {
    method: [ 'DELETE' ],
    path: '/api/v1/fibertemplate/{id?}',
    handler: 'FiberTemplateController.destroy'
  }

]

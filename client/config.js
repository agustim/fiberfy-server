// config environment

(function (root, factory) {

if (typeof define === 'function' && define.amd) {
    define(['exports', 'jquery-browserify'], function (exports, $) {
        return factory(root, exports, $);
    });
} else if (typeof exports !== 'undefined') {
    var $ = require('jquery-browserify');
    factory(root, exports, $);
} else {
    var $ = root.jQuery;
    root.Config = factory(root, {}, $);
}

})(this, function (root, Config, $) {

  exports.username;
  exports.user_id;
  exports.project = [];
  exports.actual_project;

  exports.loadProjects = function (){
    console.log("loadProjects!");
  };

  exports.viewForm = function () {

    // Hide Map & show config form.
    $('#map-group').hide();
    $('#form-config-group').removeClass('hide');
  };

  exports.closeForm = function(){
    $('#form-config-group').addClass('hide');
    this.username = $('#config-username').val();
    this.actual_project = $('#project-name').val();

  };
});

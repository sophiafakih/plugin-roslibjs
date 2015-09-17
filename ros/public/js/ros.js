(function (window, $, undefined) {
  'use strict';
  var ros;
  ros = function ros(cockpit) {
    console.log("Loading ROS plugin in the browser.");
    this.cockpit = cockpit;

    // for plugin management:
    this.name = 'ros';   // for the settings
    this.viewName = 'ROS interface'; // for the UI
    this.canBeDisabled = true; // allow enable/disable
    this.enable = function () {
      alert('ROS enabled');
    };
    this.disable = function () {
      alert('ROS disabled');
    };
  };

  ros.prototype.listen = function listen() {};

  window.Cockpit.plugins.push(ros);
}(window, jQuery));

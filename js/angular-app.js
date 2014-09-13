(function(){
    "use strict";

  /* @ngInject */
  var Routes = ['$routeProvider', function($routeProvider){
    $routeProvider
      .when('/home', {
        templateUrl: 'home/home.html',
        controller: 'HomeController as home'
      })
      .otherwise({
        redirectTo: '/home'
      });
  }];
  Routes.$inject = ['$routeProvider'];

  angular.module('asApp', ['as.home'])
    .config(Routes);
})();

(function(){
    "use strict";

    var HomeController = function() {
    this.appName = "Angular JS Starter App";
    this.toolsTech = [
      'HTML',
      'CSS',
      'JavaScript',
      'AngularJS',
      'SASS',
      'nodejs (npm)',
      'bower',
      'Gulp',
      'Git',
      'REST / AJAX',
      'Markdown',
      'Jasmine',
      'Karma',
      'Protractor',
      'Bootstrap'
    ];
    this.developer = "Sirajuddin Choudhary";
  };

  angular.module('as.home', ['ngRoute'])
    .controller('HomeController', HomeController);
})();

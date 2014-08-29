(function(){
    "use strict";

  /* @ngInject */
  var Routes = function($routeProvider){
    $routeProvider
      .when('/home', {
        templateUrl: 'home/home.html',
        controller: 'HomeController as home'
      })
      .otherwise({
        redirectTo: '/home'
      });
  };

  angular.module('asApp', ['as.home'])
    .config(Routes);
})();

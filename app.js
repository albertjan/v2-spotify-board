(function () {
    var app = angular.module('v2-spotify-board', ["ngRoute"]);    
    
    app.controller('HomeController', [ '$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {
        if (!$rootScope.loggedIn) {
            $location.path("/login");
        }
        
        $scope.boardName = "V2 SpotifyBoard";
    }]);
    
    app.controller('LoginController', ['$scope', '$rootScope', '$location', '$http', function ($scope, $rootScope, $location, $http) {
        $scope.login = function() {
            $http.get("https://ws.spotify.com/oauth/token?grant_type=client_credentials&client_id=" + $scope.username + "&client_secret=" + $scope.password)
            .then(function (data) {
                console.log(JSON.stringify(data));
                $location.path("/");
            }, function(data) {
                $scope.errorMessage = data.data.error;
            });
        };
    }]);
    
    app.run(function($rootScope) {
        $rootScope.loggedIn = false;
    });
    
    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: 'home.html',
                controller: 'HomeController'
            })
            .when("/login", {
                templateUrl: 'login.html',
                controller: 'LoginController'
            });
    }]);
})();
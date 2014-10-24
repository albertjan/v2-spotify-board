(function () {
    var app = angular.module('v2-spotify-board', ["ngRoute"]);    
    
    app.controller('HomeController', [ '$scope', '$rootScope', '$location', '$http', function ($scope, $rootScope, $location, $http) {
        if (!$rootScope.loggedIn) {
            $location.path("/login");
        }
        
        var bands = [
            { 
                name: 'Blauzun',
                uri: 'spotify:artist:1A6zWJwn4XmdZZgob3wYPM' 
            }
        ];
        
        var ctx = $('#chart').get(0).getContext("2d");
        
        $http.get("https://ws.spotify.com/analytics/aggregated/" + bands[0].uri +"?oauth_token=" + $rootScope.token)
            .then(function(data) {
                console.log(data["The Orchard Enterprises"].total.all);
                var chart = new Chart(ctx).Bar(data["The Orchard Enterprises"].total.all, {});
            });
        
        $scope.boardName = "V2 SpotifyBoard";
    }]);
    
    app.controller('LoginController', ['$scope', '$rootScope', '$location', '$http', function ($scope, $rootScope, $location, $http) {
        $scope.login = function() {
            $http.get("https://ws.spotify.com/oauth/token?grant_type=client_credentials&client_id=" + $scope.username + "&client_secret=" + $scope.password)
                .then(function (data) {
                    $rootScope.token = data.data.access_token;
                    $rootScope.validUntil = new Date(new Date().getMilliseconds() + data.data.expires_in);

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
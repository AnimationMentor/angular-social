function template(tmpl, context, filter) {
    'use strict';

    return tmpl.replace(/\{([^\}]+)\}/g, function (m, key) {
        // If key don't exists in the context we should keep template tag as is
        return key in context ? (filter ? filter(context[key]) : context[key]) : m;
    });
}

var app = angular.module('ngSocial', []);

app.directive('ngSocialButtons', ['$compile', '$q', '$parse', '$http', '$location',
    function ($compile, $q, $parse, $http, $location) {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                'url': '=',
                'title': '=',
                'description': '=',
                'image': '=',
                'showcounts': '='
            },
            replace: true,
            transclude: true,
            template: '<ul ng-social ng-transclude></ul>',
            controller: ['$scope', '$q', '$http', function ($scope, $q, $http) {
                var getUrl = function () {
                    return $scope.url || $location.absUrl();
                }, ctrl = this;
                this.init = function (scope, element, options) {
                    if (options.counter) {
                        ctrl.getCount(scope.options).then(function (count) {
                            scope.count = count;
                        });
                    }
                };
                this.link = function (options) {
                        options = options || {};
                        var urlOptions = options.urlOptions || {};
                        urlOptions.url = getUrl();
                        if (!urlOptions.title) urlOptions.title = $scope.title;
                        if (!urlOptions.image) urlOptions.image = $scope.image;
                        if (!urlOptions.description) urlOptions.description = $scope.description || '';
                        return ctrl.makeUrl(options.clickUrl || options.popup.url, urlOptions);
                };
                this.clickShare = function (e, options) {
                    if (e.shiftKey || e.ctrlKey) {
                        return;
                    }
                    e.preventDefault();

                    if (options.track && typeof _gaq != 'undefined' && angular.isArray(_gaq)) {
                        _gaq.push(['_trackSocial', options.track.name, options.track.action, $scope.url]);
                    }

                    var process = true;
                    if (angular.isFunction(options.click)) {
                        process = options.click.call(this, options);
                    }
                    if (process) {
                        var url = ctrl.link(options);
                        ctrl.openPopup(url, options.popup);
                    }
                };
                this.openPopup = function (url, params) {
                    var left = Math.round(screen.width / 2 - params.width / 2),
                        top = 0;
                    if (screen.height > params.height) {
                        top = Math.round(screen.height / 3 - params.height / 2);
                    }

                    var win = window.open(
                        url,
                        'sl_' + this.service,
                        'left=' + left + ',top=' + top + ',' +
                        'width=' + params.width + ',height=' + params.height +
                        ',personalbar=0,toolbar=0,scrollbars=1,resizable=1'
                    );
                    if (win) {
                        win.focus();
                    } else {
                        location.href = url;
                    }
                };
                this.getCount = function (options) {
                    var def = $q.defer();
                    var urlOptions = options.urlOptions || {};
                    urlOptions.url = getUrl();
                    if (!urlOptions.title) urlOptions.title = $scope.title;
                    var url = ctrl.makeUrl(options.counter.url, urlOptions),
                        showcounts = angular.isUndefined($scope.showcounts) ? true : $scope.showcounts;

                    if (showcounts) {
                        if (options.counter.get) {
                            options.counter.get(url, def, $http);
                        } else {
                            $http.jsonp(url).success(function (res) {
                                if (options.counter.getNumber) {
                                    def.resolve(options.counter.getNumber(res));
                                } else {
                                    def.resolve(res);
                                }
                            });
                        }
                    }
                    return def.promise;
                };
                this.makeUrl = function (url, context) {
                    return template(url, context, encodeURIComponent);
                };
                return this;
            }]
        };
    }
    ]);

app.directive('ngSocialFacebook', ['$parse', function ($parse) {
  'use strict';

  var options = {
    counter: {
      url: '//graph.facebook.com/fql?q=SELECT+total_count+FROM+link_stat+WHERE+url%3D%22{url}%22' +
      '&callback=JSON_CALLBACK',
      getNumber: function (data) {
        if (0 === data.data.length) {
          return 0;
        }

        return data.data[0].total_count;
      }
    },
    popup: {
      url: 'http://www.facebook.com/sharer/sharer.php?u={url}',
      width: 600,
      height: 500
    },
    track: {
      'name': 'facebook',
      'action': 'send'
    }
  };
  return {
    restrict: 'A',
    require: '^?ngSocialButtons',
    scope: true,
    replace: true,
    transclude: true,
    template: '<li>' +
    '<a ng-href="{{ctrl.link(options)}}" target="_blank" ng-click="ctrl.clickShare($event, options)" ng-social-button>' +
    '<span ng-social-icon></span>' +
    '<span ng-social-text ng-transclude></span>' +
    '</a>' +
    '<span ng-show="count" ng-social-counter>{{ count }}</span>' +
    '</li>',
    link: function (scope, element, attrs, ctrl) {
      if (!ctrl) {
        return;
      }
      options.urlOptions = {
        url: $parse(attrs.url)(scope)
      };
      scope.options = options;
      scope.ctrl = ctrl;
      ctrl.init(scope, element, options);
    }
  };
}]);

app.directive('ngSocialTwitter', ['$parse', function ($parse) {
  'use strict';

  var options = {
    counter: {
      url: '//urls.api.twitter.com/1/urls/count.json?url={url}&callback=JSON_CALLBACK',
      getNumber: function (data) {
        return data.count;
      }
    },
    popup: {
      url: 'http://twitter.com/intent/tweet?url={url}&text={title}',
      width: 600,
      height: 450
    },
    click: function (options) {
      // Add colon to improve readability
      if (!/[\.:\-–—]\s*$/.test(options.pageTitle)) options.pageTitle += ':';
      return true;
    },
    track: {
      'name': 'twitter',
      'action': 'tweet'
    }
  };
  return {
    restrict: 'A',
    require: '^?ngSocialButtons',
    scope: true,
    replace: true,
    transclude: true,
    template: '<li> \
                    <a ng-href="{{ctrl.link(options)}}" target="_blank" ng-click="ctrl.clickShare($event, options)" ng-social-button> \
                        <span ng-social-icon></span> \
                        <span ng-social-text ng-transclude></span> \
                    </a> \
                    <span ng-show="count" ng-social-counter>{{ count }}</span> \
                   </li>',
    link: function (scope, element, attrs, ctrl) {
      if (!ctrl) {
        return;
      }
      options.urlOptions = {
        url: $parse(attrs.url)(scope),
        title: $parse(attrs.title)(scope)
      };
      scope.options = options;
      scope.ctrl = ctrl;
      ctrl.init(scope, element, options);
    }
  }
}]);

angular.module('ngSocial').run(['$templateCache', function ($templateCache) {
	$templateCache.put('/views/buttons.html', '<div class="ng-social-container ng-cloak"><ul class="ng-social" ng-transclude></ul></div>');
}]);
function template(a,b,c){"use strict";return a.replace(/\{([^\}]+)\}/g,function(a,d){return d in b?c?c(b[d]):b[d]:a})}var app=angular.module("ngSocial",[]);app.directive("ngSocialButtons",["$compile","$q","$parse","$http","$location",function(a,b,c,d,e){"use strict";return{restrict:"A",scope:{url:"=",title:"=",description:"=",image:"=",showcounts:"="},replace:!0,transclude:!0,template:'<div class="ng-social-container ng-cloak"><ul class="ng-social" ng-transclude></ul></div>',controller:["$scope","$q","$http",function(a,b,c){var d=function(){return a.url||e.absUrl()},f=this;return this.init=function(a,b,c){c.counter&&f.getCount(a.options).then(function(b){a.count=b})},this.link=function(b){b=b||{};var c=b.urlOptions||{};return c.url=d(),c.title||(c.title=a.title),c.image||(c.image=a.image),c.description||(c.description=a.description||""),f.makeUrl(b.clickUrl||b.popup.url,c)},this.clickShare=function(b,c){if(!b.shiftKey&&!b.ctrlKey){b.preventDefault(),c.track&&"undefined"!=typeof _gaq&&angular.isArray(_gaq)&&_gaq.push(["_trackSocial",c.track.name,c.track.action,a.url]);var d=!0;if(angular.isFunction(c.click)&&(d=c.click.call(this,c)),d){var e=f.link(c);f.openPopup(e,c.popup)}}},this.openPopup=function(a,b){var c=Math.round(screen.width/2-b.width/2),d=0;screen.height>b.height&&(d=Math.round(screen.height/3-b.height/2));var e=window.open(a,"sl_"+this.service,"left="+c+",top="+d+",width="+b.width+",height="+b.height+",personalbar=0,toolbar=0,scrollbars=1,resizable=1");e?e.focus():location.href=a},this.getCount=function(e){var g=b.defer(),h=e.urlOptions||{};h.url=d(),h.title||(h.title=a.title);var i=f.makeUrl(e.counter.url,h),j=angular.isUndefined(a.showcounts)?!0:a.showcounts;return j&&(e.counter.get?e.counter.get(i,g,c):c.jsonp(i).success(function(a){e.counter.getNumber?g.resolve(e.counter.getNumber(a)):g.resolve(a)})),g.promise},this.makeUrl=function(a,b){return template(a,b,encodeURIComponent)},this}]}}]),app.directive("ngSocialFacebook",["$parse",function(a){"use strict";var b={counter:{url:"//graph.facebook.com/fql?q=SELECT+total_count+FROM+link_stat+WHERE+url%3D%22{url}%22&callback=JSON_CALLBACK",getNumber:function(a){return 0===a.data.length?0:a.data[0].total_count}},popup:{url:"http://www.facebook.com/sharer/sharer.php?u={url}",width:600,height:500},track:{name:"facebook",action:"send"}};return{restrict:"AC",require:"^?ngSocialButtons",scope:!0,replace:!0,transclude:!0,template:'<li><a ng-href="{{ctrl.link(options)}}" target="_blank" ng-click="ctrl.clickShare($event, options)" class="ng-social-button"><span class="ng-social-icon"></span><span class="ng-social-text" ng-transclude></span></a><span ng-show="count" class="ng-social-counter">{{ count }}</span></li>',link:function(c,d,e,f){d.addClass("ng-social-facebook"),f&&(b.urlOptions={url:a(e.url)(c)},c.options=b,c.ctrl=f,f.init(c,d,b))}}}]),app.directive("ngSocialTwitter",["$parse",function(a){"use strict";var b={counter:{url:"//urls.api.twitter.com/1/urls/count.json?url={url}&callback=JSON_CALLBACK",getNumber:function(a){return a.count}},popup:{url:"http://twitter.com/intent/tweet?url={url}&text={title}",width:600,height:450},click:function(a){return/[\.:\-–—]\s*$/.test(a.pageTitle)||(a.pageTitle+=":"),!0},track:{name:"twitter",action:"tweet"}};return{restrict:"AC",require:"^?ngSocialButtons",scope:!0,replace:!0,transclude:!0,template:'<li>                     <a ng-href="{{ctrl.link(options)}}" target="_blank" ng-click="ctrl.clickShare($event, options)" class="ng-social-button">                         <span class="ng-social-icon"></span>                         <span class="ng-social-text" ng-transclude></span>                     </a>                     <span ng-show="count" class="ng-social-counter">{{ count }}</span>                    </li>',link:function(c,d,e,f){d.addClass("ng-social-twitter"),f&&(b.urlOptions={url:a(e.url)(c),title:a(e.title)(c)},c.options=b,c.ctrl=f,f.init(c,d,b))}}}]),app.directive("ngSocialGooglePlus",["$parse",function(a){"use strict";var b={counter:{url:"//share.yandex.ru/gpp.xml?url={url}",getNumber:function(a){return a.count},get:function(a,c,d){return b._?void c.reject():(window.services||(window.services={}),window.services.gplus={cb:function(a){b._.resolve(a)}},b._=c,void d.jsonp(a))}},popup:{url:"https://plus.google.com/share?url={url}",width:700,height:500},track:{name:"Google+",action:"share"}};return{restrict:"AC",require:"^?ngSocialButtons",scope:!0,replace:!0,transclude:!0,template:'<li>                     <a ng-href="{{ctrl.link(options)}}" target="_blank" ng-click="ctrl.clickShare($event, options)" class="ng-social-button">                         <span class="ng-social-icon"></span>                         <span class="ng-social-text" ng-transclude></span>                     </a>                     <span ng-show="count" class="ng-social-counter">{{ count }}</span>                    </li>',link:function(c,d,e,f){d.addClass("ng-social-google-plus"),f&&(b.urlOptions={url:a(e.url)(c)},c.options=b,c.ctrl=f,f.init(c,d,b))}}}]),app.directive("ngSocialVk",["$parse",function(a){"use strict";var b={counter:{url:"//vkontakte.ru/share.php?act=count&url={url}&index={index}",get:function(a,c,d){b._||(b._=[],window.VK||(window.VK={}),window.VK.Share={count:function(a,c){b._[a].resolve(c)}});var e=b._.length;b._.push(c),d.jsonp(a.replace("{index}",e))}},popup:{url:"http://vk.com/share.php?url={url}&title={title}&description={description}&image={image}",width:550,height:330},track:{name:"VKontakte",action:"share"}};return{restrict:"AC",require:"^?ngSocialButtons",scope:!0,replace:!0,transclude:!0,template:'<li>                     <a ng-href="{{ctrl.link(options)}}" target="_blank" ng-click="ctrl.clickShare($event, options)" class="ng-social-button">                         <span class="ng-social-icon"></span>                         <span class="ng-social-text" ng-transclude></span>                     </a>                     <span ng-show="count" class="ng-social-counter">{{ count }}</span>                    </li>',link:function(c,d,e,f){d.addClass("ng-social-vk"),f&&(b.urlOptions={url:a(e.url)(c),title:a(e.title)(c),description:a(e.description)(c),image:a(e.image)(c)},c.options=b,c.ctrl=f,f.init(c,d,b))}}}]),angular.module("ngSocial").directive("ngSocialOdnoklassniki",["$parse",function(a){var b={counter:{url:"http://connect.ok.ru/dk?st.cmd=extLike&ref={url}&uid={index}",get:function(a,c,d){b._||(b._=[],window.ODKL||(window.ODKL={}),window.ODKL.updateCount=function(a,c){b._[a].resolve(c)});var e=b._.length;b._.push(c),d.jsonp(a.replace("{index}",e))}},popup:{url:"http://connect.ok.ru/dk?st.cmd=WidgetSharePreview&service=odnoklassniki&st.shareUrl={url}",width:550,height:360},track:{name:"Odnoklassniki",action:"share"}};return{restrict:"AC",require:"^?ngSocialButtons",scope:!0,replace:!0,transclude:!0,template:'<li>                     <a ng-href="{{ctrl.link(options)}}" target="_blank" ng-click="ctrl.clickShare($event, options)" class="ng-social-button">                         <span class="ng-social-icon"></span>                         <span class="ng-social-text" ng-transclude></span>                     </a>                     <span ng-show="count" class="ng-social-counter">{{ count }}</span>                    </li>',link:function(c,d,e,f){d.addClass("ng-social-odnoklassniki"),f&&(b.urlOptions={url:a(e.url)(c)},c.options=b,c.ctrl=f,f.init(c,d,b))}}}]),angular.module("ngSocial").directive("ngSocialMailru",["$parse",function(a){var b={counter:{url:"//connect.mail.ru/share_count?url_list={url}&callback=1&func=JSON_CALLBACK",getNumber:function(a){for(var b in a)if(a.hasOwnProperty(b))return a[b].shares}},popup:{url:"http://connect.mail.ru/share?share_url={url}&title={title}",width:550,height:360}};return{restrict:"AC",require:"^?ngSocialButtons",scope:!0,replace:!0,transclude:!0,template:'<li>                     <a ng-href="{{ctrl.link(options)}}" target="_blank" ng-click="ctrl.clickShare($event, options)" class="ng-social-button">                         <span class="ng-social-icon"></span>                         <span class="ng-social-text" ng-transclude></span>                     </a>                     <span ng-show="count" class="ng-social-counter">{{ count }}</span>                    </li>',link:function(c,d,e,f){d.addClass("ng-social-mailru"),f&&(b.urlOptions={url:a(e.url)(c),title:a(e.title)(c)},c.options=b,c.ctrl=f,f.init(c,d,b))}}}]),angular.module("ngSocial").directive("ngSocialPinterest",["$parse",function(a){var b={counter:{url:"//api.pinterest.com/v1/urls/count.json?url={url}&callback=JSON_CALLBACK",getNumber:function(a){return a.count}},popup:{url:"http://pinterest.com/pin/create/button/?url={url}&description={title}&media={image}",width:630,height:270}};return{restrict:"AC",require:"^?ngSocialButtons",scope:!0,replace:!0,transclude:!0,template:'<li>                     <a ng-href="{{ctrl.link(options)}}" target="_blank" ng-click="ctrl.clickShare($event, options)" class="ng-social-button">                         <span class="ng-social-icon"></span>                         <span class="ng-social-text" ng-transclude></span>                     </a>                     <span ng-show="count" class="ng-social-counter">{{ count }}</span>                    </li>',link:function(c,d,e,f){d.addClass("ng-social-pinterest"),f&&(b.urlOptions={url:a(e.url)(c),title:a(e.title)(c),image:a(e.image)(c)},c.options=b,c.ctrl=f,f.init(c,d,b))}}}]),angular.module("ngSocial").directive("ngSocialGithubForks",function(){var a={counter:{url:"//api.github.com/repos/{user}/{repository}?callback=JSON_CALLBACK",getNumber:function(a){return a.data.forks_count}},clickUrl:"https://github.com/{user}/{repository}/"};return{restrict:"AC",require:"^?ngSocialButtons",scope:!0,replace:!0,transclude:!0,template:'<li>                     <a ng-href="{{ctrl.link(options)}}" target="_blank" class="ng-social-button">                         <span class="ng-social-icon"></span>                         <span class="ng-social-text" ng-transclude></span>                     </a>                     <span ng-show="count" class="ng-social-counter">{{ count }}</span>                    </li>',link:function(b,c,d,e){c.addClass("ng-social-github ng-social-github-forks"),e&&(a.urlOptions={user:d.user,repository:d.repository},b.options=a,b.ctrl=e,e.init(b,c,a))}}}),angular.module("ngSocial").directive("ngSocialGithub",function(){var a={counter:{url:"//api.github.com/repos/{user}/{repository}?callback=JSON_CALLBACK",getNumber:function(a){return a.data.watchers_count}},clickUrl:"https://github.com/{user}/{repository}/"};return{restrict:"AC",require:"^?ngSocialButtons",scope:!0,replace:!0,transclude:!0,template:'<li>                     <a ng-href="{{ctrl.link(options)}}" target="_blank" class="ng-social-button">                         <span class="ng-social-icon"></span>                         <span class="ng-social-text" ng-transclude></span>                     </a>                     <span ng-show="count" class="ng-social-counter">{{ count }}</span>                    </li>',link:function(b,c,d,e){c.addClass("ng-social-github"),e&&(a.urlOptions={user:d.user,repository:d.repository},b.options=a,b.ctrl=e,e.init(b,c,a))}}}),app.directive("ngSocialStumbleupon",["$parse",function(a){"use strict";var b={counter:{url:"{proxy}?url={url}&type=stumbleupon&callback=JSON_CALLBACK",getNumber:function(a){return a.count}},popup:{url:"http://www.stumbleupon.com/submit?url={url}&title={title}",width:800,height:600},track:{name:"StumbleUpon",action:"share"}};return{restrict:"AC",require:"^?ngSocialButtons",scope:!0,replace:!0,transclude:!0,template:'<li>                     <a ng-href="{{ctrl.link(options)}}" target="_blank" ng-click="ctrl.clickShare($event, options)" class="ng-social-button">                         <span class="ng-social-icon"></span>                         <span class="ng-social-text" ng-transclude></span>                     </a>                     <span ng-show="count" class="ng-social-counter">{{ count }}</span>                    </li>',link:function(c,d,e,f){if(d.addClass("ng-social-google-plus"),f){b.urlOptions={url:a(e.url)(c),title:a(e.title)(c)};var g=a(e.proxyUrl)(c)||"/proxy.php";b.counter.url=b.counter.url.replace("{proxy}",g),c.options=b,c.ctrl=f,f.init(c,d,b)}}}}]),app.directive("ngSocialMoiKrug",["$parse",function(a){"use strict";var b={popup:{url:"//share.yandex.ru/go.xml?service=moikrug&url={url}&title={title}",width:800,height:600},track:{name:"MoiKrug",action:"share"}};return{restrict:"AC",require:"^?ngSocialButtons",scope:!0,replace:!0,transclude:!0,template:'<li>                     <a ng-href="{{ctrl.link(options)}}" target="_blank" ng-click="ctrl.clickShare($event, options)" class="ng-social-button">                         <span class="ng-social-icon"></span>                         <span class="ng-social-text" ng-transclude></span>                     </a>                    </li>',link:function(c,d,e,f){d.addClass("ng-social-moi-krug"),f&&(b.urlOptions={url:a(e.url)(c),title:a(e.title)(c)},c.options=b,c.ctrl=f,f.init(c,d,b))}}}]),app.directive("ngSocialLinkedin",["$parse",function(a){"use strict";var b={counter:{url:"//www.linkedin.com/countserv/count/share?url={url}&format=jsonp&callback=JSON_CALLBACK",getNumber:function(a){return a.count}},popup:{url:"http://www.linkedin.com/shareArticle?mini=true&url={url}&title={title}&summary={description}",width:600,height:450},click:function(a){return/[\.:\-–—]\s*$/.test(a.pageTitle)||(a.pageTitle+=":"),!0},track:{name:"LinkedIn",action:"share"}};return{restrict:"AC",require:"^?ngSocialButtons",scope:!0,replace:!0,transclude:!0,template:'<li>                     <a ng-href="{{ctrl.link(options)}}" target="_blank" ng-click="ctrl.clickShare($event, options)" class="ng-social-button">                         <span class="ng-social-icon"></span>                         <span class="ng-social-text" ng-transclude></span>                     </a>                     <span ng-show="count" class="ng-social-counter">{{ count }}</span>                    </li>',link:function(c,d,e,f){d.addClass("ng-social-linkedin"),f&&(b.urlOptions={url:a(e.url)(c),title:a(e.title)(c),description:a(e.description)(c)},c.options=b,c.ctrl=f,f.init(c,d,b))}}}]),angular.module("ngSocial").run(["$templateCache",function(a){a.put("/views/buttons.html",'<div class="ng-social-container ng-cloak"><ul class="ng-social" ng-transclude></ul></div>')}]);
//# sourceMappingURL=angular-social.map
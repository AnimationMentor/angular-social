This is a fork of Angular Social to support attribute directive syntax on `ng-social-*` directives.


Angular Social
==============
Code licensed under New BSD License.

Example you can see at this page: http://bazalt-cms.com/ng-table/

Using:

```
<ul ng-social-buttons
     data-url="'http://news.mistinfo.com/'"
     data-title="'test'"
     data-description="'test2'"
     data-image="'http://s3.mistinfo.com/32/d8/32d8eab76f4c242f665bda66b5edc6c5.jpg'">
    <li>Share:</li>
    <li ng-social-facebook>Facebook</li>
    <li ng-social-google-plus>Google+</li>
    <li ng-social-twitter>Twitter</li>
    <li ng-social-vk>Вконтакте</li>
    <li ng-social-odnoklassniki>Одноклассники</li>
    <li ng-social-mailru>Мой мир</li>
    <li ng-social-pinterest>Pinterest</li>
    <li ng-social-github user="esvit" repository="ng-table">GitHub</li>
    <li ng-social-github-forks user="esvit" repository="ng-table">Forks</li>
</ul>
```

You can also define a custom url, title, description or image specific to the service:

```
<ul ng-social-buttons
     data-url="'http://news.mistinfo.com/'"
     data-title="'test'"
     data-description="'test2'"
     data-image="'http://s3.mistinfo.com/32/d8/32d8eab76f4c242f665bda66b5edc6c5.jpg'">
    <li>Share:</li>
    <li ng-social-facebook>Facebook</li>
    <li ng-social-google-plus>Google+</li>
    <li ng-social-twitter data-title="'Woah check this site!'">Twitter</li>
</ul>
```

```
angular.module('main', ['ngSocial'])
```

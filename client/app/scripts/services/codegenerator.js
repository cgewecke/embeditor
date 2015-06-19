var cg_debug; 

(function(){ 
   'use strict';
   angular.module('embeditor.services.codeGenerator', ['embeditor.services.cyclopseDataAPI'])
      .service('codeGenerator', codeGenerator);
  
    function codeGenerator($q, Videos){
      var self = this;

      self.options = {
         _id: undefined,
         videoId: undefined,
         quality: 'auto',
         autoplay: false,
         loop: false,
         mute: false,
         rate: 1.0,
         start: 0.0,
         end: 0.0,
         width: 640,
         height: 360
      };

      self.frame = {

         iv_load_policy: 3,
         controls: 0,
         disablekb: 1,
         fs: 0,
         rel: 0,
         modestbranding: 1, 
         showinfo: 0
      };

      self.framesizes = {
        keys: [
          { name: 'Small', size: '560px x 315px'},
          { name: 'Medium', size: '640px x 360px'},
          { name: 'Large', size: '854px x 480px'},
          { name: 'X-large', size: '1280px x 720px'}
        ],
        vals: {
          'Small': { width: 560, height: 315},
          'Medium': { width: 640, height: 360},
          'Large': { width: 853, height: 480},
          'X-large': { width: 1280, height: 720}
        }
      };

      // create(). Returns promise. Generates database asset and sets
      // options._id to db key. 
      self.create = function(){

          var deferred = $q.defer();
          var video = new Videos(self.options);
          
          delete video['_id'];
          self.options.height = 360;
          self.options.width = 640;

          video.$save().then(
             function(saved){
                self.options._id = saved.video._id;
                deferred.resolve(saved);
             },
             function(error){
                deferred.reject(error);
             }
          );
          return deferred.promise;
      }

      // update(). Returns promise. Generates database asset and sets
      // options._id to db key. 
      self.update = function(){

          var deferred = $q.defer();
          var video = new Videos(self.options);
        
          video.$save().then(
             function(saved){ deferred.resolve(saved);
             },
             function(error){ deferred.reject(error);
                console.log('error updating video in code generator')
             }
          );
          return deferred.promise;
      }

      self.set = function(option, value){
         (value != undefined ) ? self.options[option] = value : false;
      };

      self.fixedIframe = function(){ 

         return '<iframe src="' + 
                window.location.href + 'embed/' + 
                self.options._id + '"' + ' style="width: ' + 
                self.options.width + 'px; height: ' +
                self.options.height + 'px; ' +
                'overflow: hidden; border: none;" ' +
                'scrolling="no" seamless="seamless"></iframe>';
      };

      self.responsiveIframe = function(){
        return '<iframe src="' + 
               window.location.href + 'embed/' + 
               self.options._id + '"' + 
               ' style="width: 100%; height: 100%; ' + 
               'overflow: hidden; border: none;" ' +
               'scrolling="no" seamless="seamless"></iframe>';
      };


    }; 
    codeGenerator.$inject = ['$q', 'Videos'];
   // 
})();
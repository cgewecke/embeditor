var ed_debug, ed_debugII;

(function(){
  'use strict';

  angular.module('embeditor.components.embedcodedialog', [

      'ngMaterial',
      'ngMessages',
      'embeditor.services.youtubePlayerAPI',
      'embeditor.services.codeGenerator',
      'embeditor.services.layoutManager'

      ])
    
      .service('embedCodeDialog', embedCodeDialog )
      .controller('CodeDialogCtrl', dialogCtrl)
      .directive('embeditorCopyCodeButton', copyCodeButton)
      .directive('embeditorSectionCodeDialog', embeditorSectionCodeDialog);
    
      // ---------------------------- SERVICE: ---------------------------------
      // Injected into PlayerCtrl - the open() method is called on embed btn click
      function embedCodeDialog($rootScope, $mdDialog, $window, codeGenerator, layoutManager){
         var self = this;
         var code = codeGenerator;
         var layout = layoutManager;
         
         var templateUrls = { 
            embed: 'templates/embedcode.html', 
            permalink: 'templates/permalink.html',
            share: 'templates/share.html', 
            preview: 'templates/preview.html',
            tweet: 'templates/tweet.html'
         };

         self.opening = false; // Triggers spinner on button during dialog open
         self.target = null; // Target === elem.id ? show loading spinner until dialog opens
         self.counter = 0; // Number of times opened - used to separate preview tabs.


         // Open()
         self.open = function(event, type){

            self.target = event.currentTarget.id;
            
            var template = templateUrls[type];
         
            // Dialog def
            var codeDialog = {
               clickOutsideToClose: true,  
               disableParentScroll: false,
               templateUrl: template,
               controller: dialogCtrl,
               onComplete: onOpen,
            };

            self.opening = true;

            // Launch
            $mdDialog.show(codeDialog).finally(function(){
               codeDialog = undefined;
            });
         }

         // Close();
         self.close = function() { $mdDialog.hide(); };

         // Preview(): Generates a clip in the DB 
         // On desktop & tablet -> before DB resolves, a blank tab gets opened synchonously, at DB resolution,
         //    the resolved address gets opened in that tab name. 
         // On Iphone/Ipod -> open dialog with active preview link - transfers user to mobile safari.
         self.preview = function(event){

            // Phone
            if (layout.phone || layout.android ){
               self.open(event, 'preview');
            
            // Desktop & Tablet
            } else {
            
               self.target = event.currentTarget.id;
               self.opening = true;
               self.counter += 1;
               
               code.create().then(
                  function(success){ 
                     
                     self.opening = false;  
                   
                     $window.open( $window.location.href + 'videos/' + code.options._id, 
                        'preview' + self.counter);
                     
                  },
                  function(error){ $rootScope.$broadcast('embedCodeDialog:database-error');}
               );
               
               $window.open('', 'preview' + self.counter);
            }
         };

         // Tweet(): Generates a clip in the DB 
         // On desktop & tablet -> before DB resolves, a blank tab gets opened synchonously, at DB resolution,
         //    the resolved address gets opened in that tab name. 
         // On Iphone/Ipod -> open dialog with active preview link - transfers user to mobile safari.
         self.tweet = function(event){
      
            self.target = event.currentTarget.id;
            self.opening = true;
            self.counter += 1;
            
            code.create().then(
               function(success){ 
                  
                  self.opening = false;  
                
                  // Phone
                  if (layout.phone){
                     self.open(event, 'tweet');
          
                  // Desktop & Tablet
                  } else {

                     $window.open(
                        '//www.twitter.com/intent/tweet?' + 'url=' + 
                        encodeURIComponent(window.location.href + 'videos/' + code.options._id),
                        'sharer' + self.counter
                     );
                     
                  }
               },
               function(error){ $rootScope.$broadcast('embedCodeDialog:database-error');}
            );
            
            // Open new tab in Desktop/Tablet
            (!layout.phone) ?
               $window.open('', 'sharer' + self.counter) :
               false;
         };

         // Hide btn spinner & create record of the current clip in DB
         function onOpen(){

            self.opening = false;
            code.create().then(
               function(success){ $rootScope.$broadcast('embedCodeDialog:ready');},
               function(error){   $rootScope.$broadcast('embedCodeDialog:database-error');}
            );
         };

      };
      embedCodeDialog.$inject = ['$rootScope', '$mdDialog', '$window', 'codeGenerator', 'layoutManager'];

      // -------------------- CONTROLLER: dialogCtrl(): ---------------------------------
      // Injected into the dialog window and the copy button directive
      function dialogCtrl($scope, $mdDialog, $window, $sce, codeGenerator, youtubePlayerAPI, layoutManager){

         var defaultButtonMessage = "Click to copy";  
         
         var formats = {
            'responsive': codeGenerator.responsiveIframe,
            'fixed': codeGenerator.fixedIframe
         };

         $scope.frameFormat = 'responsive'; //  Vals: 'responsive || fixed', bound to format radio btns
         $scope.framesize = 'Medium'; // //Vals: Small, Medium, Large, X-large. Embed framesize
         $scope.frameHeight = codeGenerator.framesizes.vals[$scope.framesize].height;;
         $scope.frameWidth = codeGenerator.framesizes.vals[$scope.framesize].width;
         $scope.ready = false; // When false, spinner occupies code window
         $scope.creationError = false; // When true . . . .
         $scope.highlight= true; // When true, code is faux-highlighted, false after copy btn is clicked.
         $scope.copyButtonMessage = defaultButtonMessage; // 'Click to Copy' || 'Copied'
         $scope.code = ''; // Contents of code window
         $scope.permalink = ''; // Permalink 
         $scope.embedlink = ''; // Embed link
      
         // Scoped services
         $scope.mdDialog = $mdDialog; 
         $scope.sce = $sce;
         $scope.codeGenerator = codeGenerator;
         $scope.API = youtubePlayerAPI;
         $scope.layout = layoutManager;

         

         // Framesize selection
         $scope.setDefaultFramesize = function(size){
      
            codeGenerator.set('width', codeGenerator.framesizes.vals[size].width);
            codeGenerator.set('height', codeGenerator.framesizes.vals[size].height);

            $scope.frameWidth = codeGenerator.framesizes.vals[size].width;
            $scope.frameHeight = codeGenerator.framesizes.vals[size].height;

            // Save changes & update code text
            codeGenerator.update();
            resetDisplay();
         }

         $scope.setCustomFramesize = function(){
            
            // Set to most recent values;
            ( $scope.frameWidth === undefined || $scope.frameWidth === null ) ?
                $scope.frameWidth = $scope.codeGenerator.options.width: false;

            ( $scope.frameHeight === undefined || $scope.frameHeight === null ) ?
                $scope.frameHeight = $scope.codeGenerator.options.height: false;

            // Save changes & update code text
            codeGenerator.set('width', $scope.frameWidth);
            codeGenerator.set('height', $scope.frameHeight);

            codeGenerator.update();
            resetDisplay();
         }

         // ------------------- Social Share --------------------
         $scope.facebookShare = function(){

            $window.open(
            '//www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(permalink())
            , 'sharer'
            );
            $scope.mdDialog.hide();
         };

         $scope.twitterShare = function(){
            $window.open(
               '//www.twitter.com/intent/tweet?' + 'url=' + encodeURIComponent(permalink())
               , 'sharer'
            );

            $scope.mdDialog.hide();
         };

         $scope.twitterSharePhone = function(){
            return '//www.twitter.com/intent/tweet?' + 'url=' + encodeURIComponent(permalink());
         };

         $scope.tumblrShare = function(){
            $window.open(
               '//www.tumblr.com/share/link?url=' + 
               encodeURIComponent(permalink())
               , 'sharer'
            );
            $scope.mdDialog.hide();

         }
         
         // ------------------- Watches/Events --------------------
         // Format changes
         $scope.$watch('frameFormat', function(newVal, oldVal){
            (oldVal) ?
               resetDisplay():
               false;  
         });

         // Events broadcast by embedCodeDialog service on DB call.
         // Item id & iframe address available/ Dismiss spinner
         $scope.$on('embedCodeDialog:ready', function(){
            $scope.code = formats["responsive"]();
            $scope.permalink = permalink();
            $scope.embedlink = embedlink();
            $scope.ready = true;
         });

         $scope.$on('embedCodeDialog:database-error', function(){
            $scope.creationError = true;
         })

         // -------------------  Private --------------------
         function resetDisplay(){
            $scope.copyButtonMessage = defaultButtonMessage;
            $scope.highlight = true;
            $scope.code = formats[$scope.frameFormat]();
         }

         function permalink(){
            return window.location.href + 'videos/' + codeGenerator.options._id;
         };

         function embedlink(){
            return window.location.href + 'embed/' + codeGenerator.options._id;
         };
      };
      dialogCtrl.$inject = ['$scope', '$mdDialog', '$window', '$sce', 'codeGenerator', 'youtubePlayerAPI', 'layoutManager'];

      // ------------------- DIRECTIVES ------------------------------
      // embeditor-copy-code-button: Attribute of md-button#code-copy-button
      // ZeroClipboard: copies scope.code to native clipboard on click
      function copyCodeButton(){
         return {
            restrict: 'A',
            controller: dialogCtrl,
            link: copyCodeButtonLink
         };

         function copyCodeButtonLink(scope, elem, attrs, ctrl){
            var clipboard;
            var client = new ZeroClipboard(elem);
            
            // Proxy for ZeroClipBoard callback, unit testing
            scope.onCopy = function(event){
               
               var model = scope.$eval(attrs.model);

               if (event){
                  clipboard = event.clipboardData;
                  clipboard.setData( "text/plain", model );
               }  
               scope.copyButtonMessage = "Copied."
               scope.highlight = false;
               scope.$apply();
            }

            // ZeroClipBoard callback
            client.on( "copy", function (event) { 
               scope.onCopy(event);
            });
         };
      };

      // Template compiled for Dialog Unit tests 
      function embeditorSectionCodeDialog(){
         return{ templateUrl: 'templates/embedcode.html' }
      };      
})();
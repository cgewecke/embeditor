var ed_debug, ed_debugII;

(function(){
  'use strict';

  angular.module('embeditor.components.embedcodedialog', [

      'ngMaterial',
      'ngMessages',
      'embeditor.services.youtubePlayerAPI',
      'embeditor.services.codeGenerator',

      ])
    
      .service('embedCodeDialog', embedCodeDialog )
      .controller('CodeDialogCtrl', dialogCtrl)
      .directive('embeditorCopyCodeButton', copyCodeButton)
      .directive('embeditorSectionCodeDialog', embeditorSectionCodeDialog);
    
      // ---------------------------- SERVICE: ---------------------------------
      // Injected into PlayerCtrl - the open() method is called on embed btn click
      function embedCodeDialog($rootScope, $mdDialog, codeGenerator){
         var self = this;
         var code = codeGenerator;

         // Open()
         self.open = function(event){
         
            // Dialog def
            var codeDialog = {
               clickOutsideToClose: true,  
               templateUrl: 'templates/embedcode.html',
               controller: dialogCtrl,
               onComplete: createClip
            };

            // Launch
            $mdDialog.show(codeDialog).finally(function(){
               codeDialog = undefined;
            });
         }

         // Close();
         self.close = function() { $mdDialog.hide(); };

         // Create record of the current clip in DB
         function createClip(){
            code.create().then(
               function(success){ $rootScope.$broadcast('embedCodeDialog:ready');},
               function(error){   $rootScope.$broadcast('embedCodeDialog:database-error');}
            );
         };

      };
      embedCodeDialog.$inject = ['$rootScope', '$mdDialog', 'codeGenerator'];

      // -------------------- CONTROLLER: dialogCtrl(): ---------------------------------
      // Injected into the dialog window and the copy button directive
      function dialogCtrl($scope, $mdDialog, codeGenerator, youtubePlayerAPI){

         var defaultButtonMessage = "Click to copy";  

         // Code generating functions
         var formats = {
            script: codeGenerator.script, 
            iframe: codeGenerator.iframe, 
            embedly: codeGenerator.embedly
         };

         $scope.format = 'iframe'; // Default radio btn group model val
         $scope.framesize = 'Medium'; // //Vals: Small, Medium, Large, X-large. Embed framesize
         $scope.frameHeight = codeGenerator.framesizes.vals[$scope.framesize].height;;
         $scope.frameWidth = codeGenerator.framesizes.vals[$scope.framesize].width;
         $scope.ready = false; // When false, spinner occupies code window
         $scope.creationError = false; // When true . . . .
         $scope.highlight= true; // When true, code is faux-highlighted, false after copy btn is clicked.
         $scope.copyButtonMessage = defaultButtonMessage; // 'Click to Copy' || 'Copied'
         $scope.code = ''; // Contents of code window
         $scope.mdDialog = $mdDialog; 
         $scope.codeGenerator = codeGenerator;
         $scope.API = youtubePlayerAPI;
         $scope.help = function(){}; // Redirect to /help

         // Framesize selection
         $scope.setDefaultFramesize = function(size){
      
            codeGenerator.set('width', codeGenerator.framesizes.vals[size].width);
            codeGenerator.set('height', codeGenerator.framesizes.vals[size].height);

            $scope.frameWidth = codeGenerator.framesizes.vals[size].width;
            $scope.frameHeight = codeGenerator.framesizes.vals[size].height;

            // Save changes & update code text
            codeGenerator.update();
            $scope.code = formats[$scope.format]();
         }

         $scope.setCustomFramesize = function(){
            
            // Set to most recent values;
            ( $scope.frameWidth === undefined || $scope.frameWidth === null ) ?
                $scope.frameWidth = $scope.codeGenerator.options.width: false;

            ( $scope.frameHeight === undefined || $scope.frameHeight === null ) ?
                $scope.frameHeight = $scope.codeGenerator.options.height: false;

            console.log('post reset: ' + $scope.frameWidth)
            // Save changes & update code text
            codeGenerator.set('width', $scope.frameWidth);
            codeGenerator.set('height', $scope.frameHeight);

            codeGenerator.update();
            $scope.code = formats[$scope.format]();
         }

         /*$scope.isDefaultFramesize = function(){

         }*/


         // Format changes
         $scope.$watch('format', function(newVal, oldVal){
            if(oldVal){
               $scope.copyButtonMessage = defaultButtonMessage;
               $scope.highlight = true;
               $scope.code = formats[newVal]();
            }  
         });

         // Events broadcast by embedCodeDialog service on DB call.
         // Item id & iframe address available/ Dismiss spinner
         $scope.$on('embedCodeDialog:ready', function(){
            $scope.code = formats["iframe"]();
            $scope.ready = true;
         });

         $scope.$on('embedCodeDialog:database-error', function(){
            $scope.creationError = true;
         })
      };
      dialogCtrl.$inject = ['$scope', '$mdDialog', 'codeGenerator', 'youtubePlayerAPI'];

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
               
               if (event){
                  clipboard = event.clipboardData;
                  clipboard.setData( "text/plain", scope.code );
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
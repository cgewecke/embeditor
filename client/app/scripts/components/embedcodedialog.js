var ed_debug, ed_debugII;

(function(){
  'use strict';

  angular.module('embeditor.components.embedcodedialog', ['embeditor.services.youtubePlayerAPI'])
    
      .service('embedCodeDialog', embedCodeDialog )
      .directive('embeditorCopyCodeButton', copyCodeButton);
    
      // -------------------- CONTROLLER: dialogCtrl(): ---------------------------------
      // For dialog window and the copy button directive
      function dialogCtrl($scope, $mdDialog, codeGenerator){

         var defaultButtonMessage = "Click to copy";  

         // Code generating functions
         var formats = {
            script: codeGenerator.script, 
            iframe: codeGenerator.iframe, 
            embedly: codeGenerator.embedly
         };

         $scope.format = 'iframe'; // Default radio btn group model val
         $scope.ready = false; // When false, spinner occupies code window
         $scope.highlight= true; // When true code is faux-highlighted
         $scope.copyButtonMessage = defaultButtonMessage; // 'Click to Copy' || 'Copied'
         $scope.code = ''; // Contents of code window
         $scope.help = function(){}; // Redirect to /help
         $scope.closeDialog = function(){$mdDialog.hide();} // Dismiss btn fn

         // Radio Button changes
         $scope.$watch('format', function(newVal, oldVal){
            if(oldVal){
               $scope.copyButtonMessage = defaultButtonMessage;
               $scope.highlight = true;
               $scope.code = formats[newVal]();
            }  
         });

         // Event broadcast by embedCodeDialog service on DB call.
         // Item id & iframe address available/ Dismiss spinner
         $scope.$on('embedCodeDialog:videoCreated', function(){
            $scope.code = formats["iframe"]();
            $scope.ready = true;
         });
      };
      dialogCtrl.$inject = ['$scope', '$mdDialog', 'codeGenerator'];

      // ----------------- SERVICE: --------------------
      function embedCodeDialog($rootScope, $mdDialog, Videos, codeGenerator){
         var self = this;
         var code = codeGenerator;
         var createEvent = {name: 'embedCodeDialog:videoCreated'};

         // Open and close methods
         self.openEmbedCodeDialog = function(event){
         
            var codeDialog = {
               clickOutsideToClose: true,  
               templateUrl: 'templates/embedcode.html',
               controller: dialogCtrl
            };

            createVideo();

            $mdDialog.show(codeDialog).finally(function(){
               codeDialog = undefined;
            });
         }

         self.closeEmbedCodeDialog = function() {
           $mdDialog.hide();
         };

         // createVideo(): Create DB object, get DB id for 
         // iframe address
         function createVideo(){
            var video = new Videos(code.options);
            video.$save().then(
               function(saved){
                  console.log("DB SAVE: " + window.location.href);
                  code.options._id = saved.video._id;
                  $rootScope.$broadcast(createEvent.name);
               },
               function(error){
                  console.log('ERROR creating video');
                  ed_debug = error;
               }
            );
         }
      };
      embedCodeDialog.$inject = ['$rootScope', '$mdDialog', 'Videos', 'codeGenerator'];

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

            client.on( "copy", function (event) {
               clipboard = event.clipboardData;
               clipboard.setData( "text/plain", scope.code );
               scope.copyButtonMessage = "Copied."
               scope.highlight = false;
               scope.$apply();
            });
         };
      };

      
})();
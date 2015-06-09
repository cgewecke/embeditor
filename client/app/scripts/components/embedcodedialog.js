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
         $scope.creationError = false; // When true . . . .
         $scope.highlight= true; // When true code is faux-highlighted, false after copy btn is clicked.
         $scope.copyButtonMessage = defaultButtonMessage; // 'Click to Copy' || 'Copied'
         $scope.code = ''; // Contents of code window
         $scope.help = function(){}; // Redirect to /help
         $scope.close = function(){ $mdDialog.hide();} // Dismiss btn fn

         // Radio Button changes
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
      dialogCtrl.$inject = ['$scope', '$mdDialog', 'codeGenerator'];

      // ---------------------------- SERVICE: ---------------------------------
      // 
      function embedCodeDialog($rootScope, $mdDialog, codeGenerator){
         var self = this;
         var code = codeGenerator;

         // Open()
         self.open = function(event){
         
            // Dialog def
            var codeDialog = {
               clickOutsideToClose: true,  
               templateUrl: 'templates/embedcode.html',
               controller: dialogCtrl
            };

            // Create record
            code.create().then(
               function(success){
                  $rootScope.$broadcast('embedCodeDialog:ready');
               },
               function(error){
                  $rootScope.$broadcast('embedCodeDialog:database-error')
               }
            );

            // Launch
            $mdDialog.show(codeDialog).finally(function(){
               codeDialog = undefined;
            });
         }

         // Close();
         self.close = function() { $mdDialog.hide(); };

      };
      embedCodeDialog.$inject = ['$rootScope', '$mdDialog', 'codeGenerator'];

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
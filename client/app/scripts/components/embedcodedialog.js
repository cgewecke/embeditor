var ed_debug, ed_debugII;

(function(){
  'use strict';

  angular.module('embeditor.components.embedcodedialog', ['embeditor.services.youtubePlayerAPI'])
    
      .service('embedCodeDialog', embedCodeDialog )
      .directive('embeditorCopyCodeButton', copyCodeButton);
    
      // dialogCtrl(): Controller for the dialog window and 
      // the copy button directive
      function dialogCtrl($scope, $mdDialog, codeGenerator){

         var defaultButtonMessage = "Click to copy";
         var formats = {
            script: codeGenerator.script, 
            iframe: codeGenerator.iframe, 
            embedly: codeGenerator.embedly
         };

         $scope.format = 'iframe';
         $scope.highlight= true;
         $scope.copyButtonMessage = defaultButtonMessage;
         $scope.code = formats["iframe"]();
         $scope.help = function(){ console.log('help clicked')};
         $scope.closeDialog = function(){$mdDialog.hide();}

         // Radio Button changes
         $scope.$watch('format', function(newVal, oldVal){
            if(oldVal){
               $scope.copyButtonMessage = defaultButtonMessage;
               $scope.highlight = true;
               $scope.code = formats[newVal]();
            }  
         });
      };
      dialogCtrl.$inject = ['$scope', '$mdDialog', 'codeGenerator'];

      // Service. Open and close methods
      function embedCodeDialog($mdDialog){
         var self = this;

         self.openEmbedCodeDialog = function(event){
            console.log('opening dialog');
            var codeDialog = {
               clickOutsideToClose: true,  
               templateUrl: 'templates/embedcode.html',
               controller: dialogCtrl
            };

            $mdDialog.show(codeDialog).finally(function(){
               codeDialog = undefined;
            });
         }

         self.closeEmbedCodeDialog = function() {
           $mdDialog.hide();
         };

      };
      embedCodeDialog.$inject = ['$mdDialog'];

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
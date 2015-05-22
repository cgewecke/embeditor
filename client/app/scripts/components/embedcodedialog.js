var ed_debug, ed_debugII;

var testcode = '\
  <script>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,\
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo\
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse\
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</script>';

(function(){
  'use strict';

  angular.module('embeditor.components.embedcodedialog', ['embeditor.services.youtubePlayerAPI'])
    
      .service('embedCodeDialog', embedCodeDialog )
      .directive('embeditorCopyCodeButton', copyCodeButton);
    
      // dialogCtrl(): Controller for the dialog window and 
      // the copy button directive
      function dialogCtrl($scope, $mdDialog, youtubePlayerAPI){

         var defaultButtonMessage = "Click to copy";

         $scope.API = youtubePlayerAPI;
         $scope.format = 'raw';
         $scope.highlight= true;
         $scope.copyButtonMessage = defaultButtonMessage;
         $scope.code = testcode;
         $scope.help = function(){ console.log('help clicked')};
         $scope.closeDialog = function(){$mdDialog.hide();}

         // Radio Button changes
         $scope.$watch('format', function(newVal, oldVal){
            if(oldVal){
               $scope.copyButtonMessage = defaultButtonMessage;
               $scope.highlight = true;
            // REFORMAT scope.code . . . .
            }  
         });
      };
      dialogCtrl.$inject = ['$scope', '$mdDialog', 'youtubePlayerAPI'];

      // Service. Open and close methods
      function embedCodeDialog($mdDialog){
         var self = this;

         self.openEmbedCodeDialog = function(event){
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
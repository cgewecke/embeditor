"use strict";
var ebd_debug, ebd_debugII;
describe('Component: Embed Code Dialog Window', function(){

  beforeEach(module('embeditor'));
  beforeEach(module('templates'));

  var scope, compile, timeout, playerAPI, code, ctrl, dialog, mdDialog;
  var video = { seconds: 414 };
      
  beforeEach(inject(function ($controller, $rootScope, $compile, $interval, $timeout, 
    $mdDialog, embedCodeDialog, codeGenerator) {

    scope = $rootScope.$new();
    compile = $compile;
    timeout = $timeout;
    mdDialog = $mdDialog
    code = codeGenerator;
    
    ctrl = $controller("CodeDialogCtrl", {$scope: scope });
    dialog = angular.element('<embeditor-section-code-dialog></embeditor-section-code-dialog>');

    compile(dialog)(scope);
    scope.$digest();

  }));

  it('should close when the dismiss icon is clicked', function(){

    var dismiss = dialog.find('button#code-dialog-dismiss-btn');
    var localScope = dismiss.scope();

    spyOn(localScope.mdDialog, 'hide');
    dismiss.triggerHandler('click');
    expect(localScope.mdDialog.hide).toHaveBeenCalled();

  });

  describe('formatting options radio button group', function(){

      it('should be bound to the value of $scope.format', function(){
        var group = dialog.find('md-radio-group#code-dialog-format-group');
        var ngModel = group.controller('ngModel');
        var localScope = group.scope();
         
        localScope.format = 'iframe';
        scope.$apply();
        expect(ngModel.$modelValue).toBe('iframe');

        localScope.format = 'script';
        scope.$apply();
        expect(ngModel.$modelValue).toBe('script');

      });

      it('should format the code text as <iframe> when iframe is selected', function(){
        var group = dialog.find('md-radio-group#code-dialog-format-group');
        var ngModel = group.controller('ngModel');
        var localScope = group.scope();
         
        localScope.format = 'iframe';
        scope.$apply();
        expect(localScope.code).toEqual(code.iframe());

      });

      it('should format the code text as HTML/JS  when html/js is selected', function(){

        var group = dialog.find('md-radio-group#code-dialog-format-group');
        var ngModel = group.controller('ngModel');
        var localScope = group.scope();
         
        localScope.format = 'script';
        localScope.$apply();
        expect(localScope.code).toEqual(code.script());

      });

      it('should format the code text as an embedly link when embedly is selected', function(){
        console.log('Embedly format not IMPLEMENTED: Component: Embed Code Dialog Window.');
      });

  });

  describe('code text', function(){
    
      it('should be selected when the dialog opens', function(){

        var code_text = dialog.find('span#embed-code-text');
        expect(code_text.hasClass('embed-code-highlight')).toBe(true);
      });

      it('should get deselected when a copy event occurs', function(){
        var code_text = dialog.find('span#embed-code-text');
        
        scope.onCopy();
        scope.$apply();

        expect(code_text.hasClass('embed-code-highlight')).toBe(false);
      })

      it('should get re-selected when the format options are changed', function(){
        var code_text = dialog.find('span#embed-code-text');
        scope.highlight = false;
        scope.format = 'iframe';
        scope.$apply();
        expect(code_text.hasClass('embed-code-highlight')).toBe(false);

        scope.format = 'script';
        scope.$apply();
        expect(code_text.hasClass('embed-code-highlight')).toBe(true);

      });
  });

  // This is implemented using ZeroClipboard's flash movie strat. and not clickable in 
  // test 
  describe('copy to clipboard button', function(){

      it('should copy the current code text to the clipboard', function(){
        // Verified manually
      });

      it('should say "Copied." after the copy event', function(){
        var button = dialog.find('button#code-copy-button');
        scope.onCopy();
        scope.$apply();
        expect(button.text().trim()).toEqual('Copied.');
      });

      it('should reset to "Click to copy" when format options are changed', function(){
        var button = dialog.find('button#code-copy-button');
        scope.onCopy();
        scope.$apply();
        scope.format = 'script';
        scope.$apply();
        expect(button.text().trim()).toEqual('Click to copy');

      });

  });

  describe('help link', function(){
      it('should open a new tab with lots of helpful information about embedding on it', function(){
        console.log('Help link not IMPLEMENTED: Component: Embed Code Dialog Window');
      });
  })

});
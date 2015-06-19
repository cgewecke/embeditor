"use strict";
var ebd_debug, ebd_debugII;
describe('Component: Embed Code Dialog Window', function(){

  beforeEach(module('embeditor'));
  beforeEach(module('templates'));

  var scope, compile, timeout, playerAPI, code, ctrl, dialog, mdDialog, httpBackend;
  var video = { seconds: 414 };
      
  beforeEach(inject(function ($controller, $rootScope, $compile, $interval, $timeout, 
    $mdDialog, $httpBackend, embedCodeDialog, codeGenerator ) {

    scope = $rootScope.$new();
    compile = $compile;
    timeout = $timeout;
    mdDialog = $mdDialog
    code = codeGenerator;
    httpBackend = $httpBackend;
    
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


  describe('embedCodeDialog Service', function(){

    it('should create a DB record for the clip on window open', function(){
      console.log('unit tests: embeddialog.js: DB tests are missing');
    });

    it('should fire a ready event when the DB call returns with DB id', function(){

    });

    it('should fire a server failure event when the DB call fails', function(){

    });

    it('should open the correct template based on which button was clicked', function(){

    });

    it('should set the public "opening" variable on open, false when the dialog open has completed', function(){

    });

  });

  describe('formatting options radio button group', function(){

      it('should be bound to the value of $scope.format', function(){
        var group = dialog.find('md-radio-group#code-dialog-format-group');
        var ngModel = group.controller('ngModel');
        var localScope = group.scope();
         
        localScope.frameFormat = 'responsive';
        scope.$apply();
        expect(ngModel.$modelValue).toBe('responsive');

        localScope.frameFormat = 'fixed';
        scope.$apply();
        expect(ngModel.$modelValue).toBe('fixed');

      });

      it('should format the code text as <iframe> when iframe is selected', function(){
        var group = dialog.find('md-radio-group#code-dialog-format-group');
        var localScope = group.scope();
         
        localScope.frameFormat = 'responsive';
        scope.$apply();
        expect(localScope.code).toEqual(code.responsiveIframe());

      });

      it('should format the code text as HTML/JS  when html/js is selected', function(){

        var group = dialog.find('md-radio-group#code-dialog-format-group');
        var ngModel = group.controller('ngModel');
        var localScope = group.scope();
         
        localScope.frameFormat = 'fixed';
        scope.$apply();
        expect(localScope.code).toEqual(code.fixedIframe());

      });

      it('should disable the options by default', function(){
        var iframe_btn = dialog.find("md-radio-button#embed-iframe-btn");
        var script_btn = dialog.find("md-radio-button#embed-iframe-btn");

        expect(iframe_btn.attr('disabled')).toEqual('disabled');
        expect(script_btn.attr('disabled')).toEqual('disabled');

      });

      it('should enable the options when it hears the "embedCodeDialog:ready" event', function(){

        var iframe_btn = dialog.find("md-radio-button#embed-iframe-btn");
        var script_btn = dialog.find("md-radio-button#embed-iframe-btn");

        scope.$broadcast('embedCodeDialog:ready');
        scope.$apply();
        expect(iframe_btn.attr('disabled')).toBeUndefined();
        expect(script_btn.attr('disabled')).toBeUndefined();
      });

  });

  describe('frame size select', function(){
     // 560 x 315 small
     // 640 x 360 medium
     // 853 x 480 large 
     // 1280 x 720 x-large
     var div, select, ngModel;
     beforeEach(function(){
        div = dialog.find('div#embed-framesize-selection'); // Select hijacks the id attr. . . .
        select = div.find('md-select');  
        ngModel = select.controller('ngModel'); 
        httpBackend.whenPOST('/api/videos').respond('');

     });

     it('should have a default value of "medium" ', function(){
        expect(ngModel.$modelValue).toBe('Medium');  
     });

     it('should be bound to the value of playerAPI.framesize', function(){
        scope.framesize = 'Small';
        scope.$apply();
        expect(ngModel.$modelValue).toBe('Small');

        scope.framesize = 'Large';
        scope.$apply();
        expect(ngModel.$modelValue).toBe('Large');
     });

     
     it('should update the codeGenerator options when the model is changed', function(){
      
        // Problems firing the ng-change on md-select. setFramesize(ng-model) is
        // its contents
        scope.setDefaultFramesize('X-large');
        scope.$apply();
        expect(scope.codeGenerator.options.width).toEqual(1280);
        expect(scope.codeGenerator.options.height).toEqual(720);

        scope.setDefaultFramesize('Small');
        scope.$apply();
        expect(code.options.width).toEqual(560);
        expect(code.options.height).toEqual(315);
    
     });

     it('should save the changes to the DB', function(){
        spyOn(scope.codeGenerator, 'update');
        scope.setDefaultFramesize('X-large');
        expect(scope.codeGenerator.update).toHaveBeenCalled();

     });

     it('should update the code text when the model is changed', function(){

        var original_code = code.fixedIframe();
        var group = dialog.find('md-radio-group#code-dialog-format-group');
        var localScope = group.scope();

        // Init scope.code to script();
        localScope.frameFormat = 'fixed';
        localScope.$apply();

        // Change size
        scope.setDefaultFramesize('X-large');
        scope.$apply();
        expect(original_code).not.toEqual(localScope.code);
     });

     it('should be disabled by default', function(){

        expect(select.attr('disabled')).toEqual('disabled');

     });

     it('should be disabled after the "embedCodeDialog:ready" event fires', function(){

        scope.$broadcast('embedCodeDialog:ready');
        scope.$apply();
        expect(select.attr('disabled')).toEqual('disabled');
     });

     it('should be enabled when the "fixed" option is selected', function(){
        scope.$broadcast('embedCodeDialog:ready');
        scope.frameFormat = 'fixed';
        scope.$apply();
        expect(select.attr('disabled')).toBeUndefined();
     })

     it('should not have selection styling on any option if the API.framesize value is "custom"', function(){
        console.log('unit tests: embeddialog.js: selection style "custom" test is missing');
     })

  });

  describe('framesize inputs', function(){
    console.log('unit tests: embeddialog.js: framesize inputs tests are missing');
    
    it('should be bound to the value of API.framesize', function(){

    });

    it('should set API.framesize to "custom" if the inputs dont match a default val', function(){

    });

    it('should not allow any values other than whole integers', function(){

    });

    it('should show value of selected option, if one is selected', function(){

    });

    it('should update the code options & save to DB when height/width are changed', function(){

    });

    it('should not update/save illegal values', function(){

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
        scope.frameFormat = 'responsive';
        scope.$apply();
        expect(code_text.hasClass('embed-code-highlight')).toBe(false);

        scope.frameFormat = 'fixed';
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

      it('should be data-bound to the value of attribute "model"', function(){
        console.log('unit tests: embeddialog.js: copy button model test is missing');
      })

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
        scope.frameFormat = 'fixed';
        scope.$apply();
        expect(button.text().trim()).toEqual('Click to copy');

      });

      it('should reset to "Click to copy" when framesize is changed', function(){
        console.log('unit tests: code dialog: test missing: clicktocopy reset on framesize change');
      });

      it('should be disabled by default', function(){
        console.log('unit tests: code dialog: test/logic missing copy button disabled');
      });

      it('should be enabled when the "embedCodeDialog:ready" event fires', function(){
        console.log('unit tests: code dialog: test/logic missing copy button disabled');
      });

  });

  describe('help link', function(){
      it('should open a new tab with lots of helpful information about embedding on it', function(){
        console.log('Help link not IMPLEMENTED: Component: Embed Code Dialog Window');
      });
  })

});
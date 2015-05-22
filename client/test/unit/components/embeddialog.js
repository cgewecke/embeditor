"use strict";

describe('Component: Embed Code Dialog Window', function(){

  beforeEach(module('embeditor'));
  beforeEach(module('templates'));

  it('should open when the embed code button is clicked', function(){

  });

  it('should close on click outside the dialog', function(){

  });

  it('should close when the dismiss icon is clicked', function(){

  });



  describe('formatting options radio button group', function(){

      it('should format the code text as <iframe> when iframe is selected', function(){

      });

      it('should format the code text as HTML/JS  when html/js is selected', function(){

      });

      it('should format the code text as an embedly link when embedly is selected', function(){

      });

  });

  describe('code text', function(){
    
      it('should be selected when the dialog opens', function(){

      });

      it('should get deselected when a copy event occurs', function(){

      })

      it('should get re-selected when the format options are changed', function(){

      });

      it('should get copied to the clipboard when ctrl c is pressed', function(){

      });
  });

  describe('copy to clipboard button', function(){

      it('should copy the current code text to the clipboard', function(){

      });

      it('should say "Copied." after the copy event', function(){

      });

      it('should say "Click to copy" when format options are changed', function(){

      });

  });

  describe('help link', function(){
      it('should open a new tab with lots of helpful information about embedding on it', function(){

      });
  })

});
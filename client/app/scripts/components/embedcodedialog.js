(function(){ 'use strict';
/**
 * Manages the app page's dialog box for embed code options. Generates twitter and other share urls, 
 * and produces a preview embed. This component is where the user first engages the server
 * and creates a record of the edit in the DB. 
 * @component embedCodeDialog
 */
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

/**
 * Dialog service. Injected into PlayerCtrl.
 * @service embedCodeDialog 
 */
function embedCodeDialog($rootScope, $mdDialog, $window, youtubePlayerAPI, codeGenerator, layoutManager){
    var self = this;
    var code = codeGenerator;
    var layout = layoutManager;
    var API = youtubePlayerAPI;
     
    var templateUrls = { 
        embed: 'templates/embedcode.html', 
        permalink: 'templates/permalink.html',
        share: 'templates/share.html', 
        preview: 'templates/preview.html',
        tweet: 'templates/tweet.html'
    };

    self.opening = false; // Triggers spinner on button during dialog open
    self.target = null;   // Target === elem.id ? show loading spinner until dialog opens
    self.counter = 0;     // Number of times opened - used to separate preview tabs.

    /**
     * Launches an $mdDialog box after selecting a template for it based on which button 
     * was clicked. 
     * @method  open 
     * @param  {Object} event DOM click event used to arbitrate template selection.
     * @param  {String} type  the html template to load into the dialog instance
     */
    self.open = function(event, type){

        var template = templateUrls[type];
        self.target = event.currentTarget.id;
    
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

    /**
     * Hides $mdDialog box
     * @method close 
     */
    self.close = function() { $mdDialog.hide(); };

    /**
     * Launches preview dialog. Pauses editor player if it is currently running.
     * @method  preview
     * @param  {Object} event Dom click event
     */
    self.preview = function(event){

        (API.state == 1 )
            ? API.togglePlay()
            : null;

        self.open(event, 'preview');
    };

    /**
     * Generates a clip in the DB for twitter post. Opens a blank tab before DB call and re-directs it to correct 
     * embed address when the DB asset resolves.
     * @method  tweet
     * @param  {Object} event DOM click event
     */
    self.tweet = function(event){
  
        self.target = event.currentTarget.id;
        self.opening = true;
        self.counter += 1;
        code.set('autoplay', true);
        
        code.create().then(function(success){ 
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
        }, function(error){ 
            self.opening = false;  
            $rootScope.$broadcast('embedCodeDialog:database-error');
        });
        
        // Open new tab in Desktop/Tablet
        (!layout.phone) ?
            $window.open('', 'sharer' + self.counter) :
            false;
    };

    /**
     * Hides btn spinner & creates record of the current clip in DB
     * @method onOpen
     */
    function onOpen(){
        self.opening = false;
        code.create().then(
            function(success){ $rootScope.$broadcast('embedCodeDialog:ready');},
            function(error){   $rootScope.$broadcast('embedCodeDialog:database-error');}
        );
    };
};
embedCodeDialog.$inject = ['$rootScope', '$mdDialog', '$window', 'youtubePlayerAPI', 'codeGenerator', 'layoutManager'];

// -------------------------------------------- CONTROLLER ------------------------------------------------
/**
 * Manages the embed-code options dialog which lets user specify size and type of embed.
 * Also houses social share link generators. Injected into the dialog window and the copy button directive.
 * @controller dialogCtrl
 */ 
function dialogCtrl($scope, $mdDialog, $window, $timeout, codeGenerator, youtubePlayerAPI, layoutManager){

    var defaultButtonMessage = "Click to copy";  
     
    var formats = {
        'responsive': codeGenerator.responsiveIframe,
        'fixed': codeGenerator.fixedIframe
    };

    $scope.frameFormat = 'responsive';               // Vals: 'responsive || fixed', bound to format radio btns
    $scope.framesize = 'Medium';                     // Vals: Small, Medium, Large, X-large. Embed framesize
    $scope.ready = false;                            // When false, spinner occupies code window
    $scope.delayed_ready = false;                    // When false, spinner occupies preview window (phones)
    $scope.creationError = false;                    // When true . . . .
    $scope.highlight= true;                          // When true, code is faux-highlighted, false after copy btn is clicked.
    $scope.copyButtonMessage = defaultButtonMessage; // 'Click to Copy' || 'Copied'
    $scope.code = '';                                // Contents of code window
    $scope.permalink = '';                           // Permalink 
    $scope.embedlink = '';                           // Embed link

    $scope.frameHeight = codeGenerator.framesizes.vals[$scope.framesize].height;;
    $scope.frameWidth = codeGenerator.framesizes.vals[$scope.framesize].width;
  
    // Scoped services
    $scope.mdDialog = $mdDialog; 
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

    // ----------------------------- Social Share --------------------------------------
    
    $scope.facebookShare = function(){
        $window.open(
        '//www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(embedlink()), 'sharer');
        $scope.mdDialog.hide();
    };

    $scope.twitterShare = function(){
        $window.open('//www.twitter.com/intent/tweet?' + 'url=' + encodeURIComponent(embedlink()), 'sharer');
        $scope.mdDialog.hide();
    };

    $scope.twitterSharePhone = function(){
        return '//www.twitter.com/intent/tweet?' + 'url=' + encodeURIComponent(embedlink());
    };

    $scope.tumblrShare = function(){
        $window.open('//www.tumblr.com/share/link?url=' + encodeURIComponent(permalink()),'sharer');
        $scope.mdDialog.hide();
    }

    function permalink(){
        return window.location.href + 'videos/' + codeGenerator.options._id;
    };

    function embedlink(){
        return window.location.href + 'embed/' + codeGenerator.options._id;
    };
     
    // ----------------------------- Watches/Events -------------------------------------
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

        // Render delay for IPhone preview iframe
        $timeout(function(){ $scope.delayed_ready = true;}, 1000 );
    });

    $scope.$on('embedCodeDialog:database-error', function(){
        $scope.creationError = true;
    })

    // ------------------------------  Utilities ------------------------------------------
    function resetDisplay(){
        $scope.copyButtonMessage = defaultButtonMessage;
        $scope.highlight = true;
        $scope.code = formats[$scope.frameFormat]();
    }
};
dialogCtrl.$inject = ['$scope', '$mdDialog', '$window', '$timeout', 'codeGenerator', 'youtubePlayerAPI', 'layoutManager'];

// ---------------------------------- DIRECTIVE ------------------------------------------
/**
 * <embeditor-copy-code-button> : Wraps and manages ZeroClipboard instance which 
 * copies a generated embed-code to the native clipboard.
 * @directive copyCodeButton 
 */
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

// ---------------------------------- Unit Testing ------------------------------------------
// Template compiled for Dialog Unit tests 
function embeditorSectionCodeDialog(){
    return{ templateUrl: 'templates/embedcode.html' }
};

// End Closure.      
})();
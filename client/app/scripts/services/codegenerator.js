(function(){ 'use strict';
/**
 * $resource to save video clip records to remote DB.
 * @factory cyclopseDataAPI
 */
angular.module('embeditor.services.cyclopseDataAPI', [])
    .factory('Videos', videos)

    function videos($resource){ return $resource('/api/videos/:id', {id: '@_id' }) };
    videos.$inject = ['$resource'];

/**
 * Service to create video clip records for the remote DB and generate shareable links/
 * iframe code snippets for them.
 * @service codeGenerator
 */
angular.module('embeditor.services.codeGenerator', ['embeditor.services.cyclopseDataAPI'])
    .service('codeGenerator', codeGenerator);
    
function codeGenerator($q, Videos){
    
    var self = this;
    
    /**
     * Video clip record options.
     * @type {Object} options
     */
    self.options = {
        _id: undefined,
        videoId: undefined,
        quality: 'auto',
        autoplay: false,
        loop: false,
        mute: false,
        rate: 1.0,
        start: 0.0,
        end: 0.0,
        width: 640,
        height: 360,
        title: '',
        imageUrl: ''
    };
    /**
     * Options metadata for the YouTube player instance
     * @type {Object} frame
     */
    self.frame = {
         iv_load_policy: 3,
         controls: 0,
         disablekb: 1,
         fs: 0,
         rel: 0,
         modestbranding: 1, 
         showinfo: 0
    };
    /**
     * Predefined embed sizes
     * @type {Object} framesizes
     */
    self.framesizes = {
        keys: [
            { name: 'Small', size: '560px x 315px'},
            { name: 'Medium', size: '640px x 360px'},
            { name: 'Large', size: '854px x 480px'},
            { name: 'X-large', size: '1280px x 720px'}
        ],
        vals: {
            'Small': { width: 560, height: 315},
            'Medium': { width: 640, height: 360},
            'Large': { width: 853, height: 480},
            'X-large': { width: 1280, height: 720}
        }
    };
    /**
     * Generates video clip asset in the DB and sets options._id to db key. 
     * @method  create 
     * @return {Promise} Resolves the DB record.
     */
    self.create = function(){

            var video = new Videos(self.options);
            
            delete video['_id'];
            self.options.height = 360;
            self.options.width = 640;

            return video.$save().then(function(saved){
                    self.options._id = saved.video._id;
                    return saved;
            });     
    };
    /**
     * Updates video clip asset in the DB
     * @return {Promise} Resolves an updated DB record
     */
    self.update = function(){
            var video = new Videos(self.options);
            return video.$save();
    };
    /**
     * Updates video clip options object
     * @method  set 
     * @param {String} option key
     * @param {(String|Number)} value  
     */
    self.set = function(option, value){
         (value != undefined ) 
            ? self.options[option] = value 
            : false;
    };
    /**
     * Generates a fixed sized Iframe code snippet for current clip.
     * @method  fixedIframe 
     * @return {String} code snippet
     */
    self.fixedIframe = function(){ 
        return '<iframe src="' + 
                window.location.origin + '/embed/' + 
                self.options._id + '"' + ' style="width: ' + 
                self.options.width + 'px; height: ' +
                self.options.height + 'px; ' +
                'overflow: hidden; border: none;" ' +
                'scrolling="no" seamless="seamless"></iframe>';
    };
    /**
     * Generates a responsive Iframe code snippet for current clip.
     * @method  responsiveIframe 
     * @return {String} code snippet
     */
    self.responsiveIframe = function(){
        return '<iframe src="' + 
                window.location.origin + '/embed/' + 
                self.options._id + '"' + 
                ' style="width: 100%; height: 100%; ' + 
                'overflow: hidden; border: none;" ' +
                'scrolling="no" seamless="seamless"></iframe>';
    };
}; 
codeGenerator.$inject = ['$q', 'Videos'];

// End closure.
})();
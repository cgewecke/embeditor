describe('Service: youtubePlayerAPI', function () {

  // load the controller's module
  beforeEach(module('embeditor'));

  describe('Player Controls', function(){

      // mock events;

      it('should disable controls until the player has loaded the video',function(){

      });

      describe('Play button', function(){

         it('should start playing the video if video is paused, and display a pause icon', function(){

         });

         it('should pause the video if the video is playing and display a play icon', function(){

         });

      });

      describe('Loading indicator', function(){

         it('should display the amount of video that has loaded', function(){

         });

      });

      describe('Playback speed setter', function(){
         
         it('should set the player playback speed', function(){

         });

         it('should be disabled if there are no playback speed options', function(){

         });

         it('should have a tooltip that explains why it is disabled', function(){

         });
      });

      describe('Loop toggle', function(){

         it('should cause the player to loop when on', function(){

         });

         it('should cause the player to stop playing at the endpoint when off', function(){

         });

         it('should be on by default', function(){

         }); 

      })

      describe('Advanced Options menu', function(){
         it('should show all the iframe parameters and allow the user to set them', function(){

         });
      })

      // Start point controls 
      describe('startpoint display', function(){
         it('should show the current value of the startpoint', function(){

         });
      })


      describe('Seek frame button forward: startpoint', function(){

         it('should advance the playhead one frame, and pause the player', function(){

         });

         it('should be disabled if the playhead is less than one second away from the endpoint', function(){

         })

         it('should set the startpoint at the playhead position', function(){

         })

         it('should synch the sliders left handle to the new startpoint value', function(){

         });
         

      })

      describe('Seek second button forward: startpoint', function(){

         it('should advance the playhead one second, and pause the player', function(){

         });

         it('should be disabled if the playhead is less than one second away from the endpoint', function(){

         })

         it('should set the startpoint at the playhead position', function(){

         })

         it('should synch the sliders left handle to the new startpoint value', function(){

         });

      })

      describe('Seek 5 second button forward: startpoint', function(){

         it('should advance the playhead 5 seconds, and pause the player', function(){

         });

         it('should be disabled if the playhead is less than 5 seconds away from the endpoint', function(){

         })

         it('should set the startpoint at the playhead position', function(){

         })

         it('should synch the sliders left handle to the new startpoint value', function(){

         });

      });

      describe('Seek frame button backward: startpoint ', function(){

         it('should set the playhead back one frame, and pause the player', function(){

         });

         it('should be disabled if the playhead is at video start', function(){

         })

         it('should not allow the playhead to be set before video start', function(){

         });

         it('should set the startpoint at the playhead position', function(){

         })

         it('should synch the sliders left handle to the new startpoint value', function(){

         });

      });

      describe('Seek second button backward: startpoint', function(){

         it('should set the playhead back one second, and pause the player', function(){

         });

         it('should be disabled if the playhead is at video start', function(){

         })

         it('should not allow the playhead to be set before video start', function(){

         });

         it('should set the startpoint at the playhead position', function(){

         })

         it('should synch the sliders left handle to the new startpoint value', function(){

         });

      })

      describe('Seek 5 second button backward: startpoint', function(){

         it('should set the playhead back one second, and pause the player', function(){

         });

         it('should be disabled if the playhead is at video start', function(){

         })

         it('should not allow the playhead to be set before video start', function(){

         });

         it('should set the startpoint at the playhead position', function(){

         })

         it('should synch the sliders left handle to the new startpoint value', function(){

         });


      });

      // End point controls 
      describe('Seek frame button forward: endpoint', function(){

         it('should move the playhead to the endpoint + 1 frame and pause the player', function(){

         });

         it('should be disabled if the playhead is at video end', function(){

         })

         it('should not allow the playhead to be set past video end', function(){

         });


         it('should set the endpoint at the new playhead position', function(){

         })

         it('should synch the sliders right handle to the new endpoint value', function(){

         });
         

      })

      describe('Seek second button forward: startpoint', function(){

         
         it('should move the playhead to the endpoint + 1 second and pause the player', function(){

         });

         it('should be disabled if the playhead is at video end', function(){

         })

         it('should not allow the playhead to be set past video end', function(){

         });

         it('should set the endpoint at the new playhead position', function(){

         })

         it('should synch the sliders right handle to the new startpoint value', function(){

         });

      })

      describe('Seek 5 second button forward: startpoint', function(){

         it('should move the playhead to the endpoint + 5 seconds and pause the player', function(){

         });

         it('should be disabled if the playhead is at video end', function(){

         })

         it('should not allow the playhead to be set past video end', function(){

         });

         it('should set the endpoint at the new playhead position', function(){

         })

         it('should synch the sliders right handle to the new startpoint value', function(){

         });

      });

      describe('Seek frame button backward: startpoint ', function(){

         it('should set the playhead back one frame, and pause the player', function(){

         });

         it('should be disabled if the playhead is less than one second away from the startpoint', function(){

         })

         it('should set the endpoint at the new playhead position', function(){

         })

         it('should synch the sliders right handle to the new startpoint value', function(){

         });
         
      });

      describe('Seek second button backward: startpoint', function(){

         it('should set the playhead back one second, and pause the player', function(){

         });

         it('should be disabled if the playhead is less than one second away from the startpoint', function(){

         })

         it('should set the endpoint at the new playhead position', function(){

         })

         it('should synch the sliders right handle to the new startpoint value', function(){

         });

      })

      describe('Seek 5 second button backward: startpoint', function(){

         it('should set the playhead back 5 seconds, and pause the player', function(){

         });

         it('should be disabled if the playhead is less than one second away from the startpoint', function(){

         })

         it('should set the endpoint at the new playhead position', function(){

         })

         it('should synch the sliders right handle to the new startpoint value', function(){

         });


      });

      describe('endpoint display', function(){
         it('should show the current value of the endpoint', function(){

         });
      })

      // HOW TO HANDLE SKIP PLAY
      describe('Start/End points slider/setter', function(){

         it('should set the value of the endpoints when its handles are dragged', function(){

         });

         it('should show the appropriate keyframes in the view as the handles are dragged', function(){

         });

         it('should always maintain a minimum distance of 1 second between endpoints', function(){

         });

      });

      

  })

});
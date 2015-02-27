(function ($) {
  AblePlayer.prototype.initSignLanguage = function() { 
    
    // only initialize sign language if user wants it 
    // since it requires downloading a second video & consumes bandwidth
    if (this.prefSignLanguage) {     
      // check to see if there's a sign language video accompanying this video
      // check only the first source 
      // If sign language is provided, it must be provided for all sources  
      this.signFile = this.$sources.first().attr('data-sign-src');
      if (this.signFile) { 
        if (this.debug) {
          console.log('This video has an accompanying sign language video: ' + this.signFile);      
        }
        this.hasSignLanguage = true;
        this.injectSignPlayerCode();
      }
      else { 
        this.hasSignLanguage = false;              
      }
    }    
  };

  AblePlayer.prototype.injectSignPlayerCode = function() { 

    // create and inject surrounding HTML structure 
    // If IOS: 
    //  If video: 
    //   IOS does not support any of the player's functionality 
    //   - everything plays in its own player 
    //   Therefore, AblePlayer is not loaded & all functionality is disabled 
    //   (this all determined. If this is IOS && video, this function is never called) 
    //  If audio: 
    //   HTML cannot be injected as a *parent* of the <audio> element 
    //   It is therefore injected *after* the <audio> element 
    //   This is only a problem in IOS 6 and earlier, 
    //   & is a known bug, fixed in IOS 7      
    
    var thisObj, signVideoId, i, signSrc, srcType, $signSource; 

    thisObj = this;

    signVideoId = this.mediaId + '-sign';
    this.$signVideo = $('<video>',{ 
      'id' : signVideoId,
      'width' : this.playerWidth      
    });
    this.signVideo = this.$signVideo[0];
    // for each original <source>, add a <source> to the sign <video> 
    for (i=0; i < this.$sources.length; i++) { 
      signSrc = this.$sources[i].getAttribute('data-sign-src');
      srcType = this.$sources[i].getAttribute('type');
      if (signSrc) {
        $signSource = $('<source>',{ 
          'src' : signSrc,
          'type' : srcType
        });
        this.$signVideo.append($signSource);
      }
      else { 
        // source is missing a sign language version 
        // can't include sign language 
        this.hasSignLanguage = false;
        break;
      }   
    }

    // TODO: Consider whether width x height should be added to the sign window, or the video element
    this.$signWindow = $('<div>',{
      'class' : 'able-sign-window',
    });
    this.$signWindow.append(this.$signVideo).hide();
    
    // Place sign window in div.able-column-right
    // If div doesn't exist yet, create it 
    if (this.$ableColumnRight) { 
      this.$ableColumnRight.append(this.$signWindow);
    }
    else { 
      this.splitPlayerIntoColumns('sign');
    }

    this.addSignEvents();    
  };
  
  AblePlayer.prototype.addSignEvents = function() { 
    
    // populate with functions to handle click and drag on sign window 
  };  
  
})(jQuery);
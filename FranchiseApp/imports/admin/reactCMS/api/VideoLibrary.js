import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const VideoLibrary = new Mongo.Collection("videoLibrary");
// export const VideoLibrary = new Mongo.Collection("videolibrarys");

if(Meteor.isServer){
    Meteor.publish('videoLibrary',()=>{
        return VideoLibrary.find({});
    });

    Meteor.methods({
    	'createVideoLibrary':function(videoLibraryName,videoLibraryUrl,videoLibraryCategory,youtubeVideoLink,videoLibraryBody,userId,updateTimestamp){

    		VideoLibrary.insert({
    			'videoLibraryName'      : videoLibraryName,
    			'videoLibraryUrl'       : videoLibraryUrl,
          'videoLibraryCategory'  : videoLibraryCategory,
          'youtubeVideoLink'      : youtubeVideoLink,
    			'videoLibraryBody'      : videoLibraryBody,
    			'createdAt'             : new Date(),
          'authorUserId'          : userId,
          'lastModified'          : updateTimestamp,
    		});
    	},
      'updateVideoLibrary':function(id,videoLibraryName,videoLibraryUrl,videoLibraryCategory,youtubeVideoLink,videoLibraryBody,userId,updateTimestamp){
        console.log("update server method");
        console.log(id);
    		VideoLibrary.update(
    			{ '_id': id },
    	        {
    	          $set:{
                  'videoLibraryName'      : videoLibraryName,
                  'videoLibraryUrl'       : videoLibraryUrl,
                  'videoLibraryCategory'  : videoLibraryCategory,
                  'youtubeVideoLink'      : youtubeVideoLink,
                  'videoLibraryBody'      : videoLibraryBody,
                  'authorUserId'          : userId,
                  'lastModified'          : updateTimestamp,
    	        } //End of set
    	      }
    		);
    	},
      'deleteVideoLibrary':function(id){
     		 VideoLibrary.remove({'_id': id});

    	},
    });
}

import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const About = new Mongo.Collection("about");
// export const About = new Mongo.Collection("abouts");

if(Meteor.isServer){
    Meteor.publish('about',()=>{
        return About.find({});
    });

    Meteor.methods({
    	'createAbout':function(aboutTitle,aboutSubTitle,aboutContent,aboutOwner,aboutVisionOne,aboutVisionTwo,aboutVisionThree,aboutVisionFour,basicPageUrl,basicPageBody,userId,updateTimestamp){

    		var aboutId = About.insert({
    			// 'basicPageName'  : basicPageName,
          'aboutTitle'     : aboutTitle,
          'aboutSubTitle'  : aboutSubTitle,
          'aboutContent'   : aboutContent,
          'aboutOwner'     : aboutOwner,
          'aboutVisionOne'    : aboutVisionOne,
          'aboutVisionTwo'    : aboutVisionTwo,
          'aboutVisionThree'  : aboutVisionThree,
          'aboutVisionFour'  : aboutVisionFour,
          'basicPageUrl'   : basicPageUrl,
          // 'basicPageBody'  : basicPageBody,
          'createdAt'      : new Date(),
          'authorUserId'   : userId,
          'lastModified'   : updateTimestamp,
    		});

        return aboutId;
    	},
      'updateAbout':function(id,aboutTitle,aboutSubTitle,aboutContent,aboutOwner,aboutVisionOne,aboutVisionTwo,aboutVisionThree,aboutVisionFour,basicPageUrl,basicPageBody,userId,updateTimestamp){
        console.log("update server method");
        console.log(id);
    		About.update(
    			{ '_id': id },
    	        {
    	          $set:{
                  // 'basicPageName'  : basicPageName,
                  'aboutTitle'     : aboutTitle,
                  'aboutSubTitle'  : aboutSubTitle,
                  'aboutContent'   : aboutContent,
                  'aboutOwner'     : aboutOwner,
                  'aboutVisionOne'    : aboutVisionOne,
                  'aboutVisionTwo'    : aboutVisionTwo,
                  'aboutVisionThree'  : aboutVisionThree,
                  'aboutVisionFour'  : aboutVisionFour,
                  'basicPageUrl'   : basicPageUrl,
                  // 'basicPageBody'  : basicPageBody,
                  'authorUserId'   : userId,
                  'lastModified'   : updateTimestamp,
    	        } //End of set
    	      }
    		);
    	},
      'deleteAbout':function(id){
     		 About.remove({'_id': id});

    	},
    });
}

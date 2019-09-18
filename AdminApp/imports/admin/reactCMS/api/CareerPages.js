import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const CareerPages = new Mongo.Collection("careerPages");
// export const CareerPages = new Mongo.Collection("careerpages");

if(Meteor.isServer){
    Meteor.publish('careerPages',()=>{
        return CareerPages.find({});
    });

    Meteor.methods({
    	'createCareerPage':function(jobTitle,jobPosition,jobLocation,jobSkills,jobValidUpTo,jobSalary,jobQualification,jobDescription,userId,updateTimestamp){

    		CareerPages.insert({
    			'careerPageTitle'         : jobTitle,
    			'careerPagePosition'      : jobPosition,
    			'careerPageLocation'      : jobLocation,
          'careerPageSkills'        : jobSkills,
          'careerPageValidUpTo'     : jobValidUpTo,
          'careerPageSalary'        : jobSalary,
          'careerPageDescription'   : jobDescription,
          'careerPageQualification' : jobQualification,
    			'createdAt'               : new Date(),
          'authorUserId'            : userId,
          'lastModified'            : updateTimestamp,
    		});
    	},
      'updateCareerPage':function(id,jobTitle,jobPosition,jobLocation,jobSkills,jobValidUpTo,jobSalary,jobQualification,jobDescription,userId,updateTimestamp){
        console.log("update server method");
        console.log(id);
    		CareerPages.update(
    			{ '_id': id },
    	        {
    	          $set:{
                  'careerPageTitle'         : jobTitle,
            			'careerPagePosition'      : jobPosition,
            			'careerPageLocation'      : jobLocation,
                  'careerPageSkills'        : jobSkills,
                  'careerPageValidUpTo'     : jobValidUpTo,
                  'careerPageSalary'        : jobSalary,
                  'careerPageDescription'   : jobDescription,
                  'careerPageQualification' : jobQualification,
                  'authorUserId'   : userId,
                  'lastModified'   : updateTimestamp,
    	        } //End of set
    	      }
    		);
    	},
      'deleteCareerPage':function(id){
     		 CareerPages.remove({'_id': id});

    	},
    });
}

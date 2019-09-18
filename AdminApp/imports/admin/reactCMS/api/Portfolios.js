import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const Portfolios = new Mongo.Collection("portfolios");
// export const Portfolios = new Mongo.Collection("portfolios");
export const TempPortfolioImages = new Mongo.Collection("tempPortfolioImages");
// export const TempPortfolioImages = new Mongo.Collection("tempportfolioimages");
export const TempPortfolioLogoImages = new Mongo.Collection("tempPortfolioLogoImages");
// export const TempPortfolioLogoImages = new Mongo.Collection("tempportfoliologoimages");

if(Meteor.isServer){
    Meteor.publish('portfolios',()=>{
        return Portfolios.find({});
    });
    Meteor.publish('tempPortfolioImages',()=>{
        return TempPortfolioImages.find({});
    });
    Meteor.publish('tempPortfolioLogoImages',()=>{
        return TempPortfolioLogoImages.find({});
    });

    Meteor.methods({
      'uploadTempPortfolioImages':function(id,amazonUrl,uploadTime){
    		TempPortfolioImages.insert({
    			'id'             : id,
    			'amazonUrl'      : amazonUrl,
    			'uploadTime'     : new Date(),
          'authorUserId'   : id,
          'submitted'       : false,
    		});
    	},
      'uploadTempPortfolioLogoImages':function(id,amazonUrl,uploadTime){
    		TempPortfolioLogoImages.insert({
    			'id'             : id,
    			'logoAmazonUrl'  : amazonUrl,
    			'uploadTime'     : new Date(),
          'authorUserId'   : id,
          'submitted'      : false,
    		});
    	},
      'updateTempPortfolioImages':function(_id,boolean){
    		TempPortfolioImages.update({
    			'_id'           : _id},
          {$set:{
    			'submitted'      : boolean,
    		}});
    	},
      'updateTempPortfolioLogoImages':function(_id,boolean){
        TempPortfolioLogoImages.update({
          '_id'           : _id},
          {$set:{
          'submitted'      : boolean,
        }});
      },
      'removeTempPortfolioImages':function(id){
        TempPortfolioImages.remove({'id':id,'submitted':true});
      },
      'removeTempPortfolioLogoImages':function(id){
        TempPortfolioLogoImages.remove({'id':id,'submitted':true});
      },
      'removePortfolioUnsubmitImages':function(id){
        TempPortfolioImages.remove({'id':id,'submitted':false});
      },
      'removePortfolioLogoUnsubmitImages':function(id){
        TempPortfolioLogoImages.remove({'id':id,'submitted':false});
      },
      'removePortfolioLogoUrlImages':function(url){
        TempPortfolioLogoImages.remove({'logoAmazonUrl':url});
      },
    	'createPortfolioPage':function(portfolioPageTitle,portfolioPageName,portfolioVideoLink,portfolioPageBody,s3,logoS3,userId,updateTimestamp){
        console.log(s3);
    		Portfolios.insert({
    			'portfolioPageTitle'  : portfolioPageTitle,
    			'portfolioPageName'   : portfolioPageName,
    			'portfolioPageBody'   : portfolioPageBody,
          'portfolioVideoLink'  : portfolioVideoLink,
          's3'                  : s3,
          'logoS3'              : logoS3,
    			'createdAt'           : new Date(),
          'authorUserId'        : userId,
          'lastModified'        : updateTimestamp,
    		});
    	},
      'updatePortfolioPage':function(id,portfolioPageTitle,portfolioPageName,portfolioVideoLink,portfolioPageBody,userId,updateTimestamp){
    		Portfolios.update(
    			{ '_id': id },
    	        {
    	          $set:{
                  'portfolioPageTitle'  : portfolioPageTitle,
            			'portfolioPageName'   : portfolioPageName,
            			'portfolioPageBody'   : portfolioPageBody,
                  'portfolioVideoLink'  : portfolioVideoLink,
                  'authorUserId'        : userId,
                  'lastModified'        : updateTimestamp,
    	        } //End of set
    	      }
    		);
    	},
      'updateEditPortfolioPage':function(amazonUrl){
    		Portfolios.update(
    			{ "s3.amazonUrl": amazonUrl },
    	        {
    	          $set:{

                  's3.$.amazonUrl'   : "",
                  's3.$.uploadTime'  : "",
    	        }
    	      }
    		);
    	},
      'updateEditPortfolioLogoPage':function(amazonUrl){
    		Portfolios.update(
    			{ "logoS3.logoAmazonUrl": amazonUrl },
    	        {
    	          $set:{

                  'logoS3.$.logoAmazonUrl'   : "",
                  'logoS3.$.uploadTime'      : "",
    	        }
    	      }
    		);
    	},
      'updatePortfolioAmazonUrl':function(amazonUrl,uploadTime,id){
    		Portfolios.update(
    			   { '_id': id },
    	        {
    	          $push:{
                    's3':
                    {
                      'amazonUrl': amazonUrl,
                      'uploadTime':uploadTime,
                    }
    	        }
    	      }
    		);
    	},
      'updatePortfolioLogoAmazonUrl':function(amazonUrl,uploadTime,id){
    		Portfolios.update(
    			   { '_id': id },
    	        {
    	          $push:{
                    'logoS3':
                    {
                      'logoAmazonUrl': amazonUrl,
                      'uploadTime':uploadTime,
                    }
    	        }
    	      }
    		);
    	},
      'deletePortfolioPage':function(id){
     		 Portfolios.remove({'_id': id});

    	},
    });
}

import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const BlogPages = new Mongo.Collection("blogPages");
// export const BlogPages = new Mongo.Collection("blogpages");
export const TempBlogImages = new Mongo.Collection("tempBlogImages");
// export const TempBlogImages = new Mongo.Collection("tempblogimages");
import { BlogImage } from "../UploadToServer/UploadBlogImgsServer.js";


if(Meteor.isServer){
    Meteor.publish('blogPages',()=>{
        return BlogPages.find({});
    });
    Meteor.publish('tempBlogImages',()=>{
        return TempBlogImages.find({});
    });
    Meteor.publish('singleBlog',(_id)=>{
        return TempBlogImages.find({"_id":_id});   
    });

    Meteor.methods({
     "addNewTemporaryBlogImage": function (id) {
        var data      = BlogImage.findOne({"_id" : id});
        var link = data.link();
        TempBlogImages.insert({
          "_id": "1",
          "userId": Meteor.userId(),
          "link": link,
          "createdAt":new Date(),
          },(error, result)=>{
        });
      }, 
      "addNewTemporaryBlogVideo": function (id) {
        var data      = BlogImage.findOne({"_id" : id});
        var link = data.link();
        TempBlogImages.insert({
          "_id": "2",
          "userId": Meteor.userId(), 
          "link": link,
          "createdAt":new Date(),
          },(error, result)=>{
        });
      }, 

     //  'uploadTempImages':function(id,amazonUrl,uploadTime){
    	// 	TempImages.insert({
    	// 		'id'             : id,
    	// 		'amazonUrl'      : amazonUrl,
    	// 		'uploadTime'     : new Date(),
     //      'authorUserId'   : id,
     //      'submitted'       : false, 
    	// 	});
    	// },
     //  'updateTempImages':function(_id,boolean){
    	// 	TempImages.update({
    	// 		'_id'           : _id},
     //      {$set:{
    	// 		'submitted'      : boolean,
    	// 	}});
    	// },
     //  'removeTempImages':function(id){
     //    TempImages.remove({'id':id,'submitted':true});
     //  },
     //  'removeUnsubmitImages':function(id){
     //    TempImages.remove({'id':id,'submitted':false});
     //  },
     //  'removeUrlImages':function(url){
     //    TempImages.remove({'amazonUrl':url});
     //  },

    'createBlogPage':function(blogPageName,blogMediaType,youTubeVideoLink,blogPageBody,userId,updateTimestamp){
        var getImage              = TempBlogImages.findOne({"_id" : "1"}, {sort: {createdAt: -1, limit: 1}});
        if(getImage){
          var localImage          = getImage.link;
        }else{
          var localImage          = "/images/assureid/noImage.png";
        }

        var getVideo              = TempBlogImages.findOne({"_id" : "2"}, {sort: {createdAt: -1, limit: 1}});
        console.log("getVideo",getVideo);
        if(getVideo){
          var localVideo          = getVideo.link;
        }else{
          var localVideo          = "/images/assureid/noImage.png";
        }

    	BlogPages.insert({
    	  'blogPageName'     : blogPageName,
    	  'blogPageBody'     : blogPageBody,
          'blogMediaType'    : blogMediaType,
          'youTubeVideoLink' : youTubeVideoLink,
          'blogImageFile'    : localImage,
          'blogLocalVideo'   : localVideo,
          'authorUserId'     : userId,
          'lastModified'     : updateTimestamp, 
          'createdAt'        : new Date(),
    	});
        TempBlogImages.remove({});
    },
    'updateBlogPage':function(id,blogPageName,blogMediaType,youTubeVideoLink,blogPageBody,userId,lastModified){
        var data = TempBlogImages.findOne({"userId":Meteor.userId(),"_id" : "1"});
        if(data){
            var imageLink     = data.link;
        }else{
            var oldImgData    = BlogPages.findOne({"_id":id},{sort:{"createdAt":-1}});
            if(oldImgData){
              var imageLink   = oldImgData.blogImage;
            }
        }

        var data = TempBlogImages.findOne({"userId":Meteor.userId(),"_id" : "2"});
          if(data){
              var localvideoLink       = data.link;
          }else{
              var oldVideoData         = BlogPages.findOne({"_id":id},{sort:{"createdAt":-1}});
              if(oldVideoData){
                var localvideoLink     = oldVideoData.blogLocalVideo;
              }
          }

		BlogPages.update(
			{ '_id': id },
	        {
	          $set:{
              'blogPageName'     : blogPageName,
    		  'blogPageBody'     : blogPageBody,
              'blogMediaType'    : blogMediaType,
              'youTubeVideoLink' : youTubeVideoLink,
              'blogImageFile'    : imageLink,
              'blogLocalVideo'   : localvideoLink,
              'authorUserId'     : userId,
              'lastModified'     : lastModified,
	        } //End of set
	      });
        TempBlogImages.remove({});
    },
     //  'updateEditBlogPage':function(amazonUrl){
    	// 	BlogPages.update(
    	// 		{ "s3.amazonUrl": amazonUrl },
    	//         {
    	//           $set:{

     //              's3.$.amazonUrl'   : "",
     //              's3.$.uploadTime'  : "",
    	//         } //End of set
    	//       }
    	// 	);
    	// },
     //  'updateAmazonUrl':function(amazonUrl,uploadTime,id){
    	// 	BlogPages.update(
    	// 		   { '_id': id },
    	//         {
    	//           $push:{
     //                's3':
     //                {
     //                  'amazonUrl': amazonUrl,
     //                  'uploadTime':uploadTime,
     //                }
    	//         }
    	//       }
    	// 	);
    	// },
      'deleteBlogPage':function(id){
     	  BlogPages.remove({'_id': id});
          // var BlogImages = BlogImage.findOne({"getblogImage" : getblogImage});
    	},
    });
}

export const S3Details=new Mongo.Collection('s3details');

if(Meteor.isServer){
	Meteor.publish('s3details',function(){
		return S3Details.find({});
	});
}
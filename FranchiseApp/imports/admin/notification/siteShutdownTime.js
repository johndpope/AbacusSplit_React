// import { Meteor } from 'meteor/meteor';
// import { Mongo } from 'meteor/mongo';
// // import { Email } from 'meteor/email';

// export const SiteDowntime = new Mongo.Collection('siteshutdowntime');

// if(Meteor.isServer){

// 	// Meteor.startup(() => {
// 	// 	SiteDowntime._ensureIndex({ "templateCategory": 1});
// 	// });
	
// 	Meteor.publish('SiteDowntimeInfo',function(){
// 	    return SiteDowntime.find({});
// 	});

	
// } 

// Meteor.methods({
// 	// 'insertDownTime':function(values){
// 	// 	console.log("values",values);
// 	// 	// if(!values.id){
// 	// 		SiteDowntime.insert({			
// 	// 		'startTime'       : values.startTime,
// 	// 		'endTime'         : values.endTime,	
// 	// 		'text'		      : "Site will be down for :",
// 	// 		'createdAt'       : new Date(),
// 	// 	});
// 		// }else{
// 		// 	SiteDowntime.update(
// 		// 	{ '_id': values.id },
// 	 //        {
// 	 //          $set:{
	              
// 		// 	'startTime'       : values.startTime,
// 		// 	'endTime'         : values.endTime,	
// 		// 	'text'		      :  "Site will be down for :",
// 		// 	'updatedAt'       : new Date(),
	             
// 	 //        }
// 	 //      }
// 		// )
// 		// }
		
// 	},


// 	'getDownTime':function(){
//         return SiteDowntime.find({"status":"Broadcast"}).fetch();
//       },




	


// 	'DeletedownTimeNotice':function(id){

//  		 SiteDowntime.remove({'_id': id});
  
// 	},
	
// });

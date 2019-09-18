// import { Mongo } from 'meteor/mongo';
// import { Meteor } from 'meteor/meteor';
// // import {TempLogoImage} from './TempLogoImage.js';
// export const ContactCategory = new Mongo.Collection('contactCategorys');
// export const ContactCategory = new Mongo.Collection('contactcategorys');

// if(Meteor.isServer){

//   Meteor.publish('contactCategory',function contactCategory(){
//       return ContactCategory.find({});
//   }); 
  
// }
// Meteor.methods({
// 	'addContactCategory' : function(categoryName) {
//   		 ContactCategory.insert({
// 			categoryName: categoryName,						
// 			}, function(error,result){
// 			if(error){
// 				return error;
// 			}else{
// 				return result;
// 			}
// 		});
                                                               
//   },
   

//   // deleteUser: function(userId){
//   //       Meteor.users.remove({'_id': userId});
//   // },

//   //   deleteContactCategory: function(roleID){
//   //     // Roles.deleteRole('super-admin');
//   //       Meteor.ContactCategory.remove({'_id': ContactCategoryID});
//   // },

//   //   addRoles: function(newID , defaultRoleconfig){
//   //   // console.log('addRoles'+ newID);
//   //   Roles.addUsersToRoles(newID, defaultRoleconfig);

//   // },
//   // updaterole: function (roleId, roleName) {
// //     // console.log(roleId);
// //     // console.log(roleName);
// //       Meteor.roles.update({'_id': roleId },
// //                           {
// //                             $set:{
// //                                     "name": roleName,
// //                           } //End of set
// //                         });
// //   },


// });
export const PlivoDetails = new Mongo.Collection('plivoDetails');
// export const PlivoDetails = new Mongo.Collection('plivodetails');
Meteor.publish('plivoDetails', function() {
  return PlivoDetails.find();
});
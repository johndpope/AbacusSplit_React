import {Meteor} from 'meteor/meteor';

  if(Meteor.isServer){

    Meteor.publish('currentUserData', function () {
         return Meteor.users.find({_id: this.userId});
    });
    // Meteor.publish('allUserData', function () {
    //      return Meteor.users.find({});
    // });
  }

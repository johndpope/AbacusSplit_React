import {Session} from 'meteor/session';


access = function(facility,module){
		
	try{
		var access = Meteor.call("isAuthenticated",facility,module,(err,res)=>{
			if(err){
				console.log(err);
				return false;
			}else{
				// result = res;
				console.log('res => ',res);
				return res;
				// Session.set("access",res);
			}
		});
		console.log("access = ",access);
		// return Sedssion.get('access');
	}catch(e){
		console.log(e);
	}
		
}

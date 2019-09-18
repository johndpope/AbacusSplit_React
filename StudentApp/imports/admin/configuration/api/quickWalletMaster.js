export const QuickWalletMaster = new Mongo.Collection("quickWalletMaster");
// export const QuickWalletMaster = new Mongo.Collection("quickwalletmasters");
if(Meteor.isServer){
	Meteor.publish("getQWDetails",function(){
		return QuickWalletMaster.find({});
	});
}
Meteor.methods({

	'saveQWSetting' : function(formvalues) {
	      var quickWalletData = QuickWalletMaster.findOne({});
	      if(quickWalletData){
	          QuickWalletMaster.update(
	            { 'quikWalletId' : 101 },
	            {
	              $set:{
	                  'environment'       : formvalues.environment,
	                  'prodAPI'           : formvalues.prodAPI,
	                  'prodKey'           : formvalues.prodKey,
	                  'prodSecret'        : formvalues.prodSecret,
	                  'sandboxAPI'        : formvalues.sandboxAPI,
	                  'sandboxKey'        : formvalues.sandboxKey,
	                  'sandboxSecret'     : formvalues.sandboxSecret,
	                  'user'              : Meteor.userId(),
	                  "updatedAt"         : new Date(),
	            } //End of set
	          }
	          ); //end of update
	      }else{
	        QuickWalletMaster.insert(
              {
                'quikWalletId'        : 101,
                'environment'         : formvalues.environment,
                'prodKey'             : formvalues.prodKey,
                'prodSecret'          : formvalues.prodSecret,
                'sandboxKey'          : formvalues.sandboxKey,
                'sandboxSecret'       : formvalues.sandboxSecret,
                'user'                : Meteor.userId(),
                "createdAt"           : new Date(),
              }, function(error,result){
                        if(error) {
                            return error;
                        }else{ 
                             }
                    }                                                            
           );       
	      }
	}
});
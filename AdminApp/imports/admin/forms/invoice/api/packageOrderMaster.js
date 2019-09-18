import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import { HTTP } from 'meteor/http';
import {PackageManagementMaster} from '/imports/admin/packageManagement/api/packageManagementMaster.js';
import {QuickWalletMaster} from '/imports/admin/configuration/api/quickWalletMaster.js';
import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';
export const PackageOrderMaster = new Mongo.Collection("packageOrderMaster");
// export const PackageOrderMaster = new Mongo.Collection("packageordermasters");

if(Meteor.isServer){

import { Email } from 'meteor/email';

	Meteor.publish("allPackageOrder",function(){
		return PackageOrderMaster.find({});
	});
	Meteor.publish("singleOrder",function(id){
		return PackageOrderMaster.find({"_id":id});
	});
	Meteor.publish("showLoginStuddntInvoices",function(id){
		return PackageOrderMaster.find({"buyerId":Meteor.userId()});
	});
	Meteor.publish("showLoginStuddntOrders",function(){
		return PackageOrderMaster.find({"buyerId":Meteor.userId(),"status":"paid"});
	});

	// Meteor.publish("StudentPackages",function(id,status){
	// 	return PackageOrderMaster.findOne({"buyerId":Meteor.userId(),"status":"Paid"});
	// });
	Meteor.methods({

		'addPackages':function(packageId,_id){
			var PackageOrderMasterData = PackageOrderMaster.findOne({"_id":_id,"packages.packageId":packageId});
			var studentMasterData = StudentMaster.findOne({"studentId":Meteor.userId()});
			if(PackageOrderMasterData && studentMasterData){
				// console.log("studentMasterData",studentMasterData);
				PackageOrderMaster.update({"_id":_id},
				{
					$pull:{
						"packages":{
							"packageId":packageId
						}
					}
				});
			}else{
				if(!_id){
					var pOMasterData = PackageOrderMaster.find({}).count();
					if(pOMasterData>0){
						var invoiceNum = pOMasterData+1;	
					}else{
						var invoiceNum = 1;
					}	
					
						var orderId = PackageOrderMaster.insert({
							'buyerId' : Meteor.userId(),
							'studentName':studentMasterData.studentFullName,
							'franchiseId':studentMasterData.franchiseId,
							'status'  : 'unPaid',
							'packages' : [],
							'invoiceId' : invoiceNum,
							'packageStatus' : "Valid",
							
						},function(err,res){
							if(err){}else if(res){}
						});
					
					if(orderId){
						var packageData = PackageManagementMaster.findOne({"_id":packageId});
						if(packageData){
						   PackageOrderMaster.update({"_id":orderId},
							{
								$push:{
									packages :{
										'packageId'   : packageData._id, 
										'packageName' : packageData.packageName,
										'category'    : packageData.categoryName,
										'subCategory' : packageData.subCategory,
										'packagePrice': packageData.PackagePrice,
										'NoOfPracticeTest': packageData.NoOfPracticeTest,



									}
								}
							});
						}
					}
					return orderId;

				}else{
					var packageData = PackageManagementMaster.findOne({"_id":packageId});
					if(packageData){

						PackageOrderMaster.update({"_id":_id},
						{
							$push:{
								packages :{
									'packageId'   : packageData._id, 
									'packageName' : packageData.packageName,
									'category'    : packageData.categoryName,
									'subCategory' : packageData.subCategory,
									'packagePrice': packageData.PackagePrice,
									'NoOfPracticeTest': packageData.NoOfPracticeTest,
												

								}
							}
						});
					}
				}
			}
		},

		'addPackagesPurchase':function(packageId,_id,studentId){
			var PackageOrderMasterData = PackageOrderMaster.findOne({"_id":_id,"packages.packageId":packageId});
			var studentMasterData = StudentMaster.findOne({"studentId":studentId});
			if(PackageOrderMasterData && studentMasterData){
				// console.log("studentMasterData",studentMasterData);
				PackageOrderMaster.update({"_id":_id},
				{
					$pull:{
						"packages":{
							"packageId":packageId
						}
					}
				});
			}else{
				if(!_id){
					var pOMasterData = PackageOrderMaster.find({}).count();
					if(pOMasterData>0){
						var invoiceNum = pOMasterData+1;	
					}else{
						var invoiceNum = 1;
					}	
					
						var orderId = PackageOrderMaster.insert({
							'buyerId' : studentId,
							'studentName':studentMasterData.studentFullName,
							'franchiseId':studentMasterData.franchiseId,
							'status'  : 'unPaid',
							'packages' : [],
							'invoiceId' : invoiceNum,
							'packageStatus' : "Valid",
							
						},function(err,res){
							if(err){}else if(res){}
						});
					
					if(orderId){
						var packageData = PackageManagementMaster.findOne({"_id":packageId});
						if(packageData){
						   PackageOrderMaster.update({"_id":orderId},
							{
								$push:{
									packages :{
										'packageId'   : packageData._id, 
										'packageName' : packageData.packageName,
										'category'    : packageData.categoryName,
										'subCategory' : packageData.subCategory,
										'packagePrice': packageData.PackagePrice,
										'NoOfPracticeTest': packageData.NoOfPracticeTest,



									}
								}
							});
						}
					}
					return orderId;

				}else{
					var packageData = PackageManagementMaster.findOne({"_id":packageId});
					if(packageData){

						PackageOrderMaster.update({"_id":_id},
						{
							$push:{
								packages :{
									'packageId'   : packageData._id, 
									'packageName' : packageData.packageName,
									'category'    : packageData.categoryName,
									'subCategory' : packageData.subCategory,
									'packagePrice': packageData.PackagePrice,
									'NoOfPracticeTest': packageData.NoOfPracticeTest,
												

								}
							}
						});
					}
				}
			}
		},

		'updatePackageStatus':function(packageId){
		PackageOrderMaster.update({"packageId":packageId},
			{
				$set:{
					"packageStatus":"InValid"
				}
			});
		},



		'updatePackagePaymentStatus':function(pOrderId,status,trnsactionId,billNum){
			Meteor.call("createQuestionPaperMasterAccordingtoPackages",pOrderId);
			var orderMasterData = PackageOrderMaster.findOne({"_id":pOrderId});
			if(orderMasterData.packages){
				var packageTotal = orderMasterData.packages.reduce((addprice,elem)=>{
					return  addprice + elem.packagePrice;
				},0);
				PackageOrderMaster.update({"_id":pOrderId},
					{
						$set:{
							'status':status,
							'amount':packageTotal,
							"transactionId" : trnsactionId,
						    "billnumbers" : billNum,
						    "paymentDate" : new Date(),
						}
					});
				return pOrderId;
			}
		},


		'updatePackageCashPaymentStatus':function(pOrderId,status,billNum,franchiseId,studentId){

            
			Meteor.call("createQuestionPaperMasterAccordingtoPackages",pOrderId);
			var orderMasterData = PackageOrderMaster.findOne({"_id":pOrderId});
			if(orderMasterData.packages){

				var packageTotal = orderMasterData.packages.reduce((addprice,elem)=>{
					return  addprice + elem.packagePrice;
				},0);

				

				PackageOrderMaster.update({"_id":pOrderId},
					{
						$set:{
							'status':status,
							'amount':packageTotal,
							"transactionId" : 'Cash Payment',
						    "billnumbers" : billNum,
						    "paymentDate" : new Date(),
						}
					});



				return pOrderId;
			}
		},

		'getMailDataForStudent':function(pOrderId,franchiseId,studentId){
			var orderMasterData = PackageOrderMaster.findOne({"_id":pOrderId});
			var packageNames='';
			var studentName='';
			if(orderMasterData.packages){

				var packageTotal = orderMasterData.packages.reduce((addprice,elem)=>{
					return  addprice + elem.packagePrice;
				},0);

				//  packageNames = orderMasterData.packages.reduce((names,el)=>{
				// 	return  names +","+el.packageName;
				// });
				orderMasterData.packages.map((packages,ind)=>{
					if(ind==0){
						packageNames = packageNames +packages.packageName;
					}else{
						packageNames = packageNames +", "+packages.packageName;
					}
					
				})

			}

					


				var studentInfo = Meteor.users.findOne({'_id':studentId});
				var franchiseInfo = Meteor.users.findOne({'_id':franchiseId});
				var adminInfo = Meteor.users.findOne({'_id':Meteor.userId()});

				if(studentInfo){
					studentProfile=studentInfo.profile;
					
					
					
					if(studentProfile){
						var studentMailId = studentProfile.emailId;
						// var franchiseMailId = franchiseProfile.emailId;
						// var adminMailId = adminProfile.emailId;
						studentName = studentProfile.fullName;
					
						var tosignupEmail    = studentMailId;
			            var fromEmailId = 'support@maats.in';
			            var subject     = 'Abacus Online Exam Registration';
			            var body        = 'Hello, '+'\n'+'\n'+" "+studentName+' is now eligible to give purchased practice exam of the Package : ' + packageNames +'.'+'\n'+'\n'+'Thanks and Regards'+'\n'+'Abacus Online Exam';
			            // var body        = 'Hello '+studentName+'\n'+"Congratulations!!!"+'\n'+'\n'+""+studentName+' is now eligible to give purchased practice exam of the Package : ' + packageNames +'\n'+'\n'+'Thanks and Regards'+'\n'+'Abacus Online Exam';
			            // Meteor.call('packagePurchaseEmailToStudent',tosignupEmail,fromEmailId,subject,body);

			             Email.send({ to      : tosignupEmail,
			                 from    : fromEmailId,
			                 subject : subject,
			                 // text    : text,
			                 html    : body,
			                 });

	                 }
	                 }
	                 if(franchiseInfo){	
	                 	var franchiseProfile = franchiseInfo.profile;
	                 	if(franchiseProfile){
			// console.log("franchiseProfile side--->",franchiseInfo,franchiseProfile);

						// var studentMailId = franchiseProfile.emailId;
						var franchiseMailId = franchiseProfile.emailId;
						// var adminMailId = adminProfile.emailId;
						var studentName = studentName;
					
						var tosignupEmail    = franchiseMailId;
			            var fromEmailId = 'support@maats.in';
			            var subject     = 'Abacus Online Exam Registration';
			            var body        = 'Hello, '+'\n'+'\n'+" "+studentName+' is now eligible to give purchased practice exam of the Package : ' + packageNames +'.'+'\n'+'\n'+'Thanks and Regards'+'\n'+'Abacus Online Exam';
			            // var body        = 'Hello '+studentName+'\n'+"Congratulations!!!"+'\n'+'\n'+""+studentName+' is now eligible to give purchased practice exam of the Package : ' + packageNames +'\n'+'\n'+'Thanks and Regards'+'\n'+'Abacus Online Exam';
			            // Meteor.call('packagePurchaseEmailToStudent',tosignupEmail,fromEmailId,subject,body);

			             Email.send({ to      : tosignupEmail,
			                 from    : fromEmailId,
			                 subject : subject,
			                 // text    : text,
			                 html    : body,
			                 });

	                 }	
	             }

	                if(adminInfo){
	                	var adminProfile = adminInfo.emails[0];
	                 if(adminProfile){
						// var studentMailId = franchiseProfile.emailId;

						var adminMailId = adminProfile.address;

						// console.log("adminMailId",adminMailId);
						// console.log("adminInfo",adminInfo);
						// var adminMailId = adminProfile.emailId;
						var studentName = studentName;					
						var tosignupEmail    = adminMailId;
			            var fromEmailId = 'support@maats.in';
			            var subject     = 'Abacus Online Exam Registration';
			            var body        = 'Hello, '+'\n'+'\n'+" "+studentName+' is now eligible to give purchased practice exam of the Package : ' + packageNames +'.'+'\n'+'\n'+'Thanks and Regards'+'\n'+'Abacus Online Exam';
			            // var body        = 'Hello '+studentName+'\n'+"Congratulations!!!"+'\n'+'\n'+""+studentName+' is now eligible to give purchased practice exam of the Package : ' + packageNames +'\n'+'\n'+'Thanks and Regards'+'\n'+'Abacus Online Exam';
			            // Meteor.call('packagePurchaseEmailToStudent',tosignupEmail,fromEmailId,subject,body);

			             Email.send({ to      : tosignupEmail,
			                 from    : fromEmailId,
			                 subject : subject,
			                 // text    : text,
			                 html    : body,
			                 });

	                 }	

				}

				return 'Mail Sent'	


		},


		'checkPackagesAdded':function(id){
			var packageData = PackageOrderMaster.findOne({"_id":id});
			if(packageData){
				var packageDataArr =packageData.packages;
				if(packageDataArr){
					var packageDataArrLen = packageDataArr.length;
					if(packageDataArrLen>0){
						return packageData;
					}else{
						return "notAdded";
					}
				}  
			}
		},	

		paymentGatewayforPackageBuy:function(pOrderId){
			
			// Meteor.call("createQuestionPaperMasterAccordingtoPackages",pOrderId);
			var orderMasterData = PackageOrderMaster.findOne({"_id":pOrderId})||{}; 
			if(orderMasterData.packages){
				var packageTotal = orderMasterData.packages.reduce((addprice,elem)=>{
					return  addprice + elem.packagePrice;
				},0);
		
			    var userId       = Meteor.userId();
			    var userObj      = Meteor.users.findOne({"_id":userId});
			    var mobileNumber = userObj.profile.mobNumber;
			    var QWCredential = QuickWalletMaster.findOne({});
		    	if(QWCredential){
		    		if(QWCredential.environment=="production"){
			    	var API = QWCredential.prodAPI;
			    	var partnerid = QWCredential.prodKey;
			    	var secret    = QWCredential.prodSecret;
				    }else{
				    	var API       = QWCredential.sandboxAPI;
				    	var partnerid = QWCredential.sandboxKey;
				    	var secret    = QWCredential.sandboxSecret;
				    }
				    var quickWalletInput = {
				    		   "partnerid": partnerid,
				               "mobile"   :   mobileNumber,
				               "secret"   :   secret,
				               "amount"   :    packageTotal,
				               "redirecturl" : Meteor.absoluteUrl()+'packagePayment-response/'+pOrderId,          
				    };

				    try {
				        var result = HTTP.call("POST", API+"/api/partner/"+quickWalletInput.partnerid+"/requestpayment",
				                               {params: quickWalletInput});
				        // console.log('result:',result);
				        if(result.data.status == 'success'){
				          var paymentUrl = result.data.data.url;
				          // console.log('paymentUrl:',paymentUrl);
				          return paymentUrl;
				        }else{
				          return false;
				        }
				    } catch (err) {
				      console.log('err',err);
				      // Got a network error, time-out or HTTP error in the 400 or 500 range.
				      return false;
				    }
				}
			}
		  
		},



		cashPaymentForPackageBuy:function(pOrderId,studentId){
			
			// Meteor.call("createQuestionPaperMasterAccordingtoPackages",pOrderId);
			var orderMasterData = PackageOrderMaster.findOne({"_id":pOrderId})||{}; 
			if(orderMasterData.packages){
				var packageTotal = orderMasterData.packages.reduce((addprice,elem)=>{
					return  addprice + elem.packagePrice;
				},0);
		
			    var userId       = studentId;
			    var userObj      = Meteor.users.findOne({"_id":userId});
			    var mobileNumber = userObj.profile.mobNumber;
			    var QWCredential = QuickWalletMaster.findOne({});
		    	if(QWCredential){
		    		if(QWCredential.environment=="production"){
			    	var API = QWCredential.prodAPI;
			    	var partnerid = QWCredential.prodKey;
			    	var secret    = QWCredential.prodSecret;
				    }else{
				    	var API       = QWCredential.sandboxAPI;
				    	var partnerid = QWCredential.sandboxKey;
				    	var secret    = QWCredential.sandboxSecret;
				    }
				    var quickWalletInput = {
				    		   "partnerid": partnerid,
				               "mobile"   :   mobileNumber,
				               "secret"   :   secret,
				               "amount"   :    packageTotal,
				               "redirecturl" : Meteor.absoluteUrl()+'packagePayment-response/'+pOrderId,          
				    };

				    try {
				        var result = HTTP.call("POST", API+"/api/partner/"+quickWalletInput.partnerid+"/requestpayment",
				                               {params: quickWalletInput});
				        // console.log('result:',result);
				        if(result.data.status == 'success'){
				          var paymentUrl = result.data.data.url;
				          // console.log('paymentUrl:',paymentUrl);
				          return paymentUrl;
				        }else{
				          return false;
				        }
				    } catch (err) {
				      console.log('err',err);
				      // Got a network error, time-out or HTTP error in the 400 or 500 range.
				      return false;
				    }
				}
			}
		  
		},


	});
}
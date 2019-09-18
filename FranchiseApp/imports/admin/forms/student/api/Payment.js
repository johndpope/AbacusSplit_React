// Template.paymentResponse.helpers({
//    paymentRply: function(){
//     console.log("Inside paymentRply");
// 	    var status      = FlowRouter.getQueryParam('status');
// 	    var id          = FlowRouter.getQueryParam('id');
// 	    var billnumbers = FlowRouter.getQueryParam('billnumbers');
// 	    var checksum    = FlowRouter.getQueryParam('checksum');
//       var userId      = Meteor.userId();

 
// 	    if(status == 'paid'){
// 	    	 // FlowRouter.go("/paymentDecision");
//               Meteor.call("insertOnlineDetailsToOrder",status, id, billnumbers,function(err,result){
//                 if(result){
//                      console.log(result);
//                      var orderId = result;
//                      afteronlinePaymentProcess(orderId)
                     
//                       FlowRouter.go("/payment-success/:orderId",{"orderId":orderId});
//               }
//               });
// 	    }else{
// 	    	FlowRouter.go("/payment-error");
// 	    }
//    		 return status;
//    },
// });



// Template.paymentSuccess.onRendered(function (){
//     var orderid = Session.get('orderId');
//     afteronlinePaymentProcess(orderid);
//     // afterPaymentProcess();
// });

// Template.paymentSuccessFailure.helpers({
//     'orderDataSuccess' : function(){
//         var orderId = FlowRouter.getParam("orderId");
//         var orderObj = Orders.findOne({"_id" : orderId});
//         if(orderObj){
//             var noOfItems = orderObj.products.length;
//             var d = orderObj.createdAt;
//             var t = d.toLocaleDateString('en-IN');
//             var orderVar = ({
//                 'orderId'     : orderId,
//                 'orderNo'     : orderObj.OrderId,
//                 'totalAmount' : (orderObj.totalAmount),
//                 'noOfItems'   : noOfItems,
//                 'payMethod'   : orderObj.paymentMethod,
//                 'transactionID': orderObj.transactionID,
//                 'date'        : t,

//             });
//         }

//         return orderVar;
//     },

//     'isCashOnDelivery' : function(){
//         return this.payMethod === "Cash On Delivery";
//     },
// });
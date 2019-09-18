import React,{Component}  from 'react';
import {render} from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import { withTracker } from 'meteor/react-meteor-data';
import {PackageOrderMaster} from '/imports/admin/forms/invoice/api/packageOrderMaster.js';
import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';


//create pdf 
function createPDF(){
  var outerInvoiceBlock = $('#outerInvoiceBlock'),
  cache_width = outerInvoiceBlock.width(),
  a4  =[850,  2000];  // for a4 size paper width and height
  getCanvas().then(function(canvas){
  var img = canvas.toDataURL("image/png"),
  doc = new jsPDF({
          unit:'px', 
          format:'a4'
        }); 
        var width = doc.internal.pageSize.width;  
        var height = doc.internal.pageSize.height - 300;
        doc.addImage(img, 'JPEG',0,0,width,height);
        doc.save('Invoice.pdf');
        outerInvoiceBlock.width(cache_width);
 });
}
 
// create canvas object
function getCanvas(){
  var outerInvoiceBlock = $('#outerInvoiceBlock'),
  cache_width = outerInvoiceBlock.width(),
  a4  =[850,  2000];  // for a4 size paper width and height
 // outerInvoiceBlock.width(cache_width).css('max-width','none');
 return html2canvas(outerInvoiceBlock,{
     imageTimeout:2000,
     removeContainer:true
    }); 
}

class MyInvoice extends Component{
  constructor(){
    super();
    this.state ={
      invoiceNo       : '',
      serviceId       : '',
      serviceName     : '',
      serviceRate     : '',
      serviceDuration : '',
      userName        : '',
      userId          : '',
      companyName     : '',
      companyAddress  : '',
      companyCity     : '',
      companyState    : '',
      companyCountry  : '',
      companyPincode  : '',
      cashPaymentStatus  : false,
      id              : '', 
      date            : '',
      rate            : '', 
      invoice         : [],
      tax             : [],
      serviceArray    : [{'serviceName': 'packageData','serviceRate':200,'totalQty':222}],
      "subscription" : {
        "singleinvoice" : Meteor.subscribe("singleinvoice"),   
        // "allOrders"     : Meteor.subscribe("allOrders"),
        "tempSingleinvoice" : Meteor.subscribe("tempSingleinvoice"),
        // "allUserProfileData" : Meteor.subscribe("allUserProfileData"),
        "singleStudent" : Meteor.subscribe("singleStudent"),
      }
    };
  }

  componentDidMount(){ 
    $('html, body').scrollTop(0);		
	if ( !$('body').hasClass('adminLte')) {
	  var adminLte = document.createElement("script");
	  adminLte.type="text/javascript";
	  adminLte.src = "/js/adminLte.js";
	  $("body").append(adminLte);
	}
  }
	
  componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  }
  
  // cancdlinvoice(event){
  //   event.preventDefault();
  //   var path = "/ServiceRequiredData/"+this.props.invoice.serviceId+"-"+this.props.invoice.serviceName+"-"+this.props.order._id;
  //   // 
  //   FlowRouter.go(path);
  // }



	confirm(event){ 
	    event.preventDefault();
	    this.setState({
	    	cashPaymentStatus : true
	    })
	   
	    Meteor.call("updatePackageCashPaymentStatus",FlowRouter.getParam('id'),'paid',this.props.orderMasterData.invoiceId,FlowRouter.getParam('fId'),FlowRouter.getParam('studentId'),(err,res)=>{
				if(err){
					console.log(err);
				}else{
					// Meteor.call("createQuestionPaperMasterAccordingtoPackages",FlowRouter.getParam('orderId'));
					Meteor.call('getMailDataForStudent',FlowRouter.getParam('id'),FlowRouter.getParam('fId'),FlowRouter.getParam('studentId'),(error,result)=>{
						if(error){

						}else{
							// console.log("mail result",result);
							FlowRouter.go('/Admin/listofFranchise');
							swal("Cash payment is succesfull");
							this.setState({
						    	cashPaymentStatus : false
						    })
						}
					});
					// FlowRouter.go('/Admin/listofFranchise');
					// swal("Cash payment is succesfull");

				}
			});

	   
			// Meteor.call('cashPaymentForPackageBuy',FlowRouter.getParam('id'),this.props.orderMasterData.buyerId,(error,result)=>{
			// 	if(error){
			// 	console.log('error');
			// 	}else{
			// 		window.location = result;
			// 		}
			// 	});
  }
 

  formatRupees(num){
    // console.log("num :"+num);
    var p = num.toFixed(2).split(".");
    return p[0].split("").reverse().reduce(function(acc, num, i, orig) {
        return  num=="-" ? acc : num + (i && !(i % 3) ? "," : "") + acc;
    }, "") + "." + p[1];
  }

  totalAmount(){ 
     var totalTax = 0;
     if (this.props.invoice.data) {
      if (this.props.invoice.data.length > 0) {
        var dataLength = this.props.invoice.data.length;
      }else{
        var dataLength = 1;
      }
     }else{
        var dataLength = 1;
     }
	   if (this.props.invoice.tax) {
	    if (this.props.invoice.tax.length > 0) {
	      var taxPrice              = parseFloat(this.props.invoice.tax[0].applicableTax);
	     }else{
	      var taxPrice              = 1;
	     }
	   }else{
	      var taxPrice              = 1;
	     }
	    var rate                  = parseFloat(this.props.invoice.serviceRate) * parseFloat(dataLength);
	    var taxAmt                = (parseFloat(taxPrice) / 100) *  parseFloat(rate);
	    var totalAmount           = parseFloat(taxAmt) + parseFloat(rate);
	    var totalAmt              = this.formatRupees(totalAmount);
	    return totalAmt;
  }

  printDocument(event){
    event.preventDefault();
       createPDF();
  }

  taxAmt(applicableTax){
    var taxPrice = parseFloat(applicableTax);
    // var rate     = parseFloat(this.props.invoice.serviceRate) * parseFloat(this.props.invoice.data.length);
    var taxAmt   = (parseFloat(taxPrice) / 100);
    // var taxAmt   = (parseFloat(taxPrice) / 100) *  parseFloat(rate);
    return taxAmt;
  } 

  rate(){
    //  var rate = parseFloat(this.props.invoice.serviceRate) * parseFloat(this.props.invoice.data.length);
    //  return rate;
  }
  // getUserName(){
  // 	var buyerData = StudentMaster.findOne({"studentId":Meteor.userId()});
  // 	if(buyerData){
  // 		var studentName = buyerData.studentFullName;
  // 	}
  // 	return studentName;
  // }
  
  render(){
    if(!this.props.loading){
      if(this.props.orderMasterData){ 
      return(
      	<div>
        {/* Content Wrapper. Contains page content */}
        <div className="content-wrapper">
          {/* Content Header (Page header) */}
          <section className="content-header">
            <h1>Package Purchase Invoice</h1>
          </section>
          {/* Main content */}
          <section className="content viewContent">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                <div className="box">
                  <div className="box-header with-border boxMinHeight">
		        <div className="outerServiceBlock col-lg-12 col-md-12 col-sm-12 col-xs-12" >
		          <div className="servieInnerBlock col-lg-12 col-md-12 col-sm-12 col-xs-12" id="outerInvoiceBlock">
		            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" >
		              <div>
		                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 headerinvoice">
		                    <span className="col-lg-5 col-lg-offset-1 col-md-5 col-md-offset-1 col-sm-6 col-xs-7 invoicetitle">INVOICE</span>
		                    <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 mailtitle"></span>
		                    <span className="col-lg-4 col-md-4 col-sm-4 col-xs-4 addresstitle"> <br /></span>
		                    {/*<span className="col-lg-1 mailtitle downloadPdf"><i className="fa fa-file-pdf-o pull-right" title="Download as pdf" onClick={this.printDocument.bind(this)}></i></span>*/}
		                  </div>
		                  
		                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 invoicebill">
		                    <div className="col-lg-3 col-lg-offset-1 col-md-3 col-md-offset-1 col-sm-3 col-sm-offset-1 col-xs-12 clientbilled">
		                      <div className="billedto date">Billed To</div>
		                      <div className="">{this.props.orderMasterData.studentName}</div>
		                      <div className="clientdetails">
		                      </div>
		                    </div>
		                    <div className="col-lg-7 col-lg-offset-1 col-md-7 col-md-offset-1 col-sm-7 col-sm-offset-1 col-xs-12 clientaddress">
		                    	<div className="col-lg-6 col-md-6   textCenterInvoice">
			                      <div className="invoicenumber date">Invoice Number <br /></div>
			                      <div className="">{this.props.orderMasterData.invoiceId}</div>
		                        </div>
		                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 textCenterInvoice">            
			                      <div className="dateofissue date">Invoice Date <br /></div>
			                      <div className="">{moment(this.props.orderMasterData.createdAt).format("DD/MM/YYYY")}</div>
		                      </div>
		                    </div>
		                    {/*<div className="col-lg-3 col-lg-offset-1 col-md-4 col-md-offset-2 invoicecount">
		                      <div className="invoicetotle">Invoice Total<br /></div>
		                      <div className=" money"><i className="fa fa-rupee"></i>{this.formatRupees(100)}</div>
		        
		                    </div>*/}

		                  </div>


		                  <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12 dash dashFirst"></div>

		                  <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12 table1">
		                    <table>
		                      <thead className="">
		                        <tr className="tablehead1">
		                          <th className="col-lg-8 col-md-8 col-sm-8 col-xs-8 serviceNm">Package Name </th>
		                          <th className="col-lg-2 col-md-2 col-sm-2 col-xs-2 amtcount">Unit Cost </th>
		                          <th className="col-lg-2 col-md-2 col-sm-2 col-xs-2 invoiceQuantity">Qty </th>
		                          <th className="col-lg-3 col-md-3 col-sm-3 col-xs-3 amtcount">Amount </th>
		                        </tr>
		                      </thead>
		                      <tbody>
		                        {
		                          this.props.orderMasterData ? 
		                           this.props.orderMasterData.packages.map((packageData,index)=>{
		                            return(
		                              <tr key ={index} className="firstrow">
		                                <td className="col-lg-8 col-md-8 col-sm-8 col-xs-8">{packageData.packageName} <br />
		                                <span className="textCSN">Category: {packageData.category}, sub-Category: {packageData.subCategory} , Number of Paper: {packageData.NoOfPracticeTest}</span> 
		                              </td>
		                                <td className="col-lg-2 col-md-2 col-sm-2 col-xs-2 amtcount"><i className="fa fa-rupee"></i>{packageData.packagePrice}</td>
		                                <td className="col-lg-2 col-md-2 col-sm-2 col-xs-2 invoiceQuantity">1 </td>
		                            <td className="col-lg-2 col-md-2 col-sm-2 col-xs-2 invoiceQuantity"><i className="fa fa-rupee"></i>{packageData.packagePrice * 1} </td>
		                                {/* <td className="col-lg-3 col-md-3 amtcount"><i className="fa fa-rupee"></i>{this.rate()} </td> */}
		                              </tr>
		                            )
		                           })
		                         
		                          :
		                          null
		                        }
		                      </tbody>
		                    </table>
		                   
		                    <hr className="hrhide"></hr>
		                 
		                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
		                    <div className="pull-right text-right noPadLeftRight col-lg-6 col-md-6 col-sm-6 col-xs-12">
		                      <span className="subtotal  text-right col-lg-7 col-md-7 col-sm-7 col-xs-12 noPadLeftRight">Invoice Total </span>
		                      <span className="subtotlecount  text-right col-lg-4 col-md-4 col-sm-4 col-xs-4 noPadLeftRight"><i className="fa fa-rupee"></i>{this.props.packageTotal}</span>
		                      {/* <span className="subtotlecount  text-right col-lg-4 noPadLeftRight"><i className="fa fa-rupee"></i>{this.formatRupees(this.props.invoice.totalAmount)}</span> */}
		                    </div>  
		                  </div>
		                 </div>
		                 
		                 
		                  <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 outerButtonDiv">
		                    <a href="/Admin/listofFranchise">
		                    <button type="submit" className="col-lg-3 col-md-4 col-xs-12 col-sm-12 col-xs-12 btn ServiceProcessButtons pull-left">Cancel</button>
		                    </a>
		                    {
		                    	this.state.cashPaymentStatus==false?
		                    	<button type="submit" className="col-lg-3 col-md-4 col-xs-12 col-sm-12 col-xs-12 btn ServiceProcessButtons pull-right" onClick={this.confirm.bind(this)}>Confirm Payment</button>
		                    	:
		                    	<button type="submit" className="col-lg-3 col-md-4 col-xs-12 col-sm-12 col-xs-12 btn ServiceProcessButtons pull-right" disabled><i className="fa fa-spinner fa-spin" aria-hidden="true"></i>&nbsp;&nbsp;Please wait</button>

		                    }
		                    
		                   </div>
		                
		                 
		              </div>
		           </div>
		          </div>
		        </div>
		      </div>
		    </div>
		  </div>
        </div>
        </section>
        </div>

        </div>

      );
     }else{
      return(<span>Data not available</span>);
     }
    }else{
      return(<span>Loading... Please Wait</span>);
    }
  } 
}
 
export default  MyInvoiceContainer = withTracker(({params}) => {
	var orderId = FlowRouter.getParam("id");
	const postHandle  = Meteor.subscribe('singleOrder',orderId);
	const loading = !postHandle.ready();
	var orderMasterData = PackageOrderMaster.findOne({"_id":orderId})||{}; 
	if(orderMasterData.packages){
			var packageTotal = orderMasterData.packages.reduce((addprice,elem)=>{
				return  addprice + elem.packagePrice;
			},0);
	}

	// console.log("orderMasterData",orderMasterData,packageTotal);
	return{
		loading,
		orderMasterData,
		packageTotal,
	}
})(MyInvoice);
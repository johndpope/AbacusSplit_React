import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {withTracker} from 'meteor/react-meteor-data';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import { FranchiseDetails }  from '/imports/admin/companySetting/api/CompanySettingMaster.js';

import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';

class DocumentDownload extends TrackerReact(Component) {

	constructor(props) {
		super(props);
		this.state={
			allCompetitions : [],
			examData : '',
			competitionStatus: true,
		}
		this.printDocument=this.printDocument.bind(this);
		// this.createPDF=this.createPDF.bind(this);
		// this.getCanvas=this.getCanvas.bind(this);
	}

	// componentWillMount(){
	// 	Meteor.call("allCompetitions",(err,res)=>{
	//  		this.setState({
	//  			allCompetitions : res,
	//  		});
	//  	});
	// }

	componentDidMount() {
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

	// getCompetitionId(s){
	// 	var competitionId = $("#selectId option:selected").attr("id");
	// 	if(competitionId){
	// 		$('.certicateCompWrap').addClass('addTransitionCCW');
	// 		// $('.addMoreCerthideBtn').addClass('addMoreCertBtn');
	// 		Meteor.call("competitionWiseRankCertificate",competitionId,Meteor.userId(),(err,res)=>{
	// 			if(err){
	// 				console.log(err);
	// 			}else{
	// 				this.setState({
	// 					examData : res,
	// 					competitionStatus : false,
	// 				});
	// 			}
	// 		});
	// 	}

	// }

	printDocument(event){
	    event.preventDefault();

	    $('#GoToLbl').hide();
		$('#printButton').hide();
		$('#hidefooter').hide();
	    window.print();
	    $('#GoToLbl').show();
	    $('#printButton').show();
	    $('#hidefooter').show();
	       // this.createPDF();
	  }

	
	// createPDF(){

	// 	Bert.alert("Please wait till document download.","success");
	//     var outerInvoiceBlock = $('.docImg'),
	//     cache_width = outerInvoiceBlock.width(),
	//     a4  =[8.5,  11];  // for a4 size paper width and height
	//     this.getCanvas();
	    
	// }

	// getCanvas(){
	// 	html2canvas($('.docImg').get(0)).then( function (canvas) {
	//     var img = canvas.toDataURL("image/png");
	//     const jsPDF = require('jspdf');
	//     console.log("jsPDF---->",jsPDF);
	    
	// 	var   doc = new jsPDF({
	// 	  		 orientation:'landscape',
	// 	          unit:'in',
	// 	          format:'a4'
	// 	        });
	// 			var width = doc.internal.pageSize.width;
	// 			var height = doc.internal.pageSize.height - 0;
	// 	        doc.addImage(img, 'JPEG',0.18,1,width,height);
	// 		    doc.save(FlowRouter.getParam("docType")+'.pdf');
	// 			// canvas.save('CompetiotionCertificate.pdf');
	// 		});
	// }
   
	render() {
		if(!this.props.loading){
        return (       	
       		<div>
		        {/* Content Wrapper. Contains page content */}
		        <div className="content-wrapper">
		          {/* Content Header (Page header) */}
		          <section className="content-header">
		            <h1>Document to download</h1>
		          </section>
		          {/* Main content */}
		          <section className="content viewContent">
		            <div className="row">
		                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
			                <div className="box">
			                 	<div className="box-header with-border boxMinHeight">	
	                  		 	 	<div className="docBox">
		                  		 	 	<div className="col-lg-6 col-md-6 col-xs-12 col-sm-12 prevPage">
		                  		 	 		<a className="col-lg-12 col-md-12 col-xs-12 col-sm-12" id="GoToLbl" href={"/Admin/profile/"+FlowRouter.getParam("franchiseId")}><blink>Go to previous page</blink></a> 
		                  		 	 	</div>
		                  		 	 	<div className="col-lg-6 col-md-6 col-xs-12 col-sm-12">
											{/*<button className="faEvent btn pull-right" title="Click to print certificate" onClick={this.getPrint.bind(this)}><i className="fa fa-print fa-2x" aria-hidden="true"></i></button>*/}
				                			<button className="faEvent btn pull-right certDlSRank" title="Click to dowload certificate PDF" id="printButton" onClick={this.printDocument.bind(this)}><i className="fa fa-download fa-2x" aria-hidden="true"></i></button>
				                		</div>
							       		<div className="docImg col-lg-12 col-md-8 col-sm-12 col-xs-12 ">
							       			<img className="col-lg-12 col-md-12 col-xs-12 col-sm-12" src={this.props.imageSrc}/>
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
       }
       return (
				 <div>
			
		        <div className="content-wrapper">
		          <section className="content-header">
		            {/*<h1>Answer Sheet</h1>*/}
		          </section>
		          <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		                  <div className="box-header with-border boxMinHeight  loadingImgWrap">
							 <h3 className="examFinishedStatus examLoadingTimeDiv"> Loading please wait... </h3>
							 {/*<img src="/images/preloader.gif"/>*/}
							 </div>
							  </div>
							</div>
						  </div>
			
					  </section>
					</div>
				</div>
				);
	} 
}
export default DocumentDownload = withTracker((props)=>{
  	var DocId=FlowRouter.getParam("docId"); 
  	var FranchiseId=FlowRouter.getParam("franchiseId"); 
    const postHandle = Meteor.subscribe('singleFranchiseData',FranchiseId);
    const loading    = !postHandle.ready();
    const FranchiseDetailsData = FranchiseDetails.findOne({"franchiseCodeForCompanyId":FranchiseId})||{};
    var documentData=[];
    if(FranchiseDetailsData){
	    documentData=FranchiseDetailsData.Documents;
	    if(documentData){
	    	var docPath=documentData[DocId];
	    	if(docPath){
	    		var imageSrc=docPath.ImgSource;
	    	}
	    }
    } 
    return {
    	loading,
        imageSrc,
        DocId
    };
})(DocumentDownload);

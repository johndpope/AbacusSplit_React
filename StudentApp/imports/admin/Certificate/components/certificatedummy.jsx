import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {withTracker} from 'meteor/react-meteor-data';
import {MyExamMaster} from '/imports/admin/forms/student/api/myExamMaster.js';
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';

export default class Certificate extends TrackerReact(Component) {

	constructor(props) {
		super(props);
		this.state={
			allCompetitions : [],
			examData : '',
			competitionStatus: true,
		}
		this.printDocument=this.printDocument.bind(this);
		this.createPDF=this.createPDF.bind(this);
		this.getCanvas=this.getCanvas.bind(this);
	}

	componentWillMount(){
		Meteor.call("allCompetitions",(err,res)=>{
	 		this.setState({
	 			allCompetitions : res,
	 		});
	 	});
	}

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

	getCompetitionId(s){
		var competitionId = $("#selectId option:selected").attr("id");
		if(competitionId){
			$('.certicateCompWrap').addClass('addTransitionCCW');
			// $('.addMoreCerthideBtn').addClass('addMoreCertBtn');
			Meteor.call("competitionWiseRankCertificate",competitionId,Meteor.userId(),(err,res)=>{
				if(err){
					console.log(err);
				}else{
					this.setState({
						examData : res,
						competitionStatus : false,
					});
				}
			});
		}

	}

	printDocument(event){
	    event.preventDefault();
	    this.createPDF();
	 }

	
	createPDF(){

		Bert.alert("Please wait till document download.","success");
	    var outerInvoiceBlock = $('.bg'),
	    cache_width = outerInvoiceBlock.width(),
	    a4  =[8.5,  11];  // for a4 size paper width and height
	    this.getCanvas();
	    
	}

	getCanvas(){
		html2canvas($('.bg').get(0)).then( function (canvas) {
	    var img = canvas.toDataURL("image/png");
	    const jsPDF = require('jspdf');
		var   doc = new jsPDF({
		  		 orientation:'landscape',
		          // unit:'in',
		          format:'a4'
		        });
		// var doc = new jsPDF("p", "mm", "a4");
				var width = doc.internal.pageSize.width;
				var height = doc.internal.pageSize.height - 0;
		        doc.addImage(img, 'JPEG',0,0,width,height);
		  // var width           = doc.internal.pageSize.width; 
    //       var height          = doc.internal.pageSize.height;
    //       var imgHeight       = canvas.height * width / canvas.width;
    //       var heightLeft = imgHeight;
    //       var position = 0;

    //       doc.addImage(img, 'PNG', 0, position, width, imgHeight);
    //       heightLeft -= height;

    //       while (heightLeft >= 0) {
    //         position = heightLeft - imgHeight;
    //         doc.addPage();
    //         doc.addImage(img, 'PNG', 0, position, width, imgHeight);
    //         heightLeft -= height;
    //       }
			    doc.save('CompetiotionCertificate.pdf');
				// canvas.save('CompetiotionCertificate.pdf');
			});
	}
   
	render() {
		
       return (
       		<div>
		        {/* Content Wrapper. Contains page content */}
		        <div className="content-wrapper">
		          {/* Content Header (Page header) */}
		          <section className="content-header">
		            <h1>My Exam Certificate</h1>
		          </section>
		          {/* Main content */}
		          <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		                  <div className="box-header with-border boxMinHeight">
		                 	<div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3 col-xs-12 certicateCompWrap">
								<span className="blocking-span"> 
									<select type="text" name="competitionId" ref="competitionId"  id="selectId" onClick={this.getCompetitionId.bind(this)} onChange={this.handleChange} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" autoComplete="off" title="Please select Category" required>
										<option value="">-- Select Competition for certificate --</option>
										{this.state.allCompetitions.map((competition,index)=>{
											return <option key={index} id={competition._id}>{competition.competitionName}</option>
										  })
										}
									</select>
									<span className="floating-label floating-label-Date">Select Competition</span>					   								   			
								</span>
							</div>
		                  {this.state.examData ?
		                  		 this.state.examData.answerArray ?
		                  		 	 this.state.examData.answerArray.length > 0 ?
		                  		 	 	<div>
		                  		 	 	<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
											{/*<button className="faEvent btn pull-right" title="Click to print certificate" onClick={this.getPrint.bind(this)}><i className="fa fa-print fa-2x" aria-hidden="true"></i></button>*/}
				                			<button className="faEvent btn pull-right certDlSRank" title="Click to dowload certificate PDF" onClick={this.printDocument.bind(this)}><i className="fa fa-download fa-2x" aria-hidden="true"></i></button>
				                		</div>
							       		<div className="bg col-xl-8 col-lg-8  col-lg-offset-2 col-md-12 col-sm-12 col-xs-12 ">
							       			<div className="col-xl-12 col-lg-12 col-md-12 col-sm-4 col-xs-4 certifywrapper">		
							       				<div className="col-lg-9 col-md-9 col-sm-4 col-xs-4 col-xl-9 ">
							   						<div className="col-lg-2 col-md-2 col-sm-6 col-xs-12 col-xl-2">
							       						<img src="/images/logo.png" className="img-responsive certificateLogo" />
							       					</div>
							       					<div className="col-xl-10 col-lg-10 col-md-10 col-sm-12 col-xs-12 titleCertify ">
														<div className="UMuppercase certifyTitle col-lg-12">MENTAL ARITHMETIC & ABACUS</div>
													</div>
													<div className="col-xl-10 col-lg-10 col-md-10 col-sm-12 col-xs-12 titleCertify">	
														<div className="UMuppercase certifyTitle2 col-lg-12">ALL INDIA TALENT SEARCH PVT. LTD.</div>	
													</div>	
													<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
														<h3 className="UMuppercase certiSubTitle col-lg-12 col-md-12 col-sm-12 col-xs-12">BRINGING EXCELLENCE TO THE TOP</h3>
													</div>
													<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
														<h5 className="col-lg-12 col-md-12 col-sm-12 col-xs-12 regesNo">Regd No. U80904PN2014PTC151064</h5>
													</div>
												</div>
												<div className="col-xl-9 col-lg-9 col-md-9 col-sm-4 col-xs-4 certificateTxtImgWrapper ">
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<img src="/images/certificate.png" className="img-responsive certificateTxtImg" />
													</div>
												</div>
												<div className="col-xl-9  col-lg-9 col-md-9 col-sm-4 col-xs-4 certificateTxtImgWrapper ">
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<p className="certificatePara">This is to certify that</p>
													</div>
												</div>
												<div className="col-xl-9  col-lg-9 col-md-9 col-sm-4 col-xs-4">
													<span className="certificateName col-lg-12 col-md-12 col-sm-12 col-xs-12 ">{this.state.examData.fullName}</span>
												</div>
												<div className="col-xl-9  col-lg-9 col-md-9 col-sm-4 col-xs-4">
													<p className="hasLine col-lg-12 col-md-12 col-sm-12 col-xs-12">has secured</p>
												</div>
												<div className="col-xl-9  col-lg-9 col-md-9 col-sm-4 col-xs-4">
													<span className="certificateNameRnk col-lg-12 col-md-12 col-sm-12 col-xs-12">{this.state.examData.rank !="Consolation" ? this.state.examData.rank+  " Rank" : this.state.examData.rank} </span>
												</div>
												<div className="col-xl-9  col-lg-9 col-md-9 col-sm-4 col-xs-4">
													<p className="certifyLastLine col-lg-12 col-md-12 col-sm-4 col-xs-12">in {this.state.examData.competitionName} of</p>
												</div>
												<div className="col-xl-9  col-lg-9 col-md-9 col-sm-4 col-xs-4">
													<p className="certifyLastTxtLine col-lg-12 col-md-12 col-sm-12 col-xs-12">ABACUS and MENTAL ARITHMETIC PROGRAMME</p>
												</div>
												<div className="col-xl-9  col-lg-9 col-md-9 col-sm-12 col-xs-12  certificateSignWrapper">
													<div className="col-lg-5 col-md-5 col-sm-12 col-xs-12 ">
														<img src="/images/_ceo_sign.png" className="img-responsive certifySignImg"/>
														<h3 className="ceoTXt">CEO</h3>
													</div>
													<div className="col-xl-5  col-lg-5 col-md-5 col-sm-12 col-xs-12 ">
														<img src="/images/_director.png" className="img-responsive certifySignImg" />
														<h3 className="ceoTXt">Director</h3>
													</div>
												</div>
							       			</div>
							       		</div>
							       		</div>
							       	:
									    null
									    /*<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noCertificateMsg">Oops! You have to participate to get the certificate.</div>*/
									:
									<div className="col-xl-12  col-lg-12 col-md-12 col-sm-12 col-xs-12 noCertificateMsg">Oops! You are not eligible to get the certificate.</div>
					       		:
					       			!this.state.competitionStatus ?
					       				!this.state.examData ?
											<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 noCertificateMsg">Oops! You are not eligible to get the certificate.</div>
										:
										null
					       			:
					       				null		
					       		}
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

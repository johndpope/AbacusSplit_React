import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {withTracker} from 'meteor/react-meteor-data';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {MyExamMaster} from '/imports/admin/forms/student/api/myExamMaster.js';
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';

export default class ParticipationCertificate extends TrackerReact(Component) {

	constructor(props) {
		super(props);
		this.state = {
	       facilityPermission : 'waitingforResult',
	       allCompetitions: [],
	       competitionStatus : true,
	       examData: '',

	    }
		this.printDocument=this.printDocument.bind(this);
		this.createPDF=this.createPDF.bind(this);
		this.getCanvas=this.getCanvas.bind(this);
	}
  	componentWillMount(){
  		Meteor.call("isAuthenticated","Certificate","ParticipationCertificate",(err,res)=>{
			if(err){
				console.log(err);
			}else{
				if(res==true){
		          this.setState({
		             facilityPermission : res,
		          });
		        }else if(res==false){
		          this.setState({
		             facilityPermission : res,
		          });
		        }
			}
		});
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
			Meteor.call("competitionWiseParticipationCertificate",competitionId,Meteor.userId(),(err,res)=>{
				if(err){
					console.log(err);
				}else{
					// console.log("res --->",res);

					this.setState({
						examData : res,
						competitionStatus : false,

					});
				}
			});
		}

	}

	// hideBtnShowList(event){
	// 	$('.certicateCompWrap').removeClass('addTransitionCCW');
	// 	$('.addMoreCerthideBtn').removeClass('addMoreCertBtn');
	// 	$('.certicateCompWrap').css('margin-top',0.5% 'position','absolute');
	// }

	printDocument(event){
	    event.preventDefault();
	    this.createPDF();
	}

	
	createPDF(){
	    Bert.alert("Please wait till document download.","success");	
	    var outerInvoiceBlock = $('.certificateWrappers'),
	    cache_width = outerInvoiceBlock.width(),
	    a4  =[7.5,  11];  // for a4 size paper width and height
	    this.getCanvas();
	}

	getCanvas(){

		html2canvas($('.certificateWrappers').get(0)).then( function (canvas) {
	    var img = canvas.toDataURL("image/png");
	    const jsPDF = require('jspdf');
		var   doc = new jsPDF({
		  		 orientation:'landscape',
		          unit:'in',
		          format:'a4'
		        });
				// var width = doc.internal.pageSize.width;
				// var height = doc.internal.pageSize.height - 0;
		  //       doc.addImage(img, 'JPEG',0.18,1,width,height);

		  	var width           = doc.internal.pageSize.width; 
          var height          = doc.internal.pageSize.height;
          var imgHeight       = canvas.height * width / canvas.width;
          var heightLeft = imgHeight;
          var position = 0;

          doc.addImage(img, 'PNG', 0, position, width, imgHeight);
          heightLeft -= height;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(img, 'PNG', 0, position, width, imgHeight);
            heightLeft -= height;
          }
			    doc.save('ParticipationCertificate.pdf');
				// canvas.save('ParticipationCertificate.pdf');
			});
	}

   
	render() {
		if(this.state.facilityPermission != 'waitingforResult' && this.state.facilityPermission == true){
			$('.sidebar').css({display:'block',background: '#222d32'});
		
       return (
       		<div>
		        <div className="content-wrapper">
			        <section className="content-header">
			            <h1>My Exam Certificate</h1>
			        </section>
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
										{/*<div className="col-lg-12 col-md-12 col-sm-12 addMoreCerthideBtn" onClick={this.hideBtnShowList.bind(this)}>
											<button className="btn btn-primary" >Get more Certificates</button>
										</div>*/}
										{this.state.examData ?
					                  		 this.state.examData.answerArray ?
					                  		 	 this.state.examData.answerArray.length > 0 ?
					                  	 			<div>
					                  	 				<div id="fader"></div>
						                 				<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 studCCWrap">
				        									{/*<button className="faEvent btn pull-right" title="Click to print certificate" onClick={this.getPrint.bind(this)}><i className="fa fa-print fa-2x" aria-hidden="true"></i></button>*/}
						                        			<button id="downloadLink" className="faEvent btn pull-right certDlS" title="Click to dowload certificate PDF" onClick={this.printDocument.bind(this)}><i className="fa fa-download fa-2x" aria-hidden="true"></i></button>
						                        		</div>
														<div className="certificateWrappers col-xl-8 col-lg-8 col-lg-offset-2  col-md-12 col-sm-12 col-xs-12 ">
															<div className="col-xl-12 col-lg-12 col-md-12 col-sm-4 col-xs-4 certifywrapper">
																<div className="col-xl-12 col-lg-12 col-md-12 col-sm-4 col-xs-4 certiTitleWrapper">
																	<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
																		<div className="UMuppercase certificateTitle col-lg-12">MENTAL ARITHMETIC & ABACUS</div>
																	</div>
																	<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 certiTitle">	
																		<div className="UMuppercase certificateTitle2 col-lg-12">ALL INDIA TALENT SEARCH PVT. LTD.</div>	
																	</div>	
																</div>
																<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
																	<h3 className="UMuppercase certiSubTitle col-lg-12">BRINGING EXCELLENCE TO THE TOP</h3>
																</div>
																<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
																	<h5 className="col-lg-12 col-xl-12 regesNo">Regd No. U80904PN2014PTC151064</h5>
																</div>
																<div className="col-lg-12 col-xl-12 col-md-12 col-sm-4 col-xs-4 certificateTxtImgWrapper ">
																	<h1 className="certiPartTitle col-xl-10 col-xl-offset-1 col-lg-10 col-lg-offset-1 ">Participation Certificate</h1>
																</div>
																<div className="col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12">
																	<p className="certificatePara col-lg-10 col-lg-offset-1 col-xl-10 col-xl-offset-1 col-md-12 col-sm-4 col-xs-4">This is to certify that</p>
																</div>
																<div className="col-lg-12 col-xl-12 col-md-12 col-sm-4 col-xs-4">
																	<span className="certificateName col-xl-10 col-xl-offset-1 col-lg-10 col-lg-offset-1 col-md-12 col-sm-4 col-xs-4">{this.state.examData.fullName}</span>
																</div>
														
																<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 col-xl-12">
																	<p className="certifyLastLine">has participated in {this.state.examData.competitionName} of</p>
																</div>
																<div className="col-xl-8 col-xl-offset-2 col-lg-8 col-lg-offset-2 col-md-8 col-sm-4 col-xs-12">
																	<p className="certifyLastTxtLine2">ABACUS and MENTAL ARITHMETIC PROGRAMME</p>
																</div>
																<div className="col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12">
																	<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 col-xl-6">
																		<img src="/images/_ceo_sign.png" className="img-responsive certifySignImg" />
																		<h3 className="ceoTXt">CEO</h3>
																	</div>
																	<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 col-xl-6">
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
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noCertificateMsg">Oops! You have to participate to get the certificate.</div>
							       		:
							       			!this.state.competitionStatus ?
							       				!this.state.examData ?
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noCertificateMsg">Oops! You are not eligible to get the certificate.</div>
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

		}else if (this.state.facilityPermission == false ){
			  	return (<div>{FlowRouter.go('/noAccesss')}</div>);
		  }else if(this.state.facilityPermission == "waitingforResult"){
		  	return(<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
			   <img className="loaderImageSize1" src="/images/loading1.gif" alt="loading"/>
			</div>);
		  }else{ 
		  return (<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap"><h3>You don't have access.</h3></div>);
		}


	} 

}

// export default ParticipationCertificateContainer = withTracker(props=>{
// 	var studId         = Meteor.userId();
// 	const postHandle   = Meteor.subscribe('showAllStudExams',studId);
// 	const loading      = !postHandle.ready();

// 	var examData       = MyExamMaster.findOne({"StudentId":studId})||{};
	
// 	return{
// 		loading,
// 		examData

// 	}
	
	
// })(ParticipationCertificate);


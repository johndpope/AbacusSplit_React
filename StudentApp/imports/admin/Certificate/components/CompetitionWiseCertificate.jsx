import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {withTracker} from 'meteor/react-meteor-data';
import {MyExamMaster} from '/imports/admin/forms/student/api/myExamMaster.js';
import html2canvas from 'html2canvas';
// import * as jsPDF from 'jspdf';
import {jsPDF} from 'jspdf';


class Certificate extends TrackerReact(Component) {

	constructor(props) {
		super(props);
		this.printDocument=this.printDocument.bind(this);
		this.createPDF=this.createPDF.bind(this);
		this.getCanvas=this.getCanvas.bind(this);
	}

	componentDidMount() {
	 	Meteor.call("allCompetitions",(err,res)=>{
	 		this.setState({
	 			allCompetitions : res,
	 		});
	 	});
	}

	getCompetitionId(s){
		var competitionId = $("#selectId option:selected").attr("id");
		Meteor.call("competitionWiseCertificate",competitionId,Meteor.userId(),(err,res)=>{
			if(err){
				console.log(err);
			}else{
				this.setState({
					examCertificateData : res,
				});
			}
		});

	}

	printDocument(event){
	    event.preventDefault();
	       this.createPDF();
	  }

	// //create pdf
	// createPDF(){
	//   var outerInvoiceBlock = $('.bg'),
	//   cache_width = outerInvoiceBlock.width(),
	//   a4  =[8.5,  11];  // for a4 size paper width and height
	//   this.getCanvas().then(function(canvas){
	//   var img = canvas.toDataURL("image/png"),
	//   doc = new jsPDF({
	//   		  orientation:'landscape',
	//           unit:'in',
	//           format:'a4'
	//         });
	//         var width = doc.internal.pageSize.width;
	//         var height = doc.internal.pageSize.height - 0;
	//         doc.addImage(img, 'JPEG',0,0,width,height);
	//         doc.save('Certificate.pdf');
	//         outerInvoiceBlock.width(cache_width);
	// });
	// }

	// // create canvas object
	// getCanvas(){
	//   var outerInvoiceBlock = $('.bg'),
	//   cache_width = outerInvoiceBlock.width(),
	//   a4  =[1122, 793];  // for a4 size paper width and height
	// // outerInvoiceBlock.width(cache_width).css('max-width','none');
	//    return html2canvas(outerInvoiceBlock,{
	//      imageTimeout:2000,
	//      removeContainer:true
	//     });
	// }

	createPDF(){
		Bert.alert("Please wait till document download.","success");
	    var outerInvoiceBlock = $('.bg'),
	    cache_width = outerInvoiceBlock.width(),
	    a4  =[8.5,  11];  // for a4 size paper width and height
	     this.getCanvas(cache_width);
	}

	// getCanvas(){
	// 	html2canvas($('.bg').get(0)).then( function (canvas) {
	//     var img = canvas.toDataURL("image/png");
	//     const jsPDF = require('jspdf');
	// 	var   doc = new jsPDF({
	// 	  		 orientation:'landscape',
	// 	          unit:'in',
	// 	          format:'a4'
	// 	        });
	// 			var width = doc.internal.pageSize.width;
	// 			var height = doc.internal.pageSize.height - 0;
	// 	        doc.addImage(img, 'JPEG',0.18,1,width,height);
	// 		    doc.save('CompetiotionCertificate.pdf');
	// 			// canvas.save('CompetiotionCertificate.pdf');
	// 		});
	// }

	getCanvas(cachewidth){
    html2canvas($('.bg').get(0)).then( function (canvas) {
    var certificateWrappers = $('.bg');
      var img = canvas.toDataURL("image/png");
      if(canvas.width > canvas.height){
         var doc = new jsPDF('landscape','mm','a4',[canvas.width, canvas.height]);
      }else{
        var doc = new jsPDF('p', 'mm','a4',[canvas.height, canvas.width]);
      }
          doc.setFontSize(16); 
          var width           = doc.internal.pageSize.getWidth(); 
          var height          = doc.internal.pageSize.getHeight();
          // var imgHeight       = (canvas.height * width) / canvas.width;
          var position = 0;

          doc.addImage(img, 'PNG', 0, position, width, height);
          // doc.addImage(img, 'PNG', 0, position, width, imgHeight);
          doc.save('CompetiotionCertificate.pdf');
          certificateWrappers.width(cachewidth);
    });
  }
   
	render() {
		
       return (
       		<div>
		        {/* Content Wrapper. Contains page content */}
		        <div className="content-wrapper">
		          {/* Content Header (Page header) */}
		          <section className="content-header">
		            <h1>Competition Wise Certificates</h1>
		          </section>
		          {/* Main content */}
		          <section className="content viewContent">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		                  <div className="box-header with-border boxMinHeight">
		                  		<div className="col-lg-8 col-lg-offset-2  col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-12 catSelectWrapRank">

									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<span className="blocking-span"> 
											<select type="text" name="competitionId" ref="competitionId"  id="selectId" onClick={this.getCompetitionId.bind(this)} onChange={this.handleChange} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" autoComplete="off" title="Please select Category" required>
												<option value="">-- Select Competition --</option>
												{this.state.allCompetitions.map((competition,index)=>{
													return <option key={index} id={competition._id}>{competition.competitionName}</option>
												  })
												}
											</select>
											<span className="floating-label floating-label-Date">Select Competition</span>					   								   			
										</span>
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
}

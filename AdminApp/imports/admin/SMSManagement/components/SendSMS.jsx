

import React, {Component} from 'react';
import {render} from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {CategoryMaster} from '/imports/admin/forms/addCategory/api/categoryMaster.js';
import {QuestionPaperMaster} from '/imports/admin/forms/setQuestionPaper/api/questionPaperMaster.js';
import { Session } from 'meteor/session';
import TimeInput from 'react-time-input';


class SendSMS extends TrackerReact(Component)  {
constructor(){
		super();
		this.state ={
			// selectUser:'Franchise',
			categoryName  : 'All',
			subCategory: 'All',
			// studentNameCWTM :'',
			franchiseId:'All',
			franchise:'',
			Student:'',
			Franchise:'',
			smsText : '',
			sms:'',
			smsCount:1,
			ArrayOfMobileNO:[],
			facilityPermission : 'waitingforResult',  
			// allCategoryWiseStudent: [],
			// allCompetitions  : [],
			// allFranchiseData : [],
			// paginationArray  : [],
			// subscription:{
			// 	getCategory : 
			// }
		}
		this.handleChange = this.handleChange.bind(this);
		// this.getFranchiseId = this.getFranchiseId.bind(this);
		this.handleChangeRadio = this.handleChangeRadio.bind(this);
		this.uploadFileOfContacts = this.uploadFileOfContacts.bind(this);
		// this.showhideSubCatDetails = this.showhideSubCatDetails.bind(this);
	}

	componentWillMount(){
		// this.paginationFunction();
		Meteor.call("isAuthenticated","SMSManagement","SendSMS",(err,res)=>{
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
	}

	componentDidMount(){
		// this.mobileNoData();
		// Meteor.call("allCompetitions",(err,res)=>{
	 // 		this.setState({
	 // 			allCompetitions : res,
	 // 		});
		// });

		Meteor.call("allFranchiseData",(err,res)=>{
	 		this.setState({
	 			allFranchiseData : res,
	 		});
		});

	}


	handleChange(event) {
	    const target = event.target;
	    const name = target.name;
	    this.setState({
	      [name]: event.target.value
	    });		
	}
	handleChangeText(event) {
	  
	    this.setState({
	      smsText: event.target.value
	    });	
	    var smsContent=event.target.value;
		var smsLength=smsContent.length;
		if(smsLength>149){
			this.setState({
				smsCount: Math.ceil(smsLength/149),
			})

		}else{
			this.setState({
				smsCount: 1,
			})
		}		
	}

	showCategories(){
		var categorryHandle = Meteor.subscribe("allCategory").ready();
		return CategoryMaster.find({}).fetch();	
	}

	// getFranchiseId(event){
	// 	var franchiseId = $("#franchiseId option:selected").attr('id');
	// 		this.setState({
	// 			franchiseId : franchiseId,
	// 	});
	// }



  	getCategoryName(event){
		var categorySubName = $(event.target).val();
		this.setState({
			categoryName : categorySubName,
		});
		
	}

	getSubCategoryName(event){
		var categorySubName = $(event.target).val();
		this.setState({
			subCategory : categorySubName,
			startRange:0,
			counter: 1,
		});		
	}

  	SubCategoryName(event){
		var categoryName = this.state.categoryName;
		var	signleCategory = CategoryMaster.findOne({"categoryName":categoryName});
		if(signleCategory){
			var subCategoryarray = signleCategory.levels;
			var subCatarray =[];
			for(var i=0; i<subCategoryarray.length;i++){
				var subCat = categoryName+''+parseInt(i+1);
				var subCat = String(subCat);
				subCatarray.push(
					<option key={i}>{subCat}</option>
					);
			}
			return subCatarray;
		}else{
			return [];
		}
	}

	// showhideSubCatDetails(event){
	// 	$('.categoryListDataStud').toggleClass('categoryListDataStudshow');
	// }


	



	// getFranchiseName(studentId){
	// 	var postHandle = Meteor.subscribe("LoginInStudent",studentId).ready();
	// 	if(postHandle){
	// 		var studData = StudentMaster.findOne({"studentId":studentId});	
	// 		if(studData){		
	// 			return studData.franchiseName;
	// 		}
	// 	}	
	// }
	handleChangeRadio(e){
		const target = e.target;
		const name   = target.name;
		// console.log("e.target",e.target);
		this.setState({
			[name] : e.target.value,
		})
		if($('.franchiseCheckbox').is(':checked')){
			this.setState({
				Franchise:"Franchise",
			})
		}else{
			this.setState({
				Franchise:"",
			})
		}

		if($('.studentCheckbox').is(':checked')){
			$('.showCategories').show();

			this.setState({
				Student:"Student",
			})

		}else{
			$('.showCategories').hide();
			this.setState({
				Student:"",
			})
		}
		

	}
	
	sendSMS(){

		swal("Please wait till success message is displayed");
		var smsContent=this.state.smsText;
		var smsLength=smsContent.length;	

		if(smsLength>0){
				// if(smsLength<=149){
					if(this.state.Student=="Student" && this.state.Franchise=="Franchise"){			
						Meteor.call("sendSMSToallFranchiseAndStudent",this.state.franchiseId,this.state.smsText,(err,res)=>{
						 		if(err){
						 			console.log(err);
						 		}else{	 			
							 		swal("SMS Sent successfully","","success");
							 		this.refs.smsText.value  = '';
							 		$('input[type=file]').val(null);
							 		
						 		}
						 	});
					}
					else if(!this.state.Student && this.state.Franchise=="Franchise"){					
						if(this.state.franchiseId=="All"){

							Meteor.call("sendSMSToAllFranchise",this.state.smsText,(err,res)=>{
						 		if(err){
						 			console.log(err);
						 		}else{	 			
							 		swal("SMS Sent successfully","","success");
							 		this.refs.smsText.value  = '';
							 		$('input[type=file]').val(null);
							 		
						 		}
						 	});

						}else{
						
							Meteor.call("sendSMSToSingleFranchise",this.state.franchiseId,this.state.smsText,(err,res)=>{
						 		if(err){
						 			console.log(err);
						 		}else{	 			
							 		swal("SMS Sent successfully","","success");
							 		this.refs.smsText.value  = '';
							 		$('input[type=file]').val(null);
							 		
						 		}
						 	});
						}

					}else if(this.state.Student=="Student" && !this.state.Franchise){
						Meteor.call("sendSMSToStudents",this.state.franchiseId,this.state.categoryName,this.state.subCategory,this.state.smsText,(err,res)=>{
						 		if(err){
						 			console.log(err);
						 		}else{	 			
							 		swal("SMS Sent successfully","","success");
							 		this.refs.smsText.value  = '';
							 		$('input[type=file]').val(null);

						 		}
						 	});
					}else{
						swal("Please select option to send SMS");
					}


					Meteor.call("sendSMSToOthers",this.state.smsText,(err,res)=>{
				 		if(err){
				 			console.log(err);
				 		}else{	 			
					 		// swal("SMS Sent successfully","","success");
				 		}
				 	});


				/*}else{
					swal("You can enter maximum 149 characters per sms");
				}*/
		}else{
			swal("Please enter sms content");
		}
	}

	uploadFileOfContacts=(event)=>{
        event.preventDefault();
        if(event.target.files[0]){
        	var fileName      =   event.target.files[0].name;
        	var fileExtension =  fileName.split('.').pop();
        // console.log("fileExtension......>", fileExtension);
       
     		if(fileExtension=="csv" || fileExtension=="xls" || fileExtension=="xlsx"){
		        UserSession.delete("progressbarSession", Meteor.userId());
		        Papa.parse( event.target.files[0], {
				    header: true,
				    complete( results, file ) {
				    	Meteor.call( 'BulkContactCSVUpload', results.data, ( error, result ) => {
		                	if ( error ){
		         				swal("Something went wrong");

		         			} else {
		         				if(result){
		         				}
		                        setTimeout(()=>{ 
		                            $(".adminBlkUpldQues").val('');
		                            UserSession.delete("progressbarSession", Meteor.userId());
		                        }, 8000);
		         			}
		      			});

				    }
		        });
		    }else{
		    	swal("Please upload only .csv or .xls or .xlsx file","","warning");
		    }
         }


    }
     showProgressBar(){
        var getPercernt = this.props.getPercernt;
        var allPercernt = this.props.allPercernt;
       
        if(getPercernt){
           
            var total = parseInt(this.props.total);
            // console.log('total: ',total);
            var styleC = {
                width:total + "%",
                display:"block",
            }
            var styleCBar = {
                display:"block",
            }
        }
        if(!getPercernt){

            var total = 0;

            var styleC = {
                width:0 + "%",
                display:"none",
            }
            var styleCBar = {
                display:"none",
            }
        }
    }


	
	render(){
		if(this.state.facilityPermission != 'waitingforResult' && this.state.facilityPermission == true){
			$('.sidebar').css({display:'block',background: '#222d32'});				
			return(
				<div>
			        {/* Content Wrapper. Contains page content */}
			        <div className="content-wrapper">
			          {/* Content Header (Page header) */}
			          <section className="content-header">
			            <h1>Send SMS</h1>
			          </section>
			          {/* Main content */}
			          <section className="content viewContent">
			            <div className="row">
			              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
			                <div className="box">
			                  <div className="box-header with-border boxMinHeight">
			                  
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  text-center ">
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<h3 className=" drpdownlbeltitle col-lg-12 col-md-12 col-xs-12 col-sm-12">Send SMS To : </h3>
											<div className="drpdownlbeltitle1 col-lg-2 col-md-2 col-sm-12 col-xs-12 examTypeBtn examTypeBtnn">
												<input className="franchiseCheckbox smsChckBox chckbxstyle" type="checkbox" name="Franchise" ref="Franchise" value="Franchise" onClick={this.handleChangeRadio}/> <label className="chbxlabel">Franchise</label>
												
											</div>
											<div className="drpdownlbeltitle col-lg-2 col-md-2 col-sm-12 col-xs-12 examTypeBtn">
												<input className="studentCheckbox smsChckBox chckbxstyle" type="checkbox" name="Student" ref="Student" value="Student" onClick={this.handleChangeRadio}/> <label className="chbxlabel">Student</label>
												
											</div>
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
											<label className="drpdownlbel col-lg-12 col-md-12 col-xs-12 col-sm-12">Franchise</label>
											<span className="blocking-span"> 
												<select type="text" id="franchiseId" name="franchiseId" ref="franchiseId"  onChange={this.handleChange} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" autoComplete="off" title="Please select Franchise" required>
													{/*<option disabled value="">All</option>*/}
													<option value="All" id="All">ALL</option>
													{this.state.allFranchiseData?
														this.state.allFranchiseData.map((franchise,index)=>{
														return <option  value={franchise.franchiseCodeForCompanyId} key={index}>{franchise.franchiseName}</option>
													  }):null
													}
												</select>
												{/*<span className="floating-label floating-label-Date">Select Franchise </span>	*/}				   								   			
											</span>
										</div>
										<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 showCategories">
											<label className="drpdownlbel col-lg-12 col-md-12 col-xs-12 col-sm-12">Category</label>
											<span className="blocking-span"> 
												<select type="text" name="categoryName" ref="categoryName" value={this.state.categoryName} onClick={this.getCategoryName.bind(this)} onChange={this.handleChange} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" autoComplete="off" title="Please select Category" required>
												{/*	<option disabled value="">-- Select Category --</option>*/}
													<option value="All" id="All">ALL</option>
													{this.showCategories().map((categories,index)=>{
														return <option key={index}>{categories.categoryName}</option>
													  })
													}
												</select>
												{/*<span className="floating-label floating-label-Date">Select Category</span>	*/}				   								   			
											</span>
										</div>
										<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 showCategories">
										<label className="drpdownlbel col-lg-12 col-md-12 col-xs-12 col-sm-12">Sub Category</label>
											{/*<span className="helpSecSR" title="Help" onClick={this.showhideSubCatDetails.bind(this)} ><i className="fa fa-question-circle"></i></span>
											<div className="categoryListDataStud categoryListDataStudshoww">
												<label>A1/B1/C1/D1</label> : Below 7 year<br/>
												<label>A2/B2/C2/D2</label> : 7-9 year<br/>
												<label>A3/B3/C3/D3</label> : 9-11 year<br/>
												<label>A4/B4/C4/D4</label> : 11-14 year<br/>
											</div>*/}
											<span className="blocking-span"> 
												<select type="text" name="subCategory" ref="subCategory" value={this.state.subCategory} onClick={this.getSubCategoryName.bind(this)} className="form-control subCatTab col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" title="Please select Sub Category" onChange={this.handleChange.bind(this)} required>
													{/*<option value="">-- Select Sub Category --</option>*/}
													<option value="All" id="All">ALL</option>
													{this.SubCategoryName()}
												</select>
												{/*<span className="floating-label floating-label-Date">Select Sub Category</span>	*/}				   			
											</span>
										</div>
										
										
											{/*<input className="col-lg-12 col-md-12 col-sm-12 col-xs-12" type="file" accept=".xls,.xlsx .csv"/>*/}

											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
												{/*<span className="fieldTitle">Upload File</span>*/}
												<label className="drpdownlbel col-lg-12 col-md-12 col-xs-12 col-sm-12">Upload File(.csv/ .xls/ .xlsx)</label>
												<input type="file" name="uploadCSV" ref="uploadCSV" onChange={this.uploadFileOfContacts.bind(this)} accept=".csv" className="fileuploadalign col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" required/>
												
												<div className="col-lg-12">
				                                    {this.showProgressBar()}
				                                </div>
											</div>
										
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 txtareaBox">
											<label className="drpdownlbel col-lg-12 col-md-12 col-xs-12 col-sm-12">SMS Content:</label>	
											<textarea className="txtareaBoxContent" rows="5" cols="138" name="smsText" ref="smsText" value={this.state.smsText} onChange={this.handleChangeText.bind(this)} placeholder="Enter message text here..." required></textarea>
										</div>
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 smslbel">
										{/*<label className="">(Max 149 char per SMS)</label>*/}
										{this.state.smsCount==1?
											<label className="">(Max 149 char per SMS)</label>
											:
											<label className="">{this.state.smsCount+" SMS per recepient"}</label>

										}
										</div>
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-6">
											<button type="submit" className="col-lg-2 col-md-2 col-sm-12 col-xs-12 btn btn-primary addCategoryBtn" onClick={this.sendSMS.bind(this)}>Send SMS</button>
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
		// }else{
		// 	 return (
		// 	 	<div>
		// 	        {/* Content Wrapper. Contains page content */}
		// 	        <div className="content-wrapper">
		// 	          {/* Content Header (Page header) */}
		// 	          <section className="content-header">
		// 	            <h1>Question Paper</h1>
		// 	          </section>
		// 	          {/* Main content */}
		// 	          <section className="content viewContent">
		// 	            <div className="row">
		// 	              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		// 	                <div className="box">
		// 	                  <div className="box-header with-border boxMinHeight">
		// 		                  <div className="box-header with-border">
		// 				            <h3 className="box-title">Set Question Paper</h3>
		// 				          </div>
		// 						  <div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-12 col-xs-12 onlineSXWrap loadingPageWrap">
		// 							 	<div className="col-lg-12 col-md-12">
		// 									<img src="/images/pageLoading.gif"/>
		// 						        </div>
		// 						   </div>
		// 					  </div>
		// 				    </div>
		// 				  </div>
		// 				</div>
		// 			  </section>
		// 			</div>
		// 		</div>

		// 	);
		// }



		}else if (this.state.facilityPermission == false ){
				  	return(<h1>{FlowRouter.go('/noAccesss')}</h1>);
			  }else if(this.state.facilityPermission == "waitingforResult"){
			  	return(<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
				   <img className="loaderImageSize1" src="/images/loading1.gif" alt="loading"/>
				</div>);
			  }else{ 
			  return (<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
				   <h3>You dont have access. Please <a href="/admin/AssignPermissionstoModules/ShowAll">click here </a> to assign permission</h3>
				</div>);
		}
	}
}
export default SendSMSContainer = withTracker(props=>{
	var id = FlowRouter.getParam("id");
	var postHandle = Meteor.subscribe("singleQuestionPaper",id).ready();
	var questionPaperData = QuestionPaperMaster.findOne({"_id":id})||{};
	var getPercernt = UserSession.get("progressbarSessionContact",Meteor.userId());
    var allPercernt = UserSession.get("allProgressbarSessionContact",Meteor.userId());
    var total = (getPercernt/allPercernt)*100;
	
	return{
		questionPaperData,
		'getPercernt' : getPercernt,
    	'allPercernt' : allPercernt,
    	'total' : total,
	}
})(SendSMS);
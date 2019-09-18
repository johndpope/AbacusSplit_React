import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
// import UMPackage from './UMPackage.jsx';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import {PackageManagementMaster} from '../api/packageManagementMaster.js';
import { withTracker } from 'meteor/react-meteor-data';
import {QuestionPaperMaster} from '/imports/admin/forms/setQuestionPaper/api/questionPaperMaster.js';
import ReactTable from "react-table";


class UMListOfPackage extends TrackerReact(Component){
	constructor(props){
		super(props);
		this.state = {
			packageName             : '',
			categoryName            : '',
			subCategory             : '',
			NoOfPracticeTest        : '',
			AttemptOfPracticeTest   : '',
			PackagePrice            : '',
			// GST                  : '',
			Description             : '',
			PackageName             : '',
			SearchText              : '',
			allPackageData           :[],
			facilityPermission : 'waitingforResult',
		}
		

	}

	componentWillMount(){
  		 Meteor.call("isAuthenticated","PackageManagement","ListOfPackages",(err,res)=>{
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


	usersListData(){
	    var packageHandle = Meteor.subscribe("packageManagementData").ready();
		return PackageManagementMaster.find({}).fetch();	
	}
	getQuestionStartEndNum(event){
		var limitRange = $(event.target).attr('id');
		limitRange     = parseInt(limitRange);
		var startRange = limitRange - 20;
		$('.page-link').removeClass('active');
		var counter = $(event.target).text();
		Session.set('pageUMNumber',counter);

		$(".liNext").css("cursor","pointer");
			if(Session.get("questionUMCount")==counter){
			$(".liNext").css("cursor","not-allowed");
		}
		this.setState({
			startRange : startRange,
			counter    : counter,
		},()=>{this.usersListData()});
	}

	nextPage(event){
		var counter = this.state.counter;
		counter++;
		Session.set('pageUMNumber',counter);
		var questionCount = Session.get("questionUMCount");
		if(questionCount>=counter){
			$('.page-link').removeClass('active');
			$(".pagination"+counter).addClass("active");
			var limitRange = $('.active').attr('id');
			var startRange =  parseInt(limitRange)- 20;
			this.setState({
				counter    : counter,
				startRange : startRange,
			});
			this.usersListData();
		}else if(questionCount==counter){
			$(".liNext").css("cursor","not-allowed");
		}
	}
	componentDidMount(){
		if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}
		{this.usersListData()}
		this.AllPackageData();
  	}
  	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}
    buildRegExp(searchText) {
	   var words = searchText.trim().split(/[ \-\:]+/);
	   var exps = _.map(words, function(word) {
	      return "(?=.*" + word + ")";
	   });
	   var fullExp = exps.join('') + ".+";
	   return new RegExp(fullExp, "i");
	}
	componentDidUpdate(){
		$('.pagination'+this.state.counter).addClass("active");
		Session.set('pageUMNumber',this.state.counter);
		// if(Session.get("questionUMCount"))
		// this.AllPackageData();

	}
	// componentWillUpdate(){
	// 	this.AllPackageData();
	// 	console.log("willupdate");
	// }

	addOneMorePackage(){
		FlowRouter.go('/Admin/CreatePackages/');
	}
	buildRegExp(searchText) {
	   var words = searchText.trim().split(/[ \-\:]+/);
	   var exps = _.map(words, function(word) {
	      return "(?=.*" + word + ")";
	   });

	   var fullExp = exps.join('') + ".+";
	   return new RegExp(fullExp, "i");
	}

	getTextValue(event){
		var searchName= $('.SearchPackage').val();
		if(searchName){
			var RegExpBuildValue = this.buildRegExp(searchName);
			this.setState({
				SearchText   : RegExpBuildValue,
				
			},()=>{this.AllPackageData()});
		}else{
			this.setState({
				SearchText   : '',
				
				
			},()=>{this.AllPackageData()});
		}
	}
	AllPackageData(){
			if(!this.state.SearchText){
				
				Meteor.call("allPackage",(err,res)=>{
					if(err){
						
					}else{
						
						this.setState({'allPackageData':res});
					}
				})

			}else{
		
				Meteor.call("SearchPackage",this.state.SearchText,(err,res)=>{
					if(err){
						// console.log(error);
					}else{
						this.setState({'allPackageData':res});
					}
				})
			}
		
	}
	'deletePackageConfirm'(event){
	    event.preventDefault();
	    var uid = event.target.id;
	    // console.log("uid",uid);
			swal({
				  title              : 'Are you sure?',
				  text               : 'You will not be able to recover this Record!',
				  type               : 'warning',
				  showCancelButton   : true,
				  confirmButtonColor : '#dd6b55',
				  cancelButtonColor  : '#d44',
				  confirmButtonText  : 'Yes, Delete it!',
				  cancelButtonText   : 'No, Keep it',
				  closeOnConfirm     : false
				}, ()=> {
					Meteor.call("removePackage",uid,(error,result)=>{
						if(error){

						}else{					
							swal(
						    'Deleted Successfully',
						    '',
						    'success'
						  );
							this.AllPackageData();
					}
				});
	  		});
  	}
	
	render(){
			if(this.state.facilityPermission != 'waitingforResult' && this.state.facilityPermission == true){
			$('.sidebar').css({display:'block',background: '#222d32'});
       return(
			<div>
		        <div className="content-wrapper">
		          <section className="content-header">
		            <h1>Package Management</h1>
		          </section>
		          <section className="content viewContent">
		            <div className="row">
		                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                    <div className="box">
		                  		<div className="box-header with-border boxMinHeight">
						            <div className="box-header with-border">
						            	<h3 className="box-title">List of Packages</h3>
						            </div>
			            			<div className="box-body1 searchTableBoxAlignSETT2">
					                    <div className="col-lg-12 paddingleftzero">
					                    <div className="col-lg-2">
					                    	<button className="btn btn-primary" onClick={this.addOneMorePackage.bind(this)}>Add Package</button> 
					                    </div>
					                    <div className="col-lg-9 col-md-12 searchTableBoxAlignSETT ">
												<span className="blocking-span">
													<input type="text" name="search"  placeholder="Search Package by Name/ Category/ SubCategory" className="col-lg-6 col-sm-4 SearchExam SearchPackage inputTextSearch" onInput={this.getTextValue.bind(this)} required/>
													{/*<span className="floating-label">Search Package by Name/ Category/ SubCategory</span>*/}
												</span>
										</div>
										</div>
										{/*<div>		
											<div>
												<div className="col-lg-12 col-md-12  col-sm-12 col-xs-12 addRolWrap addcountrylist questWrapReactTable" id="contactlistview">
													<ReactTable data={data2} columns={headers} filterable={false} />
												</div>
											</div>
										</div>*/}



											<div className="table-responsive col-lg-12 col-md-12 col-sm-12 col-xs-12 topMarginToTable">
												<table className="table table-striped  table-hover table-bordered reportTables" id="monthlyStudRegReporttab">
													<thead>
														<tr className="tableHeader">
															<th className="tab-Table">Sr. No</th>
															<th> Package Name </th>
															<th> Category </th>
															<th> Sub Category</th>
															<th> No. of Practice Test </th>
															<th> No. of Attempt </th>
															<th> Price (Rs) </th>
															<th> Action </th>
															
															{/*<th className="tab-Table"> Status </th>
															<th> Action </th>*/}
														</tr>
													</thead>
													<tbody className="myAllTable">
														{this.state.allPackageData.map((packageData, index)=>{
														return <tr key={index}>
																	<td className="tab-Table"></td>
																	<td>{packageData.packageName}</td>
																	<td>{packageData.categoryName}</td>
																	<td>{packageData.subCategory}</td>
																	<td>{packageData.NoOfPracticeTest}</td>
																	<td>{packageData.AttemptOfPracticeTest}</td>
																	<td>{packageData.PackagePrice}</td>
																	<td className="col-lg-1 col-md-2 col-sm-1 col-xs-1 tab-Table textaligncenter">
																		<a href={`/Edit/Admin/UMListOfPackages/${packageData._id}`}><i className="fa fa-edit editIcon"></i></a> 
																		<i className="fa fa-trash deleteIcon" onClick={this.deletePackageConfirm.bind(this)} id={packageData._id}/>
																	</td>
																	
																</tr>
													})}
													</tbody>
												</table>
											</div>
										{/*<div>
											{ this.state.allPackageData?
														 <UMPackage  usersDataValues={this.state.allPackageData} />
														:
														 null
													  
											}
										</div>*/}
					                </div>
								</div>
							</div>
				 		</div>
					</div>
				</section>
		  	</div>
		</div>
	    );
       }else if (this.state.facilityPermission == false ){
			  	FlowRouter.go('/noAccesss')
		  }else if(this.state.facilityPermission == "waitingforResult"){
		  	return(<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
			   <img className="loaderImageSize1" src="/images/loading1.gif" alt="loading"/>
			</div>);
		  }else{ 
		  return (<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
		  			<h3>You dont have access. Please <a href="/admin/AssignPermissionstoModules/Show%20All">click here </a>to assign permission</h3>
		  		 </div>
		  	);
		}
	} 
}
export default MasterListDataDisplay = withTracker(props => {
  	
  	const postPracticePaperHandle = Meteor.subscribe('quesPaperPracticeExam');
    const postPracticePaper       = QuestionPaperMaster.find({"examType":"Practice Exam"},{sort: {createdAt: -1}}).fetch();
    const loadingPracticePaper    = !postPracticePaperHandle.ready();
    const postHandle              = Meteor.subscribe('packageManagementData');
    const loading                 = !postHandle.ready();
    const post                    = PackageManagementMaster.find({},{sort: {createdAt: -1}}).fetch();
   
	var IDArray                   =[];
	
	for(i=0;i<post.length;i++){
		var IDs=[];
		for(j=0;j<post[i].practicePaperID.length;j++){
			if(post[i].practicePaperID[j]){
				 IDs.push(post[i].practicePaperID[j].paperID);
			}
		}
		var dataTitles = QuestionPaperMaster.find({"_id":{$in:IDs}, "examType":"Practice Exam"},{sort: {createdAt: -1}}).fetch();
		post[i].practiceNames= dataTitles;
	}
	return {
        loadingPracticePaper,
      	postPracticePaper,
      	loading,
      	post,
    };   	
})(UMListOfPackage);
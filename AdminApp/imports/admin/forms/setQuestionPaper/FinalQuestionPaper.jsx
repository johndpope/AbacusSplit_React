/*  
	COMPONENT:  Add CATEGORY 
	PROGRAMMER: VIKAS JAGDALE 
	
	This component will show final question papers. 

*/

import React, {Component} from 'react';
import {render} from 'react-dom';
import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

import {QuestionPaperMaster} from '/imports/admin/forms/setQuestionPaper/api/questionPaperMaster.js';
import {CategoryMaster} from '/imports/admin/forms/addCategory/api/categoryMaster.js';

export default class FinalQuestionPaper extends TrackerReact(Component)  {
	
	constructor(props){
		super(props);
		this.state={
			categoryName  : 'A',
			subCategory: 'A1',
			facilityPermission : 'waitingforResult',
			subscription:{
				categoryData : Meteor.subscribe("allCategory"),
			} 
		}
		this.handleChange = this.handleChange.bind(this);
	}

	componentWillMount(){
  		 Meteor.call("isAuthenticated","MasterData","FinalQuestionPaperList",(err,res)=>{
			if(err){
				console.log(err);
			}else{
				this.setState({
					// facilityPermission : access("Add Questions","Master Data"),
					 facilityPermission : res,
				});
			}
		});
  	}

	componentDidMount(){
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

	handleChange(event){
		const target = event.target;
		const name   = target.name;
		this.setState({
			[name] : event.target.value,
		});
	}

	showCategories(){
		return CategoryMaster.find({}).fetch();	
	}

  	getSubCategoryName(event){
		var categorySubName = $(event.target).val();
		this.setState({
			subCategory : categorySubName,
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

	showFinalexamPaper(){
		// var postHandle  = Meteor.subscribe("ShowQuestionPaper").ready();
		var postHandle  = Meteor.subscribe("ShowQuestionPaperMainExam",this.state.categoryName,this.state.subCategory).ready();
		 var mainQPData =   QuestionPaperMaster.find({"examType":"Final Exam","category":this.state.categoryName,"subCategory":this.state.subCategory},{sort:{'createdAt':-1}}).fetch();
		 if(mainQPData){
		 	return mainQPData;
		 }else{
		 	return [];
		 }
	}

	removeQuestionPaper(event){
		var _id = $(event.target).attr('id');
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
			}, function() {
				Meteor.call("removeQuestionPaper",_id,(error,result)=>{
							if(error){

							}else{
								var result = result
								if(result=="CantDeleteExamCreated"){
									swal(
								    "You can't delete this question paper",
								    'You have created main exam for this question paper. If you want to delete please delete main exam first for deleting this question paper',
								    'warning'
								  );
								}else{
									swal(
								    'Question Paper has been Deleted',
								    '',
								    'success'
								  );
								}
						}
					});
		
  		});

	}
	// Exam search by exam name

	FinalTableSearch(event) {
	    event.preventDefault();
	    var searchText = event.currentTarget.value;
	    var filter = searchText.toUpperCase();
	    var table = document.getElementById("ExamListTable");
	    var tr = table.getElementsByTagName("tr");
	      // Loop through all table rows, and hide those who don't match the search query
	    if(tr){
	      for (var i=0; i<tr.length; i++) {
	        var td = tr[i].getElementsByTagName("td")[1];
	        if(td) {
	          console.log(td.innerHTML.indexOf(filter));
	          if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {

	            tr[i].style.display = "";
	          } else {
	            tr[i].style.display = "none";
	          }
	        }
	      }
	    }

	}

  	showhideSubCatDetails(event){
		$('.categoryListDataStud').toggleClass('categoryListDataStudshow');
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
			            <h1>Set Question Paper</h1>
			          </section>
			          {/* Main content */}
			          <section className="content viewContent">
			            <div className="row">
			              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
			                <div className="box">
			                  <div className="box-header with-border boxMinHeight">
			                  <div className="box-header with-border">
					            <h3 className="box-title">Main Question Papers</h3>
					            </div>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				                    <div className="col-lg-12  col-md-12 col-sm-12 col-xs-12 selectCatSubCatList">
										<div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
											<span className="blocking-span"> 
												<select type="text" name="categoryName" ref="categoryName" value={this.state.categoryName} onClick={this.SubCategoryName.bind(this)} onChange={this.handleChange} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" autoComplete="off" title="Please select Category" required>
													<option disabled value="">-- Select Category --</option>
													{this.showCategories().map((categories,index)=>{
														return <option key={index}>{categories.categoryName}</option>
													  })
													}
												</select>
												<span className="floating-label floating-label-Date">Select Category</span>					   								   			
											</span>
										</div>
										<div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
											<span className="helpSecSR" title="Help" onClick={this.showhideSubCatDetails.bind(this)} ><i className="fa fa-question-circle"></i></span>
											<div className="categoryListDataStud categoryListDataStudshoww">
												<label>A1/B1/C1/D1</label> : Below 7 year<br/>
												<label>A2/B2/C2/D2</label> : 7-9 year<br/>
												<label>A3/B3/C3/D3</label> : 9-11 year<br/>
												<label>A4/B4/C4/D4</label> : 11-14 year<br/>
											</div>
											<span className="blocking-span"> 
												<select type="text" name="subCategory" ref="subCategory" value={this.state.subCategory} onClick={this.getSubCategoryName.bind(this)}className="form-control subCatTab col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" onChange={this.handleChange} required>
													<option value="">-- Select Sub Category --</option>
													{this.SubCategoryName()}
												</select>
												<span className="floating-label floating-label-Date">Select Sub Category</span>					   			
											</span>
										</div>
										<div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
				                   			<input type="text" name="search" placeholder="Search exam name..." className="col-lg-11 col-sm-11 SearchExam" onInput={this.FinalTableSearch.bind(this)}/>
				                    	</div>
									</div>
									
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 examTable">
						              		<table className="table table-striped formTable" id="ExamListTable">
											    <thead className="tableHeader">
											        <tr>
											            <th className="col-lg-1 tab-Table">Sr. No</th>
											            <th className="col-lg-6">Exam Title </th>
											            {/*<th className="col-lg-1 tab-Table"> Category </th>*/}
											            <th className="col-lg-2 tab-Table"> No. of Questions </th>
											            <th className="col-lg-2 tab-Table"> Selected Questions </th>
											            <th className="col-lg-1 tab-Table"> Action </th>
											            
											        </tr>
											    </thead>
											    {this.showFinalexamPaper().length >0 ? 
												    <tbody className="myAllTable">
												    	{this.showFinalexamPaper().map((questionPaper, index)=>{
												    		return <tr key={index} className={questionPaper.status}>
												    			<td className="tab-Table"></td>
												    			<td><a href={`/Admin/QuestionPapers/${questionPaper._id}`} title="Click to view question paper">{questionPaper.quePaperTitle} &nbsp;&nbsp;&nbsp;<span>{questionPaper.isDraft}</span></a></td>
												    			{/*<td className="tab-Table">{questionPaper.category}</td>*/}
												    			<td className="tab-Table">{questionPaper.noOfQuestion}</td>
												    			<td className="tab-Table">{questionPaper.questionsArray.length }</td>
												    
												    			<td className="tab-Table">
												    				<a href={`/Admin/CreateQuestionPapers/${questionPaper._id}`}>
												    					<i className="fa fa-eye editIcon" title="View & Edit"></i>
												    				</a>	
												    				<i className="fa fa-trash deleteIcon" title="Delete Exam" id={questionPaper._id} onClick={this.removeQuestionPaper.bind(this)}></i>
												  
												    			</td>
												    		</tr>
												    	})}
												    </tbody>
											    :
											    	
											    	<tbody className="OESDataNotAvailable">
										    		{!this.state.subCategory ?
										    			<tr>
										    				<td colSpan="6">"{this.state.categoryName} Category Main Question Papers not yet available <a href="/Admin/CreateQuestionPapers">click here</a> to add Practice Question Papers"</td>
										    			</tr>
										    		:
										    			<tr>
										    				<td colSpan="6">"{this.state.subCategory} Sub-Category Main Question Papers not yet available <a href="/Admin/CreateQuestionPapers">click here</a> to add Practice Question Papers"</td>
										    			</tr>
										    		}
										    		</tbody>
									    		}
											</table>
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
		}else if (this.state.facilityPermission == false ){
				  	return (<div>{FlowRouter.go('/noAccesss')}</div>);
			  }else if(this.state.facilityPermission == "waitingforResult"){
			  	return(<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
				   <img className="loaderImageSize1" src="/images/loading1.gif" alt="loading"/>
				</div>);
			  }else{ 
			  return (<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
		  			<h3>You dont have access.</h3>
		  		 </div>);
		}
	}
}
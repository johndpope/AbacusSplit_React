/*  
	COMPONENT:  Add CATEGORY 
	PROGRAMMER: VIKAS JAGDALE 
	
	This component show question accoriding to tab. 

*/

import React, {Component} from 'react';
import {render} from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {QuestionMaster} from './api/questionMaster.js';
import {Session} from 'meteor/session';
import {CategoryMaster} from '/imports/admin/forms/addCategory/api/categoryMaster.js';
class QuestionCategoryTab extends TrackerReact(Component)  {

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

	A_CategoryQuestion(event){
		var postHandleCat = Meteor.subscribe("allCategory").ready();
		if(postHandleCat){
			var categoryArray = CategoryMaster.find({}).fetch();
			if(categoryArray){
				var CategoryName = categoryArray[0].categoryName;
				Session.set("Category1",CategoryName);
			}			
			Meteor.subscribe("categorywiseQuestion",CategoryName).ready();
			var A_Category_Q = QuestionMaster.find({"categoryName":CategoryName},{sort:{'createdAt':-1}}).fetch();
			if(A_Category_Q){
				return A_Category_Q;
			}else{
				return 0;
			}
		}else{
			return [];
		}
	
	}

	// B_CategoryQuestion(event){
	// 	var postHandleCat = Meteor.subscribe("allCategory").ready();
	// 	if(postHandleCat){
			
	// 		var categoryArray = CategoryMaster.find({}).fetch();
	// 		if(categoryArray){
	// 			var CategoryName = categoryArray[1].categoryName;
	// 			Session.set("Category2",CategoryName);
	// 		}
			
	// 		Meteor.subscribe("categorywiseQuestion",CategoryName).ready();
	// 		var B_Category_Q = QuestionMaster.find({"categoryName":CategoryName},{sort:{'createdAt':-1}}).fetch();
	// 		if(B_Category_Q){
	// 			return B_Category_Q;
	// 		}else{
	// 			return 0;
	// 		}
	// 	}else{
	// 		return [];
	// 	}
	
	// }

	// C_CategoryQuestion(event){
	// 	var postHandleCat = Meteor.subscribe("allCategory").ready();
	// 	if(postHandleCat){
			
	// 		var categoryArray = CategoryMaster.find({}).fetch();
	// 		if(categoryArray){
	// 			var CategoryName = categoryArray[2].categoryName;
	// 			Session.set("Category3",CategoryName);
	// 		}
			
	// 		Meteor.subscribe("categorywiseQuestion",CategoryName).ready();
	// 		var C_Category_Q = QuestionMaster.find({"categoryName":CategoryName},{sort:{'createdAt':-1}}).fetch();
	// 		if(C_Category_Q){
	// 			return C_Category_Q;
	// 		}else{
	// 			return 0;
	// 		}
	// 	}else{
	// 		return [];
	// 	}
	
	// }

	// D_CategoryQuestion(event){
	// 	var postHandleCat = Meteor.subscribe("allCategory").ready();
	// 	if(postHandleCat){
			
	// 		var categoryArray = CategoryMaster.find({}).fetch();
	// 		if(categoryArray){
	// 			var CategoryName = categoryArray[3].categoryName;
	// 			Session.set("Category4",CategoryName);	
	// 		}
			
	// 		Meteor.subscribe("categorywiseQuestion",CategoryName).ready();
	// 		var D_Category_Q = QuestionMaster.find({"categoryName":CategoryName},{sort:{'createdAt':-1}}).fetch();
	// 		if(D_Category_Q){
	// 			return D_Category_Q;
	// 		}else{
	// 			return 0;
	// 		}
	// 	}else{
	// 		return [];
	// 	}
	
	// }
	
	/*
		Remove questions
	*/
	removeQuestion(event){
		var _id = $(event.target).attr('id');
		swal({
					  title: 'Are you sure?',
					  text: 'You will not be able to recover this Record!',
					  type: 'warning',
					  showCancelButton: true,
					  confirmButtonColor: '#dd6b55',
					  cancelButtonColor: '#d44',
					  confirmButtonText: 'Yes, Delete it!',
					  cancelButtonText: 'No, Keep it',
					  closeOnConfirm: false
					}, function() {
						Meteor.call("removeQuestion",_id,(error,result)=>{
							if(error){

							}else{
								swal(
							    'Question has been Deleted',
							    '',
							    'success'
							  );
						}
					});
  			
  		});

		
  			
	}
	getQuestionData(event){
		var categoryName = $(event.target).attr('id');
		var postHandle = Meteor.subscribe("categorywiseQuestion",CategoryName);
		var loadingData = !postHandle.ready();
		if(loadingData){
		var Category_Q = QuestionMaster.find({"categoryName":CategoryName},{sort:{'createdAt':-1}}).fetch();
			if(Category_Q){
				return Category_Q;
			}else{
				return 0;
			}
		}else{
			return []
		}
	}

	render(){
		return(
			<div>
		        {/* Content Wrapper. Contains page content */}
		        <div className="content-wrapper">
		          {/* Content Header (Page header) */}
		          <section className="content-header">
		            <h1>All Questions</h1>
		          </section>
		          {/* Main content */}
		          <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		                  <div className="box-header with-border boxMinHeight quesCattabpage">
		                  	<div className="box-header with-border">
				            <h3 className="box-title">Category wise Questions</h3>
				            </div>
							<div className="col-lg-12  col-md-12 col-sm-12 col-xs-12 questionCatTab">
								<div className="tabs-animated">
								  <ul className="nav nav-tabs oesNavTabs" role="tablist">
								    <li role="presentation" className="col-lg-3 col-md-3 tabPadding active" onClick={this.getQuestionData.bind(this)} id={Session.get('Category1')}><a href="#tab1" id="A" aria-controls="tab1" role="tab" data-toggle="tab">Category {Session.get('Category1')}</a></li>
								    <li role="presentation" className="col-lg-3 col-md-3 tabPadding" onClick={this.getQuestionData.bind(this)} id={Session.get('Category2')}><a href="#tab2" id="B" aria-controls="tab2" role="tab" data-toggle="tab">Category {Session.get('Category2')}</a></li>
								    <li role="presentation" className="col-lg-3 col-md-3 tabPadding" onClick={this.getQuestionData.bind(this)} id={Session.get('Category3')}><a href="#tab3" id="C" aria-controls="tab3" role="tab" data-toggle="tab">Category {Session.get('Category3')}</a></li>
								    <li role="presentation" className="col-lg-3 col-md-3 tabPadding" onClick={this.getQuestionData.bind(this)} id={Session.get('Category4')}><a href="#tab4" id="D" aria-controls="tab4" role="tab" data-toggle="tab">Category {Session.get('Category4')}</a></li>
								  </ul>


								  <div className="col-lg-12 col-md-12 tab-content tab-scroll-content">
								    <div role="tabpanel" className="tab-pane fade in active" id="tab1">
								    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 categoryTable">
					              		<table className="table table-striped formTable tab-Table">
										    <thead className="tableHeader">
										        <tr>
										            <th>Sr. No</th>
										            <th className="col-lg-4">Question </th>
										            <th className="col-lg-1"> A </th>
										            <th className="col-lg-1"> B </th>
										            <th className="col-lg-1"> C </th>
										            <th className="col-lg-1"> D </th>
										            <th className="col-lg-2"> Correct Answer </th>
										            <th className="col-lg-1"> Action </th>
										            
										        </tr>
										    </thead>
										    {this.getQuestionData() !=0 ?
											    <tbody className="myAllTable">
											    	{this.getQuestionData().map((category, index)=>{
											    		return <tr key={index}>
											    			<td></td>
											    			<td>{category.question}</td>
											    			<td>{category.A}</td>
											    			<td>{category.B}</td>
											    			<td>{category.C}</td>
											    			<td>{category.D}</td>
											    			<td>{category.correctAnswer}</td>
											    			<td>
											    				<a href={`/AddQuestions/${category._id}`}>
											    					<i className="fa fa-edit editIcon" title="Edit Question"></i>
											    				</a>	
											    				<i className="fa fa-trash deleteIcon" id={category._id} onClick={this.removeQuestion.bind(this)} title="Delete Question"></i>

											    			</td>
											  
											    		</tr>
											    	})}
											    </tbody>
										    :
										    	<tbody className="OESDataNotAvailable">
									    			<tr> 
									    				<td colSpan="8">"{Session.get('Category1')} Category Questions not added yet <a href="/AddQuestions">click here </a> to add "</td>
									    			</tr>
									    		</tbody>
								    		}
										</table>
									</div>
								    </div>
								    <div role="tabpanel" className="tab-pane fade" id="tab2">
								    	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 categoryTable">
					              		<table className="table table-striped formTable tab-Table">
										    <thead className="tableHeader">
										        <tr>
										            <th>Sr. No</th>
										            <th className="col-lg-4">Question </th>
										            <th className="col-lg-1"> A </th>
										            <th className="col-lg-1"> B </th>
										            <th className="col-lg-1"> C </th>
										            <th className="col-lg-1"> D </th>
										            <th className="col-lg-2"> Correct Answer </th>
										            <th className="col-lg-1"> Action </th>
										            
										        </tr>
										    </thead>
										    {this.getQuestionData() !=0 ?
											    <tbody className="myAllTable">
											    	{this.getQuestionData().map((category, index)=>{
											    		return <tr key={index}>
											    			<td></td>
											    			<td>{category.question}</td>
											    			<td>{category.A}</td>
											    			<td>{category.B}</td>
											    			<td>{category.C}</td>
											    			<td>{category.D}</td>
											    			<td>{category.correctAnswer}</td>
											    			<td>
											    				<a href={`/AddQuestions/${category._id}`}>
											    					<i className="fa fa-edit editIcon" title="Edit Question"></i>
											    				</a>	
											    				<i className="fa fa-trash deleteIcon" id={category._id} onClick={this.removeQuestion.bind(this)} title="Delete Question"></i>
											    			</td>
											    		</tr>
											    	})}
											    </tbody>
										    :
										    	<tbody className="OESDataNotAvailable">
									    			<tr> 
									    				<td colSpan="8">" {Session.get('Category2')} Category Questions not added yet <a href="/AddQuestions">click here </a> to add "</td>
									    			</tr>
									    		</tbody>
								    		}
										</table>
									</div>
								    </div>
								    <div role="tabpanel" className="tab-pane fade" id="tab3">
								    	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 categoryTable">
					              		<table className="table table-striped formTable tab-Table">
										    <thead className="tableHeader">
										        <tr>
										            <th>Sr. No</th>
										            <th className="col-lg-4">Question </th>
										            <th className="col-lg-1"> A </th>
										            <th className="col-lg-1"> B </th>
										            <th className="col-lg-1"> C </th>
										            <th className="col-lg-1"> D </th>
										            <th className="col-lg-2"> Correct Answer </th>
										            <th className="col-lg-1"> Action </th>
										            
										        </tr>
										    </thead>
										    {this.getQuestionData() !=0 ?
										    <tbody className="myAllTable">
										    	{this.getQuestionData().map((category, index)=>{
										    		return <tr key={index}>
										    			<td></td>
										    			<td>{category.question}</td>
										    			<td>{category.A}</td>
										    			<td>{category.B}</td>
										    			<td>{category.C}</td>
										    			<td>{category.D}</td>
										    			<td>{category.correctAnswer}</td>
										    			<td>
										    				<a href={`/AddQuestions/${category._id}`}>
										    					<i className="fa fa-edit editIcon" title="Edit Question"></i>
										    				</a>	
										    				<i className="fa fa-trash deleteIcon" id={category._id} onClick={this.removeQuestion.bind(this)} title="Delete Question"></i>
			
										    			</td>
										    		</tr>
										    	})}
										    </tbody>
										    :
										    	<tbody className="OESDataNotAvailable">
									    			<tr> 
									    				<td colSpan="8">" {Session.get('Category3')} Category Questions not added yet <a href="/AddQuestions">click here </a> to add " </td>
									    			</tr>
									    		</tbody>
								    		}
										</table>
									</div>
								    </div>
								    <div role="tabpanel" className="tab-pane fade" id="tab4">
								    	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 categoryTable">
					              		<table className="table table-striped formTable tab-Table">
										    <thead className="tableHeader">
										        <tr>
										            <th>Sr. No</th>
										            <th className="col-lg-4">Question </th>
										            <th className="col-lg-1"> A </th>
										            <th className="col-lg-1"> B </th>
										            <th className="col-lg-1"> C </th>
										            <th className="col-lg-1"> D </th>
										            <th className="col-lg-2"> Correct Answer </th>
										            <th className="col-lg-1"> Action </th>
										            
										        </tr>
										    </thead>
										    {this.getQuestionData() !=0 ?
											    <tbody className="myAllTable">
											    	{this.getQuestionData().map((category, index)=>{
											    		return <tr key={index}>
											    			<td></td>
											    			<td>{category.question}</td>
											    			<td>{category.A}</td>
											    			<td>{category.B}</td>
											    			<td>{category.C}</td>
											    			<td>{category.D}</td>
											    			<td>{category.correctAnswer}</td>
											    			<td>
											    				<a href={`/AddQuestions/${category._id}`}>
											    					<i className="fa fa-edit editIcon" title="Edit Question"></i>
											    				</a>	
											    				<i className="fa fa-trash deleteIcon" id={category._id} title="Delete Question" onClick={this.removeQuestion.bind(this)}></i>
											    				
											    			</td>
											    		</tr>
											    	})}
											    </tbody>
										    :
										    	<tbody className="OESDataNotAvailable">
									    			<tr> 
									    				<td colSpan="8">" {Session.get('Category4')} Category Questions not added yet <a href="/AddQuestions">click here </a> to add "</td>
									    			</tr>
									    		</tbody>
								    		}
										</table>
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
	}
}
export default questionCatTabContainer = withTracker(props=>{
	var postHandleCat = Meteor.subscribe("allCategory");
	var categoryloading = !postHandleCat.ready();
	var categoryArray = CategoryMaster.find({})||{};
	console.log('categoryArray-----> ', categoryArray);
	return{
		categoryloading,
		categoryArray
	}
})(QuestionCategoryTab);
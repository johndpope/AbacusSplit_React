

import React, {Component} from 'react';
import {render} from 'react-dom';
import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {QuestionMaster} from './api/questionMaster.js';
import {Session} from 'meteor/session';
import {CategoryMaster} from '/imports/admin/forms/addCategory/api/categoryMaster.js';

export default class QuestionCategoryTab extends TrackerReact(Component)  {
	
	constructor(props){
		super(props);
		this.state={
			categoryName  : 'A',
			subCategory: 'A1',
			startRange: 0,
			limitRange:100,
			counter: 1,
			negativeCounter : 2,
			questionResult : [],
			facilityPermission : 'waitingforResult',  	
			subscription:{
				categoryData : Meteor.subscribe("allCategory"),
			} 
		}
		this.handleChange = this.handleChange.bind(this);
	}

	componentWillMount(){
  		 Meteor.call("isAuthenticated","MasterData","CategorywiseQuestions",(err,res)=>{
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
		
		if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}
    	this.CategoryAndSubCatQuestion();

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
		})
	}

	showCategories(){
		return CategoryMaster.find({}).fetch();	
	}

  	getSubCategoryName(event){
		var categorySubName = $(event.target).val();
		this.setState({
			subCategory : categorySubName,
			startRange : 0,
			counter :1,
		},()=>{this.CategoryAndSubCatQuestion()});
		
		
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

	paginationFunction(event){
		var isReadyy = Meteor.subscribe("showCatWiseQuesforPagination",this.state.categoryName,this.state.subCategory).ready();
		const maxRowsPerPage = 100;
		if(isReadyy){
			var questionMasterDataCount = Counts.get('showCatWiseQuesforPagination');
			var paginationNum = parseInt(questionMasterDataCount)/maxRowsPerPage;
			var pageCount = Math.ceil(paginationNum);
			Session.set("questionCount",pageCount);
			paginationArray = [];
			for (var i=1; i<=pageCount;i++){
				var countNum = maxRowsPerPage * i;
				paginationArray.push(
					<li key={i} className="page-item"><a className={"page-link pagination"+i} id={countNum} onClick={this.getQuestionStartEndNum.bind(this)}>{i}</a></li>
				);
			}
			if(pageCount>=1){
				paginationArray.push(
					<li  key={-2} className="page-item"><a className="page-link liNext" onClick={this.nextPage.bind(this)}><i className="fa fa-angle-double-right" aria-hidden="true"></i></a></li>
				);
				return paginationArray;
			}
		}
	}

	getQuestionStartEndNum(event){
		var limitRange = $(event.target).attr('id');
		limitRange     = parseInt(limitRange);
		var startRange = limitRange - 100;
		$('.page-link').removeClass('active');
		var counter = $(event.target).text();
		Session.set('pageNumber',counter);

		$(".liNext").css("cursor","pointer");
			if(Session.get("questionCount")==counter){
			$(".liNext").css("cursor","not-allowed");
		}
		this.setState({
			startRange : startRange,
			counter    : counter,
		},()=>{this.CategoryAndSubCatQuestion()});
			
	}

	nextPage(event){
		var counter = this.state.counter;
		counter++;
		var questionCount = Session.get("questionCount");
		if(questionCount>=counter){
			Session.set('pageNumber',counter);
			$('.page-link').removeClass('active');
			$(".pagination"+counter).addClass("active");
			var limitRange = $('.active').attr('id');
			var startRange =  parseInt(limitRange)- 100;
			if(startRange){
			this.setState({
				counter    : counter,
				startRange : startRange,
			},()=>{this.CategoryAndSubCatQuestion()});
		}
		}else if(questionCount<=counter){
			$(".liNext").css("cursor","not-allowed");
			this.CategoryAndSubCatQuestion();
		}
	}

	// previousPage(event){
	// 	var negativeCounter = this.state.negativeCounter;
	// 	console.log(negativeCounter);
	// 	negativeCounter--;
		
	// 	var questionCount = Session.get("questionCount");
	// 	console.log(questionCount);
	// 	if(negativeCounter>0){
	// 	if(questionCount>=negativeCounter){
	// 		var limitRange = this.state.limitRange;
	// 		var startRange = this.state.startRange;
	// 		console.log(startRange);
	// 		console.log(limitRange);
	// 		var limitRange =  parseInt(limitRange)- 20;
	// 		var startRange = parseInt(startRange) - 20;

	// 		$('.page-link').removeClass('active');
	// 		$(".pagination"+negativeCounter).addClass("active");

	// 		this.setState({
	// 			negativeCounter    : negativeCounter,
	// 			limitRange : limitRange,
	// 			startRange : startRange,
	// 		});
	// 	}else if(questionCount==negativeCounter){
	// 		// $("li a").addClass('disabledLiPagi');
	// 	}
	// }
	// }

	CategoryAndSubCatQuestion(){
		Meteor.call("getQuestionData",this.state.categoryName,this.state.subCategory,this.state.startRange,this.state.limitRange, (err,res)=>{
			if(err){
				console.log(err.reason);
			}else{
				this.setState({"questionResult":res});
				// return res;
			}
		});
	}
	
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
						if(result){
							swal(
						    'You can not delete this question',
						    'This question used in '+result.examType+', ' +result.quePaperTitle,
						    'warning'
						  );
						}else{
						swal(
						    'Question has been Deleted',
						    '',
						    'success'
						  );
						}
				}
			});
  			
  		});		
	}

	showhideSubCatDetails(event){
		$('.categoryListDataStud').toggleClass('categoryListDataStudshow');
	}

	componentDidUpdate(){
		$('.pagination'+this.state.counter).addClass("active");
		Session.set('pageNumber',this.state.counter);
	}
	bulkDelete(e){
		event.preventDefault();
	    var checkedQuestionList     = [];
	    $('input[name=questionCheckbox]:checked').each(function() {
	       checkedQuestionList.push(this.value);
	    });
	     if( checkedQuestionList.length > 0 ){
	     	        swal({
                        title             : 'Are you sure,Do you want to Delete? You will not be able to recover selected questions again!',
                        // html              : userNames,
                        type              : 'warning',
                        showCancelButton  : true,
                        confirmButtonColor: '#dd6b55',
                        cancelButtonColor : '#999',
                        confirmButtonText : 'Yes!',
                        cancelButtonText  : 'No',
                        closeOnConfirm    : false
                    }, ()=> { 
                        Meteor.call('deleteSelectedQuestions', checkedQuestionList, (error,result)=>{
                          if(error){
                            swal(error.reason);
                          }else if(result){
                            
                          }else{
                            swal.closeModal();
                            this.CategoryAndSubCatQuestion();
                            $('.userCheckbox').prop('checked',false);
                          }
                        });
                        
                        }
                );
	     }
	  
	}
	checkAllQuestions(event){
		 if(event.target.checked){
	        $('.userCheckbox').prop('checked',true);
	      }else{
	        $('.userCheckbox').prop('checked',false);
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
			            <h1>Master Data</h1>
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
									<div className="col-lg-8  col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-12 col-xs-12">
										<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
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
										<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
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
									</div>
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
										            <th className="col-lg-1"> Correct Answer </th>
										            <th className="col-lg-1"> Action </th>
										            <th className="col-lg-1"> Bulk Delete  <input type="checkbox" className="allQSelector col-lg-6" name="allQSelector" onChange={this.checkAllQuestions.bind(this)}/> <i className="fa fa-trash deleteQuestionIcon col-lg-6"  onClick={this.bulkDelete.bind(this)} title="Delete Question"></i></th>
										            
										        </tr>
										    </thead>
										   	
									
										    {this.state.questionResult.length !=0 ?
										    	
											    <tbody className="myAllTabler">
											    	{this.state.questionResult.map((category, index)=>{
											    		return <tr key={index}>
											    			<td>{parseInt(Session.get('pageNumber')- 1) * (100) + (index + 1)}</td>
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
											    			<td>
											    				<input type="checkbox" ref="questionCheckbox" name="questionCheckbox" className="userCheckbox col-lg-12 col-md-12 col-sm-12 col-xs-12" value={category._id} />
											    			</td>
											  
											    		</tr>
											    	})}
											    </tbody>
								    		:
									    	<tbody className="OESDataNotAvailable">
									    		{!this.state.subCategory ?
									    			<tr> 
									    				<td colSpan="8">"{this.state.categoryName} Category Questions not added yet <a href="/AddQuestions">click here </a> to add "</td>
									    			</tr>
									    		:
									    			<tr> 
									    				<td colSpan="8">"{this.state.subCategory} Sub Category Questions not added yet <a to="/AddQuestions">click here </a> to add "</td>
									    			</tr>
									    		}
									    	</tbody>

								    		
									    }
										</table>
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 paginationWrap">
										 <ul className="pagination paginationOES">
											{this.paginationFunction()}
										 </ul>
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
			  	return(<div className="col-lg-8 col-lg-offset-4 col-md-8 col-md-offset-4 col-sm-8 col-sm-offset-4 waitingResLoadingWrap">
				   <img className="col-lg-12 col-md-12 col-sm-12  loaderImageSize" src="/images/loading1.gif" alt="loading"/>
				</div>);
			  }else{ 
			  return (<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
				   <h3>You dont have access. Please <a href="/admin/AssignPermissionstoModules/ShowAll">click here </a> to assign permission</h3>
				</div>);
			}
	}
}



// const questionData = withTracker( (props)=>{
// 	const handle = Meteor.subscribe("allQuestion");
// 	const loading = !handle.ready();
// 	const data = QuestionMaster.find({}).fetch();

// 	return{
// 		loading,
// 		data,
// 	}


// })(QuestionCategoryTab);


// export default questionData;




















// /*  
// 	COMPONENT:  Add CATEGORY 
// 	PROGRAMMER: VIKAS JAGDALE 
	
// 	This component show question accoriding to tab. 

// */

// import React, {Component} from 'react';
// import {render} from 'react-dom';
// import {Link} from 'react-router';
// import {browserHistory } from 'react-router';
// import {withTracker} from 'meteor/react-meteor-data';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
// import {QuestionMaster} from './api/questionMaster.js';
// import {Session} from 'meteor/session';
// import {CategoryMaster} from '/imports/admin/forms/addCategory/api/categoryMaster.js';
// export default  class QuestionCategoryTab extends TrackerReact(Component)  {

// 	componentDidMount(){
		
// 		if ( !$('body').hasClass('adminLte')) {
// 		  var adminLte = document.createElement("script");
// 		  adminLte.type="text/javascript";
// 		  adminLte.src = "/js/adminLte.js";
// 		  $("body").append(adminLte);
// 		}
// 	}
	
// 	componentWillUnmount(){
//     	$("script[src='/js/adminLte.js']").remove();
//     	$("link[href='/css/dashboard.css']").remove();
//   	}

//   	constructor(props){
// 		super(props);
// 		this.state={
// 			categoryName  : 'A',
// 			subCategory: 'A1',
// 			subscription:{
// 				categoryData : Meteor.subscribe("allCategory"),
// 			} 
// 		}
// 		this.handleChange = this.handleChange.bind(this);
// 	}

// 	handleChange(event){
// 		const target = event.target;
// 		const name   = target.name;
// 		this.setState({
// 			[name] : event.target.value,
// 		})
// 	}

// 	showCategories(){
// 		return CategoryMaster.find({}).fetch();	
// 	}

//   	getSubCategoryName(event){
// 		var categorySubName = $(event.target).val();
// 		this.setState({
// 			subCategory : categorySubName,
// 		});
		
// 	}

//   	SubCategoryName(event){
// 		var categoryName = this.state.categoryName;
// 		var	signleCategory = CategoryMaster.findOne({"categoryName":categoryName});
// 		if(signleCategory){
// 			var subCategoryarray = signleCategory.levels;
// 			var subCatarray =[];
// 			for(var i=0; i<subCategoryarray.length;i++){
// 				var subCat = categoryName+''+parseInt(i+1);
// 				var subCat = String(subCat);
// 				subCatarray.push(
// 					<option key={i}>{subCat}</option>
// 					);
// 			}
// 			return subCatarray;
// 		}else{
// 			return [];
// 		}
// 	}


// 	CategoryAndSubCatQuestion(){
// 		var isReady = Meteor.subscribe("allCatgWiseQuestion",this.state.categoryName,this.state.subCategory).ready();
// 		if(isReady){
// 			var questionMasterData = QuestionMaster.find({}).fetch();
// 			if(questionMasterData){
// 				return questionMasterData;
// 			}else{
// 				return 0;
// 			}
// 		}else{
// 			return [];
// 		}
		
	
// 	}
	
// 	/*
// 		Remove questions
// 	*/
// 	removeQuestion(event){
// 		var _id = $(event.target).attr('id');
// 		swal({
// 			  title: 'Are you sure?',
// 			  text: 'You will not be able to recover this Record!',
// 			  type: 'warning',
// 			  showCancelButton: true,
// 			  confirmButtonColor: '#dd6b55',
// 			  cancelButtonColor: '#d44',
// 			  confirmButtonText: 'Yes, Delete it!',
// 			  cancelButtonText: 'No, Keep it',
// 			  closeOnConfirm: false
// 			}, function() {
// 				Meteor.call("removeQuestion",_id,(error,result)=>{
// 					if(error){

// 					}else{
// 						swal(
// 					    'Question has been Deleted',
// 					    '',
// 					    'success'
// 					  );
// 				}
// 			});
  			
//   		});		
// 	}

// 	showhideSubCatDetails(event){
// 		$('.categoryListDataStud').toggleClass('categoryListDataStudshow');
// 	}


// 	render(){
// 		return(
// 			<div>
// 		        {/* Content Wrapper. Contains page content */}
// 		        <div className="content-wrapper">
// 		          {/* Content Header (Page header) */}
// 		          <section className="content-header">
// 		            <h1>Master Data</h1>
// 		          </section>
// 		          {/* Main content */}
// 		          <section className="content viewContent">
// 		            <div className="row">
// 		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
// 		                <div className="box">
// 		                  <div className="box-header with-border boxMinHeight quesCattabpage">
// 		                  	<div className="box-header with-border">
// 				            <h3 className="box-title">Category wise Questions</h3>
// 				            </div>
// 							<div className="col-lg-12  col-md-12 col-sm-12 col-xs-12 questionCatTab">
// 								<div className="col-lg-8  col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-12 col-xs-12">
// 									<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
// 										<span className="blocking-span"> 
// 											<select type="text" name="categoryName" ref="categoryName" value={this.state.categoryName} onClick={this.SubCategoryName.bind(this)} onChange={this.handleChange} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" autoComplete="off" title="Please select Category" required>
// 												<option disabled value="">-- Select Category --</option>
// 												{this.showCategories().map((categories,index)=>{
// 													return <option key={index}>{categories.categoryName}</option>
// 												  })
// 												}
// 											</select>
// 											<span className="floating-label floating-label-Date">Select Category</span>					   								   			
// 										</span>
// 									</div>
// 									<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
// 										<span className="helpSecSR" title="Help" onClick={this.showhideSubCatDetails.bind(this)} ><i className="fa fa-question-circle"></i></span>
// 										<div className="categoryListDataStud categoryListDataStudshoww">
// 											<label>A1/B1/C1/D1</label> : Below 7 year<br/>
// 											<label>A2/B2/C2/D2</label> : 7-9 year<br/>
// 											<label>A3/B3/C3/D3</label> : 9-11 year<br/>
// 											<label>A4/B4/C4/D4</label> : 11-14 year<br/>
// 										</div>
// 										<span className="blocking-span"> 
// 											<select type="text" name="subCategory" ref="subCategory" value={this.state.subCategory} onClick={this.getSubCategoryName.bind(this)}className="form-control subCatTab col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" onChange={this.handleChange} required>
// 												<option value="">-- Select Sub Category --</option>
// 												{this.SubCategoryName()}
// 											</select>
// 											<span className="floating-label floating-label-Date">Select Sub Category</span>					   			
// 										</span>
// 									</div>
// 								</div>
// 							    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 categoryTable">
// 				              		<table className="table table-striped formTable tab-Table">
// 									    <thead className="tableHeader">
// 									        <tr>
// 									            <th>Sr. No</th>
// 									            <th className="col-lg-4">Question </th>
// 									            <th className="col-lg-1"> A </th>
// 									            <th className="col-lg-1"> B </th>
// 									            <th className="col-lg-1"> C </th>
// 									            <th className="col-lg-1"> D </th>
// 									            <th className="col-lg-2"> Correct Answer </th>
// 									            <th className="col-lg-1"> Action </th>
									            
// 									        </tr>
// 									    </thead>
// 									   	{this.CategoryAndSubCatQuestion().length > 0 ?
// 									    this.CategoryAndSubCatQuestion() !=0 ?
// 										    <tbody className="myAllTable">
// 										    	{this.CategoryAndSubCatQuestion().map((category, index)=>{
// 										    		return <tr key={index}>
// 										    			<td></td>
// 										    			<td>{category.question}</td>
// 										    			<td>{category.A}</td>
// 										    			<td>{category.B}</td>
// 										    			<td>{category.C}</td>
// 										    			<td>{category.D}</td>
// 										    			<td>{category.correctAnswer}</td>
// 										    			<td>
// 										    				<a href={`/AddQuestions/${category._id}`}>
// 										    					<i className="fa fa-edit editIcon" title="Edit Question"></i>
// 										    				</a>	
// 										    				<i className="fa fa-trash deleteIcon" id={category._id} onClick={this.removeQuestion.bind(this)} title="Delete Question"></i>

// 										    			</td>
										  
// 										    		</tr>
// 										    	})}
// 										    </tbody>
// 									    : 
// 									    	<tbody className="OESDataNotAvailable">
// 									    	{!this.state.subCategory ?
// 								    			<tr> 
// 								    				<td colSpan="8">"{this.state.categoryName} Category Questions not added yet <a href="/AddQuestions">click here </a> to add "</td>
// 								    			</tr>
// 								    		:
// 								    			<tr> 
// 								    				<td colSpan="8">"{this.state.subCategory} Sub Category Questions not added yet <a to="/AddQuestions">click here </a> to add "</td>
// 								    			</tr>
// 								    	}
// 								    		</tbody>
// 								    	:
// 								    	<tbody className="OESDataNotAvailable">
// 								    		<tr> 
// 								    			<td colSpan="8">"Loading... Please wait"</td>
// 								    		</tr>
// 								    	</tbody>
// 							    		}
// 									</table>
// 								</div>
// 							    </div>
							  
// 							  </div>

// 							</div>
// 						</div>
// 					 </div>
// 				  </section>
// 				</div>
// 			</div>	
// 			);
// 	}
// }










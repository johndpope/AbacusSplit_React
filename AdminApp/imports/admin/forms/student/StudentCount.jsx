

import React, {Component} from 'react';
import {render} from 'react-dom';
import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {QuestionMaster} from '/imports/admin/forms/addQuestions/api/questionMaster.js';
import {Session} from 'meteor/session';
import {CategoryMaster} from '/imports/admin/forms/addCategory/api/categoryMaster.js';
import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';
const bound = Meteor.bindEnvironment((callback) => {callback();});


export default class StudentCount extends TrackerReact(Component)  {
	
	constructor(props){
		super(props);
		this.state={
			categoryName  : 'All',
			subCategory: 'All',
			subCatg:'',
			studentcnt:'',
			categoryData:'',
			subCatgData:'',
			facilityPermission : 'waitingforResult',  	
			subscription:{
				categoryData : Meteor.subscribe("allCategory"),
			} 
		}
		this.handleChange = this.handleChange.bind(this);
	}

	componentWillMount(){
  	}

	componentDidMount(){
		
		if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}

    	Meteor.call("getCategoryAndSubcategory", (err,res)=>{
			if(err){
				console.log(err.reason);
			}else{
				this.setState({
					categoryData:res,
				})
			}
		});

		Meteor.call("getAllCategoryWiseStudentCount",(err,res)=>{
			if(err){
				console.log(err.reason);
			}else{
				var studentCount1=res;
				this.setState({
					studentcnt : studentCount1,			
				});	
			}
		});
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
		},()=>{this.SubCategoryName()})

		if(name=="categoryName"){
			if(event.target.value=="All"){
				
				this.setState({
					subCategory : "All",			
				},()=>{this.getSubCategory()});	
			}
			else{
				this.setState({
					[name] : event.target.value,
				},()=>{this.getSubCategory()})
			}

		}

	}

	showCategories(){
		return CategoryMaster.find({}).fetch();	
	}

	getSubCategory(event){	
		var studentCount;		
	 	if(this.state.subCategory){
			Meteor.call("getCategoryWiseStudentCount", this.state.categoryName,this.state.subCategory,(err,res)=>{
				if(err){
					console.log(err.reason);
				}else{
					studentCount=res;
					this.setState({
						studentcnt : studentCount,			
					});	
				}
			});				
		}			
	}

  	getSubCategoryName(event){		
		var categorySubName = $(event.target).val();
		var studentCount;
		 bound(() => {
		 	if(categorySubName){
				Meteor.call("getCategoryWiseStudentCount", this.state.categoryName,categorySubName,(err,res)=>{
					if(err){
						console.log(err.reason);
					}else{
						studentCount=res;
						this.setState({
							studentcnt : studentCount,			
						});	
					}
				});
				this.setState({
					subCategory : categorySubName,			
				});	
			}
		});	
	}

  	SubCategoryName(event){
		var categoryName = this.state.categoryName;
		var subCatarray =[];
		if(this.state.categoryName=="All"){
			subCatarray.push(null);
			this.setState({
				subCatgData:subCatarray,
			})
		}else{
			Meteor.call("getSingleCategory",categoryName, (err,res)=>{
				if(err){
					console.log(err.reason);
				}else{
					if(res){
						var subCategoryarray = res.levels;
						for(var i=0; i<subCategoryarray.length;i++){
							var subCat = categoryName+''+parseInt(i+1);
							var subCat = String(subCat);

							subCatarray.push(subCat);
						}
						this.setState({
							subCatgData:subCatarray,
						}) 
					}
				}
			});
		}
	}



	showhideSubCatDetails(event){
		$('.categoryListDataStud').toggleClass('categoryListDataStudshow');
	}

	componentDidUpdate(){
		
	}

	render(){
		// if(this.state.facilityPermission != 'waitingforResult' && this.state.facilityPermission == true){
		// 	$('.sidebar').css({display:'block',background: '#222d32'});
			return(
				<div>
			        {/* Content Wrapper. Contains page content */}
			        <div className="content-wrapper">
			          {/* Content Header (Page header) */}
			          <section className="content-header">
			            <h1>Student Count</h1>
			          </section>
			          {/* Main content */}
			          <section className="content viewContent">
			            <div className="row">
			              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
			                <div className="box">
			                  <div className="box-header with-border boxMinHeight quesCattabpage">			                  	
								<div className="col-lg-12  col-md-12 col-sm-12 col-xs-12 questionCatTab">
									<div className="col-lg-8  col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-12 col-xs-12">
										<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
											<div className="selectLabel">Select Category</div>
											<span className="blocking-span"> 
												<select type="text" name="categoryName" ref="categoryName" value={this.state.categoryName}  onChange={this.handleChange} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" autoComplete="off" title="Please select Category" required>
													<option disabled value="">-- Select Category --</option>
													<option  value="All">All</option>
													{this.state.categoryData?
														this.state.categoryData.map((categories,index)=>{
														return <option key={index}>{categories.categoryName}</option>
													  })
														:null
													}
												</select>	   			
											</span>
										</div>
										<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
											<div className="selectLabel">Select Sub Category</div>
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
													<option  value="All">All</option>
													{this.state.subCatgData?
														this.state.subCatgData.map((subcategories,index1)=>{
														return <option key={index1}>{subcategories}</option>
													  })
														:null
													}
													
												</select>		   			
											</span>
										</div>
									</div>
								    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 categoryTable">
					              		<table className="table table-striped formTable tab-Table">										  								
									    	<tbody className="OESDataNotAvailable">									    		
									    			<tr> 
									    			{this.state.studentcnt?
									    				<td colSpan="8">Student Count - {this.state.studentcnt}</td>
									    				:
									    					this.state.studentcnt==0?
									    					<td colSpan="8">Student Count - 0</td>
									    					:
									    					<td colSpan="8">Please wait...</td>
									    			}
									    			</tr>									    		
									    	</tbody>
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
			// }else if (this.state.facilityPermission == false ){
			// 	  	return (<div>{FlowRouter.go('/noAccesss')}</div>);
			//   }else if(this.state.facilityPermission == "waitingforResult"){
			//   	return(<div className="col-lg-8 col-lg-offset-4 col-md-8 col-md-offset-4 col-sm-8 col-sm-offset-4 waitingResLoadingWrap">
			// 	   <img className="col-lg-12 col-md-12 col-sm-12  loaderImageSize" src="/images/loading1.gif" alt="loading"/>
			// 	</div>);
			//   }else{ 
			//   return (<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
			// 	   <h3>You dont have access. Please <a href="/admin/AssignPermissionstoModules/ShowAll">click here </a> to assign permission</h3>
			// 	</div>);
			// }
	}
}


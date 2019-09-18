/*  
	COMPONENT:  Add CATEGORY 
	PROGRAMMER: VIKAS JAGDALE 
	
	This component will add categories. 

*/

import React, {Component} from 'react';
import {render} from 'react-dom';
import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {CategoryMaster} from './api/categoryMaster.js';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';


class AddCategory extends TrackerReact(Component)  {

	constructor(props){
		super(props);
		this.state={
			'categoryName'   : '',
			'NoofQuestion'   : '',
			'categoryMarks'  : '',
			'_id'            : '',
			facilityPermission : 'waitingforResult',
		}
		this.handleChange = this.handleChange.bind(this);
	}

	componentWillMount(){
  		 Meteor.call("isAuthenticated","MasterData","AddCategory",(err,res)=>{
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
  	}

  	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}


	/*
		Add and update category into categoryMaster.

	*/

	addCategory(event){
		event.preventDefault();
		var categoryName = this.refs.categoryName.value.trim();
		var NoofQuestion = this.refs.NoofQuestion.value.trim();
		var categoryMarks = this.refs.categoryMarks.value.trim();
		var _id = this.refs._id.value;
		if(categoryMarks>0){
			var findCategory = CategoryMaster.findOne({"categoryName":categoryName});
			if(findCategory){
				if(_id){
					Meteor.call("addCategory",categoryName,NoofQuestion,categoryMarks,_id,(error,result)=>{
						if(error){
							console.log("somthing went wrong");
						}else{
							FlowRouter.go('/AddCategories');
							swal("Category Updated Successfully","","success");
							$('.addCategoryBtn').html("Add");
							this.setState({
								'categoryName'   : '',
								'NoofQuestion'   : '',
								'categoryMarks'  : '',
								'_id'            : '',
							});
							
						}
					});
				}else{
					this.refs.categoryName.value  = '';	
					this.refs.categoryMarks.value = '';
					this.refs.NoofQuestion.value = '';
					swal("Category Already Exist","","warning");
				}

			}else{
				Meteor.call("addCategory",categoryName,NoofQuestion,categoryMarks,_id,(error,result)=>{
					if(error){
						console.log("somthing went wrong");
					}else{
						swal('"' +categoryName+'"' +" Category Added Successfully","","success");
						FlowRouter.go('/AddCategories');
						this.setState({
							'categoryName'   : '',
							'NoofQuestion'   : '',
							'categoryMarks'  : '',
							'_id'            : '',

						});
					}
				});
			}
		}else{
			swal("Marks must be greater than zero","","warning");
		}
	}

	/*
	
		Show all categories into tabular format.

	*/
	
	getAllCategory(){
		var categorryHandle = Meteor.subscribe("allCategory").ready();	
			var allCategory = CategoryMaster.find({}).fetch();
			if(allCategory){
				return allCategory;
			}else{
				return 0;
			}
	}

	/*
		This methos call when props get change.	
	*/

	componentWillReceiveProps(nextProps){
		if(nextProps.categoryData){
			this.setState({
				'categoryName': nextProps.categoryData.categoryName,
				'NoofQuestion': nextProps.categoryData.NoofQuestion,
				'categoryMarks': nextProps.categoryData.categoryMarks,
				'_id'          : nextProps.categoryData._id,
			});
			this.handleChange = this.handleChange.bind(this);
		}
	}

	handleChange(event){
		const target = event.target;
		const name   = target.name;
		this.setState({
		  [name]: event.target.value,
		});
  	}

	/*
		Remove Selected category.	

	*/
  	removeCategory(event){
  		var _id = $(event.target).attr('id');
  		swal({
			  title             : 'Are you sure?',
			  text              : 'You will not be able to recover this Record!',
			  type              : 'warning',
			  showCancelButton  : true,
			  closeOnConfirm    : false,
			  confirmButtonColor: '#dd6b55',
			  cancelButtonColor : '#d44',
			  confirmButtonText : 'Yes, Delete it!',
			  cancelButtonText  : 'No, Keep it',
			  closeOnConfirm    : false
			}, function() {
				Meteor.call("removeCategory",_id,(error,result)=>{
					if(error){

					}else{
						swal(
					    'Category has been Deleted',
					    '',
					    'success'
					  );
					}
				});
  			
  		});
  		
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
			                  <div className="box-header with-border boxMinHeight">
			                   <div className="box-header with-border">
					            <h3 className="box-title">Add Categories</h3>
					            </div>
								<div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 onlineSXWrap">
									<form onSubmit={this.addCategory.bind(this)}>
										<div className="col-lg-4 col-md-4 col-sm-9 col-xs-9">
											<span className="blocking-span"> 
												<input type="text" name="categoryName" ref="categoryName" value={this.state.categoryName} onChange={this.handleChange} className={this.state.categoryName?"form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText has-content":"form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText"} pattern="^([a-zA-Z][a-zA-Z0-9-\s]*)$" title="Enter Category" required/>
												<span className="floating-label">Category Name</span>					   			
											</span>
											<input type="hidden" name="_id" ref="_id" value={this.state._id}/>
										</div>
										<div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
											<span className="blocking-span"> 
												<input type="number" min="1" step="1" name="NoofQuestion" ref="NoofQuestion" value={this.state.NoofQuestion} onChange={this.handleChange} className={this.state.NoofQuestion?"form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText has-content":"form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText"} title="Enter Number of Questions" required/>
												<span className="floating-label">Total Questions</span>					   			
											</span>
										</div>
										<div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
											<span className="blocking-span"> 
												<input type="number" name="categoryMarks" ref="categoryMarks" value={this.state.categoryMarks} onChange={this.handleChange} className={this.state.categoryMarks?"form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText  has-content":"form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText"} title="Enter Category Marks" required/>
												<span className="floating-label">Marks per Question</span>					   			
											</span>
										</div>
										<div className="col-lg-2 col-md-2 col-sm-3 col-xs-3">
											<button type="submit" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 btn btn-primary addCategoryBtn ACBtnOES">Add</button>
										</div>
									</form>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 categoryTable">
					              		<table className="table table-striped formTable tab-Table">
										    <thead className="tableHeader">
										        <tr>
										            <th className="col-lg-1">Sr.No</th>
										            <th className="col-lg-3">Category Name </th>
										            <th className="col-lg-3">Total Questions </th>
										            <th className="col-lg-3"> Marks per Question </th>
										            <th className="col-lg-3"> Action </th>
										            
										        </tr>
										    </thead>
										    {this.getAllCategory() != 0 ?
											    <tbody className="myAllTable">
											     	{this.getAllCategory().map((categories,index)=>{
											     	return <tr key={index}>
											     			<td></td>
											     			<td>{categories.categoryName}</td>
											     			<td>{categories.NoofQuestion}</td>
											     			<td>{categories.categoryMarks}</td>
											     			<td>
											     				<a href={`/AddCategories/${categories._id}`}>
											     				 	<i className="fa fa-edit editIcon" title="Edit Category"></i>
											     				</a>
											     				<i className="fa fa-trash deleteIcon" title="Delete Category" id={categories._id} onClick={this.removeCategory.bind(this)}></i>
											
											     			</td>
											     		</tr>
											     		})
											     }
											    </tbody>
										    :
										    	<tbody className="OESDataNotAvailable">
									    			<tr>
									    				<td colSpan="5">"Categories not yet added"</td>
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
				   <h3>You dont have access. Please <a href="/admin/AssignPermissionstoModules/ShowAll">click here </a> to assign permission</h3>
				</div>);
		}
	}
}

export default CategoryContainer = withTracker(props =>{
	// console.log('newstr --->',newStr);
	// var _id = props.params.id;
	var _id = FlowRouter.getParam("id");
	if(_id){
		$('.ACBtnOES').html('Update');
	}
	var categoryData = CategoryMaster.findOne({"_id":_id});
	return{
		categoryData,
	} 
})(AddCategory);
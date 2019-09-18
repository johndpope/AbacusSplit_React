/*  
	COMPONENT:  Add CATEGORY 
	PROGRAMMER: VIKAS JAGDALE 
	
	This component will show final question papers. 

*/

import React, {Component} from 'react';
import {render} from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';
import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';



class ListOfFranchise extends Component {
	
	constructor(props){
		super(props);
		this.state={
			franchiseName : '',
			allFranchiseData:[],
			facilityPermission : 'waitingforResult',
		}
		this.handleChange = this.handleChange.bind(this);
	}

	componentWillMount(){
  		 Meteor.call("isAuthenticated","MasterData","ListOfFranchises",(err,res)=>{
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
		this.showFranchise();
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

// Remove selected student
	removeFranchise(event){
		var _id = $(event.target).attr('id');
		// ()=>{this.showallFranchise()}
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
						Meteor.call("removeCompany",_id,(error,result)=>{
							if(error){

							}else{
								location.reload();
								swal(
							    'Franchise has been Deleted',
							    '',
							    'success'
							  );
							
						}
						()=>{this.showFranchise()}
					});
  			
  		});

	}
  	
	showFranchise(){
		if(this.state.franchiseName){
			Meteor.call("searchFranchiseAdminside",this.state.franchiseName,(err,res)=>{
				if(err){
					console.log(error);
				}else{
					this.setState({'allFranchiseData':res});
				}
			});
		}else{
			Meteor.call("allFranchiseDataAdmin",(err,res)=>{
				if(err){
					console.log(error);
				}else{
					this.setState({'allFranchiseData':res});
				}
			});
		}
	}

	// franchise search by franchise name

	buildRegExp(searchText) {
	   var words = searchText.trim().split(/[ \-\:]+/);
	   var exps = _.map(words, function(word) {
	      return "(?=.*" + word + ")";
	   });

	   var fullExp = exps.join('') + ".+";
	   return new RegExp(fullExp, "i");
	}

	getTextValue(event){
		var franchiseName= $('.SearchFranchise').val();
		if(franchiseName){
			var RegExpBuildValue = this.buildRegExp(franchiseName);
			this.setState({
				franchiseName   : RegExpBuildValue,
				paidStudent   : RegExpBuildValue,
				unPaidStudent : RegExpBuildValue,
			},()=>{this.showFranchise()});
		}else{
			this.setState({
				franchiseName   : '',
				paidStudent   : '',
				unPaidStudent : '',
			},()=>{this.showFranchise()});
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
		            <h1>Franchise List</h1>
		          </section>
		          {/* Main content */}
		          <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		                  <div className="box-header with-border boxMinHeight">
		                  	<div className="box-header with-border">
				            	{/*<h3 className="box-title">List of Franchise</h3>*/}
				            </div>
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div className="col-lg-12 col-md-12 searchTableBoxAlignSETT">
			                   		<span className="blocking-span">
				                   		<input type="text" name="search"  className="col-lg-4 col-sm-4 SearchExam SearchFranchise inputTextSearch" placeholder="Search Franchise Name" onInput={this.getTextValue.bind(this)} required/>
				               
			                   		</span>
			                    </div>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 examTable">
					              		<table className="table table-striped formTable" id="ExamListTable">
										    <thead className="tableHeader">
										        <tr>
										            <th className="tab-Table">Sr. No</th>
										            <th className="col-lg-4">Franchise Owner's Name </th>
										            <th className="col-lg-2">Franchise  Name </th>
										            <th className="col-lg-2 tab-Table"> Mobile Number </th>
										            <th className="col-lg-2 tab-Table"> Company Id </th>
										            <th className="col-lg-1 tab-Table"> Action </th>
										            
										        </tr>
										    </thead> 
										    {this.state.allFranchiseData.length !=0 ? 
										    	!this.state.allFranchiseData ?
									    		<tbody className="OESDataNotAvailable">
										    		<tr> 
									    				<td colSpan="5">" Franchise are loading... Please wait "</td>
									    			</tr>
								    			</tbody>
								    		:
										    <tbody className="myAllTable">										    	
											    	{this.state.allFranchiseData.map((allFranchise, index)=>{
											    		return <tr key={index}>
											    			<td className="tab-Table"></td>
											    			<td className="studnameWraptable"><a href={`/Admin/ListOfStudents/${allFranchise.franchiseCodeForCompanyId}`} title="Click to view franchise students">{allFranchise.firstName} {allFranchise.lastName}</a></td>
											    			<td className="tab-Table">{allFranchise.franchiseName}</td>	
											    			<td className="tab-Table">{allFranchise.contactNo}</td>
											    			<td className="tab-Table">{allFranchise.companyId}</td>
											    			<td className="tab-Table">
											    				<i className="fa fa-trash deleteIconn" title="Delete Student" id={allFranchise._id} onClick={this.removeFranchise.bind(this)} ></i>
					
											    			</td>
											    		</tr>
											    	})}
											    	
										    </tbody>
										    :
										    	<tbody className="OESDataNotAvailable">
									    			<tr>
									    				<td colSpan="6">" Franchise not yet Registered."</td>
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
			  	FlowRouter.go('/noAccesss')
		  }else if(this.state.facilityPermission == "waitingforResult"){
		  	return(<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
			   <img className=" loaderImageSize1" src="/images/loading1.gif" alt="loading"/>
			</div>);
		  }else{ 
		  return (<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
		  			<h3>You dont have access. Please <a href="/admin/AssignPermissionstoModules/Show%20All">click here </a>to assign permission</h3>
		  		 </div>
		  	);
		}
	}
}
export default ListOfFranchiseContainer = withTracker(props=>{
		var allCategoryWiseStudent = '';
		return {
			allCategoryWiseStudent,
		}

})(ListOfFranchise);
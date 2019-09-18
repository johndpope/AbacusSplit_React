import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {withTracker} from 'meteor/react-meteor-data';
import {FranchiseDetails} from '/imports/admin/companySetting/api/CompanySettingMaster.js';

export default class UMAdd_ContactCategory extends TrackerReact(Component) {
	componentDidMount(){
		
		if (!$("#adminLte").length>0 && !$('body').hasClass('adminLte')) {
	      // console.log("I am appended!");
	      var adminLte = document.createElement("script");
	      adminLte.type = "text/javascript";
	      adminLte.src = "/js/adminLte.js";
	      adminLte.setAttribute('id','adminLte');
	      $("body").append(adminLte);
	    }
	}
	editCategory(event){
	  event.preventDefault();
      var categoryId    = event.target.id;         
      var categoryName  = $("input[name="+categoryId+"-Namecategory]").val(); 

      Meteor.call('updatecategory',this.state.categoryName,categoryName,
                function(error, result) { 
                    if (error) {                       
                        swal("Oops....","Category Not Updated !!!",'error');
                    } 
                    else {
                    	swal("Category Updated Successfully!!!",'success');
                    }
                }
        );	
	}

	delCategory(event){
	  event.preventDefault();	  
	  Meteor.call('deleteCategory', event.currentTarget.id,
                function(error, result) { 
                    if (error) {
                        console.log ( error ); 
                    }  
                    
                });	
	}

	handlecategoryChange(event){
	    this.setState({value: event.target.value});
	}

	 handlecategorySubmit(event) {
	    event.preventDefault();
	}

	constructor(props) {
	  super(props);
	  this.state = {
	    categoryName: this.props.CategoryDataValues,
	  };

    this.handlecategoryChange = this.handlecategoryChange.bind(this);
    this.handlecategorySubmit = this.handlecategorySubmit.bind(this);
	}

	render(){
       return(
				<tr>
					<td className="rolelst rolelst1"> {this.props.CategoryDataValues}</td>			
					<td className="roletbl roletble1"> 
						{/*<button className="editrole fa fa-pencil-square-o editbtns editbtnshvr editbtns1"  data-toggle="modal" data-target={`#edit-${this.props.dataindex}`} ></button>
						<div id={`edit-${this.props.dataindex}`} className="modal fade" role="dialog">
						  <div className="modal-dialog">
						    <div className="modal-content reportWrapper">
						      <div className="modal-header">
						        <button type="button"  className="close" data-dismiss="modal">&times;</button>
						        <h4 className="modal-title">Edit Category</h4>
						      </div>
						      <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<form className="editroles">
										<div className="form-group col-lg-5 col-md-4 col-xs-12 col-sm-12 paddingLeftz">
											<label>Category Name*</label>
											<input type="text" ref="roleName" className="form-control rolesField" name={`${this.props.dataindex}-Namecategory`} defaultValue={`${this.state.categoryName}`} onChange={this.handlecategoryChange.bind(this)} required/>
										</div>
										<div className="form-group col-lg-1 col-md-4 col-xs-12 col-sm-12 ">
											<label>&nbsp;</label>
										    <button type="button" onClick={this.editCategory.bind(this)} id={this.props.dataindex} className="btn btn-primary submit" data-dismiss="modal">Edit Role</button>
										</div>
									</form>
						      </div>
						      <div className="modal-footer">
						        <button type="button" className="btn btn-primary" data-dismiss="modal">Close</button>
						      </div>
						    </div>

						  </div>
						</div>*/}
						&nbsp;&nbsp;
						
						<button className= "roleDelete fa fa-trash delIcon detailsCenter editbtns btn-danger editbtns1 editbtnred" data-toggle="modal" data-target={`#del-${this.props.dataindex}`}></button>

						 <div className="modal fade" id={`del-${this.props.dataindex}`} role="dialog">
						    <div className="modal-dialog modal-sm">
						      <div className="modal-content">
						        <div className="modal-header">
						          <button type="button" className="close" data-dismiss="modal">&times;</button>
						          <h4 className="modal-title">Delete Category</h4>
						        </div>
						        <div className="modal-body">
						          <p><b>The category will be deleted. Are you sure you want to continue?.</b></p>
						        </div>
						        <div className="modal-footer">
						          <button  onClick={this.delCategory.bind(this)} id={this.props.dataindex} data-categoryname={this.props.CategoryDataValues} type="button" data-dismiss="modal" className="btn btn-danger deleteRole" >Delete</button>
				    			  <button type="button" data-dismiss="modal" className="btn btn-primary ">Cancel</button>
						        </div>
						      </div>
						    </div>
						  </div>
					</td>		
				</tr>
	    );

	} 

}
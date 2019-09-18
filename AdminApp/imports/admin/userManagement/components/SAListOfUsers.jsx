import React, { Component } from 'react';
import { render }               from 'react-dom';
import TrackerReact             from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }           from 'meteor/ostrio:flow-router-extra';
import {withTracker} 	        from 'meteor/react-meteor-data';

import UMAddRolRow              from './UMAddRolRow.jsx';
import UMDelRolRow              from './UMDelRolRow.jsx';
import UMSelectRoleUsers        from './UMSelectRoleUsers.jsx';
import UMUsers                  from './UMUsers.jsx';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

export default class SAListOfUsers extends Component {
	
	constructor(props){
		super(props);
		this.state = {
			'roleSett': '',
			'firstname':'',
			'startRange': 0,
			'limitRange':20,
			'counter': 1,
			'admin_Stud_ShowAll':'Admin',
			'negativeCounter' : 2,
			subscription : {
				"rolesData" : Meteor.subscribe('rolefunction'),
				"usersData" : Meteor.subscribe('userfunction'),
			}
		}
	}

    'adminUserActions'(event) {
			event.preventDefault();

			var checkedUsersList     = [];
			$('input[name=userCheckbox]:checked').each(function() {
				checkedUsersList.push(this.value);
			});

			if( checkedUsersList.length > 0 ){
				var selectedValue        = this.refs.userListDropdown.value;
				var keywordSelectedValue = selectedValue.split('$')[0];
				var role                 = selectedValue.split('$')[1];

				switch(keywordSelectedValue){
				  case '-':
				    // console.log('selectedValue:' + selectedValue);
				    break;

				  case 'block_selected':
				    Meteor.call('blockSelectedUser', checkedUsersList);
				    break;

				  case 'active_selected':
				    Meteor.call('activeSelectedUser', checkedUsersList);
				    break;

				  case 'cancel_selected':

				    var users = Meteor.users.find({"_id":{ $in: checkedUsersList } }).fetch();

				    if(users){
				    	var userNames = '';
				    	for(var k=0;k<users.length;k++){
				    		userNames += users[k].profile.firstname +' '+ users[k].profile.lastname + '\n';
				    	}

							SweetAlert.swal({
						            title             : 'Are you sure,Do you want to Delete? You will not be able to recover below users again!',
						            html              : userNames,
						            type              : 'warning',
						            showCancelButton  : true,
						            confirmButtonColor: '#dd6b55',
						            cancelButtonColor : '#999',
						            confirmButtonText : 'Yes!',
						            cancelButtonText  : 'No',
						            closeOnConfirm    : false
						        }, ()=> { 
						        				Meteor.call('deleteSelectedUser', checkedUsersList, (error,result)=>{
						        					if(error){
						        						swal(error.reason);
						        					}else if(result){
						        						swal('Below users status is blocked now as they are having record in either orders/feedback/space.'+'\n'+ result);
						        					}else{
						        						swal.closeModal();
						        					}
						        				});
						        				
						        			  }
						    );

				    }

				    break;

				  case 'add':
				    Meteor.call('addRoleToUser', role, checkedUsersList);
				    break;

				  case 'remove':
				    Meteor.call('removeRoleFromUser', role, checkedUsersList);
				    break;

				}
			}else{
				this.refs.userListDropdown.value = '-';
				swal('Please select atleast one user.');
			}
			{this.usersListData()}


	}

	rolesListData(){
		var roleSetArray = [];
		var roles =  Meteor.roles.find({"name":{ $nin: ["superAdmin"] } }).fetch();
		if(roles){
			return roles;
		}else{
			return roleSetArray;
		}

	}

	adminRolesListData(){
		var roleSetArray = [];
		var roles =  Meteor.roles.find({"name":{ $in: ["Admin","Student"] } }).fetch();
		if(roles){
			return roles;
		}else{
			return roleSetArray;
		}
	}


	usersListData(){
	    var roleSetArray      = [];
	    var roleSetVar        = Session.get('roleSet');
	    var activeBlockSetVar = Session.get('activeBlockSet');
		console.log()
	      if(roleSetVar || activeBlockSetVar){

	      	if(!this.state.firstname){
	      		if((roleSetVar == "all" && !activeBlockSetVar)       || 
		           (roleSetVar == "all" && activeBlockSetVar == '-') || 
		           (!roleSetVar && activeBlockSetVar == '-')         ||
		           (roleSetVar == '-' && activeBlockSetVar == '-'))
		        {
		          return Meteor.users.find({"roles":{ $nin: ["superAdmin"] }},{sort:{'createdAt':-1}, skip:this.state.startRange, limit: this.state.limitRange});
		        }else if((roleSetVar == "all" && activeBlockSetVar) || 
		                 (roleSetVar == "-" && activeBlockSetVar)   || 
		                 (!roleSetVar && activeBlockSetVar))
		        {
		          return Meteor.users.find({"profile.status": activeBlockSetVar,"roles":{ $nin: ["superAdmin"] }},{sort:{'createdAt':-1}, skip:this.state.startRange, limit: this.state.limitRange});
		        }else if((roleSetVar && activeBlockSetVar == '-') || 
		                 (roleSetVar && !activeBlockSetVar))
		        {
		          return Meteor.users.find({"roles":{ $nin: ["superAdmin"], $in: [roleSetVar]}},{sort:{'createdAt':-1}, skip:this.state.startRange, limit: this.state.limitRange});
		        }else if(roleSetVar && activeBlockSetVar){
		          return Meteor.users.find({"profile.status": activeBlockSetVar,"roles":{ $nin: ["superAdmin"], $in: [roleSetVar]}},{sort:{'createdAt':-1}, skip:this.state.startRange, limit: this.state.limitRange});
		        }else{
		          return Meteor.users.find({"roles":{ $nin: ["superAdmin","Student"] } },{sort:{'createdAt':-1}},{sort:{'createdAt':-1}, skip:this.state.startRange, limit: this.state.limitRange});
		        }
	      	}else{ 
	      		// return Meteor.users.find({$or:[{"profile.franchiseName":this.state.firstname},{"profile.teacherName":this.state.firstname,},{"profile.firstname":this.state.firstname},{"profile.lastname":this.state.firstname},{"roles":{ $in: [Session.get('roleSet')] },"profile.fullname":this.state.firstname}]},{sort:{'createdAt':-1}});
	      		return Meteor.users.find({$or:[{"profile.franchiseName":this.state.firstname},{"profile.teacherName":this.state.firstname,},{"profile.firstname":this.state.firstname},{"profile.lastname":this.state.firstname},{"profile.emailId":this.state.firstname},{"roles":{ $in: ["Student","Admin","admin"] },"profile.fullName":this.state.firstname}]},{sort:{'createdAt':-1},skip:this.state.startRange, limit: this.state.limitRange});
	    	}
	           
	      }else{
	      	if(!this.state.firstname){
	        	return Meteor.users.find({"roles":{ $in: ["admin","Admin","Franchise"] } },{sort:{'createdAt':-1},skip:this.state.startRange, limit: this.state.limitRange});
	    	}else{
	    		return Meteor.users.find({$or:[{"profile.franchiseName":this.state.firstname},{"profile.teacherName":this.state.firstname},{"profile.fullName":this.state.firstname},{"profile.emailId":this.state.firstname}]},{sort:{'createdAt':-1},skip:this.state.startRange, limit: this.state.limitRange});
	    	}
	      }
	}

	paginationUMFunction(event){
		 var roleSetArray      = [];
	    var roleSetVar        = Session.get('roleSet');
	    var activeBlockSetVar = Session.get('activeBlockSet');
	    if((roleSetVar == "all" && !activeBlockSetVar)       || 
		           (roleSetVar == "all" && activeBlockSetVar == '-') || 
		           (!roleSetVar && activeBlockSetVar == '-')         ||
		           (roleSetVar == '-' && activeBlockSetVar == '-')){
			var questionMasterDataCount = Meteor.users.find({"roles":{$nin:["superAdmin"]}}).count();
		}else{

			var questionMasterDataCount = Meteor.users.find({"roles":{$in:[this.state.admin_Stud_ShowAll]}}).count();
		}
			var paginationNum = parseInt(questionMasterDataCount)/20;
			var pageCount = Math.ceil(paginationNum);

			Session.set("questionUMCount",pageCount);
			paginationArray = [];
			{/*paginationArray.push(
				{<li key={-1} className="page-item"><a className="page-link" onClick={this.previousPage.bind(this)}>Previous</a></li>}
			);*/}
			for (var i=1; i<=pageCount;i++){
				var countNum = 20 * i;
				paginationArray.push(
					<li key={i} className="page-item"><a className={"page-link pagination"+i} id={countNum} onClick={this.getQuestionStartEndNum.bind(this)}>{i}</a></li>
				);
			}
			// if(pageCount>=1){
				paginationArray.push(
					<li  key={-2} className="page-item"><a className="page-link liNext" onClick={this.nextPage.bind(this)}>next</a></li>
				);
			// }
				return paginationArray;
			
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
		// console.log("question Count-----> ",questionCount);
		// console.log("counter Count-----> ",this.state.counter);
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


	'roleFilter'(event) {
	    event.preventDefault(); 
	    var selectedValue = this.refs.roleListDropdown.value;
	    if(selectedValue){
	    	var RegExpBuildValue1 = this.buildRegExp(selectedValue);
	    	this.setState({
	    		roleSett: RegExpBuildValue1,
	    		admin_Stud_ShowAll : RegExpBuildValue1,
	    	});
	    	
	    }else{
	    	this.setState({
	    		roleSett : '',
	    	});
	    }
	    Session.set("roleSet", selectedValue);
	    this.usersListData();
	}

	'activeBlockRoles'(event) {
	    event.preventDefault();
	    var selectedValue = this.refs.blockActive.value;
	    Session.set("activeBlockSet", selectedValue);
	    this.usersListData();
	}

	componentDidMount(){
		if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);

		}
		{this.usersListData()}
  	}
  	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}
	
    checkAll(event) {
      // event.preventDefault();
      if(event.target.checked){
        $('.userCheckbox').prop('checked',true);
      }else{
        $('.userCheckbox').prop('checked',false);
      }
    }

  /*--------------- Search User --------------*/

    buildRegExp(searchText) {
	   var words = searchText.trim().split(/[ \-\:]+/);
	   var exps = _.map(words, function(word) {
	      return "(?=.*" + word + ")";
	   });

	   var fullExp = exps.join('') + ".+";
	   return new RegExp(fullExp, "i");
	}

	getTextValue(event){
		var studentName= $('.SearchFranchise').val();
		if(studentName){
			var RegExpBuildValue = this.buildRegExp(studentName);
			this.setState({
				firstname   : RegExpBuildValue,
				
			});
		}else{
			this.setState({
				firstname   : '',
				
			});
		}
	}

	componentDidUpdate(){
		$('.pagination'+this.state.counter).addClass("active");
		Session.set('pageUMNumber',this.state.counter);
		// if(Session.get("questionUMCount"))
	}

/*--------------- Search User --------------*/

	render(){
       return(
			<div>
		        {/* Content Wrapper. Contains page content */}
		        <div className="content-wrapper">
		          {/* Content Header (Page header) */}
		          <section className="content-header">
		            <h3 className="contentTitle">User Management</h3>
		          </section>
		          {/* Main content */}
		          <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		                 
		                  <div className="box-header with-border boxMinHeight">
				            <div className="box-header with-border">
				            	<h3 className="box-title">List of Users</h3>
				            </div>
					         <ReactHTMLTableToExcel
				                    id="test-table-xls-button"
				                    className="pull-right dwnldAsExcelAdmin fa fa-download download-table-xls-button btn report-list-downloadXLXS"
				                    table="listOfUsersDwnld"
				                    filename="listOfUsersDwnld"
				                    sheet="tablexls"
				                    buttonText=""/>
			           
			            <div className="box-body">
			            <div className="col-lg-12 userListdropDownList">
							<div className="form-group col-lg-4 col-md-4 col-sm-12 col-xs-12">
								
								<label className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 selectTitle noLRPad">Select Action</label>
								<select className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 userListDropdown actionSelect" ref="userListDropdown" name="userListDropdown" onChange={this.adminUserActions.bind(this)}>
									<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-limit='37' value="-" name="userListDDOption">-- Select --</option>	
									<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-limit='37' value="block_selected" name="userListDDOption">Block Selected</option>	
									<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-limit='37' value="active_selected" name="userListDDOption">Active Selected</option>
									<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-limit='37' value="cancel_selected" name="userListDDOption">Delete Selected Acccounts</option>	
									{ this.adminRolesListData().map( (rolesData)=>{
										return <UMAddRolRow key={rolesData._id} roleDataVales={rolesData}/>
									  }) 
									}	
									{ this.adminRolesListData().map( (rolesData)=>{
										return <UMDelRolRow key={rolesData._id} roleDataVales={rolesData}/>
									  }) 
									}
								</select>
							</div> 
							

							<div className="form-group col-lg-4 col-md-4 col-sm-12 col-xs-12">
								
								<label className="col-md-10 col-lg-10 col-lg-offset-1 col-sm-12 col-xs-12 selectTitle noLRPad">Select Role</label>
								<select className="col-md-10 col-lg-10 col-lg-offset-1 col-sm-12 col-xs-12 userListDropdown roleFilter noLRPad" ref="roleListDropdown" name="roleListDropdown" onChange={this.roleFilter.bind(this)}>
									<option value="-" name="roleListDDOption">-- Select --</option>
									{/* <option value="all" name="roleListDDOption">Show All</option>		 */}
									<option value="all" name="roleListDDOption">Franchise</option>		

									{/* { this.rolesListData().map( (rolesData)=>{
										return <UMSelectRoleUsers key={rolesData._id} roleDataVales={rolesData}/>
									  }) 
									}	 */}
								</select>
							</div>

							<div className="form-group col-lg-4 col-md-4 col-sm-12 col-xs-12">
								
								<label className="col-md-10 col-lg-10 col-lg-offset-1 col-sm-12 col-xs-12 selectTitle noLRPad">Select Block & Active Roles</label>
								<select className="col-md-10 col-lg-10 col-lg-offset-1 col-sm-12 col-xs-12 userListDropdown activeBlockRoles noLRPad" ref="blockActive" name="blockActive" onChange={this.activeBlockRoles.bind(this)}>
									<option value="-" name="roleListDDOption">-- Show All --</option>	
									<option value="Blocked" name="roleListDDOption">Blocked</option>	
									<option value="Active" name="roleListDDOption">Active </option>	
								</select>
							</div>
						</div>
						<div className="col-lg-12 col-md-12 searchTableBoxAlignSETUM">
	                   		<span className="blocking-span">
		                   		<input type="text" name="search"  className="col-lg-7 col-md-7 col-sm-7 SearchExam SearchFranchise inputTextSearch" onInput={this.getTextValue.bind(this)} required/>
		                   		<span className="floating-label">Search by Admin / Student name, Email Id, Franchise name or Teacher name</span>
	                   		</span>
	                    </div>
					  	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 table-responsive noLRPad">
							<table id="listOfUsersDwnld" className="UMTableSAU table table-bordered table-striped table-hover myTable dataTable no-footer formTable col-lg-10 col-md-10 col-sm-10 col-xs-12">
								<thead className="table-head umtblhdr tableHeader">
								<tr className="hrTableHeader info">
									<th className="col-lg-1 col-md-1 col-sm-3 col-xs-6">Sr. No</th>
									<th className="umHeader col-lg-2 col-md-2 col-sm-3 col-xs-6">
										<input type="checkbox" className="allSelector col-lg-1" name="allSelector" onChange={this.checkAll.bind(this)}/> 
									<span className="col-lg-11">Name</span>
									</th>
									<th className="umHeader col-lg-1 col-md-1 col-sm-6 col-xs-6"> 							    
										
										Username
									</th>
									<th className="umHeader col-lg-1 col-md-1 hidden-xs hidden-sm"> Status </th>
									<th className="umHeader col-lg-1 col-md-1 col-sm-1 col-xs-1"> Roles </th>

									<th className="umHeader col-lg-1 col-md-1 col-sm-1 col-xs-1"> Number of Submembers </th>

									<th className="umHeader col-lg-1 col-md-1 hidden-xs hidden-sm"> Member for </th>
									<th className="umHeader col-lg-1 col-md-1 hidden-xs hidden-sm"> Last Access </th>
									<th className="umHeader col-lg-1 col-md-1 col-sm-1 col-xs-3"> Action </th>
								</tr>
								</thead>
								<tbody className="noLRPad">
									{ this.usersListData().map( (usersData, index)=>{
										return <UMUsers key={usersData._id} usersDataValues={usersData} serialNum={index}/>
									  }) 
									}
								</tbody>
							</table>
						</div>
						<div className="col-lg-12 col-md-12 col-sm-12 paginationWrap">
							<ul className="pagination paginationOES">
								  
								  {this.paginationUMFunction()}
								 
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

	} 

}
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker}     from 'meteor/react-meteor-data';

import UMAddRolRow from './UMAddRolRow.jsx';
import UMDelRolRow from './UMDelRolRow.jsx';
import UMSelectRoleUsers from './UMSelectRoleUsers.jsx';
import UMUsers from './UMUsers.jsx';
import ListOfUsersStudent from './ListOfUsersStudent.jsx';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

export default class UMListOfUsers extends TrackerReact(Component) {
  
  constructor(props){
    super(props);
    this.state = {
      'roleSett': '',
      'firstname':'',
      'startRange': 0,
      'limitRange':200,
      'counter': 1,
      'dataRange':200,
      'admin_Stud_ShowAll':'Admin',
      'negativeCounter' : 2,
      'usersListData' : [],
      'paginationArray': [],
      'facilityPermission' : 'waitingforResult',    
      subscription : {
        "rolesData" : Meteor.subscribe('rolefunction'),
      }
    }
  }

  componentWillMount(){
       Meteor.call("isAuthenticated","UserManagement","ListOfUsers",(err,res)=>{
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

          var roleSetVar        = Session.get('roleSet');
            var activeBlockSetVar = Session.get('activeBlockSet');
            {this.paginationUMFunction()}
            Meteor.call("getUsersData",roleSetVar,activeBlockSetVar,this.state.startRange,this.state.limitRange,this.state.firstname,(err,res)=>{
              if(err){}else{
                this.setState({
                  usersListData : res,
                });
              }
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
    // var roleSetVar        = Session.get('roleSet');
   //    var activeBlockSetVar = Session.get('activeBlockSet');
   //    {this.paginationUMFunction()}
    // Meteor.call("getUsersData",roleSetVar,activeBlockSetVar,this.state.startRange,this.state.limitRange,this.state.firstname,(err,res)=>{
    //  if(err){}else{
    //    this.setState({
    //      usersListData : res,
    //    });
    //  }
    // });
    }
    componentWillUnmount(){
      $("script[src='/js/adminLte.js']").remove();
      $("link[href='/css/dashboard.css']").remove();
    }

    usersListData(){
      var roleSetVar        = Session.get('roleSet');
      var activeBlockSetVar = Session.get('activeBlockSet');
      Meteor.call("getUsersData",roleSetVar,activeBlockSetVar,this.state.startRange,this.state.limitRange,this.state.firstname,(err,res)=>{
        if(err){}else{
          this.setState({
            usersListData : res,
          });
        }
      });
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

            // var users = Meteor.users.find({"_id":{ $in: checkedUsersList } }).fetch();

            // if(users){
            //   var userNames = '';
            //   for(var k=0;k<users.length;k++){
            //     userNames += users[k].profile.firstname +' '+ users[k].profile.lastname + '\n';
            //   }

              swal({
                        title             : 'Are you sure,Do you want to Delete? You will not be able to recover selected users again!',
                        // html              : userNames,
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
                            {this.usersListData()}
                            swal('Below users status is blocked now as they are having record in either orders/feedback/space.'+'\n'+ result);
                          }else{
                            swal.closeModal();
                          }
                        });
                        
                        }
                );

            // }

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
    if(Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin'])) {
      var roles =  Meteor.roles.find({"name":{ $in: ["Admin","Student","Franchise","Staff"] } }).fetch();
      if(roles){
        return roles;
      }else{
        return roleSetArray;
      }
    }else if (Roles.userIsInRole(Meteor.userId(), ['Franchise'])){
      var roleSetArray = [];
      var roles =  Meteor.roles.find({"name":{ $in: ["Student","Staff"] } }).fetch();
      if(roles){
        // console.log("roles",roles);
        return roles;
      }else{
        return roleSetArray;
      }
    }

  }

  adminRolesListData(){
    if(Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin'])) {
      var roleSetArray = [];
      var roles =  Meteor.roles.find({"name":{ $in: ["Admin","Student","Franchise","Staff"] } }).fetch();
      if(roles){
        return roles;
      }else{
        return roleSetArray;
      }
    }else if (Roles.userIsInRole(Meteor.userId(), ['Franchise'])){
      var roleSetArray = [];
      var roles =  Meteor.roles.find({"name":{ $in: ["Student","Staff"] } }).fetch();
      if(roles){
        return roles;
      }else{
        return roleSetArray;
      }
    }

  }

  paginationUMFunction(){
    var roleSetArray      = [];
      var roleSetVar        = Session.get('roleSet');
      var activeBlockSetVar = Session.get('activeBlockSet');
      Meteor.call("getCountFunction",roleSetVar,activeBlockSetVar,(err,res)=>{
        if(err){}else{
          this.setState({
            questionMasterDataCount : res,
          });
          if(res){
            var paginationNum = parseInt(this.state.questionMasterDataCount)/this.state.dataRange;
          
            var pageCount = Math.ceil(paginationNum);

            Session.set("questionUMCount",pageCount);
            paginationArray = [];
            for (var i=1; i<=pageCount;i++){
              var countNum = this.state.dataRange * i;
              paginationArray.push(
                <li key={i} className="page-item"><a className={"page-link pagination"+i} id={countNum} onClick={this.getQuestionStartEndNum.bind(this)}>{i}</a></li>
              );
            }
            paginationArray.push(
              <li  key={-2} className="page-item"><a className="page-link liNext" onClick={this.nextPage.bind(this)}>next</a></li>
            );
            if(pageCount<=i){
              this.setState({
                paginationArray : paginationArray,
              })
            } 
          }
        }

      });
  }

  getQuestionStartEndNum(event){
    var limitRange = $(event.target).attr('id');
    limitRange     = parseInt(limitRange);
    var startRange = limitRange - this.state.dataRange;
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
    
    var questionCount = Session.get("questionUMCount");
    if(questionCount>=counter){
      Session.set('pageUMNumber',counter);
      $('.page-link').removeClass('active');
      $(".pagination"+counter).addClass("active");
      var limitRange = $('.active').attr('id');
      var startRange =  parseInt(limitRange)- this.state.dataRange;
      this.setState({
        counter    : counter,
        startRange : startRange,
      },()=>{this.usersListData()});
    }else if(questionCount==counter){
      $(".liNext").css("cursor","not-allowed");
      this.usersListData()
    }
  }


  'roleFilter'(event) {
      event.preventDefault(); 
      var selectedValue = this.refs.roleListDropdown.value;
      if(selectedValue){
        if(selectedValue == "Franchise"){
          this.setState({
            roleFranchise : 'true',
          });
        }else{
          this.setState({
            roleFranchise : 'false',
          });
        }

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
      this.paginationUMFunction();


  }

  'activeBlockRoles'(event) {
      event.preventDefault();
      var selectedValue = this.refs.blockActive.value;
      Session.set("activeBlockSet", selectedValue);
      this.usersListData();
  }
  
    checkAll(event) {
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
      {this.usersListData()}
    }else{
      this.setState({
        firstname   : '',
      });
      {this.usersListData()}
    }
  }

  componentDidUpdate(){
    $('.pagination'+this.state.counter).addClass("active");
    Session.set('pageUMNumber',this.state.counter);
    // if(Session.get("questionUMCount"))
  }

/*--------------- Search User --------------*/

  render(){
    if(this.state.facilityPermission != 'waitingforResult' && this.state.facilityPermission == true){
      $('.sidebar').css({display:'block',background: '#222d32'});      
         return(
        <div>
              {/* Content Wrapper. Contains page content */}
              <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <section className="content-header">
                  <h1>User Management</h1>
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
                              className="UMDownloadBtn pull-right dwnldAsExcelAdmin fa fa-download download-table-xls-button btn report-list-downloadXLXS"
                              table="listOfUsersDwnld"
                              filename="listOfUsersDwnld"
                              sheet="tablexls"
                              buttonText=""/>
                   
                    <div className="box-body">
                    <div className="col-lg-12 userListdropDownList">
                <div className="form-group col-lg-4 col-md-4 col-sm-12 col-xs-12">
                  
                  <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 selectTitle noLRPad">Select Action</label>
                  <select className="col-lg-12 col-md-12 col-sm-12 col-xs-12 userListDropdown actionSelect" ref="userListDropdown" name="userListDropdown" onChange={this.adminUserActions.bind(this)}>
                    <option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-limit='37' value="-" name="userListDDOption">-- Select --</option> 
                    <option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-limit='37' value="block_selected" name="userListDDOption">Block Selected</option>  
                    <option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-limit='37' value="active_selected" name="userListDDOption">Active Selected</option>
                    {<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-limit='37' value="cancel_selected" name="userListDDOption">Delete Selected Acccounts</option>  }
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
                  
                  <label className="col-md-12 col-lg-12 col-sm-12 col-xs-12 selectTitle noLRPad">Select Role</label>
                  <select className="col-md-12 col-lg-12 col-sm-12 col-xs-12 userListDropdown roleFilter noLRPad" ref="roleListDropdown" name="roleListDropdown" onChange={this.roleFilter.bind(this)}>
                    <option value="all" name="roleListDDOption">-- Select --</option>
                  
                    <option value="all" name="roleListDDOption">Show All</option>   
                   
                    { this.rolesListData().map( (rolesData)=>{
                      return <UMSelectRoleUsers key={rolesData._id} roleDataVales={rolesData}/>
                      }) 
                    }  
                  </select>
                </div>

                <div className="form-group col-lg-4 col-md-4 col-sm-12 col-xs-12">
                  
                  <label className="col-md-12 col-sm-12 col-xs-12 selectTitle noLRPad">Select Block & Active Roles</label>
                  <select className="col-md-12 col-lg-12 col-sm-12 col-xs-12 userListDropdown activeBlockRoles noLRPad" ref="blockActive" name="blockActive" onChange={this.activeBlockRoles.bind(this)}>
                    <option value="-" name="roleListDDOption">-- Show All --</option> 
                    <option value="Blocked" name="roleListDDOption">Blocked</option>  
                    <option value="Active" name="roleListDDOption">Active </option> 
                  </select>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 searchTableBoxAlignSETUM">
                          <span className="blocking-span">
                            <input type="text" name="search"  className="col-lg-7 col-md-7 col-sm-7 SearchExam SearchFranchise inputTextSearch" onInput={this.getTextValue.bind(this)} placeholder="Search by Admin,Franchise or Student name, Email Id,Mobile number" required/>
                          </span>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 table-responsive noLRPad">
                <table id="listOfUsersDwnld" className="UMTableSAU table table-bordered table-striped table-hover myTable dataTable no-footer formTable col-lg-10 col-md-10 col-sm-10 col-xs-12">
                  <thead className="table-head umtblhdr tableHeader">
                  <tr className="hrTableHeader info">
                    <th>Sr. No</th>
                    <th className="umHeader col-lg-3 col-md-3 col-sm-3 col-xs-6">
                      <input type="checkbox" className="allSelector col-lg-1" name="allSelector" onChange={this.checkAll.bind(this)}/> 
                    <span className="col-lg-11 col-md-11">Name</span>
                    </th>
                    <th className="umHeader col-lg-1 col-md-1 col-sm-6 col-xs-6">                   
                      
                      Username
                    </th>
                    <th className="umHeader col-lg-1 col-md-1 col-sm-1 col-xs-1"> Mobile Number </th>
                    <th className="umHeader col-lg-1 col-md-1 hidden-xs hidden-sm"> Status </th>
                    <th className="umHeader col-lg-1 col-md-1 col-sm-1 col-xs-1"> Roles </th>
                    {/*
                    {this.state.roleFranchise == 'true' ? 
                      <th className="umHeader col-lg-1 col-md-1 col-sm-1 col-xs-1 submembersnum"> Number of Submembers </th>
                      :
                      null
                    }
                  */}
                    <th className="umHeader col-lg-1 col-md-1 hidden-xs hidden-sm"> Member for </th>
                    <th className="umHeader col-lg-1 col-md-1 hidden-xs hidden-sm"> Last Access </th>
                    <th className="umHeader col-lg-3 col-md-3 col-sm-1 col-xs-3"> Action </th>
                  </tr>
                  </thead>
                  {this.state.usersListData && this.state.usersListData.length>0 ? 

                    <tbody className="noLRPad">
                      { this.state.usersListData.map( (usersData, index)=>{
                        return <UMUsers key={usersData._id} usersDataValues={usersData} serialNum={index} roleFranchise={this.state.roleFranchise} />
                        }) 
                      }
                    </tbody>
                  :
                    <tbody>
                      <tr>
                      {this.state.roleFranchise == 'true' ? 
                        <td colSpan="9" className="ntdiaplay">Nothing to display .</td>
                        :
                        <td colSpan="9" className="ntdiaplay">Nothing to display .</td>
                      }
                      </tr>
                    </tbody>
                  }
                </table>
              </div>
              {this.state.usersListData && this.state.usersListData.length>0 ? 
                <div className="col-lg-12 col-md-12 col-sm-12 paginationWrap">
                  <ul className="pagination paginationOES">
                      {this.state.paginationArray}
                  </ul>
                </div>
              :
                null
              }
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
          return(<div>{FlowRouter.go('/noAccesss')}</div>);
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
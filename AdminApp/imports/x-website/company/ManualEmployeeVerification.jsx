import React from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Link } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

export default class ManualEmployeeVerification extends TrackerReact(React.Component) {
  constructor(){
    super(); 
    this.state ={ 
      "employeeData" : [
        {
          "firstName": "",
          "lastName": "",
          "emailId": "",
          "mobile": "",
          "status": "",
        }
      ],
      "employeeDataOutput" : [
        
      ],
      "subscription" : {
      } 
    };
  }
  componentDidMount() {
    var data = this.state.employeeData;
    for(i=0;i<data.length;i++){
      $('firstName'+i).val(data[i].firstName);
      $('lastname'+i).val(data[i].lastName);
      $('emailId'+i).val(data[i].emailId);
      $('mobileNo'+i).val(data[i].mobile);
    }
  }
  addMore(event){
    event.preventDefault();
    var currentRows = this.state.employeeData;
    var obj = {
                "firstName": "",
                "lastName": "",
                "emailId": "",
                "mobile": "",
                "status": "",
              }
    currentRows.push(obj);
    this.setState({
      "employeeData":currentRows,
    });
  }
  checkExistingEmployee(event){
    event.preventDefault();
    var emailId = $(event.currentTarget).val();
    // console.log("emailId: ",emailId);
    var index = $(event.currentTarget).attr('data-index');
    var userData = Meteor.users.findOne({"username": emailId});
    // console.log("userData: ",userData);
    var data = this.state.employeeData;

    for(i=0;i<data.length;i++){
      if(i==index){
        if(userData){
          if(userData.profile){
            if(userData.profile.loginAs == 'user'){
              data[i].status = "View Profile"; 
            }else{
              swal({
                title: "This email address is already registered for Company.",
                timer: 3000,
                showConfirmButton: false,
                type: "error"
              });
            }
          }
        }else{
          data[i].status = "New"; 
        }
      }
    }

    this.setState({
      "employeeData":data,
    });       
  }
  addCompanyEmployee(event){
    event.preventDefault();
    // var formValues = {
    //   "firstName"       : this.refs.firstName.value,
    //   "lastName"        : this.refs.lastName.value,
    //   "mobile"          : this.refs.mobile.value,
    //   "emailId"         : this.refs.emailId.value,
    // }
    var data = this.state.employeeData;
    var currentRows = [];

    for(i=0;i<data.length;i++){
      if($('.empVerifCheckBox'+i).is(':checked')){
        // console.log('index',i);
        var obj = {
          "firstName": $('.firstName'+i).val(),
          "lastName": $('.lastname'+i).val(),
          "emailId": $('.emailId'+i).val(),
          "mobile": $('.mobileNo'+i).val(),
        }
        currentRows.push(obj);
      }
    }
    this.setState({
      "employeeDataOutput":currentRows,
    });
    // console.log('employeeDataOutput: ',this.state.employeeDataOutput);
  }
  render() {
    if(Meteor.userId())
    return (
      <div className="basicForm employeeVerifTable">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th className="text-center">First Name</th>
              <th className="text-center">Last Name</th>
              <th className="text-center">Email</th>
              <th className="text-center">Mobile</th>
              <th className="text-center">Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            { this.state.employeeData.map( (empData, index)=>{
              return (
                  <tr key={index+"employeeVerificationTable"}>
                    <td>
                      <input type="checkbox" className={"empVerifCheckBox"+index} checked={empData.status === 'New'}/>
                    </td>
                    <td>
                      <input className={"firstName"+index} type="text" name="firstName"/>
                    </td>
                    <td>
                      <input className={"lastname"+index} type="text" name="lastName"/>
                    </td>
                    <td>
                      <input className={"emailId"+index} type="email" name="emailId" data-emailId={empData.emailId} onBlur={this.checkExistingEmployee.bind(this)} data-index={index}  />
                    </td>
                    <td>
                      <input className={"mobileNo"+index} type="text" name="mobile" />
                    </td>
                    <td>{empData.status == 'New' ? <span>New</span> : empData.status == 'View Profile' ? <a href="#">View Profile</a> : ''}</td>
                    <td>
                      <i className="fa fa-plus" onClick={this.addMore.bind(this)}></i>              
                    </td>
                  </tr>
                );
              }) 
            }
          </tbody>
        </table>
        <button type="submit" className="btn btn-info pull-right" onClick={this.addCompanyEmployee.bind(this)}>Submit</button>
        {
          this.state.employeeDataOutput.length > 0 ?
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <h3 className="text-center">List of Employees</h3>
              <table className="table table-bordered empVerifListTable">
                <thead>
                  <tr>
                    <th className="text-center">First Name</th>
                    <th className="text-center">Last Name</th>
                    <th className="text-center">Email</th>
                    <th className="text-center">Mobile</th>
                  </tr>
                </thead>
                <tbody>
                  { this.state.employeeDataOutput.map((empDetails, index)=>{
                    return (
                        <tr key={index+"listEmployeeTable"}>
                          <td>
                            <span>{empDetails.firstName}</span>
                          </td>
                          <td>
                            <span>{empDetails.lastName}</span>
                          </td>
                          <td>
                            <span>{empDetails.emailId}</span>
                          </td>
                          <td>
                            <span>{empDetails.mobile}</span>
                          </td>
                        </tr>
                      );
                    }) 
                  }
                </tbody>
              </table>
            </div>
          :
          ""
        }
      </div> 
    );
  }
}
import React from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Link } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

export default class BulkEmployeeVerification extends TrackerReact(React.Component) {
  constructor(){
    super(); 
    this.state ={ 
      "userprofileData" : {},
      "subscription" : {
      } 
    }
  }
  componentDidMount() {
  }
  inputFileChange(event){
    event.preventDefault();
    // console.log('true',$(event.currentTarget));
    $(event.target).parent().siblings('.inputFiles').click();
  }
  render() {
    if(Meteor.userId())
    return (
      <div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeContent">
          <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 bulkEmployeeImg">
            <img src="../images/assureid/filecsv.png" />
          </div>
          <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12 bulkEmployeeVerif">
            <ul>
              <li>Please use attached file format to bulkupload your employee details into this system.</li>
              <li>Please do not change the Heading of following file.</li>
              <li>File format must be *.csv</li>
              <li>Following is the format of .csv file</li>
            </ul>
          </div>
        </div>
        {/*<table className="table table-bordered empVerifListTable">
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
        </table>*/}
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeFile">
          <input type="file" className="btn btn-info inputFiles"/>
          <p>Upload File : <span className="btn" onClick={this.inputFileChange.bind(this)}>Choose File</span></p>
        </div>
      </div> 
    );
  }
}
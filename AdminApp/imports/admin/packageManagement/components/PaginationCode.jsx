import React, { Component }  from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {withTracker} from 'meteor/react-meteor-data';
import ContactDetailsList from '/imports/admin/contactManagement/component/CMContactdetails/ContactDetailsList.jsx';
import { contacts } from '/imports/admin/contactManagement/api/Addnewcontact.js';
import ReactTable from "react-table";

class CMcontactdetails extends Component {
constructor(props){
super(props)
this.handleChange = this.handleChange.bind(this);

}


render() {
this.props.post;
var data1 = this.props.post;
var data2 = [];

for(i=0; i<data1.length; i++){
data2[i] = {
"_id" : data1[i]._id,
"firstName" : data1[i].firstName,
"permanantAddress" : data1[i].permanantAddress,
"mobNumber" : data1[i].mobNumber,
"personalEmail" : data1[i].personalEmail,


};     
}
// console.log(data2);

var headers = [
{Header: "First Name", accessor: 'firstName' },
{Header: "Permanant Address", accessor: 'permanantAddress'},
{Header: "Mobile Number", accessor: 'mobNumber' },
{Header: "Personal Email", accessor: 'personalEmail' },
{Header: "Action", },
];



       return (
      
    <div className="content-wrapper">
          {/* Content Header (Page header) */}
        <section className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdetailshead content-header">
            <h1 className="col-lg-4 col-md-4 col-xs-12 col-sm-12">CONTACT DETAILS</h1>
{/* <button type="button" className="col-lg-4 col-md-4 col-xs-12 col-sm-12 btn btn-info btnswitch">Switch to Listview</button>*/}
        </section>
{/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 table-responsive noLRPad">
<table id="listOfUsersDwnld" className="table table-bordered table-striped table-hover myTable dataTable no-footer formTable col-lg-10 col-md-10 col-sm-10 col-xs-12">
<thead className="table-head umtblhdr tableHeader">
<tr className="hrTableHeader info ">


<th className="umHeader srpadd"> Name</th>
<th className="umHeader srpadd"> Address </th>
<th className="umHeader srpadd">Mobile Number</th>
<th className="umHeader srpadd">Email Id</th>
<th className="umHeader srpadd">Address</th>


</tr>
</thead>
<tbody className="addRoleTbody">
{ this.contactListData().map( (contactData)=>{
console.log("contactData----->",contactData);
return <ContactDetailsList key={contactData._id} contactDataVales={contactData}/>
  })
}
</tbody>
</table>
</div>*/}

<div className="col-lg-12 col-md-12  col-sm-12 col-xs-12 addRolWrap addcountrylist" id="contactlistview">
<ReactTable data={data2} columns={headers} filterable={true} />
</div>
</div>


    );

}

}


export default ContactList = withTracker((props)=>{


  const postHandle = Meteor.subscribe('contacts');
    const post       = contacts.find({}).fetch({})||[];
    // console.log(post);
    const loading    = !postHandle.ready();
   
   
    return {
   

    loading,
    post,

    };
})(CMcontactdetails);
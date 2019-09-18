import React, { Component } from 'react';
import TimeAgo from 'react-timeago';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import {QuestionPaperMaster} from '/imports/admin/forms/setQuestionPaper/api/questionPaperMaster.js';
import {PackageManagementMaster} from '../api/packageManagementMaster.js';
import ReactTable from "react-table";
class UMPackage extends TrackerReact(Component) {
 	constructor(props){
		super(props);
	}
   //  'deletePackageConfirm'(event){
	  //   event.preventDefault();
	  //   var uid = event.target.id;
	  //   // console.log("uid",uid);
			// swal({
			// 	  title              : 'Are you sure?',
			// 	  text               : 'You will not be able to recover this Record!',
			// 	  type               : 'warning',
			// 	  showCancelButton   : true,
			// 	  confirmButtonColor : '#dd6b55',
			// 	  cancelButtonColor  : '#d44',
			// 	  confirmButtonText  : 'Yes, Delete it!',
			// 	  cancelButtonText   : 'No, Keep it',
			// 	  closeOnConfirm     : false
			// 	}, function() {
			// 		Meteor.call("removePackage",uid,(error,result)=>{
			// 			if(error){

			// 			}else{
			// 				swal(
			// 			    'Deleted Successfully',
			// 			    '',
			// 			    'success'
			// 			  );
			// 				// this.props.usersDataValues;
			// 		}
			// 	});
	  // 		});
  	// }
	render(){
		// var packageData1=[];
		// packageData1=this.props.usersDataValues;
		// 		var data2 = [];

		// 		for(i=0; i<packageData1.length; i++){
		// 		data2[i] = {
		// 		"_id" : packageData1[i]._id,
		// 		"serialNumber" : i+1,
		// 		"packageName" : packageData1[i].packageName,
		// 		"categoryName" : packageData1[i].categoryName,
		// 		"subCategory" : packageData1[i].subCategory,
		// 		"NoOfPracticeTest" : packageData1[i].NoOfPracticeTest,
		// 		"AttemptOfPracticeTest" : packageData1[i].AttemptOfPracticeTest,
		// 		"PackagePrice" : packageData1[i].PackagePrice,
		// 		"ActionToPerform":<div className="col-lg-1 col-md-2 col-sm-1 col-xs-1 tab-Table textaligncenter"> 
		// 							<a href={`/Edit/Admin/UMListOfPackages/${packageData1[i]._id}`}><i className="fa fa-edit editIcon"></i> </a> 
		// 							<i className="fa fa-trash deleteIcon" onClick={this.deletePackageConfirm.bind(this)} id={packageData1[i]._id}/>
		// 						</div>


		// 		};     
		// 		}
		// 		// console.log(data2);

		// 		var headers = [
		// 		{Header: "Sr. No.", accessor: 'serialNumber' },
		// 		{Header: "Package Name", accessor: 'packageName' },
		// 		{Header: "Category", accessor: 'categoryName'},
		// 		{Header: "Sub Category", accessor: 'subCategory' },
		// 		{Header: "No. of Practice Test", accessor: 'NoOfPracticeTest' },
		// 		{Header: "No. of Attempt", accessor: 'AttemptOfPracticeTest' },
		// 		{Header: "Price (Rs)", accessor: 'PackagePrice' },
		// 		{Header: "Action", accessor: 'ActionToPerform'},
		// 		];
       return(			
				<div>
					{/*<div className="col-lg-12 col-md-12  col-sm-12 col-xs-12 addRolWrap addcountrylist questWrapReactTable" id="contactlistview">
						<ReactTable data={data2} columns={headers} filterable={false} />
					</div>*/}
				</div>
			);
		} 
	}

export default MasterDataDisplay  = withTracker(props => {
  	const postPracticePaperHandle = Meteor.subscribe('quesPaperPracticeExam');
    const postPracticePaper       = QuestionPaperMaster.find({"examType":"Practice Exam"},{sort: {createdAt: -1}}).fetch();
    const loadingPracticePaper    = !postPracticePaperHandle.ready();
    const postHandle              = Meteor.subscribe('packageManagementData');
    const loading                 = !postHandle.ready();
    const post                    = PackageManagementMaster.find({},{sort: {createdAt: -1}}).fetch();
 
	    return {
	        loadingPracticePaper,
          	postPracticePaper,
          	loading,
          	post,
	    };   	
})(UMPackage);


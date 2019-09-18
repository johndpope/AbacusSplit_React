import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import InputMask from 'react-input-mask';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {CategoryMaster} from '/imports/admin/forms/addCategory/api/categoryMaster.js';
import {PackageManagementMaster} from '../api/packageManagementMaster.js';
import {QuestionPaperMaster} from '/imports/admin/forms/setQuestionPaper/api/questionPaperMaster.js';
var idArray=[]; 

class CreatePackage extends TrackerReact(Component) {
	constructor(props){
		super(props);
		this.state={
			packageName                  : '',
			categoryName                 : '',
			subCategory                  : '',
			// NoOfPracticeTest          : '',
			AttemptOfPracticeTest        : '',
			PackagePrice                 : '',
			// GST                       : '',
			Description                  : '',
			practicePaperList            : '',
			checklist                    : '',
			practicePaperID              : '',              
			packageStatus                : '',              
			PracticePaper			     : [],
			practicePaperdata    	     : [],
			practicePaperIDArray  	     : [],
			practicePaper        	     : [],
			practicePaperSelect    	     : [],
			SelectedpracticePaperIDArray : '',
			checkedAll				     : false,
			facilityPermission : 'waitingforResult',  	
		}
		this.handleChange      = this.handleChange.bind(this);
		this.selectSource      = this.selectSource.bind(this);
		this.selectAllSource   = this.selectAllSource.bind(this);
        this.addPracticePapers = this.addPracticePapers.bind(this);
	}

	componentWillMount(){
  		 Meteor.call("isAuthenticated","PackageManagement","CreatePackage",(err,res)=>{
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

	componentWillReceiveProps(nextProps) {
		// if(nextProps.postPracticePaper){
		// 	var newArr = [];
		// 	for(var i=0;i<nextProps.postPracticePaper.length; i++){
		// 		newArr.push({
	 //  				"PracticePaperDataId":nextProps.postPracticePaper[i]._id,
	 //  				"checked":false,
	 //  				"PracticePaperData":nextProps.postPracticePaper[i],
		//   		});
		// 	}
		// 	this.setState({
		// 		practicePaper : newArr,
		// 	})
		// }
    	var PPInfo=[];
    	var array={
    		"practicePaperInfo"  : nextProps.postPracticePaper,
            "checklist"  : false,
    	}
    	PPInfo.push(array);
    	this.setState({
			practicePaperSelect : PPInfo,
		})

        this.setState(state =>({        	
            "practicePaperdata"  : nextProps.postPracticePaper,
            "checklist"  : false,
        }));
        
    }


	componentDidMount() {
		if ( !$('body').hasClass('adminLte')) {
			var adminLte = document.createElement("script");
			adminLte.type="text/javascript";
			adminLte.src = "/js/adminLte.js";
			$("body").append(adminLte);
		}
		 $(".accessInputField").attr("disabled", true);
 	}
 	
 	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
	      Meteor.call('removeEmptyPackage',(error,result) => {
            if(error){
            
            }else{ 
            } //end else
        });
  	}

	createPackage(event){
		event.preventDefault();
		// this.handleChange();
        var formValues = {
		    'packageName'          : this.refs.packageName.value,
            'categoryName'         : this.refs.categoryName.value,
            'subCategory'          : this.refs.subCategory.value,
            'AttemptOfPracticeTest': this.refs.AttemptOfPracticeTest.value,
            'PackagePrice'         : this.refs.PackagePrice.value,
            'Description'          : this.refs.Description.value,
            'practicePaperID'      :'',
            'packageStatus'        :'NotCreated',
        } 

        if(!FlowRouter.getParam("id")){ 
        if(formValues.packageName.length>0){                
	        Meteor.call('createPackage', formValues ,FlowRouter.getParam("id"),(error,result) => {
	          if(error){
	            swal("Package not created.");
	          }else{      
	          	var id = result;
	          	 FlowRouter.go('/Admin/CreatePackages/'+id);
	          	 $(".accessInputField").removeAttr("disabled");
	          } 
	        });
	    }else{
	    	swal("Please fill the package name first.");
	    }
    	return 0; 
    }else{
    	null
    }



	}
	showCategories(){
		var categorryHandle = Meteor.subscribe("allCategory").ready();
		return CategoryMaster.find({}).fetch();	
	}
	SubCategoryName(){
		var categoryName = this.state.categoryName;
		var	signleCategory = CategoryMaster.findOne({"categoryName":categoryName});
		if(signleCategory){
			var subCategoryarray = signleCategory.levels;
			var subCatarray =[];
			for(var i=0; i<subCategoryarray.length;i++){
				var subCat = categoryName+''+parseInt(i+1);
				var subCat = String(subCat);
				subCatarray.push(
					<option key={i}>{subCat}</option>
					);
			}
			return subCatarray;
		}else{
			return [];
		}
	}
	showhideSubCatDetails(event){
		$('.categoryListDataStud').toggleClass('categoryListDataStudshow');
	}
	handleChange(event){
		event.preventDefault();
		const target = event.target;
		const name   = target.name;
		var category='';
		var subCategoryName='';
		var CategoryWisePPData='';
		this.setState({
		  [name]: event.target.value,
		});
		if(name=="categoryName"){
			
		   category= event.target.value;
		}
		if(name=="subCategory"){
			 subCategoryName=event.target.value;			 
		}
		
		CategoryWisePPData=QuestionPaperMaster.find({"examType":"Practice Exam","subCategory":subCategoryName,"paperStatus":"Not Assign","isDraft" : ""}).fetch();
		if(CategoryWisePPData){
			var newArr = [];
			for(var i=0;i<CategoryWisePPData.length; i++){
				newArr.push({
	  				"PracticePaperDataId":CategoryWisePPData[i]._id,
	  				"checked":false,
	  				"PracticePaperData":CategoryWisePPData[i],
		  		});
			}
			this.setState({
				practicePaper : newArr,
			})
		}
		
  	}
  	showPracticePapers(){
		var practicepaperHandle = Meteor.subscribe("quesPaperPracticeExam").ready();
		return QuestionPaperMaster.find({"examType":"Practice Exam"}).fetch();	
	}
	selectSource(event){
		event.preventDefault();
		var targetID=this.props.post._id;
    	var currentText = $(event.currentTarget).attr('data-irsrc');
    	var currentIndex=$(event.currentTarget).attr('data-index');
	  	var repeat = !!(idArray.indexOf(currentText)+1);
	  	if(repeat === false){
	  		idArray.push(currentText);
	  	}else{
	  		var index = idArray.indexOf(currentText);
	  		idArray.splice(index, 1);
	  	}
    	var PPracticeInfo=[];
    	var array={
    		"practicePaperInfo"  : this.props.postPracticePaper,
            "checklist"  : true,
    	}
    	PPracticeInfo.push(array);
    	this.setState({
			practicePaperSelect : PPracticeInfo,
		})
		var data = this.state.practicePaper;
		var newArr = [];
		for(var i=0; i<data.length; i++){
			if(currentIndex == i){
				var obj = {
					PracticePaperDataId : data[i].PracticePaperDataId,
					checked             : !data[i].checked,
					PracticePaperData   :data[i].PracticePaperData,
				}
				newArr.push(obj);
			}else{
				newArr.push(data[i]);
			}
		}
		
		this.setState({
			practicePaper : newArr,
			checkedAll:'',
		})
		
	}
	selectAllSource(event){
		event.preventDefault();
		var changingVal = this.state.checkedAll;
		var data = this.state.practicePaper;
		var newArr = [];
		var IDArray=[];

		for(var i=0; i<data.length; i++){
			var obj = {
				PracticePaperDataId  : data[i].PracticePaperDataId,
				PracticePaperData    : data[i].PracticePaperData,
				checked              : !changingVal,
			}
			newArr.push(obj);
			var objct={
				paperID:data[i].PracticePaperDataId,
			}
			this.setState({
			practicePaper : newArr,
			checkedAll    : !changingVal,
		})
			IDArray.push(objct);
			// idArray.push(data[i].PracticePaperDataId);
			if(!this.state.checkedAll){
			var repeat = !!(idArray.indexOf(data[i].PracticePaperDataId)+1);
		  	if(repeat === false){
		  		idArray.push(data[i].PracticePaperDataId);
		  	}
			  	}else{
			  		idArray=[];
			  	}
		  	// else{
		  	// 	var index = idArray.indexOf(data[i].PracticePaperDataId);
		  	// 	idArray.splice(index, 1);
		  	// }

		}
		
		this.setState({
				practicePaperIDArray : IDArray,
		})

		// console.log("select all ==>",this.state.practicePaperIDArray);

	}
	addPracticePapersList(){
		var listArray=[];

		var selectedlistdata=this.state.practicePaper;
		for(x=0;x<selectedlistdata.length;x++){
			var object={
				PracticePaperDataId:selectedlistdata[x].PracticePaperDataId,
				checked:selectedlistdata[x].checked,
			}
			listArray.push(object);
		}
		this.setState({
			practicePaperList : listArray,
		})
		if(this.state.practicePaperIDArray.length>0){
			swal("Selected Practice papers : "+idArray.length);
			var paperIDArray1=[];
			for(k=0;k<idArray.length;k++){
				var object={
					paperID : idArray[k],
				} 
				paperIDArray1.push(object);

			}
			this.setState({
				practicePaperIDArray : paperIDArray1,
			})

		}else{
			var paperIDArray=[];
			for(k=0;k<idArray.length;k++){
				var object={
					paperID : idArray[k],
				} 
				paperIDArray.push(object);

			}
			this.setState({
				practicePaperIDArray : paperIDArray,
			})
			
			swal("Practice papers selected : "+idArray.length);
		}
		if(idArray.length>0){
			this.setState({
				SelectedpracticePaperIDArray : idArray.length,
			})
		}
	}
	addPracticePapers(event){
		event.preventDefault();
		var ID=this.props.post._id;
		// console.log("addPracticePapers ==>",this.state.practicePaperIDArray);
		
        var formValues = {
			'packageName'          : this.refs.packageName.value,
		    'practicePaperID'      :this.state.practicePaperIDArray,
            'categoryName'         : this.refs.categoryName.value,
            'subCategory'          : this.refs.subCategory.value,
            'NoOfPracticeTest'     : this.state.practicePaperIDArray.length,
            'AttemptOfPracticeTest': this.refs.AttemptOfPracticeTest.value,
            'PackagePrice'         : this.refs.PackagePrice.value.trim(),
          // // 'GST'                  : this.refs.GST.value,
            'Description'          : this.refs.Description.value,
            'packageStatus'               : 'Created',
        }   

        if(formValues.AttemptOfPracticeTest>0 && formValues.PackagePrice>0 && formValues.NoOfPracticeTest>0){ 

	        Meteor.call('createPackage', formValues ,ID,(error,result) => {
	            if(error){
	            // swal(error.reason);
	            swal("Package not created.");
	            }else{ 

		          	swal("Package created successfully.");
		         Meteor.call('removeEmptyPackage',(error,result) => {
	            if(error){
	            
	            }else{ 
	            } //end else
	        });
		          	idArray=[];
		          	FlowRouter.go('/Admin/UMListOfPackages');
		          	this.refs.packageName.value           ='';
		            this.refs.categoryName.value          = '';
		            this.refs.subCategory.value           = '';
		            // this.state.NoOfPracticeTest      = '';
		            this.refs.AttemptOfPracticeTest.value = '';
		            this.refs.PackagePrice.value          = '';
		            // this.refs.GST.value                = '';
		            this.refs.Description.value           = '';
		            this.setState({
		            	practicePaperIDArray : [],
		            	subCategory:'',
		            	categoryName:'',
		            });
	            } //end else
	        });
	    }else{
	    	swal({
				title: "Please check one of the points before submit", 
				html: "1.No of attempt for practice test should be greater than zero </br> 2.Package price should not be zero </br> 3.Atleast 1 practice paper should be selected",
			});
	    	// swal("Please check one of the points before submit",
	    	// 	"1.No of attempt for practice test should be greater than zero 2.Package price should not be zero 3.Atleast 1 practice paper should be selected");
	    		
	    		
	    	FlowRouter.go('/Admin/CreatePackages');
	    }
    	return 0; 
	}

	existInPackageOrNot(questionPaperId){
		
		var isReady = Meteor.subscribe("checkExistInPackage",questionPaperId).ready();
		if(isReady){
			var packageManagementData = PackageManagementMaster.findOne({"practicePaperID.paperID":questionPaperId});
			
			if(packageManagementData){
				var packageName = "Used In Package Name : "+packageManagementData.packageName;
				return packageName;
			}else{
				return '';
			}
		}
	}

	render(){
		if(this.state.facilityPermission != 'waitingforResult' && this.state.facilityPermission == true){
			$('.sidebar').css({display:'block',background: '#222d32'});
        return (
       		<div>
		        <div className="content-wrapper">
		            <section className="content-header">
		                <h1> Package Management</h1>
		            </section>
		            <section className="content viewContent">
		                <div className="row">
		                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                		<div className="box">
		                  			<div className="box-header with-border boxMinHeight">
					                  	<div className="box-header with-border textboxborder">
							            	<h3 className="box-title">Add Package</h3>
							            </div>
										       	<section className="NotificationContent">
											            <div className="box-body">
															<div className="col-lg-10 col-lg-offset-1 col-sm-12 col-xs-12 col-md-10 col-md-offset-1 bordercolor createUserWrapp">
															  <form id="signUpUser">
																  <div className="signuppp col-lg-12 col-md-12 col-sm-12 col-xs-12">
																	  <span className="col-lg-6 col-md-6 col-xs-6 col-sm-6">Package Name <label className="requiredsign">*</label></span>
																	  <span className="col-lg-6 col-md-6 col-xs-6 col-sm-6">Select Category <label className="requiredsign">*</label></span>
																	   <div className=" col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent">

																	   		<span className="blocking-span">
																			   	<input type="text" title="Only alphabets are allowed!"  onBlur={this.createPackage.bind(this)} className="form-control textboxborder UMname inputText tmsUserAccForm"  ref="packageName" name="packageName"  required />
																	   			
																			</span>
																    	</div>
																	    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
																			<span className="blocking-span"> 
																				<select type="text" name="categoryName" ref="categoryName" value={this.state.categoryName} onClick={this.SubCategoryName.bind(this)} onChange={this.handleChange} className="form-control  textboxborder col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" autoComplete="off" title="Select Category" required>
																					<option disabled value="">-- Select Category --</option>
																					{this.showCategories().map((categories,index)=>{
																						return <option key={index}>{categories.categoryName}</option>
																					  })
																					}
																				</select>
																				{/*<span className="floating-label floating-label-Date">Select Category</span>	*/}				   								   			
																			</span>
																		</div>
																	<span className="col-lg-6 col-md-6 col-xs-6 col-sm-6">Select Sub Category</span>	
																	<span className="col-lg-6 col-md-6 col-xs-6 col-sm-6">Attempt for each Test<label className="requiredsign">*</label></span>	
																	<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
																		<span className="helpSecSR" title="Help" onClick={this.showhideSubCatDetails.bind(this)}><i className="fa fa-question-circle"></i></span>
																		<div className="categoryListDataStud categoryListDataStudshoww">
																			<label>A1/B1/C1/D1</label> : Below 7 year<br/>
																			<label>A2/B2/C2/D2</label> : 7-9 year<br/>
																			<label>A3/B3/C3/D3</label> : 9-11 year<br/>
																			<label>A4/B4/C4/D4</label> : 11-14 year<br/>
																		</div>
																		<span className="blocking-span"> 
																			<select type="text" name="subCategory" ref="subCategory" value={this.state.subCategory} className="form-control accessInputField textboxborder col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" onChange={this.handleChange} title="Select Sub-Category" required>
																				<option value="">-- Select Sub Category --</option>
																				{this.SubCategoryName()}
																			</select>
																							   			
																		</span>
																	</div>
																	
																    <div className=" col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent">
																   		<span className="blocking-span">
																		   	<input type="number" min="0" title="Only numbers are allowed!" className="form-control accessInputField textboxborder UMname inputText tmsUserAccForm" ref="AttemptOfPracticeTest" name="AttemptOfPracticeTest"  required />
{/*																   			<span className="floating-label">Attempt for each Test<label className="requiredsign">*</label></span>
*/}																		</span>
																    </div>
																    <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12">Package Price (<i className="fa fa-inr" aria-hidden="true">)<label className="requiredsign">*</label></i></span>
																    <div className=" col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent">
																   		<span className="blocking-span">
																		   	<input type="text" title="Only numbers are allowed!" className="form-control accessInputField textboxborder UMname inputText tmsUserAccForm" ref="PackagePrice" name="PackagePrice"  required />
																		</span>
																    </div>
																    {/*<div className=" col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent">
																   		<span className="blocking-span">
																		   	<input type="text" title="Only numbers are allowed!" className="form-control UMname inputText tmsUserAccForm" ref="GST" name="GST"  required />
																   			<span className="floating-label">GST(%)</span>
																		</span>
																    </div>*/}
																    
																    <div className=" col-lg-6 col-md-6 col-xs-6 col-sm-6  inputContent">
																	<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 paddingleftzero">
																		<span className="blocking-span"> 
																			<button type="button" className="btn btn-primary practicepaperselectbtn btn-lg col-lg-12 accessInputField" data-toggle="modal" data-target="#PracticePaperModal">Select Practice Test Papers</button>
																			{/*<select type="text" data-toggle="modal" data-target="#PracticePaperModal" name="categoryName" ref="categoryName" value={this.state.categoryName} onClick={this.SubCategoryName.bind(this)} onChange={this.handleChange} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" autoComplete="off" title="Select Category" required>
																				<option disabled value="">-- Select Practice Test Papers--</option>
																				
																			</select>*/}
																			<div id="PracticePaperModal" className="modal fade" role="dialog">
																			  <div className="modal-dialog package-ModalDialog">
																			    <div className="modal-content">
																			      <div className="modal-header">
																			        <button type="button" className="close" data-dismiss="modal">&times;</button>
																			        <h4 className="modal-title">Select Practice Test Papers</h4>
																			      </div>
																			      <div className="modal-body">
																			        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 examTable tablescrollPP">
																	              		<table className="table table-striped formTable " id="ExamListTable">
																						    <thead className="tableHeader">
																						        <tr>
																						        	<th className="col-lg-1 tab-Table">Sr. No</th>
																						            <th className="col-lg-1 tab-Table"><div className="col-lg-1 checkedList" data-checkedAll={this.state.checkedAll} onClick={this.selectAllSource.bind(this)}><i className={this.state.checkedAll? "fa fa-square-o showercolor2" : "fa fa-square-o showercolor3"} aria-hidden="true"></i></div>&nbsp;Select All</th>
																						            <th className="col-lg-3 centertextalign">Exam Title </th>
																						            <th className="col-lg-3 centertextalign">No. of Questions </th>
																						            <th className="col-lg-3 centertextalign">Exam Time (Min) </th>
																						            {/*<th className="col-lg-1 tab-Table"> Category </th>*/}
																						        </tr>
																						    </thead>
																						    {/*{this.showFinalexamPaper().length >0 ? */}
																							    <tbody>
																							    	{this.state.practicePaper.length>0?
																							    		this.state.practicePaper.map((PapersData,index)=>{
																										return  <tr key={index}>
																										
																													<td className="tab-Table">{index +1} </td>
																									    			<td className="checkcenter"><div className="checkedList" data-irsrc={PapersData.PracticePaperDataId} data-irsrcbol={PapersData.checked} data-index={index} onClick={this.selectSource.bind(this)}  data-tag={PapersData.PracticePaperDataId}><i className={PapersData.checked ? "fa fa-square-o showercolor2" : "fa fa-square-o showercolor3"} aria-hidden="true"></i></div></td>
																									    			<td className="tab-Table">{PapersData.PracticePaperData ? PapersData.PracticePaperData.quePaperTitle : null}
																									    				<div className="existInPackage">{this.existInPackageOrNot(PapersData.PracticePaperDataId)}</div>
																									    			</td>
																									    			<td className="tab-Table">{PapersData.PracticePaperData ? PapersData.PracticePaperData.noOfQuestion : null}</td>
																									    			<td className="tab-Table">{PapersData.PracticePaperData ? PapersData.PracticePaperData.examTime : null}</td>

																												</tr>
																									  })
																							    		:
																							    		<tr className="PracticepaperDataNotAvailable text-center">

																						    				<td colSpan="5 ">" Practice Papers not yet Added."</td>
																						    			</tr>
																									}
																									
																								</tbody>																								    
																						</table>
																					</div>
																			      </div>
																			      <div className="modal-footer">
																			        <button type="button" className="btn btn-default addpaperbtn" data-dismiss="modal" onClick={this.addPracticePapersList.bind(this)}>Add Practice Papers</button>
																			      </div>
																			    </div>
																			  </div>
																			</div>				   								   			
																		</span>
																	</div>

																	<div className=" col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent paddingrightzero">

																		<label className=" col-lg-12 zeropackagepadding selectedpaperqty">Number of Practice Test Papers : {idArray.length}</label>
																   		<span className="blocking-span col-lg-12"></span>
																    </div>
																    </div>
																    <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12">Description</span>
																    <div className=" col-lg-12 col-md-6 col-xs-6 col-sm-6 inputContent">
																   		<span className="blocking-span">
																		   	<textarea rows="4" cols="50" className="form-control textboxborder accessInputField UMname inputText2 tmsUserAccForm" ref="Description" name="Description" ></textarea>
																   			
																		</span>
																    </div>
																	<div className=" col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
																    	<input className="col-lg-3 col-md-4 col-xs-12 col-sm-12 col-xs-12 btn btn-primary pull-right nextForm" type="submit" onClick={this.addPracticePapers.bind(this)} value="Submit"/>
																   </div>
																</div> 
															</form>
													 	</div>	
													</div>
											    </section>
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
			   <img className="loaderImageSize1" src="/images/loading1.gif" alt="loading"/>
			</div>);
		  }else{ 
		  return (<h1></h1>);
		}
		} 
	}
export default MasterPracticePaperDataDisplay = withTracker(props => {
  	const postPracticePaperHandle = Meteor.subscribe('quesPaperPracticeExam');
    const postPracticePaper       = QuestionPaperMaster.find({"examType":"Practice Exam"},{sort: {createdAt: -1}}).fetch();
    const loadingPracticePaper    = !postPracticePaperHandle.ready();
    const postHandle              = Meteor.subscribe('packageManagementData');
    const post                    = PackageManagementMaster.findOne({},{sort: {createdAt: -1}});
    const loading                 = !postHandle.ready();
	    return {
	        loadingPracticePaper,
          	postPracticePaper,
          	post,
          	loading,
	    };   	
})(CreatePackage);

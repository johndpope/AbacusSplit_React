import React, { Component } from 'react';
import {withTracker} from 'meteor/react-meteor-data';
import { render } from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import InputMask from 'react-input-mask';
import {PackageManagementMaster} from '../api/packageManagementMaster.js';
import {CategoryMaster} from '/imports/admin/forms/addCategory/api/categoryMaster.js';
import {QuestionPaperMaster} from '/imports/admin/forms/setQuestionPaper/api/questionPaperMaster.js';
var idArray=[]; 
var IdObj=[];
class UMEditPackage extends TrackerReact(Component){
	constructor(props) {
	  super(props);
	  var packageId       = FlowRouter.getParam("id");
	  if(this.props.post){
		    this.state = {
			    packageName             : this.props.post.packageName,
				categoryName            : this.props.post.categoryName,
				subCategory             : this.props.post.subCategory,
				// NoOfPracticeTest        : this.props.post.NoOfPracticeTest,
				AttemptOfPracticeTest   : this.props.post.AttemptOfPracticeTest,
				PackagePrice            : this.props.post.PackagePrice,
				// GST                  : this.props.post.GST,
				Description             : this.props.post.Description,
				practicePaperList       : '',
				checklist               : '',
				selectSubCat               : '',
				packageStatus           : 'Created',
				PracticePaper			: [],
				practicePaperdata    	: [],
				practicePaperIDArray  	: [],
				practicePaper        	: [],
				practicePaperSelect    	: [],
				PracticePaperForUpdate  : [],
				checkedAll				: false,
				status				    : false,
				SelectedpracticePaperCount:'',
		    };
	  }else{
		    this.state = {
		        packageName             : '',
				categoryName            : '',
				subCategory             : '',
				NoOfPracticeTest        : '',
				AttemptOfPracticeTest   : '',
				PackagePrice            : '',
				// GST                     : '',
				Description             : '',
				practicePaperList       : '',
				checklist               : '',
				PracticePaper			:[],
				practicePaperdata    	:[],
				packageStatus           :'',
				
				practicePaperSelect    	:[],
				checkedAll				: false,
		  };	  	
	  }
	    this.handleChange = this.handleChange.bind(this);
	    this.handleSubmit = this.handleSubmit.bind(this);
	}
    componentWillReceiveProps(nextProps){
    	if(!nextProps.loading){	
	    	if(nextProps.post){	
	    		idArray=[]; 
	    		var selectedidArray=[]; 
	    	 IdObj=[];
	    		var cnt=nextProps.post.practicePaperID;
				var packageID        = nextProps.post._id;
		    	var selectedlist     = PackageManagementMaster.findOne({"_id":packageID});
		    	var selectedlistPPId = selectedlist.practicePaperID;

		    	for(i=0;i<selectedlistPPId.length;i++){
		    		idArray.push(selectedlistPPId[i].paperID);
		    	}
		    	var selectedidArray=idArray;

		    	for(x=0;x<selectedidArray.length;x++){
		    		IdObj.push({
		    			'paperID':selectedidArray[x],
		    		})
		    	}
		    	
		    	this.setState({
	                packageName          : nextProps.post.packageName,
	                SelectedpracticePaperCount : cnt.length,
	                categoryName         : nextProps.post.categoryName,
	                subCategory          : nextProps.post.subCategory,
	                // NoOfPracticeTest     : nextProps.post.NoOfPracticeTest,
	                AttemptOfPracticeTest: nextProps.post.AttemptOfPracticeTest,
	                PackagePrice         : nextProps.post.PackagePrice,
	                // GST               : nextProps.post.GST,
	                Description          : nextProps.post.Description,
	                practicePaperIDArray : IdObj,
	                PracticePaperForUpdate:nextProps.CategorywisepostPracticePaper,
	            })
	        }
        
        if(nextProps.CategorywisepostPracticePaper){
			var newArr = [];
			var listIDArray = [];
			
			for(var i=0;i<nextProps.CategorywisepostPracticePaper.length; i++){
				
				newArr.push({
	  				"PracticePaperDataId":nextProps.CategorywisepostPracticePaper[i]._id,
	  				"checked":false,
	  				"PracticePaperData":nextProps.CategorywisepostPracticePaper[i],
		  		});
			}
			this.setState({
				practicePaper : newArr,
			})
		}
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
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
}

	handleSubmit(event) {
	    event.preventDefault();
	    var packageId            = FlowRouter.getParam("id");
	    var practicePaperID=this.state.practicePaperList;
	    var formValues = {
            'packageName'          : this.refs.packageName.value,
            'categoryName'         : this.refs.categoryName.value,
            'subCategory'          : this.refs.subCategory.value,
            'NoOfPracticeTest'     : this.state.practicePaperIDArray.length,
            'AttemptOfPracticeTest': this.refs.AttemptOfPracticeTest.value,
            'PackagePrice'         : parseFloat(this.refs.PackagePrice.value),
            // 'GST'                  : this.refs.GST.value,
            'Description'          : this.refs.Description.value,
            'practicePaperID'      : this.state.practicePaperIDArray,
            'packageStatus'        :'Created',
	    }

	    if(formValues){
	    	if(formValues.AttemptOfPracticeTest>0 && formValues.PackagePrice>0  && formValues.NoOfPracticeTest>0){
			    Meteor.call('createPackage',formValues, packageId, function(error,result){
			    	if(error){
			    		
			    	}else{
			    		Session.set('inputbox', 1);
			    		swal('Package updated successfully.');
			    		idArray=[];
			    		FlowRouter.go('/Admin/UMListOfPackages');
			    	}
			    });
			}else{
				swal("No of attempt for practice test should be greater than zero or Package price should not be zero or atleast 1 practice paper should be selected.");
			}
		}else{
			swal("Please fill all fields.");
		}
	    return false;	    	
	}

	handleChange(event){
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
		   idArray=[];
		}
		if(name=="subCategory"){
			 subCategoryName=event.target.value;	
			 this.setState({
				selectSubCat : subCategoryName,
			},()=>{this.getPracticePaperData()});
		}
	}

	getPracticePaperData(){
		CategoryWisePPData=QuestionPaperMaster.find({"examType":"Practice Exam","subCategory":this.state.selectSubCat,"paperStatus":"Not Assign","isDraft" : ""}).fetch();
		// console.log("CategoryWisePPData",CategoryWisePPData);
		this.setState({
				PracticePaperForUpdate : CategoryWisePPData,
			})
	}

	
	componentDidMount(){
		Session.set('inputbox', 1);
		$('.uneditable').prop('disabled', true);
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
	selectedPPlistdata(event){
			event.preventDefault();
	    	for(i=0;i<idArray.length;i++){
		    	var isGreen = $('.'+idArray[i]).hasClass('fa fa-square-o showercolor2');
		    	
		    	if(isGreen){
		    		$('.'+idArray[i]).addClass('fa fa-square-o showercolor3');
		    	}else{
		    		$('.'+idArray[i]).removeClass('fa fa-square-o showercolor3');
		    		$('.'+idArray[i]).addClass('fa fa-square-o showercolor2');
		    	}
	    	}
	    }
    selectSource(event){
		event.preventDefault();
    	var currentText = $(event.currentTarget).attr('data-irsrc');
    	var currentIndex=$(event.currentTarget).attr('data-index');
    	var IdArrays=[];
    	var isGreen = $('.'+currentText).hasClass('fa fa-square-o showercolor2');
    	if(isGreen){
    		$('.'+currentText).addClass('fa fa-square-o showercolor3');
    	}else{
    		$('.'+currentText).removeClass('fa fa-square-o showercolor3');
    		$('.'+currentText).addClass('fa fa-square-o showercolor2');
    	}

    	var repeat = !!(idArray.indexOf(currentText)+1);
	  	if(repeat === false){
	  		idArray.push(currentText);
	  	}else{
	  		var index = idArray.indexOf(currentText);
	  		idArray.splice(index, 1);
	  	}
		for(k=0;k<idArray.length;k++){
			var obj={
  				paperID:idArray[k],
  			}
  		IdArrays.push(obj);
		}
		this.setState({
			practicePaperIDArray : IdArrays,
		})
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
		
		var selectalldata=[];
		selectalldata=this.state.PracticePaperForUpdate;
		
		if(selectalldata){
			var newArr = [];
			
			for(var i=0;i<selectalldata.length; i++){
				
				newArr.push({
	  				"PracticePaperDataId":selectalldata[i]._id,
	  				"checked":false,
	  				"PracticePaperData":selectalldata[i],
		  		});
			}
			
		}
		
		var changingVal = this.state.checkedAll;
		var data = newArr;
		var IDArray=[];
		var newArr = [];
		var unchecked = this.state.status;
		this.setState({
			status : !unchecked,
		})
		for(var i=0; i<data.length; i++){
			var obj = {
				PracticePaperDataId  : data[i].PracticePaperDataId,
				checked             : !changingVal,
				PracticePaperData   :data[i].PracticePaperData,
			}
			newArr.push(obj);
			var objct={
				paperID:data[i].PracticePaperDataId,
			}
			IDArray.push(objct);
		}
		this.setState({
			practicePaper : newArr,
			checkedAll : !changingVal,
		})
		this.setState({
			practicePaperIDArray : IDArray,
		})
		
		var PPCollection=this.state.PracticePaperForUpdate;
		var PPIds=[];
		for(j=0;j<PPCollection.length;j++){
			PPIds.push(PPCollection[j]._id);
		}
		for(z=0;z<PPIds.length;z++){
    		$('.'+PPIds[z]).addClass('fa fa-square-o showercolor2');
		}
		idArray=PPIds;
		if(this.state.checkedAll){
			for(i=0;i<idArray.length;i++){
				$('.'+idArray[i]).removeClass('fa fa-square-o showercolor2');
	    		$('.'+idArray[i]).addClass('fa fa-square-o showercolor3');
		    }
	    	this.setState({
			practicePaperIDArray :[],
			})
			idArray=[];
		}else{
			for(i=0;i<idArray.length;i++){
				$('.'+idArray[i]).removeClass('fa fa-square-o showercolor3');
	    		$('.'+idArray[i]).addClass('fa fa-square-o showercolor2');
		    }
		}
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
			swal("Selected Practice papers :"+idArray.length);
		}else{
			var paperIDArray=[];
			for(k=0;k<idArray.length;k++){
				var obj={
					paperID : idArray[k],
				} 
				paperIDArray.push(obj);
			}
			
			this.setState({
				practicePaperIDArray : paperIDArray,
			})
			swal("Practice papers selected :"+idArray.length);
		}
		this.setState({
			SelectedpracticePaperCount : idArray.length,
		})

		for(i=0;i<idArray.length;i++){
	    	var isGreen = $('.'+idArray[i]).hasClass('fa fa-square-o showercolor3');
	    	
	    	if(isGreen){
	    		$('.'+idArray[i]).addClass('fa fa-square-o showercolor2');
	    	}else{
	    		$('.'+idArray[i]).removeClass('fa fa-square-o showercolor2');
	    		$('.'+idArray[i]).addClass('fa fa-square-o showercolor3');
	    	}
    	}
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


	render() {
		

			var URL = Meteor.absoluteUrl();
		    if(!this.props.loading){	
			   	if(this.props.post){       
				   	if(this.props.post.packageName){       
					   	return (
							<div>
					        <div className="content-wrapper">
						        <section className="content-header">
						            <h3 className="contentTitle">Package Management</h3>
						        </section>
					            <section className="content viewContent">
					            	<div className="row">
					              		<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
					                		<div className="box">
					                  			<div className="box-header with-border boxMinHeight">
										            <div className="box-header with-border textboxborder">
										            <h4 className="reportTitle">Edit Package </h4>
										            </div>
														<div className="box-body">
															<div className="col-lg-10 col-lg-offset-1 col-sm-12 col-xs-12 col-md-10 col-md-offset-1 bordercolor EditPackageProfileWrap createUserWrapp formwrap">
																<div className="col-lg-12  col-sm-10 col-xs-10 col-md-10">
																	{/*<div className=" col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent">
																   		<span className="blocking-span">
																		   	<input type="text" title="Only alphabets are allowed!" value={this.state.packageName} onChange={this.handleChange} className={this.state.packageName?"form-control textboxborder UMname inputText tmsUserAccForm has-content":"form-control textboxborder UMname inputText tmsUserAccForm"} ref="packageName" name="packageName"  required />
																   			<span className="floating-label ">Package Name<label className="requiredsign">*</label></span>
																   			 <span className="col-lg-6 col-md-6 col-xs-6 col-sm-6">Select Category <label className="requiredsign">*</label></span>
																		</span>
																    </div>
																    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
																		<span className="blocking-span"> 
																			<select type="text" name="categoryName" ref="categoryName" value={this.state.categoryName} onClick={this.SubCategoryName.bind(this)} onChange={this.handleChange} className="form-control textboxborder col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" autoComplete="off" title="Select Category" required>
																				<option disabled value="">-- Select Category --</option>
																				{this.showCategories().map((categories,index)=>{
																					return <option key={index}>{categories.categoryName}</option>
																				  })
																				}
																			</select>
																			<span className="floating-label floating-label-Date">Select Category</span>					   								   			
																		</span>
																	</div>*/}
																	   	<span className="col-lg-6 col-md-6 col-xs-6 col-sm-6">Package Name <label className="requiredsign">*</label></span>
																	  	<span className="col-lg-6 col-md-6 col-xs-6 col-sm-6">Select Category <label className="requiredsign">*</label></span>
																		   	<div className=" col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent">

																		   		<span className="blocking-span">
																		   			<input type="text" title="Only alphabets are allowed!" value={this.state.packageName} onChange={this.handleChange} className={this.state.packageName?"form-control textboxborder UMname inputText tmsUserAccForm has-content":"form-control textboxborder UMname inputText tmsUserAccForm"} ref="packageName" name="packageName"  required />
																				   
																				</span>
																	    	</div>
																		    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
																				<span className="blocking-span"> 
																					<select type="text" name="categoryName" ref="categoryName" value={this.state.categoryName} onClick={this.SubCategoryName.bind(this)} onChange={this.handleChange} className="form-control textboxborder col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" autoComplete="off" title="Select Category" required>
																						<option disabled value="">-- Select Category --</option>
																						{this.showCategories().map((categories,index)=>{
																							return <option key={index}>{categories.categoryName}</option>
																						  })
																						}
																					</select>
																							   								   			
																				</span>
																			</div>
																	{/*<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
																	<span className="">Select Sub Category</span>		
																		<span className="helpSecSR" title="Help" onClick={this.showhideSubCatDetails.bind(this)}><i className="fa fa-question-circle"></i></span>
																		<div className="categoryListDataStud categoryListDataStudshoww">
																			<label>A1/B1/C1/D1</label> : Below 7 year<br/>
																			<label>A2/B2/C2/D2</label> : 7-9 year<br/>
																			<label>A3/B3/C3/D3</label> : 9-11 year<br/>
																			<label>A4/B4/C4/D4</label> : 11-14 year<br/>
																		</div>
																		<span className="blocking-span"> 
																			<select type="text" name="subCategory" ref="subCategory" value={this.state.subCategory} className="form-control textboxborder col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" onChange={this.handleChange} title="Select Sub-Category" required>
																				<option value="">-- Select Sub Category --</option>
																				{this.SubCategoryName()}
																			</select>
																						   			
																		</span>
																	</div>
																	
																    <div className=" col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent">
																   		<span className="blocking-span">
																		   	<input type="number" title="Only numbers are allowed!"  onChange={this.handleChange} value={this.state.AttemptOfPracticeTest} className={this.state.AttemptOfPracticeTest?"form-control accessInputField textboxborder UMname inputText tmsUserAccForm has-content":"form-control accessInputField textboxborder UMname inputText tmsUserAccForm"} ref="AttemptOfPracticeTest" name="AttemptOfPracticeTest"  required />
																   			<span className="floating-label">Attempt for each Test <label className="requiredsign">*</label></span>
																		</span>
																    </div>*/}
																    <span className="col-lg-6 col-md-6 col-xs-6 col-sm-6">Select Sub Category</span>	
																	<span className="col-lg-6 col-md-6 col-xs-6 col-sm-6">Attempt for each Test<label className="requiredsign">*</label></span>	
																	<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
																		{/*<span className="helpSecSR" title="Help" onClick={this.showhideSubCatDetails.bind(this)}><i className="fa fa-question-circle"></i></span>*/}
																		<span className="helpSecSR" title="Help" onClick={this.showhideSubCatDetails.bind(this)}><i className="fa fa-question-circle"></i></span>

																		<div className="categoryListDataStud categoryListDataStudshoww">
																			<label>A1/B1/C1/D1</label> : Below 7 year<br/>
																			<label>A2/B2/C2/D2</label> : 7-9 year<br/>
																			<label>A3/B3/C3/D3</label> : 9-11 year<br/>
																			<label>A4/B4/C4/D4</label> : 11-14 year<br/>
																		</div>
																		<span className="blocking-span"> 
																			<select type="text" name="subCategory" ref="subCategory" value={this.state.subCategory} className="form-control textboxborder col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" onChange={this.handleChange} title="Select Sub-Category" required>
																				<option value="">-- Select Sub Category --</option>
																				{this.SubCategoryName()}
																			</select>
																						   			
																		</span>
																	</div>
																	
																    <div className=" col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent">
																   		
																   		<span className="blocking-span">
																		    <input type="number" title="Only numbers are allowed!"  onChange={this.handleChange} value={this.state.AttemptOfPracticeTest} className={this.state.AttemptOfPracticeTest?"form-control accessInputField textboxborder UMname inputText tmsUserAccForm has-content":"form-control accessInputField textboxborder UMname inputText tmsUserAccForm"} ref="AttemptOfPracticeTest" name="AttemptOfPracticeTest"  required />
																		</span>
																    </div>
																    <div className=" col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent">
																   		<span className="blocking-span">
																		   	<input type="text" title="Only numbers are allowed!" onChange={this.handleChange} value={this.state.PackagePrice} className={this.state.PackagePrice?"form-control accessInputField textboxborder UMname inputText tmsUserAccForm has-content":"form-control accessInputField textboxborder UMname inputText tmsUserAccForm"} ref="PackagePrice" name="PackagePrice"  required />
																   			<span className="floating-label">Package Price (<i className="fa fa-inr" aria-hidden="true"></i>)<label className="requiredsign">*</label></span>
																		</span>
																    </div>
																    <div className=" col-lg-6 col-md-6 col-xs-6 col-sm-6  inputContent">
																    	<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 paddingleftzero">
																			<span className="blocking-span"> 
																				<button type="button" className="btn btn-primary btn-lg practicepaperselectbtn col-lg-12" data-toggle="modal" data-target="#PracticePaperModal" onClick={this.selectedPPlistdata.bind(this)}>Select Practice Test Papers</button>
																			
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
																									            <th className="col-lg-1 tab-Table"><div className="col-lg-1 checkedList" data-checkedAll={this.state.checkedAll} onClick={this.selectAllSource.bind(this)}><i className={this.state.status? "fa fa-square-o showercolor" : "fa fa-square-o showercolor1"} aria-hidden="true"></i></div>&nbsp;Select All Practice Paper</th>
																									            <th className="col-lg-3 centertextalign">Exam Title </th>
																									            <th className="col-lg-3 centertextalign">No. of Questions </th>
																									            <th className="col-lg-3 centertextalign">Exam Time (Min) </th>
																									            {/*<th className="col-lg-1 tab-Table"> Category </th>*/}
																									        </tr>
																						    			</thead>
																									    <tbody>
																									    	{this.state.PracticePaperForUpdate.length>0?
																									    		this.state.PracticePaperForUpdate.map((PapersData,index)=>{
																												return  <tr key={index}>
																															<td className="tab-Table">{index +1} </td>
																											    			<td className="checkcenter"><div className="checkedList" data-irsrc={PapersData._id}  data-index={index} onClick={this.selectSource.bind(this)} ><i className={PapersData._id+ " fa fa-square-o showercolor3"} aria-hidden="true"></i></div></td>
																											    			<td className="tab-Table">{PapersData ? PapersData.quePaperTitle : null}
																											    				<div className="existInPackage">{this.existInPackageOrNot(PapersData._id)}</div>
																											    			</td>
																											    			<td className="tab-Table">{PapersData ? PapersData.noOfQuestion : null}</td>
																											    			<td className="tab-Table">{PapersData ? PapersData.examTime : null}</td>
																														</tr>
																											  })
																									    	:
																													    <tr className="PracticepaperDataNotAvailable text-center">
																										    				<td colSpan="5">" Practice Papers not yet Added."</td>
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

																			<label className=" col-lg-12 zeropackagepadding selectedpaperqty">Number. of Practice Test Papers : {idArray.length}</label>
																	   		<span className="blocking-span col-lg-12"></span>
																	    </div>
															 		</div>
															 		<span className="col-lg-12">Description</span>
																	<div className=" col-lg-12 col-md-6 col-xs-6 col-sm-6 inputContent">
																   		<span className="blocking-span">
																		   	<textarea rows="4" cols="50" onChange={this.handleChange} className="form-control UMname inputText textboxborder tmsUserAccForm" value={this.state.Description} ref="Description" name="Description"></textarea>
																   			
																		</span>
																    </div>	
																	<div className=" col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
																		<button onClick={this.handleSubmit.bind(this)} className="btn btn-primary pull-right">Update Package</button>
																	</div>
																</div>		
																<br/>
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
			}else{
				return(
					<div>
					    <div className="content-wrapper">
					        <section className="content-header">
					            <h3 className="contentTitle">Edit Package</h3>
					        </section>
					        <section className="content viewContent">
					            <div className="row">
					                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
					                    <div className="box">
						                    <div className="box-header with-border boxMinHeight">
									            <div className="box-header with-border">
									            <h4 className="reportTitle">Edit Package Data</h4>
									            </div>
												<div className="box-body">
													<div className="col-sm-12 col-xs-12 loadingImg loadingUserProfImg">
														Loading Please Wait...
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

	}

export default EditPackageContainer = withTracker(props => {
    var   packageId                 = FlowRouter.getParam("id");
    const postHandle                = Meteor.subscribe('packageData',packageId);
    const post                      = PackageManagementMaster.findOne({ '_id': packageId })||{};
    const loading                   = !postHandle.ready();
    const postPracticePaperHandle   = Meteor.subscribe('quesPaperPracticeExam');
    const postPracticePaper         = QuestionPaperMaster.find({"examType":"Practice Exam"},{sort: {createdAt: -1}}).fetch();
    const loadingPracticePaper      = !postPracticePaperHandle.ready();
    var subCat=post.subCategory;


    const CategorywisePracticePaperHandle       = Meteor.subscribe('quesPaperPracticeExam');
    const CategorywiseloadingPracticePaper      = !postPracticePaperHandle.ready();
    const CategorywisepostPracticePaper         = QuestionPaperMaster.find({"examType":"Practice Exam","subCategory":subCat,"paperStatus":"Not Assign","isDraft" : ""}).fetch();
   
	    return {
	        loading,
	        loadingPracticePaper,
	        post,
	        postPracticePaper,
	        CategorywisepostPracticePaper,
	    }; 
})(UMEditPackage);



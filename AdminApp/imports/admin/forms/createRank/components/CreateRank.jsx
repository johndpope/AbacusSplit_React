import React, { Component } from 'react';
import { render } from 'react-dom';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';


import { CategoryMaster } from '/imports/admin/forms/addCategory/api/categoryMaster.js'; 

export default class CreateRank extends Component {

	constructor(props){
		super(props);
		this.state ={
			categoryName  : '',
			subCategory: '',
			studentNameCWT:'',
			allCompetitions : [],
			competitionId : '',
			competitionName: '',
			rankButton : true,
			facilityPermission : 'waitingforResult',
			"subscription" : {
				"CategoryCollection" : Meteor.subscribe("allCategory"),
			}
		}
		this.handleChange = this.handleChange.bind(this)
	}

	componentWillMount(){
  		 Meteor.call("isAuthenticated","Rank","GenerateRank",(err,res)=>{
			if(err){
				console.log(err);
			}else{
				this.setState({
					// facilityPermission : access("Add Questions","Master Data"),
					 facilityPermission : res,
				});
			}
		});

  		Meteor.call("allCompetitions",(err,res)=>{

	 		this.setState({
	 			allCompetitions : res,
	 		});
	 	});
  	}

	componentDidMount() {
	 	if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}
	}

	handleChange(event) {
	    const target = event.target;
	    const name = target.name;

	    this.setState({
	      [name]: event.target.value
	    });		
	}

	showCategories(){
		return CategoryMaster.find({}).fetch();	
	}

  	getCategoryName(event){
		var categorySubName = $(event.target).val();
		this.setState({
			categoryName : categorySubName,
		},()=>{this.getCompetitionId()});
		
	}
	getSubCategoryName(event){
		var categorySubName = $(event.target).val();
		this.setState({
			subCategory : categorySubName,
		},()=>{this.getCompetitionId()});	
	}

	getCompetitionId(s){
		var competitionId = $("#selectId option:selected").attr("id");
		var competitionName = $("#selectId option:selected").val();
		Meteor.call("checkCompetitionResultDeclare",competitionId,this.state.categoryName,this.state.subCategory,(err,res)=>{
			if(err){}else{
				// console.log("res ----> ",res);
				if(res=="resultDeclared"){
					this.setState({
						competitionId   : competitionId,
						competitionName : competitionName,
						rankButton      :false,
					});
				}else if("resultNotDeclared"){
					this.setState({
						competitionId   : competitionId,
						competitionName : competitionName,
						rankButton      : true,
					});
				}
			}
		});

	}




  	SubCategoryName(event){
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

	createRank(event){
		event.preventDefault();
		if(this.state.categoryName && this.state.subCategory && this.state.competitionId){
			
			Meteor.call("generateRankCatSubCatWise",this.state.categoryName,this.state.subCategory,this.state.competitionId,(err,re)=>{
				if(err){
					console.log(err);
				}else{
					swal(
						'Rank Created SuccessFully for '+' " '+this.state.competitionName +' "'+ " ( "+ this.state.categoryName+'/'+this.state.subCategory +" ) ",
						' ',
						'success');
				}
			});
				
		}else{
			swal(
				'Please select competition',
				' ',
				'warning');
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
		            <h1>Generate Rank</h1>
		          </section>
		          {/* Main content */}
		          <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		                <div className="box-header with-border">
				            <h3 className="box-title">Generate rank for Competition wise and category wise students</h3>
				        </div>
		                  <div className="box-header with-border boxMinHeight">
							<div className="col-lg-12 col-md-12 col-sm-12">
								<div className="col-lg-8 col-lg-offset-2  col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-12 catSelectWrapRank">

									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<span className="blocking-span"> 
											<select type="text" name="competitionId" ref="competitionId"  id="selectId" onClick={this.getCompetitionId.bind(this)} onChange={this.handleChange} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" autoComplete="off" title="Please select Category" required>
												<option value="">-- Select Competition --</option>
												{this.state.allCompetitions.map((competition,index)=>{
													return <option key={index} id={competition._id}>{competition.competitionName}</option>
												  })
												}
											</select>
											<span className="floating-label floating-label-Date">Select Competition</span>					   								   			
										</span>
									</div>

									<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
										<span className="blocking-span"> 
											<select type="text" name="categoryName" ref="categoryName" value={this.state.categoryName} onClick={this.getCategoryName.bind(this)} onChange={this.handleChange.bind(this)} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" autoComplete="off" title="Please select Category" required>
												<option value="">-- Select Category --</option>
												{this.showCategories().map((categories,index)=>{
													return <option key={index}>{categories.categoryName}</option>
												  })
												}
											</select>
											<span className="floating-label floating-label-Date">Select Category</span>					   								   			
										</span>
									</div>
									<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
										<span className="helpSecSR" title="Help" onClick={this.showhideSubCatDetails.bind(this)} ><i className="fa fa-question-circle"></i></span>
										<div className="categoryListDataStud categoryListDataStudshoww">
											<label>A1/B1/C1/D1</label> : Below 7 year<br/>
											<label>A2/B2/C2/D2</label> : 7-9 year<br/>
											<label>A3/B3/C3/D3</label> : 9-11 year<br/>
											<label>A4/B4/C4/D4</label> : 11-14 year<br/>
										</div>
										<span className="blocking-span"> 
											<select type="text" name="subCategory" ref="subCategory" value={this.state.subCategory} onClick={this.getSubCategoryName.bind(this)}className="form-control subCatTab col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" onChange={this.handleChange.bind(this)} required>
												<option value="">-- Select Sub Category --</option>
												{this.SubCategoryName()}
											</select>
											<span className="floating-label floating-label-Date">Select Sub Category</span>					   			
										</span>
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 grBtn">
										{this.state.rankButton ?
											<button className="btn btn-primary col-lg-4 col-md-4 col-sm-4" onClick={this.createRank.bind(this)}> Generate Rank</button>
											:
											<button className="btn btn-default col-lg-4 col-md-4 col-sm-4 alreadyGeneratedRank" title="Rank already generated for this competition"> Rank Already Generated</button>
										}
									</div>
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
			   <img className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 loaderImageSize" src="/images/loading1.gif" alt="loading"/>
			</div>);
		  }else{ 
		  return (<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
		  			<h3>You dont have access. Please <a href="/admin/AssignPermissionstoModules/Show%20All">click here </a>to assign permission</h3>
		  		 </div>
		  	);
		}
	}
}
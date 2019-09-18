
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import { withTracker } from 'meteor/react-meteor-data';
import {PackageManagementMaster} from '/imports/admin/packageManagement/api/packageManagementMaster.js';
import {PackageOrderMaster} from '/imports/admin/forms/invoice/api/packageOrderMaster.js';
import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';

var idPackageArray=[];
class PackageList extends TrackerReact(Component)  {
  constructor(props){
    super(props);
    this.state={
      facilityPermission : 'waitingforResult',
      subscription:{
        packageOrderData : Meteor.subscribe("singleOrder",FlowRouter.getParam('id')),
      }
    }
  }
  
  componentDidMount(){
      window.addEventListener('scroll', this.handleScroll);
      if ( !$('body').hasClass('adminLte')) {
        var adminLte = document.createElement("script");
        adminLte.type="text/javascript";
        adminLte.src = "/js/adminLte.js";
        $("body").append(adminLte);
      }
      $(".seleectQueInput").each(function(){

      });


    }
    componentWillMount(){
       Meteor.call("isAuthenticated","PracticePackages","PurchaseNewPackage",(err,res)=>{
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

    componentWillUnmount(){
      window.removeEventListener('scroll', this.handleScroll);
      $("script[src='/js/adminLte.js']").remove();
      $("link[href='/css/dashboard.css']").remove();
    }
  
    addPackages(event){
        var packageId = event.target.getAttribute('id');
        Meteor.call('addPackages',packageId,FlowRouter.getParam("id"),(err,res)=>{
          if(err){
            console.log("Something went wrong");
          }else{
            var orderId = res;
            if(orderId){
              FlowRouter.go('/PackageList/'+orderId);
            }
          }
        });
      }

      buyPackages(){
        Meteor.call("checkPackagesAdded",FlowRouter.getParam('id'),(err,res)=>{
          if(err){
            console.log(err);
          }else{
        console.log("res",res);

            if(res=="packagesAdded"){
                FlowRouter.go("/MyInvoice/"+FlowRouter.getParam("id"));
              }else if(res=="notAdded"){
                swal("Please Select Package","","warning");
              }else{
                swal("Please Select Package","","warning");
              }
            }
        });
      }

    handleScroll(event){

        var winHeight = $(window).height();
        var element = $(".packagebox .showBox");
        var x = 1;
          if(element){
          element.each(function(){
            var elm = $(this);
            var winTop =  $(window).scrollTop();
            var topCoord = elm.offset().top;
            if(winTop > (topCoord - (winHeight*0.95)) ){
              $(this).addClass('effect'+x);
              x++;
              if(x == 5){
                x = 1;
              }
            }
          });
        }
    }

    componentDidUpdate(){
      var _id = FlowRouter.getParam("id");
      var PackageOrderData = PackageOrderMaster.findOne({"_id":_id})||{};
      if(PackageOrderData){
        var packages = PackageOrderData.packages;
        if(packages){
          for(var i=0; i<packages.length;i++){
            $("#"+packages[i].packageId).attr("checked",true);
          }
        }
      }
    }


  render(){
    if(this.state.facilityPermission != 'waitingforResult' && this.state.facilityPermission == true){
      $('.sidebar').css({display:'block',background: '#222d32'});
    return(
      <div>
        <div className="content-wrapper">
                <section className="content-header">
                    <h1>Package List</h1>
                </section>
                    <section className="content viewContent">
                    <div className="row">
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                        <div className="box">
                        {Roles.userIsInRole(Meteor.userId(), ['Franchise'])?
                          <div className="box-header with-border boxMinHeight">
                            <div className="box-header with-border textboxborder">
                            <h4 className="reportTitle">Select Packages1 </h4>
                            </div>
                            <div className="box-body packageboxbody  examPageWrapbtn">
                              <div className="packagebox col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                {
                                  this.props.post.length>0?
                                  this.props.post.map((Data,index)=>{
                                  return index<8?
                                    <div key={index} className="col-lg-3 col-md-4 col-xs-12 col-sm-6">
                                      <div  className="singlepackagebox  col-lg-12 col-md-12 col-xs-12 col-sm-12">
                                        {
                                        Roles.userIsInRole(Meteor.userId(), ['Franchise'])?
                                          null
                                          :
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                            <div className="checkbox checkbox-success pull-right">

                                                <input type="checkbox" className="seleectQueInput" id={Data._id} name="seleectQueInput" onClick={this.addPackages.bind(this)} />
                                                <label></label>
                                            </div>
                                          </div>
                                        }
                                         
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  whitetext boldtextofcost pckgtitle"> {Data.packageName}</div>
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  whitetext boldtextofcost">
                                            <label title="Click here to see description" className="docLabel docLabelhover" data-toggle="modal" data-target={'#'+index}><blink>Description</blink></label>
                                          </div>
                                           <div id={index} className="modal fade" role="dialog">
                                            <div className="modal-dialog">
                                              <div className="modal-content documentModal">
                                                <div className="modal-header">
                                                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                                                    <h4 className="modal-title">Package Name : {Data.packageName}</h4>
                                                </div>
                                                <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 modalbodyHeight">
                                                    <h5 className="modal-title">Description :</h5>
                                                     {Data.Description.length>0?
                                                      <p className="docImageView packageDescPara">{Data.Description}</p>
                                                      :
                                                      <p className="docImageView packageDescParaRed">Description not added for this package.</p>
                                                    }
                                                  </div>
                                                </div>  
                                                <div className="modal-footer">
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfo">
                                          <div className="col-lg-6 col-md-12 col-xs-12 col-sm-12 packagefontsize pckginfobox minhtpkg"> <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext">Category Name </div> <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  pckginfoboxtext">{Data.categoryName}</div></div>
                                          <div className="col-lg-6 col-md-12 col-xs-12 col-sm-12 packagefontsize pckginfobox1 minhtpkg"><div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext1">Sub Category</div><div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext1">  {Data.subCategory}</div></div>
                                          <div className="col-lg-6 col-md-12 col-xs-12 col-sm-12 packagefontsize pckginfobox1 minhtpkg"><div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext1">No. of Tests</div><div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext1">  {Data.NoOfPracticeTest}</div></div>
                                          <div className="col-lg-6 col-md-12 col-xs-12 col-sm-12 packagefontsize pckginfobox minhtpkg"><div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext">No. of Attempts</div><div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext"> {Data.AttemptOfPracticeTest}</div></div>
                                        </div>
                                        {/*<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 packagefontsize">Cost : {Data.PackagePrice}&nbsp;&nbsp;<i className="fa fa-inr" aria-hidden="true"></i></div>*/}
                                      </div>
                                      <div className="packagelabel col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                     {/*   <div className="whitetext col-lg-6">{Data.packageName}</div>*/}
                                        <div className="whitetext col-lg-12 col-md-12 col-sm-12 col-xs-12  boldtextofcost"><h4><i className="fa fa-inr" aria-hidden="true"></i>&nbsp;&nbsp;{Data.PackagePrice}</h4></div>
                                      </div>
                                    </div>
                                    :
                                     <div key={index} className="col-lg-3 col-md-4 col-xs-12 col-sm-6 showBox">
                                      <div  className="singlepackagebox  col-lg-12 col-md-12 col-xs-12 col-sm-12">
                                       {
                                        Roles.userIsInRole(Meteor.userId(), ['Franchise'])?
                                          null
                                          :
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                            <div className="checkbox checkbox-success pull-right">
                                                <input type="checkbox" className="seleectQueInput" id={Data._id} name="seleectQueInput" onClick={this.addPackages.bind(this)} />
                                                <label></label>
                                            </div>
                                          </div>
                                      }
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  whitetext boldtextofcost pckgtitle"> {Data.packageName}</div>
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  whitetext boldtextofcost">
                                            <label title="Click here to see description" className="docLabel docLabelhover" data-toggle="modal" data-target={'#'+index}><blink>Description</blink></label>
                                          </div>
                                           <div id={index} className="modal fade" role="dialog">
                                            <div className="modal-dialog">
                                              <div className="modal-content documentModal">
                                                <div className="modal-header">
                                                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                                                    <h4 className="modal-title">Package Name : {Data.packageName}</h4>
                                                </div>
                                                <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 modalbodyHeight">
                                                    <h5 className="modal-title">Description :</h5>
                                                     {Data.Description.length>0?
                                                      <p className="docImageView packageDescPara">{Data.Description}</p>
                                                      :
                                                      <p className="docImageView packageDescParaRed">Description not added for this package.</p>
                                                    }
                                                  </div>
                                                </div>  
                                                <div className="modal-footer">
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfo">
                                          <div className="col-lg-6 col-md-12 col-xs-12 col-sm-12 packagefontsize pckginfobox minhtpkg"> <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext">Category Name </div> <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext">{Data.categoryName}</div></div>
                                          <div className="col-lg-6 col-md-12 col-xs-12 col-sm-12 packagefontsize pckginfobox1 minhtpkg"><div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext1">Sub Category</div><div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext1">  {Data.subCategory}</div></div>
                                          <div className="col-lg-6 col-md-12 col-xs-12 col-sm-12 packagefontsize pckginfobox1 minhtpkg"><div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext1">No. of Tests</div><div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext1">  {Data.NoOfPracticeTest}</div></div>
                                          <div className="col-lg-6 col-md-12 col-xs-12 col-sm-12 packagefontsize pckginfobox minhtpkg"><div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext">No. of Attempts</div><div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext"> {Data.AttemptOfPracticeTest}</div></div>
                                        </div>
                                        {/*<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 packagefontsize">Cost : {Data.PackagePrice}&nbsp;&nbsp;<i className="fa fa-inr" aria-hidden="true"></i></div>*/}
                                      </div>
                                      <div className="packagelabel col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                     {/*   <div className="whitetext col-lg-6">{Data.packageName}</div>*/}
                                        <div className="whitetext col-lg-12 col-md-12 col-sm-12 col-xs-12 boldtextofcost"><h4><i className="fa fa-inr" aria-hidden="true"></i>&nbsp;&nbsp;{Data.PackagePrice}</h4></div>
                                      </div>
                                    </div>
                                  })
                                  :
                                  <div className="box-header with-border boxMinHeight  studDataNotExist">
                                  <div>
                                    Packages Not Added
                                  </div>
                                </div>
                                }
                              </div>
                              {
                              Roles.userIsInRole(Meteor.userId(), ['Franchise'])?
                                        null
                                        :
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bypackagebtnWrap">
                                    <button className="btn bypackagebtn" onClick={this.buyPackages.bind(this)}>Buy Packages</button>
                                  </div>
                                }

                            </div>
                           
                          </div>
                          :
                          this.props.studentData._id?
                          <div className="box-header with-border boxMinHeight">
                            <div className="box-header with-border textboxborder">
                            <h4 className="reportTitle">Select Packages </h4>
                            </div>
                            <div className="box-body packageboxbody  examPageWrapbtn">
                              <div className="packagebox col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                {
                                  this.props.post.length>0?
                                  this.props.post.map((Data,index)=>{
                                  return index<8?
                                    <div key={index} className="col-lg-3 col-md-4 col-xs-12 col-sm-6">
                                      <div  className="singlepackagebox  col-lg-12 col-md-12 col-xs-12 col-sm-12">
                                        {
                                        Roles.userIsInRole(Meteor.userId(), ['Franchise'])?
                                          null
                                          :
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                            <div className="checkbox checkbox-success pull-right">

                                                <input type="checkbox" className="seleectQueInput" id={Data._id} name="seleectQueInput" onClick={this.addPackages.bind(this)} />
                                                <label></label>
                                            </div>
                                          </div>
                                        }
                                         
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  whitetext boldtextofcost pckgtitle"> {Data.packageName}</div>
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  whitetext boldtextofcost "> 
                                             <label title="Click here to see description" className="docLabel docLabelhover " data-toggle="modal" data-target={'#'+index}><blink>Description</blink></label>
                                          </div>
                                          <div id={index} className="modal fade" role="dialog">
                                            <div className="modal-dialog">
                                              <div className="modal-content documentModal">
                                                <div className="modal-header">
                                                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                                                    <h4 className="modal-title">Package Name : {Data.packageName}</h4>
                                                </div>
                                                <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 modalbodyHeight">
                                                    <h5 className="modal-title">Description :</h5>
                                                    {Data.Description.length>0?
                                                      <p className="docImageView packageDescPara">{Data.Description}</p>
                                                      :
                                                      <p className="docImageView packageDescParaRed">Description not added for this package.</p>
                                                    }
                                                  </div>
                                                </div>  
                                                <div className="modal-footer">
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfo">
                                          <div className="col-lg-6 col-md-12 col-xs-12 col-sm-12 packagefontsize pckginfobox minhtpkg"> <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext">Category Name </div> <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext">{Data.categoryName}</div></div>
                                          <div className="col-lg-6 col-md-12 col-xs-12 col-sm-12 packagefontsize pckginfobox1 minhtpkg"><div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext1">Sub Category</div><div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext1">  {Data.subCategory}</div></div>
                                          <div className="col-lg-6 col-md-12 col-xs-12 col-sm-12 packagefontsize pckginfobox1 minhtpkg"><div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext1">No. of Tests</div><div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext1">  {Data.NoOfPracticeTest}</div></div>
                                          <div className="col-lg-6 col-md-12 col-xs-12 col-sm-12 packagefontsize pckginfobox minhtpkg"><div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext">No. of Attempts</div><div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext"> {Data.AttemptOfPracticeTest}</div></div>
                                        </div>
                                        {/*<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 packagefontsize">Cost : {Data.PackagePrice}&nbsp;&nbsp;<i className="fa fa-inr" aria-hidden="true"></i></div>*/}
                                      </div>
                                      <div className="packagelabel col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                     {/*   <div className="whitetext col-lg-6">{Data.packageName}</div>*/}
                                        <div className="whitetext col-lg-12 col-md-12 col-sm-12 col-xs-12  boldtextofcost"><h4><i className="fa fa-inr" aria-hidden="true"></i>&nbsp;&nbsp;{Data.PackagePrice}</h4></div>
                                      </div>
                                    </div>
                                    :
                                     <div key={index} className="col-lg-3 col-md-4 col-xs-12 col-sm-6 showBox">
                                      <div  className="singlepackagebox  col-lg-12 col-md-12 col-xs-12 col-sm-12">
                                       {
                                        Roles.userIsInRole(Meteor.userId(), ['Franchise'])?
                                          null
                                          :
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                            <div className="checkbox checkbox-success pull-right">
                                                <input type="checkbox" className="seleectQueInput" id={Data._id} name="seleectQueInput" onClick={this.addPackages.bind(this)} />
                                                <label></label>
                                            </div>
                                          </div>
                                      }
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  whitetext boldtextofcost pckgtitle"> {Data.packageName}</div>
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  whitetext boldtextofcost">
                                            <label title="Click here to see description" className="docLabel docLabelhover" data-toggle="modal" data-target={'#'+index}><blink>Description</blink></label>
                                          </div>
                                           <div id={index} className="modal fade" role="dialog">
                                            <div className="modal-dialog">
                                              <div className="modal-content documentModal">
                                                <div className="modal-header">
                                                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                                                    <h4 className="modal-title">Package Name : {Data.packageName}</h4>
                                                </div>
                                                <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 modalbodyHeight">
                                                    <h5 className="modal-title">Description :</h5>
                                                     {Data.Description.length>0?
                                                      <p className="docImageView packageDescPara">{Data.Description}</p>
                                                      :
                                                      <p className="docImageView packageDescParaRed">Description not added for this package.</p>
                                                    }
                                                  </div>
                                                </div>  
                                                <div className="modal-footer">
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfo">
                                          <div className="col-lg-6 col-md-12 col-xs-12 col-sm-12 packagefontsize pckginfobox"> <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext">Category Name </div> <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext">{Data.categoryName}</div></div>
                                          <div className="col-lg-6 col-md-12 col-xs-12 col-sm-12 packagefontsize pckginfobox1"><div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext1">Sub Category</div><div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext1">  {Data.subCategory}</div></div>
                                          <div className="col-lg-6 col-md-12 col-xs-12 col-sm-12 packagefontsize pckginfobox1"><div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext1">No. of Tests</div><div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext1">  {Data.NoOfPracticeTest}</div></div>
                                          <div className="col-lg-6 col-md-12 col-xs-12 col-sm-12 packagefontsize pckginfobox"><div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext">No. of Attempts</div><div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pckginfoboxtext"> {Data.AttemptOfPracticeTest}</div></div>
                                        </div>
                                        {/*<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 packagefontsize">Cost : {Data.PackagePrice}&nbsp;&nbsp;<i className="fa fa-inr" aria-hidden="true"></i></div>*/}
                                      </div>
                                      <div className="packagelabel col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                     {/*   <div className="whitetext col-lg-6">{Data.packageName}</div>*/}
                                        <div className="whitetext col-lg-12 col-md-12 col-sm-12 col-xs-12  boldtextofcost"><h4><i className="fa fa-inr" aria-hidden="true"></i>&nbsp;&nbsp;{Data.PackagePrice}</h4></div>
                                      </div>
                                    </div>
                                  })
                                  :
                                  <div className="box-header with-border boxMinHeight  studDataNotExist">
                                    <div>
                                      Packages Not Added
                                    </div>
                                </div>
                                }                               
                              </div>
                              {
                              Roles.userIsInRole(Meteor.userId(), ['Franchise'])?
                                        null
                                        :
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bypackagebtnWrap">
                                    <button className="btn bypackagebtn" onClick={this.buyPackages.bind(this)}>Buy Packages</button>
                                  </div>
                                }

                            </div>
                           
                          </div>
                          :
                          <div className="box-header with-border boxMinHeight  studDataNotExist whitebackground">
                            <div className="col-lg-offset-2 col-lg-8 col-md-offset-2 col-md-8 col-sm-offset-1 col-sm-10 col-xs-12">
                              Please Fill Registration Form <a href="/studentRegistration"> Click Here </a> to Register & purchase the packages.
                            </div>
                          </div>
                        }
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
            </div>


        );
        }else if (this.state.facilityPermission == false ){
          return (<div>{FlowRouter.go('/noAccesss')}</div>);
      }else if(this.state.facilityPermission == "waitingforResult"){
        return(<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 waitingResLoadingWrap">
         <img className="loaderImageSize1" src="/images/loading1.gif" alt="loading"/>
      </div>);
      }else{ 
      return (<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 waitingResLoadingWrap"><h3>You don't have access.</h3></div>);
    }
    }
  }
  export default PackageListContainer = withTracker(props=>{
    const postHandle   = Meteor.subscribe('packageManagementData');
    const loading      = !postHandle.ready();
    const post         = PackageManagementMaster.find({},{sort: {createdAt: -1}}).fetch();

    const postHandle1 = Meteor.subscribe("LoginInStudent",Meteor.userId());
    const LoadingTest = !postHandle1.ready();
    var studentData = StudentMaster.findOne({"studentId":Meteor.userId()})||{};
    // console.log("studentData",studentData);

    return {

    loading,
    post,
    studentData

    };

  })(PackageList);
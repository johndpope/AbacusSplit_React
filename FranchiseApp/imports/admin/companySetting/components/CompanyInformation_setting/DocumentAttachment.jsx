
import React, {Component} from 'react';
import {render} from 'react-dom';
import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {Link} from 'react-router';
import {browserHistory } from 'react-router';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import { FranchiseDetails }      from '/imports/admin/companySetting/api/CompanySettingMaster.js';

// import { TempLogoImage } from '../api/TempLogoImage.js';
import {TempImage} from '/imports/s3/api/ClientImageCall.js';
import {TempDocumentsImage} from '/imports/s3/api/ClientImageCall.js';
import {FranchiseDetailsMaster} from '/imports/admin/franchiseDetails/api/FranchiseDetailsMaster.js';
import validator from 'validator';
import {Session} from 'meteor/session';
import ReactTable from "react-table";
 var documentArrayVar=[];
var IPAddress='';
class CompanyInformation extends TrackerReact(Component)  {

  constructor(props){
    super(props);
    this.state={
      'companyId'               :'',
      'firstName'               : '',
      "middleName"              : '',
      "lastName"                : '',
      'contactNo'               : '',
      'alternateContactNo'      : '',
      'addressLine1'            : '',
      'addressLine2'            : '',
      'city'                    : '',
      'state'                   : '',
      'country'                 : '',
      'pincode'                 : '',
      'mail'                    : '',
      'dob'                     : '',
      'franchiseName'           : '',
      'documentArray'           : [],
      'allFranchiseData'        : [],
      'document'                : '',
      'documentAttachedStatus'  : '',
      'FranchiseName'           : '',
      'franchiseCode'           : '',
      'searchText'              : '',
      'fID'                     : '',
      
    }
    this.handleChange = this.handleChange.bind(this);
    // this.removeFranchiseDetails = this.removeFranchiseDetails.bind(this);
  }

  componentDidMount(){
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
  
  adddocuments(event){
    event.preventDefault();

   if(Roles.userIsInRole(Meteor.userId(), ['superAdmin','Admin'])){
    var curUrl = location.pathname;
        if(curUrl=='/initial-company-setting'){
          var id         = Meteor.userId();
        }else{
          var id         = FlowRouter.getParam("id");
        }

  }else{
    var id         = Meteor.userId();
  }  
    if(this.StudentImage1().length>0){
      Meteor.call('updateDocumentFranchiseInfo', (error,result) => {
          if(error){
            swal("Documents are not attached","","warning");
          }else{
           

             if (Roles.userIsInRole(Meteor.userId(), ['Franchise'])){
              if(result=="DocNotAttached"){
                 swal("Documents are not attached","Please check attached documents","warning");

              }else{
               Meteor.call("updateVerificationStatus",(err,res)=>{
                  if(err){           
                  }else{
                    // console.log("res--->",res);
                  }
                }) 
              swal("Documents updated successfully!!. Please contact us on support@maats.in or call us on +91-8983318508 to get verify your documents.");
              } 

             }else  if (Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin'])){
               if(result=="DocNotAttached"){
                 swal("Documents are not attached","Please check attached documents","warning");
               }else{
                swal("Documents updated successfully!!");
                FlowRouter.go('/Admin/profile/'+Meteor.userId()); 
               }
              

             }
        
      }
    });
    }else{
      swal("Please attach documents.");
    }
        
  }

  getAllFranchiseDetails(){
      if(!this.state.searchText){
        
        Meteor.call("allFranchise",(err,res)=>{
          if(err){
            // console.log(error);
          }else{
            
            this.setState({'allFranchiseData':res});
          }
        })

      }else{
    
        Meteor.call("SearchFranchise",this.state.searchText,(err,res)=>{
          if(err){
            // console.log(error);
          }else{
            this.setState({'allFranchiseData':res});
          }
        })
      }
    
  }

  buildRegExp(searchText) {
     var words = searchText.trim().split(/[ \-\:]+/);
     var exps = _.map(words, function(word) {
        return "(?=.*" + word + ")";
     });

     var fullExp = exps.join('') + ".+";
     return new RegExp(fullExp, "i");
  }

  getTextValue(event){
    var searchName= $('.SearchFranchise').val();
    if(searchName){
      var RegExpBuildValue = this.buildRegExp(searchName);
      this.setState({
        searchText   : RegExpBuildValue,
        
      },()=>{this.getAllFranchiseDetails()});
    }else{
      this.setState({
        searchText   : '',
        
        
      },()=>{this.getAllFranchiseDetails()});
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.FranchiseDetailsData){
      this.setState({
      
        // 'allFranchiseData':nextProps.postFranchiseData,
        
      });
      this.handleChange = this.handleChange.bind(this);
      this.removeFranchiseDetails = this.removeFranchiseDetails.bind(this);
    }
  }

  handleChange(event){
    const target = event.target;
    const name   = target.name;
    this.setState({
      [name]: event.target.value,
    });
    if(name=="document"){
      this.setState({
                document : event.target.value,
            });
    }
    }

    imgBrowse(e){
        e.preventDefault();
        e.stopPropagation();
        let self=this;      
        if(e.currentTarget.files){
          var file=e.currentTarget.files[0];
        
          if(file){
            addProductImgsToS3Function(file,self);
          }
        }
        return false;       
    }
    imgBrowse1(event){
        event.preventDefault();
        event.stopPropagation();
        

        let self=this;      
        if(event.currentTarget.files){
        var file=event.currentTarget.files[0];
        var documentType=this.state.document;
        if(file){
       
          var fileName  = file.name; 
                 var ext       = fileName.split('.').pop();  
                      if(ext=="jpg" || ext=="png" || ext=="jpeg"){    
                          if (file,documentType) {   
                      addProductDocumentImgsToS3Function(file,self,documentType);
                }else{           
                         swal("File not uploaded","Something went wrong","error");  
                           }     
                      }else{ 
                         swal("Please upload file","Only Upload  images format (jpg,png,jpeg)","error");   
                      }
          
        }
      } 
      $('#attachfile').val("");
    }
    addDocumentList(event){
      event.preventDefault();
      var TempImg = TempDocumentsImage.find({"userId":Meteor.userId()}).fetch();

    }
    removeCompanyImage(event){
      event.preventDefault();
      var id=this.props.post._id;
      var link = $(event.target).attr('data-link');
      Meteor.call("removeCompanyImage",link,id,(error, result)=>{
      });
    }
  removeStudProfPhoto(){
    swal({
        title             : 'Are you sure?',
        text              : 'You will not be able to recover this profile photo.',
        type              : 'warning',
        showCancelButton  : true,
        closeOnConfirm    : false,
        confirmButtonColor: '#dd6b55',
        cancelButtonColor : '#d44',
        confirmButtonText : 'Yes, Delete it!',
        cancelButtonText  : 'No, Keep it',
        closeOnConfirm    : false
    },function(){
      Meteor.call("removeprofPhoto",Meteor.userId(),(error,result)=>{
        if(error){

        }else{

          swal(
            'Profile image has been Deleted',
           
          );
        }
      });
          
      });
      
  }
  removeStudProfPhoto1(){
    swal({
        title             : 'Are you sure?',
        text              : 'You will not be able to recover this profile photo!',
        type              : 'warning',
        showCancelButton  : true,
        closeOnConfirm    : false,
        confirmButtonColor: '#dd6b55',
        cancelButtonColor : '#d44',
        confirmButtonText : 'Yes, Delete it!',
        cancelButtonText  : 'No, Keep it',
        closeOnConfirm    : false
    },function(){
      Meteor.call("removeprofDocumentPhoto",Meteor.userId(),(error,result)=>{
        if(error){

        }else{

          swal(
            'Profile photo has been Deleted',
            
          );
        }
      });
        
      });
  }
  
    removeFranchiseDetails(event){
 
      event.preventDefault();
      var id = $(event.target).attr('id');
      var franchiseUser=FranchiseDetailsMaster.findOne({"_id":id});
      var franchiseID=franchiseUser.franchiseID;
     // console.log("studentID",studentID);
      Meteor.call("deleteUser", franchiseID,(error, result)=>{
      });
      swal({
        title             : 'Are you sure?',
        text              : 'You will not be able to recover this Record!',
        type              : 'warning',
        showCancelButton  : true,
        closeOnConfirm    : false,
        confirmButtonColor: '#dd6b55',
        cancelButtonColor : '#d44',
        confirmButtonText : 'Yes, Delete it!',
        cancelButtonText  : 'No, Keep it',
        closeOnConfirm    : false
    },function(){
      Meteor.call("RemoveFranchiseDetails",id,(error,result)=>{
        if(error){

        }else{
          swal(
              'Franchise Record has been Deleted',
          );
        }
      });
      });
    }

    StudentImage(){
        if(Roles.userIsInRole(Meteor.userId(), ['superAdmin','Admin'])){
        var userId         = FlowRouter.getParam("id");
      }else{
        var userId         = Meteor.userId();
      }
    var TempImg = TempImage.findOne({"userId":userId});
    if(TempImg){
      return TempImg.imagePath;
    }else{
        return '/images/addLogo1.png';
    }
  }
  StudentImage1(){
       if(Roles.userIsInRole(Meteor.userId(), ['superAdmin','Admin'])){
        var curUrl = location.pathname;
        if(curUrl=='/initial-company-setting' || curUrl=='/admin/companyinfo' || curUrl=='/initial-company-setting/'+FlowRouter.getParam("id")){
          var id         = Meteor.userId();
        }else{
          var id         = FlowRouter.getParam("id");
        }
      }else{
        var id         = Meteor.userId();
      } 
      if(id){
         Meteor.subscribe("TempDocumentsImages");
           var TempImg = TempDocumentsImage.find({"userId":id}).fetch();
          } 
            
      if(TempImg){
        return TempImg;
      }else{
          return '/images/attachment.png';
      }
  }
  removeLi(e){
    event.preventDefault();
    var documentID=e.target.id;
    swal({
        title             : 'Are you sure?',
        text              : 'You will not be able to recover this document image!',
        type              : 'warning',
        showCancelButton  : true,
        closeOnConfirm    : false,
        confirmButtonColor: '#dd6b55',
        cancelButtonColor : '#d44',
        confirmButtonText : 'Yes, Delete it!',
        cancelButtonText  : 'No, Keep it',
        closeOnConfirm    : false
    },function(){
      Meteor.call("removeprofDocumentPhoto",Meteor.userId(),documentID,(error,result)=>{
        if(error){
          }else{
            swal(
              'Document image has been Deleted.'
            );
          }
      });
      });
  }
  
  getUploadServicesPercentage(){
    var uploadProgressPercent = Session.get("imageprogress");
    if(uploadProgressPercent){
        var percentVal = parseInt(uploadProgressPercent);
        if(percentVal){
            var styleC = {
                width:percentVal + "%",
                display:"block",
                height:"8px",
            }
            var styleCBar = {
                display:"block",
                marginTop:117,
                height:"8px",
            }
        }
        if(!percentVal){
            var percentVal = 0;

            var styleC = {
                width:0 + "%",
                display:"none",
                height:"8px",
            }
            var styleCBar = {
                display:"none",
                marginTop:117,
                height:"8px",
            }
        }
        if(percentVal == 100){
            var percentVal = 0;
            var styleC = {
                width:0 + "%",
                display:"none",
                height:"8px",
            }
            var styleCBar = {
                display:"none",
                marginTop:117,
                height:"8px",
            }
        }
        return (
            <div>
                <div className="progress col-lg-12 progressbarPadding"  style= {styleCBar}>
                    <div className="progress-bar progress-bar-striped active" role="progressbar"
                  aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style= {styleC}>
                    </div>
                </div>
            </div>
        );
      }
  }
  dwnldAttach(){
   Bert.alert("Please wait till document download.","success");
  }
  documentsVerified(){
     Meteor.call("updateFranchiseDocumentVerification",FlowRouter.getParam("id"),(error,result)=>{
        if(error){
          }else{
            if(result=="documentssNotAdded"){
              swal("We can not verify.","Documents not added","warning");
            }else if(result=="bankDetailsNotAdded"){
              swal("We can not verify.","Bank details not added","warning");
            }else if(result=="verified"){
              swal("Documents are verified successfully.","","success");
            }
          }
      });
  }

  render(){
      if(location.pathname == "/initial-company-setting"){  
     
      var docattach = "Submit";
    }else{
     
      var docattach = "Update";

    }

    if(location.pathname =="/Admin/profile/"+FlowRouter.getParam("id")){
       var link="userInfo";
    }
    var userInfo=Meteor.users.findOne({"_id":FlowRouter.getParam("id")});
    if(userInfo){
      var userRole=userInfo.roles[0];
    }
    

    return(
      <section className="NotificationContent">
        <div className="row">
          <div className="col-lg-12 col-md-12  col-sm-12 col-xs-12">
            <div className="box box-default companysettingboxinfo1">
            <div className="box-header with-border franchiseBoxheader2">
              <h3 className="box-title1">Documents Attachment</h3>
            </div>           
              <div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 inputContent villageinput listbox">
              { Roles.userIsInRole(Meteor.userId(), ['Franchise']) ?

                <div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 inputContent villageinput listbox">
                <span className="col-lg-12 col-md-12 col-xs-12 col-sm-12 docFranWrap"><label className="col-lg-12 docFranWrap">Documents to attach <label className="imagelabel ">(Image Size :700 KB - jpg/jpeg/png)</label><label className="requiredsign">*</label></label></span>
                      <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-6 inputContent villageinput">
                          <span className="blocking-span">
                              <select className="stateselection  form-control"  id="document" value={this.state.document}  ref="document" name="document" onChange={this.handleChange.bind(this)} required>
                                <option value="">-Select-</option>
                                <option value="Aadhar Card">Aadhar Card</option>
                                <option value="Pan Card">Pan Card</option>
                                <option value="Bank Passbook">Bank Passbook (front)</option>

                              </select>
                          </span>
                      </div>
                      <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-6 inputContent villageinput chosefilebor">
                        <input type="file" accept="image/x-png,image/jpeg,image/pdf,image/jpg" onChange={this.imgBrowse1.bind(this)} placeholder="Upload Your document*" ref="attachfile" name="attachfile" id="attachfile" aria-describedby="sizing-addon1"/>       
                      </div>
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 paddingleftzero attachdocument1">
                      <button type="submit" className="col-lg-3 col-lg-offset-9 col-md-3 col-md-offset-9 col-sm-6 col-offset-6 col-xs-12 btn btn-primary addCategoryBtn docattachsubmit" onClick={this.adddocuments.bind(this)}>{docattach}</button>
                     </div>

              </div>
              :
               null
            }
                    {
                      Roles.userIsInRole(Meteor.userId(), ['superAdmin','Admin'])?
                      this.props.FranchiseDetailsData.Documents?
                      <div className="col-lg-4">
                      <label className="col-lg-12">Attached Documents</label>
                      {this.props.FranchiseDetailsData.Documents.map( (element,index)=>{
                      return(
                        <div className="listarraybox1 col-lg-6" key={index}>
                          
                          <span className="blocking-span col-lg-10 attachedImagetitle" >
                             <img src={element.ImgSource}  className="commonLogo commonLogoicon displayLogo img-responsive img-rounded"/>
                          </span>
                          <span className="blocking-span col-lg-12 attachedImagetitle">
                            <label title="Click here to zoom document" className="docLabel docLabelhover doclblalign" data-toggle="modal" data-target={'#'+index}>{element.DocumentType}</label>
                          </span>
                          <a title="Click here to download document" href={"/DocumentDownload/"+FlowRouter.getParam("id")+"/"+element.DocumentType+"/"+index}>
                            <i className="fa fa-download col-lg-12 doclblalign attachedImagetitle dwnldLabel" aria-hidden="true"></i>
                          </a>
                          <div id={index} className="modal fade" role="dialog">
                            <div className="modal-dialog">
                              <div className="modal-content documentModal">
                                <div className="modal-header">
                                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                                  {/*<h4 className="modal-title">Select Practice Test Papers</h4>*/}
                                </div>
                                <div className="modal-body">
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 modalbodyHeight">
                                    <img className="docImageView" src={element.ImgSource}/>
                                  </div>
                                </div>  
                                <div className="modal-footer">
                                </div>
                              </div>
                            </div>
                          </div>
                          
                        </div>

                         );
                      })
                    } 
                    </div>
                      :null
                      :null 

                    }
                    { Roles.userIsInRole(Meteor.userId(), ['Franchise','Admin','superAdmin'])?
                      link!="userInfo"?
                      
                        this.StudentImage1().length>0?
                        <div className="col-lg-12">
                        <label className="col-lg-12">Recently Attached Documents</label>
                        {this.getUploadServicesPercentage()}
                        {this.StudentImage1().map( (element,index)=>{
                          return(
                           <div className="listarraybox1 col-lg-2" key={index}>                            
                              <span className="blocking-span col-lg-10 attachedImagetitle">
                                 <img src={element.imagePath} className="commonLogo commonLogoicon displayLogo img-responsive img-rounded"/>
                                </span>
                                
                                <span className="blocking-span col-lg-12 attachedImagetitle">
                                  <label>{element.documentType}</label>
                                </span>
                                <div className="form-group col-lg-2 col-md-2 col-sm-2 col-xs-2" title="click here to remove image">
                                  <i onClick={this.removeLi.bind(this)} id={element._id} className="fa fa-times" aria-hidden="true"></i>
                                </div> 
                                                               
                              </div>
                            

                               );
                            })
                          } 
                        </div>
                        :null
                        :null
                      
                      :
                      this.StudentImage1().length>0?
                        <div className="col-lg-12">
                        <label className="col-lg-12">Recently Attached Documents</label>
                        {this.getUploadServicesPercentage()}
                        {this.StudentImage1().map( (element,index)=>{
                          return(
                           <div className="listarraybox1 col-lg-2" key={index}>

                              <span className="blocking-span col-lg-10 attachedImagetitle">
                                 <img src={element.imagePath} className="commonLogo commonLogoicon displayLogo img-responsive img-rounded"/>
                                </span>
                               
                                <span className="blocking-span col-lg-12 attachedImagetitle">
                                  <label>{element.documentType}</label>
                                </span>
                                <div className="form-group col-lg-2 col-md-2 col-sm-2 col-xs-2" title="click here to remove">
                                  <i onClick={this.removeLi.bind(this)} id={element._id} className="fa fa-times" aria-hidden="true"></i>
                                </div> 
                                 
                                                              
                            </div>
                            
                                     );
                            })
                          } 
                        </div>
                        :null

                      // :null
                    }
                    { Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin'])?
                      this.props.FranchiseDetailsData.verificationStatus=="Verified"?
                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                        <button className="col-lg-offset-5 col-lg-2 btn btn-success docVerifiedDisabled" title="Documents already verified">Documents Verified</button>
                      </div>
                      :
                      userRole=="Admin" || userRole=="superAdmin"?
                        null
                        :
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                        <button className="col-lg-offset-5 col-lg-2 btn btn-primary docVerified" onClick={this.documentsVerified.bind(this)} title="Click to verify documents">Verify Documents</button>
                      </div>
                      :
                      this.props.FranchiseDetailsData.verificationStatus=="Verified"?
                       <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                        <a href="/franchiseDashboard"><button className="col-lg-offset-5 col-lg-2 btn btn-primary docVerified" title="Click to go to dashboard">Dashboard</button></a>

                      </div>
                      :
                      null
                    }
        
              </div>
                       
           

            
            
            </div>
            
          </div>
    
        </div>

      </section>


      );
  }

 }

 

export default EditCompanyInformation = withTracker((props)=>{
    if(Roles.userIsInRole(Meteor.userId(), ['superAdmin','Admin'])){
      var curUrl = location.pathname;
      if(curUrl=='/admin/companyinfo'){
        var franchId         = Meteor.userId();
      }else{
        var franchId         = FlowRouter.getParam("id");
      }
    }else{
        var franchId         = Meteor.userId();
    } 
    const postHandle = Meteor.subscribe('LoginInFranchiseData',franchId);
    const loading    = !postHandle.ready();
    const FranchiseDetailsData = FranchiseDetails.findOne({"franchiseCodeForCompanyId":franchId})||{};
  
    return {
      FranchiseDetailsData
    };
})(CompanyInformation);
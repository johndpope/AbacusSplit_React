import React, {Component} from 'react';
import {render} from 'react-dom';
import {Session} from 'meteor/session';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';
import {ExamMaster} from '/imports/admin/forms/exam/api/examMaster.js';
import {NotificationMaster} from '/imports/admin/notification/apiNotificationMaster.js';
import CKEditor           from "react-ckeditor-component";
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css';
import  renderHTML from 'react-render-html';
import  { Quill, Mixin, Toolbar } from 'react-quill'; 

class NotificationList extends Component{

  constructor(){
    super();
      this.state = {
          competitionId       : FlowRouter.getParam('compId'),
          reciptdata          : "",
          facilityPermission  : 'waitingforResult',
          competitonFee       : '',

          subject         : '',
          content         : '',
          status          : '',
          notifid         : '',
      }
      this.handleChange = this.handleChange.bind(this);
  }


  'deletenotification'(event){
    event.preventDefault();
    // var uid = event.target.id;
    var id = event.currentTarget.id;

    swal({
        title              : 'Are you sure,Do you want to Delete?',
        text               : 'You will not be able to recover this Record!',
        type               : 'warning',
        showCancelButton   : true,
        confirmButtonColor : '#dd6b55',
        cancelButtonColor  : '#d44',
        confirmButtonText  : 'Yes, Delete it!',
        cancelButtonText   : 'No, Keep it',
        closeOnConfirm     : false
      }, function() {
        Meteor.call("Deletenotification",id,(error,result)=>{
          if(error){

          }else{
            swal(
              'Deleted Successfully',
              '',
              'success'
            );
        }
      });
        
      });
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

  showprofile(e){
    e.preventDefault();
    FlowRouter.go('/editnotification/'+e.currentTarget.id);
  }

  handleChange(event){
    const target = event.target;
    const name   = target.name;
    this.setState({
      [name]: event.target.value,
    });
  }

  updateNotification(props){
    var Notisid          = this.state.notifid; 
    var subject          = this.state.subject;
    var cketext          = this.state.content;
    // var cketext          = result;      
      Meteor.call('updateNotificationtemp',Notisid,subject,cketext,function(error,result){
            if(error){
              console.log(error.reason);
            }else{
              swal({
                    title: 'Update Successfully',
                    text: "",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#666',
                    confirmButtonText: 'Ok'});
                  $('.modalHide').modal('hide'); 
            }
          }); 

  }
  editnotetemp(event){
    event.preventDefault();
    var id = event.currentTarget.id;
    // console.log("id==",id);
    $('#showupdate-'+id).modal('show');

    var noteid =  NotificationMaster.findOne({"_id":id}); 
    if(noteid){
      this.setState({
        subject : noteid.subject,
        content : noteid.content,
        notifid : noteid._id,
      })
    }
  }

  // updateContent(newContent) {
  //       this.setState({
  //           content: newContent
  //       })
  //   }
    // onChange(evt){
     
    //   var newContent = evt.editor.getData();      
     
    //   result = newContent;     
    // }
    broadcast(e){
      var _id = $(e.currentTarget).attr('id');
      var status = $(e.currentTarget).attr('value');  
        Meteor.call("updateNoticeStatus",_id,status,function(err,result){
          if(err){
             console.log(err.reason);
          }else{
               swal({
                    title: 'Notice updated Successfully',
                    text: "",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#666',
                    confirmButtonText: 'Ok'});           
              
            }

            }); 
        }

    // broadcastcancel(){}
     quillText(e){
      this.setState({
        content:e
      })      
    }

  render(){
    return(
      <div>
        <div className="content-wrapper">
          <section className="content-header">
            <h1> Notification List</h1>
          </section>
          <section className="content viewContent">
            <div className="row">
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                  <div className="box">
                  <div className="box-header with-border boxMinHeight">
                    <section className="NotificationContent">
                      <div className="box-body">
                        <div className="col-lg-12">
                          <section className="NotificationContent">
                            <div className="box-body">
                              {this.props.Notificationlist.length>0?
                                this.props.Notificationlist.map((notemsg,index)=>{  
                                    var textcontent = renderHTML(notemsg.content);                                  
                                    // var regex = new RegExp(/(<([^>]+)>)/ig);
                                    // var textcontent = notemsg.content.replace(regex, '');
                                    //  textcontent   = textcontent.replace(/\&nbsp;/g, '');
                                  return(<div className="col-lg-8 col-lg-offset-2 col-sm-12 col-xs-12 col-md-8 col-md-offset-2 borderdetails " key={index}>                                        
                                               <div className="liheader1 dropdown col-lg-1 col-md-1 col-sm-1 col-xs-1 pull-right">
                                                    <i className="fa fa-ellipsis-v dropbtn" aria-hidden="true"></i>
                                                    <div className="dropdown-content  drpdwnpd">                                                  
                                                      <ul className="pdcls ulbtm">                                                     
                                                         <li>
                                                          <div className=" resetIcon col-lg-12 col-md-12 "  data-toggle="modal" id={notemsg._id} onClick={this.editnotetemp.bind(this)} >
                                                              <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6 iconUM">
                                                                <i className="fa fa-pencil" aria-hidden="true" title="Edit Profile" ></i>
                                                              </div>
                                                              <div className="aligntxtUM Notificationhover">
                                                                Edit Notification
                                                              </div>
                                                            </div>
                                                          </li>
                                                          <li>
                                                          <div className=" resetIcon col-lg-12 col-md-12"  id={notemsg._id}onClick={this.deletenotification.bind(this)} >
                                                            <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6 iconUM">
                                                                <i className="fa fa-trash" aria-hidden="true" title="Delete" ></i>
                                                                  </div>
                                                              <div className="aligntxtUM Notificationhover">                                                            
                                                                Delete Notification
                                                              </div>
                                                          </div>                                        
                                                          </li>
                                                        </ul>
                                                    </div>
                                                  </div>
                                          <div className="col-lg-12 col-md-12 col-sm-12 notificationmsg">Notification Message</div>                                         
                                              <div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 payrecreg ">
                                                <div className="col-lg-12 col-md-12 col-sm-6 payrecreg">
                                                  <div className="col-lg-4 col-md-6 col-sm-6 notesnsub"><h4>Subject :</h4></div>                                  
                                                  <div className="col-lg-6 col-md-6 col-sm-6 notesnsub"><h4>{notemsg.subject}</h4></div>                                  
                                                  <div className="col-lg-4 col-md-6 col-sm-6 notesnsub"><h4>Message : </h4></div>                                  
                                                  <div className="col-lg-6 col-md-6 col-sm-6 notesnsub "><h4 className="notificationWrap">{textcontent}</h4></div>                                  
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-6 ">
                                                  {
                                                    notemsg.status=="cancel" ?                                                   
                                                    <button type="submit"  className="btn btn-success pull-right col-lg-2 col-md-3 col-sm-6 col-xs-12 btnbroadcaststatus" id={notemsg._id} value="Broadcast" title="Click to broadcast notice" onClick={this.broadcast.bind(this)}>Broadcast</button> 
                                                 :
                                                    <button type="submit"  className="btn btn-primary pull-right col-lg-2 col-md-3 col-sm-6 col-xs-12 btnbroadcaststatus" id={notemsg._id} value="cancel" title="Click to cancel notice" onClick={this.broadcast.bind(this)}>Cancel</button>
                                                  }
                                                </div> 
                                            </div> 
                                            <div className="modal fade modalHide" id={"showupdate-"+notemsg._id} role="dialog">
                                              <div className="modal-dialog modal-lg" role="document">
                                                <div className="modal-content modalContent col-lg-12">
                                                    <div className="modal-header notifyHeader ">
                                                      <h4 className="" id="exampleModalLabel">Edit Template</h4>
                                                      <button type="button" className="close modalCloseBtn" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                      </button>
                                                    </div>

                                                  <div className="modal-body">
                                                      <form className="newTemplateForm" >
                                                     
                                                    <div className="">
                                                      <div className="">
                                                       
                                                        <div className="form-group nopad">
                                                       <label className="">Subject<span className="astrick">*</span>:</label>                 
                                                            <input type="text" ref="subject" name="subject" value={this.state.subject} onChange={this.handleChange} className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" required />
                                                      </div>   
                                                      </div>
                                                    </div>
                                                    <div className="row rowPadding">
                                                      <div className="">
                                                        <div className="form-group">
                                                         <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Message<span className="astrick">*</span>:</label> 
                                                         <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">  
                                                           {/* <CKEditor activeClass="p15" id="editor" className="templateName" content={this.state.content} events={{"change": this.onChange}} required />*/}
                                                           <ReactQuill modules={App} formats={AppFormat} value={this.state.content} onChange={this.quillText.bind(this)} />
                                                         </div>             
                                                        </div>  
                                                      </div>
                                                    </div>
                                                  </form>
                                                    </div>
                                                  <div className="modal-footer paddingtop-down">
                                                      <button type="submit"  className="btn pull-right col-lg-3 col-md-3 col-sm-6 col-xs-12 btnUpdate updateBTNModal"  onClick={this.updateNotification.bind(this)}>Update Template</button>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div> 
                                        ) 
                                      })
                                   :       
                                    <div className="box-header with-border boxMinHeight  studDataNotExist">
                                      <div className="startExambox col-lg-offset-2 col-lg-8 col-md-offset-2 col-md-8 col-sm-offset-1 col-sm-10 col-xs-12">
                                        <div className="fontstyle">Notifications not added yet...</div> 
                                      </div>
                                    </div>
                              }
                            </div>
                        </section>
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
    )
  }
}

var App={
  toolbar:[
    [{"header":'1'},{"header":'2'},{"font":[]},{ 'color': [] }, { 'background': [] }],
    [{"size":[]}],
    ['bold','italic','underline','strike','blockquote'],
    [{'list':'ordered'},{"list":'bullet'}],
    ["link"
    // ,"image","video"
    ],
    ["clean"],
  ]
};

var AppFormat=[
  'header','color','font','background','size','bold','italic','underline','strike','blockquote','list','bullet','link',
  // 'image','video',
  'code-block'
]

export default NotificationList = withTracker(props=>{

const postHandle1             = Meteor.subscribe('NotificationMaster');
const loading1                = !postHandle1.ready();
const Notificationlist        = NotificationMaster.find({}).fetch();
const postHandle = Meteor.subscribe('NotificationMasternotes');
const loading    = !postHandle.ready();
const post       = NotificationMaster.find({}).fetch(); 

return{
  Notificationlist,
  loading1,
  post,
  }
})(NotificationList);
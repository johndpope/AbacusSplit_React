/*  
	COMPONENT:  Add CATEGORY 
	PROGRAMMER: VIKAS JAGDALE 
	
	This component will add Vender using csv file accor. 

*/
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import React, {Component} from 'react';
import {render} from 'react-dom';
import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Session } from 'meteor/session'; 

class UploadCSVChild extends TrackerReact(Component)  {
	constructor(props) {
        super(props);
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

	uploadCSVQuestion(event){
        event.preventDefault();
        
        // UserSession.delete("allProgressbarSession", Meteor.userId());
        UserSession.delete("progressbarSession", Meteor.userId());
        
        Papa.parse( event.target.files[0], {
		    header: true,
		    complete( results, file ) {
		    	Meteor.call( 'BulkQuestionCSVUpload', results.data, ( error, result ) => {
                	if ( error ){
                        //Some code
         			} else {
                       console.log('in results');
                            swal({
                                position: 'top-right',
                                type: 'success',
                                title: 'Questions Added Successfully',
                                showConfirmButton: false,
                                timer: 1500
                            });
    
                            $(".adminBlkUpldBkg").val('');
                            setTimeout(()=>{ 
                                
                                // UserSession.delete("allProgressbarSession", Meteor.userId());
                                UserSession.delete("progressbarSession", Meteor.userId());
                            }, 8000);
                        
                       
         			}
      			});

		    }
        });


    }


  	 showProgressBar(){
        var getPercernt = this.props.getPercernt;
        var allPercernt = this.props.allPercernt;
        if(getPercernt){
           
            var total = parseInt(this.props.total);
            console.log('total: ',total);
            var styleC = {
                width:total + "%",
                display:"block",
            }
            var styleCBar = {
                display:"block",
            }
        }
        if(!getPercernt){

        	// console.log('not getPercernt');
            var total = 0;

            var styleC = {
                width:0 + "%",
                display:"none",
            }
            var styleCBar = {
                display:"none",
            }
        }
        return (
            <div>
                <div className="progress"  style= {styleCBar}>
                    <div className="progress-bar progress-bar-striped active" role="progressbar"
                    aria-valuenow="40"  style= {styleC}>
                        {total} %
                    </div>
                </div>
            </div>

        );

    }

	render(){
		return(
			<div>
		        {/* Content Wrapper. Contains page content */}
		        <div className="content-wrapper">
		          {/* Content Header (Page header) */}
		          <section className="content-header">
		            <h1>Master Data</h1>
		          </section>
		          {/* Main content */}
		          <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		                  <div className="box-header with-border boxMinHeight">
		                  	<div className="box-header with-border">

				            <h3 className="box-title">Upload Questions</h3>
				            </div>
							<div className="col-lg-10 col-lg-offset-1 col-md-8 col-md-offset-2 col-sm-12 col-xs-12 questionFormWrap">
								<div className="col-lg-12 col-md-12 csvDLWrap">
									
									<div className="bulkuploadInstruction ">
										<div className="col-lg-10 col-lg-offset-2 col-md-12 col-md-offset-2 markksWrap"><h4>Instructions  </h4></div>
										<div className="bulkuploadIns col-lg-2">
											<a href="/images/uploadBulkQuestions.csv" download>
												<img src="images/csv.jpg" className="img-responsive" title="Click to download file"/>
											</a>
										</div>
										<ul className="uploadQuesinst">
											<li><b>1)</b> Please use attached file format to bulkupload <b>Questions</b> into this system.</li>
											<li><b>2)</b> Please do not change the format of following file.</li>
											<li><b>3)</b> File Format must be *.CSV.</li>
											<li><b>4)</b> Following is the  format of .CSV file.</li>
											
										</ul>
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 categoryTable1">
					              		<table className="table table-striped">
										    <thead className="tableHeader csvuploadTab">
										        <tr>
										           
										            <th className="col-lg-3">Category Name </th>
										            <th className="col-lg-1"> Question</th>
										            <th className="col-lg-1"> A </th>
										            <th className="col-lg-1"> B </th>
										            <th className="col-lg-1"> C </th>
										            <th className="col-lg-1"> D </th>
										            <th className="col-lg-3"> Correct Answer </th>
										        </tr>
										    </thead>
										    <tbody className="csvuploadTab">
										    	<tr>
									    			<td>A</td>
									    			<td>1+1+1+1</td>
									    			<td>4</td>
									    			<td>3</td>
									    			<td>5</td>
									    			<td>6</td>
									    			<td>A</td>
										    	</tr>
										    </tbody>
										</table>
									</div>
								</div>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<span className="fieldTitle">Upload Questions</span>
									<input type="file" name="uploadCSV" ref="uploadCSV" onChange={this.uploadCSVQuestion.bind(this)} accept=".csv" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" required/>
									
									<div className="col-lg-12">
	                                    {this.showProgressBar()}
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
	}
}


export default UploadCSV = withTracker(props=>{

    var getPercernt = UserSession.get("progressbarSession",Meteor.userId());
    var allPercernt = UserSession.get("allProgressbarSession",Meteor.userId());
    var total = (getPercernt/allPercernt)*100;

    console.log('getPercernt: ',getPercernt);
    console.log('allPercernt: ',allPercernt);

    return {
    	'getPercernt' : getPercernt,
    	'allPercernt' : allPercernt,
    	'total' : total,
    };

})(UploadCSVChild);
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
// import Validation from 'react-validation';
// import validator from 'validator';


// Object.assign(Validation.rules, {    
// 	required: {     

// 		rule: value => {       
// 		 if(value) {return value.toString().trim();   }
// 		 else{return 'hello'}     
// 		},

// 	 hint: value => {           
// 	  return (<span className='form-error is-visible'>Required</span> )      
// 	  }  


// 	 },   

// 	 alpha: {        
// 	 	rule: value => validator.isAlpha(value),       
// 	 	 hint: () =>{ return(          
// 	 	   <span className="form-error is-visible">                
// 	 	      String should contain only letters (a-zA-Z).           
// 	 	   </span>       
// 	 	   )}

// 	 	},   
// 	 	 api: {       
// 	//  	  hint: value => (           
// 	//  	   <button  className="form-error is-visible">            
// 	//  	       API Error on "{value}" value. Focus to hide.           
// 	//  	   </button>       
// 	//  	 )
// 	 }
// }
// );

export default class UMaddRoles extends TrackerReact(Component) {

	addRole(event){  
	event.preventDefault();     
	 var roleName   = $("input[name=roleName]").val();     
	  Meteor.call('addrole', roleName, function(error, result) {                    
	   if (error) {                        
	   console.log ( error );                    
	    }                     
              
	      }        
	      );      
	  $("input[name=roleName]").val('');	

	}


	// render(){    
	// 		 return(
	// 		<Validation.components.Form id="addrolesToList" ref={c => { this.form = c }} onSubmit={this.addRole} className="col-lg-6 col-lg-offset-3 col-md-12 col-sm-12 col-xs-12 paddingLeftz">
	// 			<div className="form-group col-lg-8 col-md-4 col-xs-7 col-sm-12 paddingLeftz noLRPad">
	// 				<label>Role Name*</label>
	// 				<Validation.components.Input value='' errorClassName='is-invalid-input' type="text" name="roleName" className="form-control rolesField" validations={['required','alpha']}/>
	// 			</div>
	// 			<div className="form-group col-lg-4 col-md-4 col-xs-5 col-sm-12 ">
	// 				<label className="noLabel">Button</label>
	// 				<Validation.components.Button className="btn btn-primary submit addrolesBtn">ADD ROLE</Validation.components.Button>
	// 			</div>
	// 		</Validation.components.Form>   
	// 		 );

	// } 

	render(){    
		return(
			<form id="addrolesToList" onSubmit={this.addRole} className="col-lg-6 col-lg-offset-3 col-md-12 col-sm-12 col-xs-12 paddingLeftz">
				<div className="form-group col-lg-8 col-md-4 col-xs-7 col-sm-12 paddingLeftz noLRPad">
					<label>Role Name*</label>
					<input type="text" name="roleName" className="form-control rolesField" required/>
				</div>
				<div className="form-group col-lg-4 col-md-4 col-xs-5 col-sm-12 ">
					<input type="submit" value="ADD ROLE" className="btn btn-primary submit addrolesBtn"/>
				</div>
			</form>   
		 );
	 }
	}


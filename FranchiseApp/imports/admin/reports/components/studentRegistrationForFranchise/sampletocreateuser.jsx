Meteor.call('userCreateAccountByAdmin', studFormValues ,(error,result) => {
  if(error){
    swal("Email Id already exist","","warning");
  }else{ 
  	var newID = result;
    Meteor.call('addRoles', newID , "Student", function(error,result){
      if(error){
        swal(error);
      }else{              	
		swal('Congratulations!! Account Created...',"","success");
      }
    });
  	// console.log(result);
   
  } 
});
	  		
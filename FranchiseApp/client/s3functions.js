import {ProductImage} from '/imports/s3/ProductImage.js';


/*--------------------- Image add to s3 ---------------------*/

addStudentProfileImage = function(file,self) {
    if(file.size<=716800){
        uploadInstance = ProductImage.insert({
          file: file,
          meta: {
            locator : self.props.fileLocator,
            userId  : Meteor.userId() // Optional, used to check on server for file tampering
          },
          streams         : 'dynamic',
          chunkSize       : 'dynamic',
          allowWebWorkers : true // If you see issues with uploads, change this to false
        }, false);

        self.setState({
            uploading  : uploadInstance, // Keep track of this instance to use below
            inProgress : true // Show the progress bar now
        });
        // These are the event functions, don't need most of them, it shows where we are in the process
        uploadInstance.on('start', function () {
        });

        uploadInstance.on('end', function (error, fileObj) {
        });

        uploadInstance.on('uploaded',  (error, fileObj) => {
            if(fileObj){
                Meteor.call("addProductImages",fileObj._id,(error,result)=>{
                    if(error){
                        console.log(error);
                        console.log(error.reason);
                    }else{
                        // console.log("my result=> " +result);
                        // Meteor.call("uploadFromDashboard");
                    }
                });

                // Session.set("addNewProductImage",)
            }

            self.setState({
                uploading  : [],
                progress   : 0,
                inProgress : false
            });
        });

        uploadInstance.on('error', function (error, fileObj) {
        });

        uploadInstance.on('progress', function (progress, fileObj) {
            Session.set('imageprogress',progress);
            self.setState({
                progress : progress
            })
        });

        uploadInstance.start(); // Must manually start the uploaded
    }else{

        swal("Please upload image, with size equal or less than 700 kb","","warning");
    }

}

addProductImgsToS3Function = function(file,self) {
    if(file.size<=716800){
        uploadInstance = ProductImage.insert({
          file: file,
          meta: {
            locator : self.props.fileLocator,
            userId  : Meteor.userId() // Optional, used to check on server for file tampering
          },
          streams         : 'dynamic',
          chunkSize       : 'dynamic',
          allowWebWorkers : true // If you see issues with uploads, change this to false
        }, false);

        self.setState({
            uploading  : uploadInstance, // Keep track of this instance to use below
            inProgress : true // Show the progress bar now
        });

        // These are the event functions, don't need most of them, it shows where we are in the process
        uploadInstance.on('start', function () {
        });

        uploadInstance.on('end', function (error, fileObj) {
        });

        uploadInstance.on('uploaded',  (error, fileObj) => {
            if(fileObj){
                Meteor.call("addProductImages",fileObj._id,(error,result)=>{
                	if(error){
                        console.log(error);
                		console.log(error.reason);
                	}else{
                		// console.log("my result=> " +result);
                        // Meteor.call("uploadFromDashboard");
                	}
                });

                // Session.set("addNewProductImage",)
            }

            self.setState({
                uploading  : [],
                progress   : 0,
                inProgress : false
            });
        });

        uploadInstance.on('error', function (error, fileObj) {
        });

        uploadInstance.on('progress', function (progress, fileObj) {
            Session.set('imageprogress',progress);
            self.setState({
                progress : progress
            })
        });

        uploadInstance.start(); // Must manually start the uploaded
    }else{

        swal("Please upload image, with size equal or less than 700 kb","","warning");
    }

}
addStudentImgsToS3Function = function(file,self) {
    if(file.size<=716800){
        uploadInstance = ProductImage.insert({
          file: file,
          meta: {
            locator : self.props.fileLocator,
            userId  : Meteor.userId() // Optional, used to check on server for file tampering
          },
          streams         : 'dynamic',
          chunkSize       : 'dynamic',
          allowWebWorkers : true // If you see issues with uploads, change this to false
        }, false);

        self.setState({
            uploading  : uploadInstance, // Keep track of this instance to use below
            inProgress : true // Show the progress bar now
        });

        // These are the event functions, don't need most of them, it shows where we are in the process
        uploadInstance.on('start', function () {
        });

        uploadInstance.on('end', function (error, fileObj) {
        });

        uploadInstance.on('uploaded',  (error, fileObj) => {
            if(fileObj){
                Meteor.call("addProductImages",fileObj._id,(error,result)=>{
                    if(error){
                        console.log(error);
                        console.log(error.reason);
                    }else{
                        // console.log("my result=> " +result);
                        Meteor.call("uploadFromDashboard");
                    }
                });

                // Session.set("addNewProductImage",)
            }

            self.setState({
                uploading  : [],
                progress   : 0,
                inProgress : false
            });
        });

        uploadInstance.on('error', function (error, fileObj) {
        });

        uploadInstance.on('progress', function (progress, fileObj) {
            Session.set('imageprogresss',progress);
            self.setState({
                progress : progress
            })
        });

        uploadInstance.start(); // Must manually start the uploaded
    }else{

        swal("Please upload image, with size equal or less than 700 kb","","warning");
    }

}


addImgsToS3Function = function(id,file,self) {
    var userID = id;
    uploadInstance = ProductImage.insert({
      file: file,
      meta: {
        locator : self.props.fileLocator,
        userId  : Meteor.userId() // Optional, used to check on server for file tampering
      },
      streams         : 'dynamic',
      chunkSize       : 'dynamic',
      allowWebWorkers : true // If you see issues with uploads, change this to false
    }, false);

    self.setState({
        uploading  : uploadInstance, // Keep track of this instance to use below
        inProgress : true // Show the progress bar now
    });

    // These are the event functions, don't need most of them, it shows where we are in the process
    uploadInstance.on('start', function () {
    });

    uploadInstance.on('end', function (error, fileObj) {
    });

    uploadInstance.on('uploaded',  (error, fileObj) => {
        if(fileObj){
            Meteor.call("addProductImages",fileObj._id,(error,result)=>{
                if(error){
                    console.log(error);
                    console.log(error.reason);
                }else{
                   if(!userID){
                    Meteor.call('uploadUserProfile',fileObj._id, function(error,result){
                        if(error){
                          console.log("error"+error);
                        }else{
                            $('#imgUploadModal').modal('hide');
                            swal('Profile pic uploaded successfully!');
                        }
                    }); 

                    //Remove the filename from the upload box
                    self.refs['myDP'].value = '';                   
                    }else{
                        Meteor.call('uploadUserProfileByAdmin',fileObj._id, userID, function(error,result){
                            if(error){
                              console.log("error"+error);
                            }else{
                                $('#imgUploadModal').modal('hide');
                                swal('Profile pic uploaded successfully!');
                            }
                        }); 

                       // Remove the filename from the upload box
                        self.refs['userPic'].value = '';                    
                    }
                }
            });

            // Session.set("addNewProductImage",)
        }

        self.setState({
            uploading  : [],
            progress   : 0,
            inProgress : false
        });
    });

    uploadInstance.on('error', function (error, fileObj) {
    });

    uploadInstance.on('progress', function (progress, fileObj) {
        Session.set('imageprogress',progress);
        self.setState({
            progress : progress
        })
    });

    uploadInstance.start(); // Must manually start the uploaded
    
    
}

addProductDocumentImgsToS3Function = function(file,self,documentType) {
    if(file.size<=716800){
    uploadInstance = ProductImage.insert({
      file: file,
      meta: {
        locator : self.props.fileLocator,
        userId  : Meteor.userId() // Optional, used to check on server for file tampering
      },
      streams         : 'dynamic',
      chunkSize       : 'dynamic',
      allowWebWorkers : true // If you see issues with uploads, change this to false
    }, false);

    self.setState({
        uploading  : uploadInstance, // Keep track of this instance to use below
        inProgress : true // Show the progress bar now
    });

    // These are the event functions, don't need most of them, it shows where we are in the process
    uploadInstance.on('start', function () {
    });

    uploadInstance.on('end', function (error, fileObj) {
    });

    uploadInstance.on('uploaded',  (error, fileObj) => {
        if(fileObj){
            Meteor.call("addProductDocumentImages",fileObj._id,documentType,(error,result)=>{
                if(error){
                    console.log(error);
                    console.log(error.reason);
                }else{
                    // console.log("my result=> " +result);
                    // Meteor.call("uploadFromDashboard");
                }
            });

            // Session.set("addNewProductImage",)
        }

        self.setState({
            uploading  : [],
            progress   : 0,
            inProgress : false
        });
    });

    uploadInstance.on('error', function (error, fileObj) {
    });

    uploadInstance.on('progress', function (progress, fileObj) {
        Session.set('imageprogress',progress);
        self.setState({
            progress : progress
        })
    });

    uploadInstance.start(); // Must manually start the uploaded
}else{
        swal("Please upload image, with size equal or less than 700 kb","","warning");
    }
}


addImageForNetspeed = function(file,self) {
    
        uploadInstance = ProductImage.insert({
          file: file,
          meta: {
            locator : self.props.fileLocator,
            userId  : Meteor.userId() // Optional, used to check on server for file tampering
          },
          streams         : 'dynamic',
          chunkSize       : 'dynamic',
          allowWebWorkers : true // If you see issues with uploads, change this to false
        }, false);

        self.setState({
            uploading  : uploadInstance, // Keep track of this instance to use below
            inProgress : true // Show the progress bar now
        });
        // These are the event functions, don't need most of them, it shows where we are in the process
        uploadInstance.on('start', function () {
        });

        uploadInstance.on('end', function (error, fileObj) {
        });

        uploadInstance.on('uploaded',  (error, fileObj) => {
            if(fileObj){
                Meteor.call("addProductImagesNetSpeed",fileObj._id,(error,result)=>{
                    if(error){
                        console.log(error);
                        console.log(error.reason);
                    }else{
                       
                    }
                });                
            }

            self.setState({
                uploading  : [],
                progress   : 0,
                inProgress : false
            });
        });

        uploadInstance.on('error', function (error, fileObj) {
        });

        uploadInstance.on('progress', function (progress, fileObj) {
            Session.set('imageprogress',progress);
            self.setState({
                progress : progress
            })
        });

        uploadInstance.start(); // Must manually start the uploaded
    

}


addStudentExamAppearingImgsToS3Function = function(file,documentType) {
   // console.log("self",self);
   console.log("file",file);
   console.log("documentType",documentType);
   
    uploadInstance = ProductImage.insert({
      file: file,
      meta: {       
        // locator : self.props.fileLocator,
        userId  : Meteor.userId() // Optional, used to check on server for file tampering
      },
      streams         : 'dynamic',
      chunkSize       : 'dynamic',
      allowWebWorkers : true // If you see issues with uploads, change this to false
    }, false);

    // self.setState({
    //     uploading  : uploadInstance, // Keep track of this instance to use below
    //     inProgress : true // Show the progress bar now
    // });

    // These are the event functions, don't need most of them, it shows where we are in the process
    uploadInstance.on('start', function () {
    });

    uploadInstance.on('end', function (error, fileObj) {
    });

    uploadInstance.on('uploaded',  (error, fileObj) => {
        if(fileObj){
        // console.log("fileObj",fileObj);            
            Meteor.call("addStusentExamAppearingImages",fileObj._id,documentType,(error,result)=>{
                if(error){
                    console.log("err",error);
                    console.log("errr1",error.reason);
                }else{
                    // console.log("my result=> " +result);
                    // Meteor.call("uploadFromDashboard");
                }
            });

            // Session.set("addNewProductImage",)
        }

        // self.setState({
        //     uploading  : [],
        //     progress   : 0,
        //     inProgress : false
        // });
    });

    uploadInstance.on('error', function (error, fileObj) {
    });

    uploadInstance.on('progress', function (progress, fileObj) {
        Session.set('imageprogress',progress);
        // self.setState({
        //     progress : progress
        // })
    });

    uploadInstance.start(); // Must manually start the uploaded

}



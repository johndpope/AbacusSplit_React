// import { Meteor } from 'meteor/meteor';
// import { FilesCollection } from 'meteor/ostrio:files';

// export const LogoFiles = new FilesCollection({
// 	collectionName : 'LogoFiles',
// 	allowClientCode : false,
// 	chunkSize : 1024 * 1024,
// });


import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const LogoFiles = new FilesCollection({
    collectionName: 'LogoFiles',
    allowClientCode: false,
    chunkSize: 1024 * 1024
});
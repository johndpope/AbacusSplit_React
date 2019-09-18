import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const UserImage = new FilesCollection({
    collectionName: 'UserImage',
    allowClientCode: false,
    chunkSize: 1024 * 1024
});


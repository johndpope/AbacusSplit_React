import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const BlogImage = new FilesCollection({
    collectionName: 'BlogImage',
    allowClientCode: false,
    chunkSize: 1024 * 1024
});


import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const ServiceImage = new FilesCollection({
    collectionName: 'ServiceImage',
    allowClientCode: false,
    chunkSize: 1024 * 1024
});

  
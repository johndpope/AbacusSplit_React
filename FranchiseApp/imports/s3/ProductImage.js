import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const ProductImage = new FilesCollection({
    collectionName: 'ProductImage',
    allowClientCode: false,
    chunkSize: 1024 * 1024
});

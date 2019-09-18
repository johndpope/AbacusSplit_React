import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const ProofDocuments = new FilesCollection({
    collectionName: 'ProofDocuments',
    allowClientCode: false,
    chunkSize: 1024 * 1024
});


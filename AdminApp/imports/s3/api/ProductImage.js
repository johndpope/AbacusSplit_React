import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Random } from 'meteor/random';
import { FilesCollection } from 'meteor/ostrio:files';
import stream from 'stream';
import { Session } from 'meteor/session';

import S3 from 'aws-sdk/clients/s3'; // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
// See fs-extra and graceful-fs NPM packages
// For better i/o performance
import fs from 'fs';

import { ProjectSettings } from './projectSettings.js';



var s3Data = ProjectSettings.findOne({"_id":"1"});
if(s3Data){
    process.env.S3='{"s3":{"key": "'+ s3Data.key+'", "secret": "'+ s3Data.secret+'", "bucket": "'+ s3Data.bucket +'", "region": "'+s3Data.region+'"}}' ;
    

    if (process.env.S3) {
        Meteor.settings.s3 = JSON.parse(process.env.S3).s3;
        const s3Conf = Meteor.settings.s3 || {};
        const bound  = Meteor.bindEnvironment((callback) => {
            return callback();
        });

        if (s3Conf && s3Conf.key && s3Conf.secret && s3Conf.bucket && s3Conf.region) {
            const s3 = new S3({
                secretAccessKey     : s3Conf.secret,
                accessKeyId         : s3Conf.key,
                region              : s3Conf.region,
                httpOptions: {
                    timeout : 60000,
                    agent   : false
                }
            });

            export const ProductImage = new FilesCollection({
                debug          : false, // Change to `true` for debugging
                storagePath    : 'ProductImage',
                collectionName : 'ProductImage',
                allowClientCode: false,
                chunkSize      : 1024 * 1024,

                onAfterUpload(fileRef) {
                   
                    _.each(fileRef.versions, (vRef, version) => {
                       
                        const filePath = 'ProductImage/' + fileRef._id +'.' + fileRef.extension;
                        s3.putObject({
                            StorageClass : 'STANDARD',
                            Bucket       : s3Conf.bucket,         //s3Conf.bucket,
                            Key          : filePath,
                            Body         : fs.createReadStream(vRef.path),
                            ContentType  : vRef.type,
                        }, (error) => {
                            bound(() => {
                                if (error) {
                                    console.error(error);
                                } else {
                                    const upd = { $set: {} };
                                    upd['$set']['versions.' + version + '.meta.pipePath'] = filePath;

                                    this.collection.update({
                                        _id: fileRef._id
                                    }, upd, (updError) => {
                                        if (updError) {
                                            console.error(updError);
                                        } else {
                                            this.unlink(this.collection.findOne(fileRef._id), version);
                                        }
                                    });
                                }
                            });
                        });
                    });
                },

                interceptDownload(http, fileRef, version) {
                    let path;

                    if (fileRef && fileRef.versions && fileRef.versions[version] && fileRef.versions[version].meta && fileRef.versions[version].meta.pipePath) {
                        path = fileRef.versions[version].meta.pipePath;
                    }

                    if (path) {
                        const opts = {
                            Bucket: s3Conf.bucket,
                            Key   : path
                        };

                        if (http.request.headers.range) {
                            const vRef  = fileRef.versions[version];
                            let range   = _.clone(http.request.headers.range);
                            const array = range.split(/bytes=([0-9]*)-([0-9]*)/);
                            const start = parseInt(array[1]);
                            let end = parseInt(array[2]);
                            if (isNaN(end)) {
                                end = (start + this.chunkSize) - 1;
                                if (end >= vRef.size) {
                                    end = vRef.size - 1;
                                }
                            }
                            opts.Range = `bytes=${start}-${end}`;
                            http.request.headers.range = `bytes=${start}-${end}`;
                        }

                        const fileColl = this;
                        s3.getObject(opts, function(error) {
                            if (error) {
                                console.error(error);
                                if (!http.response.finished) {
                                    http.response.end();
                                }
                            } else {
                                if (http.request.headers.range && this.httpResponse.headers['content-range']) {
                                    http.request.headers.range = this.httpResponse.headers['content-range'].split('/')[0].replace('bytes ', 'bytes=');
                                }

                                const dataStream = new stream.PassThrough();
                                fileColl.serve(http, fileRef, fileRef.versions[version], version, dataStream);
                                dataStream.end(this.data.Body);
                            }
                        });

                        return true;
                    }
                    return false;
                }
            });

            // Intercept FilesCollection's remove method to remove file from AWS:S3
            const _origRemove = ProductImage.remove;
            ProductImage.remove = function(search) {
                const cursor = this.collection.find(search);
                cursor.forEach((fileRef) => {
                    _.each(fileRef.versions, (vRef) => {
                        if (vRef && vRef.meta && vRef.meta.pipePath) {
                            // Remove the object from AWS:S3 first, then we will call the original FilesCollection remove
                            s3.deleteObject({
                                Bucket: s3Conf.bucket,
                                Key: vRef.meta.pipePath,
                            }, (error) => {
                                bound(() => {
                                    if (error) {
                                        console.error(error);
                                    }
                                });
                            });
                        }
                    });
                });

                //remove original file from database
                _origRemove.call(this, search);
            };
        } else {
            throw new Meteor.Error(401, 'Missing Meteor file settings');
        }
    }
}

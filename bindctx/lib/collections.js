import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';

export const Users = Meteor.users;
export const Posts = new Mongo.Collection('posts');
export const Comments = new Mongo.Collection('comments');

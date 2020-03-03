import * as Collections from '/lib/collections';
import {Meteor} from 'meteor/meteor';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {ReactiveDict} from 'meteor/reactive-dict';
import {Tracker} from 'meteor/tracker';

export default function (context) {
  return {
    Meteor,
    FlowRouter,
    Tracker,
    Collections,
    LocalState: new ReactiveDict(),
    ...context,
  };
}

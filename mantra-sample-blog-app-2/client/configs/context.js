import * as Collections from '/lib/collections';
import {Meteor} from 'meteor/meteor';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {ReactiveDict} from 'meteor/reactive-dict';
import {Tracker} from 'meteor/tracker';


export default function () {
  const lastAccount = JSON.parse(localStorage.getItem('lastAccount'))
  const accounts = JSON.parse(localStorage.getItem('accounts'))
  const LocalState = new ReactiveDict({ accounts, lastAccount })

  window.addEventListener('storage', () => {
    console.log(JSON.parse(window.localStorage.getItem('accounts')));
  })

  return {
    Meteor,
    FlowRouter,
    Collections,
    LocalState,
    Tracker
  };
}

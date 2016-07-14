"use strict";
const RtmClient = require('@slack/client').RtmClient;
const MemoryDataStore = require('@slack/client').MemoryDataStore;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const isPhone = require('is-phone');
const token = process.env.SLACK_TOKEN || '';

const rtm = new RtmClient(token, {
  logLevel: 'error',
  // logLevel: 'debug',
  // Initialise a data store for our client, this will load additional helper functions for the storing and retrieval of data
  dataStore: new MemoryDataStore(),
  // Boolean indicating whether Slack should automatically reconnect after an error response
  autoReconnect: true,
  // Boolean indicating whether each message should be marked as read or not after it is processed
  autoMark: true,
});


let userData = [];
/* proxy for now, for flexibility in this area later */
const setState = (newState, response) => {
  if (response) {
    userData.push(response);
  }
  state = newState;
}

const states = {
  DEFAULT: "DEFAULT",
  GET_NAME: "GET_NAME",
  GET_GENDER: "GET_GENDER",
  GET_ADDRESS: "GET_ADDRESS",
  GET_PHONE: "GET_PHONE"
}

/* init state, set initial state */
let state;
state = states.DEFAULT;

/* functions that send responses and set state, called based on state */

const handlers = {};

handlers.DEFAULT = (message) => {
  console.log(message.text, state);
  rtm.sendMessage("Welcome! What's your name?", message.channel);
  setState(states.GET_NAME, message.text);
  console.log(message.text, state);

}

handlers.GET_NAME = (message) => {
  console.log(message.text, state);
  rtm.sendMessage("Ok, what's your address?", message.channel);
  setState(states.GET_ADDRESS, message.text);
  //userData.address = message.text;
  console.log(message.text, state);

}


handlers.GET_ADDRESS = (message) => {
  console.log(message.text, state);
  rtm.sendMessage("What's your phone number?", message.channel);
  setState(states.GET_PHONE, message.text);
  console.log(message.text, state);

}
handlers.GET_PHONE = (message) => {
  console.log(message.text, state);
  rtm.sendMessage("What's your gender?", message.channel);
  setState(states.GET_GENDER, message.text);
  console.log(message.text, state);
}

handlers.GET_GENDER = (message) => {
  console.log(message.text, state);
  rtm.sendMessage("all SET!", message.channel);
  setState(states.DEFAULT, message.text);
  console.log(message.text, state);
  rtm.sendMessage("Your response:", message.channel);
  return userData.forEach((value) => {
    return rtm.sendMessage(value, message.channel);
  });
}


const router = (message) => {
  handlers[state](message);
}



// Listens to all `message` events from the team
rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  router(message);
});

rtm.start();

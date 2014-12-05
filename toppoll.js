Polls = new Mongo.Collection("polls");

if (Meteor.isClient) {
  Template.poll.helpers({
    polls: function () {
      return Polls.find();
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

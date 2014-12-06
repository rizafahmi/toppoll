Polls = new Mongo.Collection("polls");

if (Meteor.isClient) {
  Template.poll.helpers({
    polls: function () {
      return Polls.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.newPoll.events({
    'submit .new-poll': function (e) {
      var question = e.target.question.value;
      var answer_a = e.target.answer_a.value;
      var answer_b = e.target.answer_b.value;
      var answer_c = e.target.answer_c.value;

      Polls.insert({
        question: question,
        answer_a: answer_a,
        answer_b: answer_b,
        answer_c: answer_c,
        createdAt: new Date()
      });

      e.target.question.value = "";
      e.target.answer_a.value = "";
      e.target.answer_b.value = "";
      e.target.answer_c.value = "";

      return false;

    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

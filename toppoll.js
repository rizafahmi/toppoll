Polls = new Mongo.Collection("polls");
PollAnswers = new Mongo.Collection("pollAnswer");


if (Meteor.isClient) {


  Template.poll.helpers({
    polls: function () {
      return Polls.find({}, {sort: {createdAt: -1}});
    },
    selectedVote: function () {
      var vote = Polls.findOne(Session.get("selectedVote"));
      return vote ;
    },
    pollAnswers: function () {
      var answers = PollAnswers.find({pollId: Session.get("selectedVote")}, {sort: {count: -1}});
      return answers;
    }
  });

  Template.poll.events({
    'click .btn-delete': function () {
      Polls.remove(this._id);
    },
    'click .btn-vote': function () {
      Session.set('selectedVote', this._id);
    },
    'click .btn-vote-count': function () {
      var id = this._id;
      PollAnswers.update({_id: id}, {$inc: { count: 1 }});
    },
  });

  Template.newPoll.events({
    'submit .new-poll': function (e) {
      var question = e.target.question.value;
      var answer_a = e.target.answer_a.value;
      var answer_b = e.target.answer_b.value;
      var answer_c = e.target.answer_c.value;

      var poll = Polls.insert({
        question: question,
        createdAt: new Date()
      });

      console.log(poll);
      PollAnswers.insert({
        pollId: poll,
        answer: answer_a
      });

      PollAnswers.insert({
        pollId: poll,
        answer: answer_b
      });

      PollAnswers.insert({
        pollId: poll,
        answer: answer_c
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

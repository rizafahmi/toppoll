if (Meteor.isClient) {
  Template.poll.helpers({
    'polls': [
        { question: "Bagaimana menurut kamu Meteor itu?",
          answer: [ { a: "Keren" }, { b: "Bagus" }, { c: "Biasa aja" } ]
        },
        { question: "Apakah belajar Meteor menyenangkan?",
          answer: [ { a: "Tentu saja" }, { b: "Pastinya" }, { c: "Hmmm..." } ]
        },
      ]
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

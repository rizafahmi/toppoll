# 0. Installing Meteor
# 1. Creating an app

    $> meteor create toppoll
    
[view source](https://github.com/rizafahmi/toppoll/commit/b412652050614dc36696dbaf2ab68cdfd307af97)

Run meteor

    $> cd toppoll
    $> meteor

# 2. Templates

Add listing template that iterates through polls. 

    <head>
        <title>Toppoll</title>
    </head>
    <body>
        <h1>Top Poll</h1>
        <ul>
            {{> poll}}
        </ul>
    </body>
    
    <template name="poll">
        {{#each polls}}
            <li>{{question}}</li>
        {{/each}}
    </template>

Remove placeholder code and binding dummy polls in javascript file.

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

[View Source](https://github.com/rizafahmi/toppoll/commit/f96670e21d177fd0b65e4b1462e50c25f07840e1)
# 3. Collections

Add new polls collection, and change dummy polls into Polls.find()

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

Now, let's try insert one or more data from the database.

    $> meteor mongo
    meteor:PRIMARY> db.polls.insert({question: "Apakah Meteor keren?", answers: [{a: "Pastinya"}, {b: "Keren dong"}, {c: "Keren sih"}], dateCreated: new Date()})
    
# 4. Forms and Events

Sekarang kita akan buat form untuk add poll baru.

    <head>
      <title>Toppoll</title>
    </head>

    <body>
      <h1>Top Poll</h1>

      <form class="new-poll" action="">
        <textarea id="" name="question" cols="30" rows="10" placeholder="Enter your poll question here"></textarea>
        <input type="text" name="answer_a" placeholder="First poll answer">
        <input type="text" name="answer_b" placeholder="Second poll answer">
        <input type="text" name="answer_c" placeholder="third poll answer">

        <button type="submit">Save</button>

      </form>

      <ul>
        {{> poll}}
      </ul>
    </body>

    <template name="poll">
      {{#each polls}}
        <li>{{question}}</li>
      {{/each}}
    </template>

Kok jelek ya... Time to use bootstrap! Buka `https://atmospherejs.com/` search bootstrap. Tambahkan paket bootstrap pilihan kita ke project.

  $> meteor add mizzao:bootstrap-3

Masih keliatan kurang ok sih, mari kita benarkan desain-nya.

    <head>
      <title>Toppoll</title>
    </head>

    <body>

      <div class="container">
        <div class="row">
          <h1>Top Poll</h1>
          <div class="col-md-8">
            <h3> &gt; New Poll</h3>
            {{> newPoll}}
          </div>
        </div>

        <div class="row">
          <div class="col-md-8">
            <h3> &gt; List of Polls</h3>
            <ul>
              {{> poll}}
            </ul>
          </div>
        </div>
      </div>
    </body>

    <template name="poll">
      {{#each polls}}
        <li>{{question}}</li>
      {{/each}}
    </template>
    <template name="newPoll">

    <form class="form-horizontal new-poll" action="">
      <div class="form-group">

        <textarea id="" class="form-control" name="question" placeholder="Enter your poll question here"></textarea>
      </div>
      <div class="form-group">
        <input class="form-control" type="text" name="answer_a" placeholder="First poll answer">
      </div>
      <div class="form-group">
        <input class="form-control" type="text" name="answer_b" placeholder="Second poll answer">
      </div>
      <div class="form-group">
        <input class="form-control" type="text" name="answer_c" placeholder="third poll answer">
      </div>

      <div class="form-group">
        <button class="btn btn-primary" type="submit">Save</button>
      </div>

    </form>


    </template>


Sudah kelihatan better, kan?!

Sekarang mari kita bikin form polling baru berfungsi. Buka javascript file.

    Polls = new Mongo.Collection("polls");

    if (Meteor.isClient) {
      Template.poll.helpers({
        polls: function () {
          return Polls.find();
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

Mari kita coba form kita. Yes! It works! Ok, selesai sudah workshop kita hari ini sampai bertemu di episode berikutnya :)

Biar daftar polling-nya ter sorting sesuai tanggal (yg terbaru diatas), kita ubah dikit di bagian query-nya.

  return Polls.find({}, {sort: {createdAt: -1}});

# 5. Remove a Poll

Ok, sekarang kita mau coba buat supaya bisa hapus polling yg udah kita buat.
Pertama-tama kita tambah tombol delete-nya dulu di template html.


    <head>
      <title>Toppoll</title>
    </head>

    <body>

      <div class="container">
        <div class="row">
          <h1>Top Poll</h1>
          <div class="col-md-8">
            <h3> &gt; New Poll</h3>
            {{> newPoll}}
          </div>
        </div>

        <div class="row">
          <div class="col-md-8">
            <h3> &gt; List of Polls</h3>
            <ul>
              {{> poll}}
            </ul>
          </div>
        </div>
      </div>
    </body>

    <template name="poll">
      {{#each polls}}
        <li>
          {{question}}
          <button class="btn btn-danger btn-delete btn-xs" type="button">&times;</button>
        </li>
      {{/each}}
    </template>

    <template name="newPoll">

    <form class="form-horizontal new-poll" action="">
      <div class="form-group">

        <textarea id="" class="form-control" name="question" placeholder="Enter your poll question here"></textarea>
      </div>
      <div class="form-group">
        <input class="form-control" type="text" name="answer_a" placeholder="First poll answer">
      </div>
      <div class="form-group">
        <input class="form-control" type="text" name="answer_b" placeholder="Second poll answer">
      </div>
      <div class="form-group">
        <input class="form-control" type="text" name="answer_c" placeholder="third poll answer">
      </div>

      <div class="form-group">
        <button class="btn btn-primary" type="submit">Save</button>
      </div>

    </form>


    </template>

Ok, sekarang mari kita buat delete button berfungsi.


    Polls = new Mongo.Collection("polls");

    if (Meteor.isClient) {
      Template.poll.helpers({
        polls: function () {
          return Polls.find({}, {sort: {createdAt: -1}});
        }
      });

      Template.poll.events({
        'click .btn-delete': function () {
          Polls.remove(this._id);
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

Sekarang yuk kita coba mendelete beberapa polling yg kita buat sebelumnya.

Tuh, keren kan?

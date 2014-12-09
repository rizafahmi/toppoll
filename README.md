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

# 6. Enhanced List of Polls

Sekarang yuk kita bikin list of polls lebih bagus dan lebih terstruktur. Seperti
menggunakan table, terus bisa diklik untuk menuju ke poll yg bisa kita vote rame-rame.
Buka html file dan bikin tabel untuk list of poll.
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
          <div class="col-md-10">
            <h3> &gt; List of Polls</h3>
            <ul>
              {{> poll}}
            </ul>
          </div>
        </div>
      </div>
    </body>

    <template name="poll">
    <table class="table table-striped">
      <thead>
      <tr>
        <th>Questions</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      {{#each polls}}
      <tr>
        <td>{{question}}</td>
        <td>
          <button class="btn btn-warning btn-vote btn-sm" type="button">Vote Now</button> 
          <button class="btn btn-danger btn-delete btn-sm" type="button">Delete</button>
        </td>
      </tr>
      {{/each}}
      </tbody>
    </table>
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

Nah, sekarang terlihat lebih bagus, bukan?!

# 7. Voting Time!

Nah sekarang kita mau bikin kalo user klik tombol 'Vote Now' akan buka semacam modal
untuk voting. Yuk kita bikin modal di html file kita.


    <!-- MODAL -->
    <div id="voteModal" class="modal fade">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
            <h4 class="modal-title">{{selectedVote.question}}</h4>
          </div>
          <div class="modal-body">
            <table class="table table-striped">
              <tbody>
                <tr>
                  <td>{{selectedVote.answer_a}}</td>
                  <td><strong>{{selectedVote.count_a}}</strong></td>
                  <td><button class="btn btn-sm btn-vote-a btn-success">Vote!</button></td>
                </tr>
                <tr>
                  <td>{{selectedVote.answer_b}}</td>
                  <td><strong>{{selectedVote.count_b}}</strong></td>
                  <td><button class="btn btn-sm btn-vote-b btn-success">Vote!</button></td>
                </tr>
                <tr>
                  <td>{{selectedVote.answer_c}}</td>
                  <td><strong>{{selectedVote.count_c}}</strong></td>
                  <td><button class="btn btn-sm btn-vote-c btn-success">Vote!</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->

Jangan lupa kalo kita klik button 'Vote Now' men-trigger modal-nya.

    <button class="btn btn-warning btn-vote btn-sm" data-toggle="modal" data-target="#voteModal" type="button">Vote Now</button> 

Sekarang ke javascript file. Pertama, kalo button 'Vote Now' di klik, kita akan set
session yg menyimpan vote id.

    Template.poll.events({
      'click .btn-delete': function () {
        Polls.remove(this._id);
      },
      'click .btn-vote': function () {
        Session.set('selectedVote', this._id);
      }
    });


Begitu vote id tersedia, kita select di database dan ditampilkan di modal.

    Template.poll.helpers({
      polls: function () {
        return Polls.find({}, {sort: {createdAt: -1}});
      },
      selectedVote: function () {
        var vote = Polls.findOne(Session.get("selectedVote"));
        return vote ;
      }
    });

Sekarang kita tampilkan di html. Kita pake if untuk cek kalo data sudah tersedia
maka modal akan dimunculkan. Kalo ngga ada data, modal tidak akan muncul. Kita
taro modal ini didalam template poll supaya masih didalam satu konteks.

    {{# if selectedVote}}
      <!-- MODAL -->
      <div id="voteModal" class="modal fade">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
              <h4 class="modal-title">{{selectedVote.question}}</h4>
            </div>
            <div class="modal-body">
              <table class="table table-striped">
                <tbody>
                  <tr>
                    <td>{{selectedVote.answer_a}}</td>
                    <td><strong>{{selectedVote.count_a}}</strong></td>
                    <td><button class="btn btn-sm btn-vote-a btn-success">Vote!</button></td>
                  </tr>
                  <tr>
                    <td>{{selectedVote.answer_b}}</td>
                    <td><strong>{{selectedVote.count_b}}</strong></td>
                    <td><button class="btn btn-sm btn-vote-b btn-success">Vote!</button></td>
                  </tr>
                  <tr>
                    <td>{{selectedVote.answer_c}}</td>
                    <td><strong>{{selectedVote.count_c}}</strong></td>
                    <td><button class="btn btn-sm btn-vote-c btn-success">Vote!</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
      </div><!-- /.modal -->
    {{/if}}

Selanjutnya kita bikin tiga button vote itu berfungsi. Setiap kali klik kita dapat id-nya,
terus count-nya di increment.

    Template.poll.events({
      'click .btn-delete': function () {
        Polls.remove(this._id);
      },
      'click .btn-vote': function () {
        Session.set('selectedVote', this._id);
      },
      'click .btn-vote-a': function () {
        var id = Session.get('selectedVote');
        Polls.update({_id: id}, {$inc: { count_a: 1 }});
      },
      'click .btn-vote-b': function () {
        var id = Session.get('selectedVote');
        Polls.update({_id: id}, {$inc: { count_b: 1 }});

      },
      'click .btn-vote-c': function () {

        var id = Session.get('selectedVote');
        Polls.update({_id: id}, {$inc: { count_c: 1 }});
      },
    });

Sekarang yuk kita coba. Keren kan?! Coba lihat di database, beneran nambah ngga datanya di database.


# Reset Vote

# Edit Vote

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
          <div class="col-md-10">
            <h3> &gt; List of Polls</h3>
            <ul>
              {{> poll}}
            </ul>
          </div>
        </div>
      </div>
    </body>

    <template name="poll">
    <table class="table table-striped">
      <thead>
      <tr>
        <th>Questions</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      {{#each polls}}
      <tr>
        <td>{{question}}</td>
        <td>
          <button class="btn btn-warning btn-vote btn-sm" type="button">Vote Now</button> 
          <button class="btn btn-danger btn-delete btn-sm" type="button">Delete</button>
        </td>
      </tr>
      {{/each}}
      </tbody>
    </table>
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

Yes! This is better!!

# 7. Vote Page

Nah, sekarang kita mau bikin kalo user klik tombol 'Vote Now' akan menuju ke
page vote. Untuk itu kita perlu install paket yg namanya iron router.

    $> meteor add iron:router

Router ini harus bisa diakses di client dan di server. Dan mumpung kita baru
mau bikin router ini, yuk sekalian kita bikin app ini lebih terstruktur.
App kita sudah mulai kompleks soalnya. Kalo ngga dipisahin nanti bakal pusing.

Pertama-tama kita bikin tiga folder: client, server, lib. Lib folder ini akan
bisa diakses di client dan server, sementara client hanya bisa diakses di client, 
dan folder server hanya bisa diakses dari sisi server. Router akan kita bikin
di folder lib. Tapi sebelum itu, yuk kita bikin layout template untuk dipake di
satu atau beberapa router. Jadi kita ngga perlu bikin layout berulang-ulang.
Kita bikin di folder client dengan nama `layout.html`.

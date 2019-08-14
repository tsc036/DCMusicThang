const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dbName="dc_music_thing";
const user = encodeURIComponent('username');
const password = encodeURIComponent('password');
const authMechanism = 'DEFAULT';
const bcrypt=require('bcrypt');
const salt_rounds=12;
// Connection URL
const url = `mongodb://${user}:${password}@localhost:27017/?authMechanism=${authMechanism}`;
// Create a new MongoClient
const client = new MongoClient(url);

// Use connect method to connect to the Server
client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    const db=client.db(dbName);
    hash_and_store(db,"users_login",'alex',"alexpassword",function(){
        client.close();
    });

});
function create_collection(db,collection_name,callback){
    db.createCollection(collection_name,function(err,results){
        console.log("collection created");
        callback();
    });
};
function hash_and_store(db,collection,entered_username,password,callback){
    bcrypt.hash(password,salt_rounds,function(err,hash){
        if(err){
            throw err;
        }
        let user_login_doc={username:entered_username,password:hash};
        add_to_database(db,collection,user_login_doc);
        callback();
    });
};
function add_to_database(db,collection,document) {
    db.collection(collection).insertOne(document, function(err,res){
       if (err) {
           console.log(err);
       }
       else{
           console.log(res);
           console.log("login added");
       }
    });
};
function check_password(db,collection,entered_username,entered_password,callback){
    let query={username:entered_username};
    db.collection(collection).findOne(query)
        .then(function(user){
            let hashed_password=user.password;
            //console.log(hashed_password)
            return bcrypt.compare(entered_password,hashed_password);
    })
        .then(function(same_password) {
            if(!same_password){
                console.log("incorrect password");
            }
            else{
                console.log("correct password");
            }
        }).catch(function (error) {
            console.log("error authenticating user:");
            console.log(error);
        }
    );
    callback();
}
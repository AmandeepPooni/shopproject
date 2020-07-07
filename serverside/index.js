const functions = require('firebase-functions');
const admin=require('firebase-admin');
const cors = require('cors')();
admin.initializeApp();
const co = require('co');
const mc = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

const db=admin.firestore();
const bucket = admin.storage().bucket();

let client = null;
const uri = '<MongoDB database URL>';

exports.mongo = functions.https.onRequest((req, res) => {
    
    
    co(function*() {
        
        var orgg = req.query.or;
        
        let is_reused = "Reused connection";
        
        if(!client){
            is_reused = "New connection";
            client = yield mc.connect(uri,{useUnifiedTopology:true});
        }
        
        let docs = yield client.db('subscription').collection('fac').find().toArray();
        
        res.send('Result ('+is_reused+') :' + JSON.stringify(docs));
    }).catch(error => {
        res.send('Error: ' + error.toString());
    });
});









exports.add = functions.https.onRequest((req, res) => {
    cors(req, res, async() => {
        
        
        co(function*() {
            
            let data = req.body.data;
            let url = req.body.url;
            
            if(!client){
                is_reused = "New connection";
                client = yield mc.connect(uri,{useUnifiedTopology:true});
            }
            
            
            const docs = yield client.db('test').collection(url).insertOne({data:data});
            
            res.send({ok:true});
            
            
        }).catch(error => {
            res.send({error:error.toString()});
        });
        
    });
});




exports.get = functions.https.onRequest((req, res) => {
    cors(req, res, async() => {
        co(function*() {
            let url = req.body.url;
            let query = req.body.query;

            if(!client){
                is_reused = "New connection";
                client = yield mc.connect(uri,{useUnifiedTopology:true});
            }
            
            
            let docs = yield client.db('test').collection(url).find(query).toArray();
            
            
            res.send(JSON.stringify(docs));
            
            
        }).catch(error => {
            res.send({error:error.toString()});
        });
        
    });
});


exports.buy = functions.https.onRequest((req, res) => {
    cors(req, res, async() => {
        
        co(function*() {
            let id = req.body.product._id;
            let quan = parseInt(req.body.quantity);
            
            if(!client){
                is_reused = "New connection";
                client = yield mc.connect(uri,{useUnifiedTopology:true});
            }

            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+", "+today.getHours() + ":" + today.getMinutes();
            req.body.time = date;

            let stock = yield client.db('test').collection("seller").find({ _id: ObjectId(id) }).toArray();


            if(stock[0].data.stock>=quan){
                let docs = yield client.db('test').collection("seller").updateOne({ _id: ObjectId(id)},{ $inc:{"data.stock":(-1*quan)}});
                let docs2 = yield client.db('test').collection("orders").insertOne(req.body);
                res.send({ok:true});
            }
            else{
                res.send({ok:false});
            }
            
            
            
        }).catch(error => {
            res.send({error:error.toString()});
        });
        
    });
});



exports.update = functions.https.onRequest((req, res) => {
    cors(req, res, async() => {
        
        
        co(function*() {
            let id = req.body.id;
            let data = req.body.data;
            
            if(!client){
                is_reused = "New connection";
                client = yield mc.connect(uri,{useUnifiedTopology:true});
            }
            
            let docs = yield client.db('test').collection("seller").updateOne({ _id: ObjectId(id) },{ $inc: data});
            
            res.send({ok:true});
            
            
        }).catch(error => {
            res.send({error:error.toString()});
        });
        
    });
});    
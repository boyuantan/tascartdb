var express = require('express');
var router = express.Router();

/* GET userlist. */
router.get('/tasklist', function(req, res) {
    var db = req.db;
    var collection = db.get('tasklist');
    collection.find({},{}, function(e, docs) {
        res.json(docs);
    });
});

/* POST to postreq */
router.post('/postreq', function(req, res) {
    var db = req.db;
    var collection = db.get('tasklist');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/* DELETE to deletereq */
router.delete('/deletereq', function(req, res) {
    var db = req.db;
    var collection = db.get('tasklist');
    var toDelete = req.params.id;
    collection.remove({'_id' : toDelete}, function(err) {
        res.send (
            (err === null) ? {msg: ''} : {msg: 'error' + err}
        );
    });
});

module.exports = router;

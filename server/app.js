const path = require('path');
cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');

//EXPRESS
const app = express();
app.use(cors());
app.use(bodyParser.json());
//comment out static vvvvv line when trying to hit end points from somewhere besides your static files
app.use(express.static(path.join(__dirname, '../public')));

//MONGOOSE
const mongoose = require('mongoose');
const db = mongoose.connect('mongodb://localhost/starwars'); //specify the db name you want to connect to
const People = require('./models/peopleModel');

//Simple Non Router endpoint starter
// app.get('/', function(req, res) {
//     res.send({'myapi': "i hear you!"});
// })

//ROUTER
const router = express.Router();
app.use('/', router);

// EXPRESS GET endpoint1 - NO Callback using req.params & req.query          http://localhost:8080/peopleAPI1/male?birth_year=19BBY   (should return luke)   
router.route('/peopleAPI1/:gender') 
    .get(function(req, res) {  
        // MONGOOSE
        let results = People.find(req.params)
            .where(req.query);
            //---manipulate results here-----
                // results.select(name: "Mark"); //or any other mongoose query method ie (.sort, .limit etc.)
                //  or use pure javascript to perform calculations that you don't want visible on the front end
                //  you might calculate and get a yes/no answer and simply use a res.send 
        results.exec(function(err,data) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(data);
            }
        })
    })
// EXPRESS GET endpoint2 - No Callback using req.params and req.query with mongoose comparison operators         http://localhost:8080/peopleAPI2/150/170?gender=male 
router.route('/peopleAPI2/:heightMin/:heightMax')
    .get(function(req, res) {
        //MONGOOSE
        let results = People.find(
                {   
                    height: { $gt: req.params.heightMin, $lt: req.params.heightMax }
                }
            )
            .where(req.query);

        results.exec(function(err,data) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(data);
            }
        })
    })
// EXPRESS GET endpoint3 - Callback using req.query (no req.params)        http://localhost:8080/peopleAPI3?gender=female 
router.route('/peopleAPI3')
    .get(function(req, res) {  
        //MONGOOSE
        People.find(
            req.query, 
            function(err, data) { 
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(data);
                }
            }
        )
    })
// EXPRESS POST endpoint4
router.route('/peopleAPI4')
    .post(function(req, res) {
        People.create(req.body, function(err, result) {
            if (err) {
                return res.status(500).send(err);
            } else {
                res.status(200).json(result);
            }
        })
    });
// EXPRESS DELETE endpoint5
router.route('/peopleAPI5/:id')
    .delete(function(req, res) {
        People.findByIdAndRemove(req.params.id, function(err, result) {
            if (err) {
                return res.status(500).send(err);
            } else {
                res.status(200).json(result);
            }
        })
    });
// EXPRESS PUT endpoint5
router.route('/peopleAPI6/:id')
    .put(function(req, res) {


        People.findById(req.params.id, function (err, target) {
            if (err) {
                return res.status(500).send(err);
            } else {
                target.set(req.body);
                target.save(function (err, updatedTarget) {
                  if (err) return handleError(err);
                  res.send(updatedTarget);
                });
            }
          });
    })

let port = 8080;
app.listen(port, function() {
    console.log('express is running on port ' + port);
})
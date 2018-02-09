var express = require('express'),
    router = express.Router(),
    _ = require('underscore'),
    dish = require('../../database/schemas/dish.js');


function checkDishExistance(req, res, next) {
  if(req.body){
    var body = req.body,
        rowId = body.rowId;
    if(rowId){
      next();
    }
    else {
      var name = body.name,
          regex = new RegExp(["^",name,"$"].join(""),"i"),
          exclude = {
            createdAt: false,
            updatedAt: false,
            isActive: false
          };
      dish.find({name: regex}, exclude, (err, docs) => {
        if (err) {
          res.status(500).send('Internal Server Error !');
        } else if (docs && !_.isEmpty(docs)) {
            req.dish = docs;
        }
        next();
      });
    }
  }
}

function saveDistinctName(req, res, next) {
  if (req.body) {
    var body = req.body,
        rowId = body.rowId;
    if (rowId) {
      var data = {
        dcat: body.dcat || "default-dcat",
        price: body.price || 0,
        scd: body.scd || "",
        ncd: body.ncd || 0,
        updatedAt: new Date()
      };
      if(body.name){
        data['name'] = body.name;
      }
      dish.findByIdAndUpdate(rowId,{$set: data},{new : true},(err,doc) => {
        if(err){
          res.status(500).send('Internal Server Error !');
          return;
        }
        else{
          res.status(200).send({
            code: 0,
            message: 'Dish updated successfully !',
            resultId: doc._id
          });
        }

      });
    }
    else if(req.dish && !_.isEmpty(req.dish)){
      res.status(200).send({
				code:1,
				message: 'Dish already Exist !'
			});
    }
    else {
      var dishData = new dish(body);
      dishData.createdAt = new Date();
      dishData.isActive = true;
      dishData.save((err,docs) => {
        if (err) {
          res.status(500).send('Internal Server Error !');
          return;
        } else {
          res.status(200).send({
  					code: 0,
  					message: 'Dish stored successfully !',
  					resultId: docs._id
  				});
        }
      });
    }
  }
}

router.post('/save', checkDishExistance, saveDistinctName);

router.get('/:option?', (req, res) => {
  var exclude = {
    createdAt:false,
    updatedAt:false,
    isActive:false,
    __v:false
  },
  options = {
    sort:{ name:1 }
  },
  query = {};
  if(req.params.option && req.params.option==='active'){
    query = { isActive : true };
  }
  dish.find(query, exclude, options, (err, docs) => {
    if (err) {
      res.status(500).send('Internal Server Error !');
      return
    } else {
      res.status(200).send({
        code: 0,
        message: 'All Dish list !',
        list: docs
      });
    }
  });
});

router.delete('/:rowId', (req, res) => {
  if(req.params.rowId){
    var rowId = req.params.rowId;
    dish.findByIdAndRemove(rowId,(err,docs) => {
      if(err){
        res.status(500).send('Internal server error !');
      }
      res.status(200).send({
				code: 0,
				message: 'Dish deleted successfully !',
				resultId: docs._id
			})
    })
  }
});



module.exports = router;

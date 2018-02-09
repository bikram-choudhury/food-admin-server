var express = require('express'),
    router = express.Router(),
    _ = require('underscore'),
    dishcategory = require('../../database/schemas/dishCategory.js');


function checkCategoryExistance(req, res, next) {
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
      dishcategory.find({name: regex}, exclude, (err, docs) => {
        if (err) {
          res.status(500).send('Internal Server Error !');
        } else if (docs && !_.isEmpty(docs)) {
            req.category = docs;
        }
        next();
      });
    }
  }
}

function saveDistinctCategory(req, res, next) {
  if (req.body) {
    var body = req.body,
        rowId = body.rowId;
    if (rowId) {
      var data = {
        mcat: body.mcat || "default-cat",
        priority: body.priority || 1,
        type: body.type || "veg",
        color: body.color || "#ffffff",
        updatedAt: new Date()
      };
      if(body.name){
        data['name'] = body.name;
      }
      dishcategory.findByIdAndUpdate(rowId,{$set: data},{new : true},(err,doc) => {
        if(err){
          res.status(500).send('Internal Server Error !');
          return;
        }
        else{
          res.status(200).send({
            code: 0,
            message: 'Dish category updated successfully !',
            resultId: doc._id
          });
        }

      });
    }
    else if(req.category && !_.isEmpty(req.category)){
      res.status(200).send({
				code:1,
				message: 'Category already Exist !'
			});
    }
    else {
      var catData = new dishcategory(body);
      catData.createdAt = new Date();
      catData.isActive = true;
      catData.save((err,docs) => {
        if (err) {
          res.status(500).send('Internal Server Error !');
          return;
        } else {
          res.status(200).send({
  					code: 0,
  					message: 'Dish category stored successfully !',
  					resultId: docs._id
  				});
        }
      });
    }
  }
}

router.post('/save', checkCategoryExistance, saveDistinctCategory);

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
  if(req.params.option  && req.params.option==='active'){
    query = { isActive : true };
  }
  dishcategory.find(query, exclude, options, (err, docs) => {
    if (err) {
      res.status(500).send('Internal Server Error !');
      return
    } else {
      res.status(200).send({
        code: 0,
        message: 'All Dish category list !',
        list: docs
      });
    }
  });
});

router.delete('/:rowId', (req, res) => {
  if(req.params.rowId){
    var rowId = req.params.rowId;
    dishcategory.findByIdAndRemove(rowId,(err,docs) => {
      if(err){
        res.status(500).send('Internal server error !');
      }
      res.status(200).send({
				code: 0,
				message: 'Dish category deleted successfully !',
				resultId: docs._id
			})
    })
  }
});



module.exports = router;

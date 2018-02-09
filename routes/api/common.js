var express = require('express'),
    router = express.Router(),
    _ = require('underscore'),
    mainCategory = require('../../database/schemas/mainCategory.js');

router.get('/main-category/save', (req, res, next) => {
  var iterable = [{ name: 'hot beverages' },
                  { name: 'merchandise' },
                  { name: 'eatables' },
                  { name: 'cold beverages' },
                  { name: 'packaging' },
                  { name: 'intermediary' },
                  { name: 'consumables' },
                  { name: 'packing materials' },
                  { name: 'raw materials' } ];

  for (doc of iterable) {
    var mcatData = new mainCategory(doc);
    mcatData.save((err,docs) => {
      if (err) {
        console.log(doc.name+" - not saved");
        return;
      } else {
        console.log(doc.name+" - saved");
      }
    });
  }

  res.status(200).send({
    code:0,
    message: 'Main category stored successfully !',
  });

});


router.get('/main-category', (req, res, next) => {
    var exclude = {
      __v: false
    },
    options = {
  		sort:{name:1}
  	};
    mainCategory.find({},exclude,options, (err, docs) => {
      if (err) {
        res.status(500).send('Internal server error !');
  			return;
      } else {
        res.status(200).send({
    			code: 0,
    			message: 'All main category list !',
    			list: docs
    		})

      }

    });
});

module.exports = router;

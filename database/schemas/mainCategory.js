let mongoose = require('mongoose'),
    mainCategory = mongoose.Schema({
      name:{
        type: String,
        require: true
      }
    });

module.exports = mongoose.model('maincategories', mainCategory);

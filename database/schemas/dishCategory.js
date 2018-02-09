let mongoose = require('mongoose'),
    category = mongoose.Schema({
      name:{
        type: String,
        require: true
      },
      mcat:{
        type: String,
        require: true
      },
      priority:{
        type: Number,
        require: true
      },
      type:{
        type: String,
        require: true
      },
      color:{
        type: String,
        require: true
      },
      createdAt:{
        type: Date,
        require: false
      },
      updatedAt:{
        type: Date,
        require: false
      },
      isActive:{
        type: Boolean,
        require: false
      }
    });

module.exports = mongoose.model('dishcategory', category);

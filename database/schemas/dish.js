let mongoose = require('mongoose'),
    dish = mongoose.Schema({
      name:{
        type: String,
        require: true
      },
      dcat:{
        type: String,
        require: true
      },
      price:{
        type: Number,
        require: true
      },
      scd:{
        type: String,
        require: false
      },
      ncd:{
        type: Number,
        require: false
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

module.exports = mongoose.model('dish', dish);

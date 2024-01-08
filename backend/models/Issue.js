const mongoose = require('mongoose');


const issueSchema = mongoose.Schema({
  issue:Object,
  name:String,
  description:String
},{ collection: 'issue' });
issueSchema.set('collection', 'issue');
module.exports = mongoose.model('Issue', issueSchema,'issue');

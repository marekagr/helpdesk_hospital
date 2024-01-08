const express = require("express");
const Issue = require("../models/Issue");
const { SSL_OP_NO_TLSv1_1 } = require("constants");


const router = express.Router();


router.get("", (req, res, next) => {
  Issue.find().select({'name':1,'description':1,'_id':1}).then(documents => {
    // console.log('documents:',documents)
    res.status(200).json(documents);
  })
});


router.get("/:id", (req, res, next) => {
  Issue.findOne({_id:req.params.id }).then(document => {
    // console.log('documents:',documents)
    res.status(200).json(document);
  })
});


router.post("", (req, res) => {
  // console.log('body:',req.get('Content-Type'),req.body);
  const body=JSON.parse(req.body);
  //delete body['_id'];

  const item = new Issue(body);
  item.save().then(data => {
    res.status(201).json(data);
  });
});

router.put("/:id", (req, res, next) => {
  const issue=JSON.parse(req.body);
  console.log('put issue',issue);
  Issue.findByIdAndUpdate({ _id: req.params.id },issue).then(data=>{
     console.log('put',data);
    res.status(200).json(data)
  })
});

module.exports = router;

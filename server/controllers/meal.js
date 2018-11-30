const express = require('express');
const models = require('../models');
const Redirect = require('../middlewares/redirect');
const getSlug = require('speakingurl');

const router = express.Router();
const Meal = models.Meal;


/*find all the meal the user made once the user is log in*/ 
router.get('/', Redirect.ifNotLoggedIn('/login'), (req, res) => { 
  Meal.findAll({ 
    where:{
      userId: req.user.id
    },
    include:[{
      model: models.User,
    }],
  })
  .then(allMeals => {
    res.json(allMeals);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({msg: "error", details: err});
  });
});

//adding a new meal
router.post('/',Redirect.ifNotLoggedIn('/login'), (req, res) => {
  //using the association from sequelize
  req.user.createMeal({
    name: req.body.name.toLowerCase(),
    comment: req.body.comment,
    time: req.body.time
  })
  .then(meals => {    
    // Send created meals to client
    //res.json(meals);
    res.status(200).json( { mgs: "successfully Created" } );
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({msg: "error", details: err});
  });
});

//update Meal
router.put('/', Redirect.ifNotLoggedIn('/login'), /*Redirect.ifNotAuthorized('/meal'),*/(req, res) => {
  Meal.update({
      name: req.body.name.toLowerCase(),
      comment: req.body.comment,
      time: req.body.time
  }, 
  { 
    where: {
      name: req.body.name.toLowerCase(),
      userId: req.user.id,
    },
    include: [{
      model: models.User,
      where:{
        username:req.user.username,
      },
    }],
  })
  .then(() => {
      res.status(200).json( { mgs: "Updated Successfully"} );
  }).catch(err => {
    console.log(err);
    res.status(500).json({msg: "error", details: err});
  });
});

//delete  Meal
router.delete('/', Redirect.ifNotLoggedIn('/login'), /*Redirect.ifNotAuthorized('/posts'),*/ (req, res) => {
  Meal.destroy({
    where: {
      name: req.body.name,
      userId: req.user.id,
    },
    include: [{
      model: models.User,
      where: {
        username: req.user.username,
      },
    }],
  })
  .then(() => {
    res.status(200).json( { msg: "Deleted Successfully"} );
  })
  .catch(err => {
      console.log(err);
      res.status(500).json({msg: "error", details: err});
  });
});

//find by id
/*router.get('/:username/:slug', (req, res) => { 
  Meal.findOne({ 
    where:{
      slug: req.params.slug
    },
    include:[{
      model: models.User,
      where:{
        username: req.params.username,
      },
    }],
  })
  .then((meals) => {
    res.status(200).json(meals);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({msg: "error", details: err});
  });
});*/

//update Meal
/*router.put('/:username/:slug', Redirect.ifNotLoggedIn('/login'), Redirect.ifNotAuthorized('/meal'),(req, res) => {
  Meal.update({
      slug:getSlug(req.body.name.toLowerCase()),
      name: req.body.name.toLowerCase(),
      comment: req.body.comment,
      time: req.body.time
  }, 
  { 
    where: {
      slug: req.params.slug,
    },
    include: [{
      model: models.User,
      where:{
        username:req.params.username,
      },
    }],
  })
  .then(() => {
      res.status(200).json( { mgs: "Updated Successfully"} );
  }).catch(err => {
    console.log(err);
    res.status(500).json({msg: "error", details: err});
  });
});

//delete  Meal
router.delete('/:username/:slug', Redirect.ifNotLoggedIn('/login'), Redirect.ifNotAuthorized('/posts'), (req, res) => {
  Meal.destroy({
    where: {
      slug: req.params.slug,
    },
    include: [{
      model: models.User,
      where: {
        username: req.params.username,
      },
    }],
  })
  .then(() => {
    res.status(200).json( { msg: "Deleted Successfully"} );
  })
  .catch(err => {
      console.log(err);
      res.status(500).json({msg: "error", details: err});
  });
});*/

module.exports = router;
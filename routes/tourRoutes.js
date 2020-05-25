const express = require('express');
const tourController = require('./../controllers/tourController');
// Creates a new router object.
const router = express.Router();

//!Special middleware "param". Only runs for certain parameters

//router.param('id', tourController.checkID);
// Personalized Most tipical query set
router
  .route('/top-5-cheat')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);
module.exports = router;

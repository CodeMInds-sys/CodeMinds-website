const express = require("express");
const router = express.Router();
const { auth } = require('../middlewares/jwt');
const checkRole = require('../middlewares/checkRole');
const groupController = require('../controllers/groupController');


router.use(auth);

router
  .route('/')
  .get(groupController.getGroups)
  .post(checkRole('manager', 'admin'), groupController.createGroup);

router
  .route('/:id')
  .get(groupController.getGroup)
  .put(checkRole('manager', 'admin'), groupController.updateGroup)
  .delete(checkRole('manager', 'admin'), groupController.deleteGroup);


module.exports = router;

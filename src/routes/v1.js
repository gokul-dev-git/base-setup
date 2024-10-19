const express = require('express');
const userController = require('../controllers/authController');
const roleController = require('../controllers/roleController');
const patientController = require('../controllers/patientController');
const loginValidation = require('../middlewares/validation/loginValidation');
const loginVerifyValidation = require('../middlewares/validation/loginVerifyValidation');
const roleValidation = require('../middlewares/validation/roleValidation');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Base Setup V1 APIs' });
});

router.route('/role')
  .get(authenticate, roleController.getAllRoles)
  .post(authenticate, roleValidation, roleController.createRole);

router.route('/role/:id')
  .get(authenticate, roleController.getRoleById)
  .patch(authenticate, roleValidation, roleController.updateRole)
  .delete(authenticate, roleController.deleteRole);

router.post('/loginSME', loginValidation, userController.loginUser);
router.post('/validateSME', loginVerifyValidation, userController.loginValidate);
router.get('/testAuth', authenticate, userController.testAuth);
router.post('/refreshToken', userController.validateRefreshToken);

router.get('/allPatient', authenticate, patientController.fetchAllPatients);

module.exports = router;

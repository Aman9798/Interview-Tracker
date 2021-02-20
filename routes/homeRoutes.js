const {Router} = require('express');
const homeController = require('../controllers/homeController');
const {requireAuth, checkUser}  = require('../middleware/authMiddleware');

const upload = homeController.upload;

const router= Router();
//upload.single('image'),

router.get('/topics', requireAuth, homeController.handleTopicsList);
router.post('/topics', requireAuth, homeController.handleAddQuestion);
router.get('/topics/:name', requireAuth, homeController.handleQuestionList);

router.get('/companies', requireAuth, homeController.handleCompaniesList);
router.post('/companies', requireAuth, upload.single('uploaded_image'), homeController.handleAddExperience);
router.get('/companies/:name', requireAuth, homeController.handleExperienceList);

module.exports = router;
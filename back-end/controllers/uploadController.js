// const multer = require('multer');
// const Image = require('../models/imageModel');



// // Configure multer storage
// const storageProfile = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/profile'); // Adjust the path according to your setup
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });

// const upload = multer({ storage: storageProfile }).single('image');

// uploadImage = (req, res) => {
//     upload(req, res, async (err) => {
//         if (!req.file) {
//             return res.status(400).json({ success: 0, message: 'Please select an image to upload' });
//         } else if (err instanceof multer.MulterError) {
//             return res.status(500).json({ success: 0, message: err.message });
//         } else if (err) {
//             return res.status(500).json({ success: 0, message: err.message });
//         }

//         try {
//             const newImage = new Image({
//                 filename: req.file.filename,
//                 path: req.file.path,
//             });

//             await newImage.save();

//             res.status(200).json({ success: 1, message: 'Image uploaded successfully', data: newImage });
//         } catch (err) {
//             res.status(500).json({ success: 0, message: 'Internal Server Error', error: err.message });
//         }
//     });
// };


// export default uploadImage;
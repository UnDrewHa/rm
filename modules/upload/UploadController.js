const multer = require('multer');
const {commonHTTPCodes} = require('../../common/errors');
const {AppError} = require('../../common/errors');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(
            new AppError(
                'Для загрузки принимаются только изображения',
                commonHTTPCodes.BAD_REQUEST,
            ),
            false,
        );
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

exports.uploadSingle = upload.single('file');
exports.uploadMultiple = upload.array('files', 3);

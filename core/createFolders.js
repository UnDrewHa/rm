const path = require('path');
const mkdirp = require('mkdirp');
const {logger} = require('./Logger');

const folderNames = ['img'];

exports.createFolders = () => {
    folderNames.map((folderName) => {
        const fullPath = path.normalize(
            `${process.cwd()}/${process.env.STATIC_PATH}/${folderName}`,
        );

        const result = mkdirp.sync(fullPath);

        logger.info(
            'Результат создания папок: ' + (result || 'Ничего не создано'),
        );
    });
};

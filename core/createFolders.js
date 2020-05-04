const path = require('path');
const mkdirp = require('mkdirp');
const {logger} = require('./Logger');

/**
 * Функция, создающая папки, необходимые для работы приложения.
 */
exports.createFolders = () => {
    const cwd = process.cwd();
    const folderNames = [`${cwd}/${process.env.STATIC_PATH}/img`];

    folderNames.map((folderName) => {
        const normalizedPath = path.normalize(folderName);

        const result = mkdirp.sync(normalizedPath);

        logger.info(
            'Результат создания папки: ' + (result || 'Ничего не создано'),
        );
    });
};

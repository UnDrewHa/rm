const path = require('path');
const mkdirp = require('mkdirp');
const {logger} = require('./Logger');

/**
 * Функция, создающая папки, необходимые для работы приложения.
 */
exports.createFolders = () => {
    const cwd = process.cwd();
    const folderNames = [
        `${cwd}/${process.env.STATIC_PATH}/img`,
        `${cwd}/${process.env.STATIC_PATH}/files`,
    ];

    folderNames.map((folderName) => {
        const normalizedPath = path.normalize(folderName);

        const result = mkdirp.sync(normalizedPath);

        logger.info(
            'Результат создания папки: ' +
                (result || `${normalizedPath} - Папка не создана`),
        );
    });
};

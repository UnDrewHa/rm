const fs = require('fs');
const util = require('util');
const {logger} = require('./Logger');

const getPathStat = util.promisify(fs.stat);
const mkDirAsync = util.promisify(fs.mkdir);
const folderNames = ['img'];

exports.createFolders = () => {
    Promise.all(
        folderNames.map((folderName) => {
            const fullPath = `${process.cwd()}/${
                process.env.STATIC_PATH
            }/${folderName}`;

            return getPathStat(fullPath).catch((err) => {
                if (err && err.code === 'ENOENT') {
                    return mkDirAsync(fullPath);
                }

                logger.error('Ошибка получения данных папки', err);
            });
        }),
    ).catch((err) => logger.error('Ошибка создания папок', err));
};

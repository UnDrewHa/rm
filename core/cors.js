exports.getCorsSettings = (isDevEnv, productionLocation) => {
    const origin = isDevEnv
        ? true
        : function (origin, callback) {
              if (origin === productionLocation) {
                  callback(null, true);
              } else {
                  callback(new Error('Not allowed by CORS'));
              }
          };

    return {
        origin,
        optionsSuccessStatus: 200,
        credentials: true,
    };
};

exports.getCorsSettings = (isDevEnv, productionLocation) => {
    const origin = isDevEnv ? true : productionLocation;

    return {
        origin,
        optionsSuccessStatus: 200,
        credentials: true,
    };
};

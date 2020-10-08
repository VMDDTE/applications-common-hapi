function checkHapiUrlForPathName (hapiRequestUrl) {
    if (!hapiRequestUrl) {
        throw new Error('Hapi request url is required')
    }

    if (!hapiRequestUrl.hasOwnProperty('pathname')) {
        throw new Error('Hapi request url requires a \'pathname\' property')
    }
}

function isHealthUrl (url) {
    // TODO Rework method to expect/check for hapi request url
    return /health\//.test(url)
}

function isResourceUrl (hapiRequestUrl) {
    checkHapiUrlForPathName(hapiRequestUrl)
    // Currently within the Vmd hapi apps there is a convention that resources are in assets/static folders

    const url = hapiRequestUrl.pathname

    return /\/(assets|static)\//ig.test(url)
}

export {
    isHealthUrl,
    isResourceUrl
}

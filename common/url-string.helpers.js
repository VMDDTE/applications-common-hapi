function isHealthUrl (url) {
    return /health\//ig.test(url)
}

function isResourceUrl (url) {
    // Currently within the Vmd hapi apps there is a convention that resources are in assets/static folders
    return /\/(assets|static)\//ig.test(url)
}

export {
    isHealthUrl,
    isResourceUrl
}

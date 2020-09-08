function isHealthUrl (url) {
    return /health\//.test(url)
}

export {
    isHealthUrl
}


function checkForLog4jsProtectiveMonitoring (log4js, serviceName) {
    if (!log4js) {
        throw new Error(`${serviceName} requires a log4js`)
    }

    if (typeof log4js.getLogger === 'undefined') {
        throw new Error(`${serviceName} requires a log4js object with getLogger method`)
    }

    const log4jsLogger = log4js.getLogger('protective-monitoring')
    if (!log4jsLogger) {
        throw new Error(`${serviceName} requires a log4js protective monitor logger`)
    }

    return log4jsLogger
}

module.exports = {
    checkForLog4jsProtectiveMonitoring
}

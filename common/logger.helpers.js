// Decide if this is better placed in logging?
export function isTypeOfVmdLogger (vmdLogger) {
    // We dont really care what type of logger is provided as long is it supports logStandardDebug/logStandardInfo/logStandardError
    if (typeof vmdLogger.logStandardDebug !== 'function' || typeof vmdLogger.logStandardInfo !== 'function' || typeof vmdLogger.logStandardError !== 'function') {
        throw new Error('VmdLogger does not provide required methods')
    }
}

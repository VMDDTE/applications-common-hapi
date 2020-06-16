import chai from 'chai'
const expect = chai.expect

function checkForCorrelationIdHeader (response, expectedCorrelationId) {
    expect(response).to.have.nested.property('config.headers')
    expect(response.config.headers).to.have.property('X-VMD-Request-Id')
    expect(response.config.headers['X-VMD-Request-Id']).to.equal(expectedCorrelationId)
}

async function expectThrowsAsync (method, errorMessage) {
    let error = null
    try {
        await method()
    } catch (err) {
        error = err
    }
    expect(error).to.be.an('Error')
    if (errorMessage) {
        expect(error.message).to.equal(errorMessage)
    }
}

function checkResponseStatusCode (response, expectedCode) {
    expect(response).to.have.property('status')
    expect(response.status).to.equal(expectedCode)
}

function checkResponseData (response, expectedPropertyName, expectedPropertyValue) {
    expect(response).to.have.property('data')
    expect(response.data).to.have.property(expectedPropertyName)
    expect(response.data[expectedPropertyName]).to.equal(expectedPropertyValue)
}

function checkLoggedErrorDetails (loggedError, expectedStatus, expectedApiServiceUrl, expectedExceptionStartsWith) {
    expect(loggedError).to.have.property('ErrorStatus')
    expect(loggedError.ErrorStatus).to.equal(expectedStatus)

    expect(loggedError).to.have.property('ApiServiceUrl')
    expect(loggedError.ApiServiceUrl).to.equal(expectedApiServiceUrl)

    expect(loggedError).to.have.property('Exception')

    const errorMessageStartsWithReqEx = new RegExp(`^${expectedExceptionStartsWith}`)
    expect(loggedError.Exception).to.match(errorMessageStartsWithReqEx)
}

function checkLoggedProtectiveMonitoringDetails (loggedPmMessage, environment, auditCode, auditDescription) {
    expect(loggedPmMessage).to.have.property('Environment')
    expect(loggedPmMessage.Environment).to.equal(environment)

    expect(loggedPmMessage).to.have.property('AuditCode')
    expect(loggedPmMessage.AuditCode).to.equal(auditCode)

    expect(loggedPmMessage).to.have.property('AuditDescription')
    expect(loggedPmMessage.AuditDescription).to.equal(auditDescription)
}

module.exports = {
    checkForCorrelationIdHeader,
    expectThrowsAsync,

    checkResponseStatusCode,
    checkResponseData,
    checkLoggedErrorDetails,
    checkLoggedProtectiveMonitoringDetails
}

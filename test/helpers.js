import chai from 'chai'
const expect = chai.expect

function checkResponseForRequestHeaders (response) {
    expect(response).to.have.nested.property('config.headers')
    return response.config.headers
}

function checkForCorrelationIdHeader (response, expectedCorrelationId) {
    const headers = checkResponseForRequestHeaders(response)
    expect(headers).to.have.property('X-VMD-Request-Id')
    expect(headers['X-VMD-Request-Id']).to.equal(expectedCorrelationId)
}

function checkResponseForRequestData (response) {
    expect(response).to.have.nested.property('config.data')
    return response.config.data
}

function checkRequestData (response, expectedPropertyName, expectedPropertyValue) {
    const data = checkResponseForRequestData(response)
    const parsedData = JSON.parse(data)
    expect(parsedData).to.have.property(expectedPropertyName)
    expect(parsedData[expectedPropertyName]).to.equal(expectedPropertyValue)
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

export {
    checkForCorrelationIdHeader,
    checkResponseForRequestData,
    checkRequestData,

    expectThrowsAsync,

    checkResponseStatusCode,
    checkResponseData,
    checkLoggedErrorDetails,
    checkLoggedProtectiveMonitoringDetails
}

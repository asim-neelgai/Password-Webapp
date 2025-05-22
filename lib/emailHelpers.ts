import AWS from 'aws-sdk'
const sendEmail = async (toEmail: string, hint: string): Promise<void> => {
  try {
    const ses = new AWS.SES({ region: 'us-east-2' })
    const emailFrom = process.env.EMAIL_FROM || ''

    const sesParams = {
      Destination: {
        ToAddresses: [toEmail]
      },
      Message: {
        Body: {
          Text: {
            Data: `Hello, \n\nYour Password hint is ${hint}`
          }
        },
        Subject: {
          Data: 'Password hint'
        }
      },
      Source: emailFrom
    }

    if (emailFrom === undefined) {
      throw new Error('EMAIL_FROM environment variable is not set')
    }
    await ses.sendEmail(sesParams).promise()
  } catch (sesError) {
    console.error('SES Error:', sesError)
  }
}
export default { sendEmail }

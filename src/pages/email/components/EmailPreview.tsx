import React from 'react'
import AppleReceiptEmail from './AppleReceiptEmail'
import GooglePlayPolicyUpdateEmail from './GooglePlayPolicyUpdateEmail'
import AWSVerifyEmail from './AWSVerifyEmail'

interface EmailPreviewProps {
  template: string
  userEmail: string
}

const EmailPreview: React.FC<EmailPreviewProps> = ({ template, userEmail }) => {
  const getEmailComponent = (template: string, userEmail: string) => {
    switch (template) {
      case 'apple':
        return <AppleReceiptEmail userEmail={userEmail} />
      case 'google':
        return <GooglePlayPolicyUpdateEmail userEmail={userEmail} />
      case 'aws':
        return <AWSVerifyEmail userEmail={userEmail} />
      default:
        return <AppleReceiptEmail userEmail={userEmail} />
    }
  }

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h2 className="text-xl font-bold mb-4">Email Preview</h2>
      <div className="border-t pt-4">
        {getEmailComponent(template, userEmail)}
      </div>
    </div>
  )
}

export default EmailPreview


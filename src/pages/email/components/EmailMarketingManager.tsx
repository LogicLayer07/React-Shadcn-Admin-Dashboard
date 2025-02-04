import React, { useState, useEffect, useCallback } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import axios from 'axios'
import ReactDOMServer from 'react-dom/server'
import AppleReceiptEmail from './AppleReceiptEmail'
import GooglePlayPolicyUpdateEmail from './GooglePlayPolicyUpdateEmail'
import AWSVerifyEmail from './AWSVerifyEmail'
import EmailPreview from './EmailPreview'
// import { sendEmails } from '@/api/emailAPI'
import { Button } from '@/components/custom/button'

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  role: string
  status: string
}

const EmailMarketingManager: React.FC = () => {
  const [users, setUsers] = useState<string>('')
  const [subject, setSubject] = useState<string>('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('apple')
  const [sendToAll, setSendToAll] = useState<boolean>(false)
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [previewEmail, setPreviewEmail] = useState<string>('user@example.com')

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await axios.get('http://localhost:10001/api/users/getall/all')
      setAllUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const renderToHtmlFallback = useCallback((component: React.ReactElement): string => {
    return ReactDOMServer.renderToStaticMarkup(component)
  }, [])

  const getEmailComponent = useCallback((template: string, userEmail: string) => {
    switch (template) {
      case 'apple':
        return <AppleReceiptEmail userEmail={userEmail} />
      case 'google':
        return <GooglePlayPolicyUpdateEmail userEmail={userEmail} />
      case 'aws':
        return <AWSVerifyEmail userEmail={userEmail} />
      default:
        return <AWSVerifyEmail userEmail={userEmail} />
    }
  }, [])

  const handleSendEmails = useCallback(async () => {
    // const userList = sendToAll ? allUsers.map(user => user.email) : users.split(',').map(email => email.trim());
    setIsLoading(true);

    try {
      // const emailPromises = userList.map(async (userEmail) => {
        // const emailComponent = getEmailComponent(selectedTemplate, userEmail);
        // const htmlContent = renderToHtmlFallback(emailComponent);
        // return sendEmails({
        //   to: userEmail,
        //   subject,
        //   html: htmlContent,
        // });
      // });

      // await Promise.all(emailPromises);
      toast({
        title: "Success",
        description: "All emails sent successfully!",
      });
    } catch (error) {
      console.error('Error sending emails:', error);
      toast({
        title: "Error",
        description: "Failed to send emails. Please check the console for more details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [sendToAll, allUsers, users, selectedTemplate, subject, getEmailComponent, renderToHtmlFallback]);

  return (
    <main className="grid flex-1 gap-4 p-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8">
        <h1 className="text-3xl font-bold mb-6 dark:text-white">Email Marketing Manager</h1>
        <div className="space-y-4">
          <div>
            <Label htmlFor="users" className="dark:text-gray-300">Users (comma-separated emails)</Label>
            <Input
              id="users"
              value={users}
              onChange={(e) => setUsers(e.target.value)}
              placeholder="user1@example.com, user2@example.com"
              disabled={sendToAll || isLoading}
              className="dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sendToAll"
              checked={sendToAll}
              onCheckedChange={(checked) => setSendToAll(checked as boolean)}
              disabled={isLoading}
            />
            <Label htmlFor="sendToAll" className="dark:text-gray-300">Send to All Users ({allUsers.length})</Label>
          </div>

          <div>
            <Label htmlFor="subject" className="dark:text-gray-300">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email Subject"
              disabled={isLoading}
              className="dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <Label htmlFor="template" className="dark:text-gray-300">Email Template</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate} disabled={isLoading}>
              <SelectTrigger className="dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple Receipt Email</SelectItem>
                <SelectItem value="google">Google Play Policy Update Email</SelectItem>
                <SelectItem value="aws">AWS Verify Email</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="previewEmail" className="dark:text-gray-300">Preview Email</Label>
            <Input
              id="previewEmail"
              value={previewEmail}
              onChange={(e) => setPreviewEmail(e.target.value)}
              placeholder="user@example.com"
              className="dark:bg-gray-700 dark:text-white"
            />
          </div>

          <Button onClick={handleSendEmails} className="w-full" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Emails'}
          </Button>
        </div>
      </div>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8">
        <EmailPreview template={selectedTemplate} userEmail={previewEmail} />
      </div>
    </main>
  )
}

export default EmailMarketingManager


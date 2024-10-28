import { Column, User } from "./schema"

export const initialData: { [key: string]: Column } = {
    draft: {
        id: 'draft',
        title: 'Draft',
        items: [
            { id: 'card1',  title: 'Server Side Template Injection (Blind)', severity: 'Critical', type: 'Hyppsto', score: 8.8, assignedTo: ['Alice'], status: 'Draft', startDate: new Date(), endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), comments: [{ id: '1', user: 'Alice', text: 'Initial discovery', timestamp: new Date() }], priority: true },
            { id: 'card2', title: 'PII Disclosure', severity: 'Medium', type: 'Datastra', score: 4.5, assignedTo: ['Bob'], status: 'Draft', startDate: new Date(), endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), comments: [{ id: '2', user: 'Bob', text: 'Needs further investigation', timestamp: new Date() }], priority: false },
            { id: 'card8', title: 'Cross-Site Scripting (XSS)', severity: 'High', type: 'Hyppsto', score: 7.0, assignedTo: ['Alice'], status: 'Draft', startDate: new Date(), endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), comments: [{ id: '8', user: 'Alice', text: 'Requires immediate attention', timestamp: new Date() }], priority: true },
            { id: 'card9', title: 'Insecure Direct Object References', severity: 'Medium', type: 'Datastra', score: 5.0, assignedTo: ['Bob'], status: 'Draft', startDate: new Date(), endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), comments: [{ id: '9', user: 'Bob', text: 'Investigate user access controls', timestamp: new Date() }], priority: false },
        ],
    },
    unsolved: {
        id: 'unsolved',
        title: 'Unsolved',
        items: [
            { id: 'card3', title: '.svn/entries Found', severity: 'Low', type: 'Hyppsto', score: 2.3, assignedTo: ['Charlie'], status: 'Unsolved', startDate: new Date(), endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), comments: [{ id: '3', user: 'Charlie', text: 'Low priority', timestamp: new Date() }], priority: false },
            { id: 'card10', title: 'SQL Injection Vulnerability', severity: 'Critical', type: 'Hyppsto', score: 9.5, assignedTo: ['David'], status: 'Unsolved', startDate: new Date(), endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), comments: [{ id: '10', user: 'David', text: 'Potentially severe, needs review', timestamp: new Date() }], priority: true },
            { id: 'card11', title: 'Unvalidated Redirects and Forwards', severity: 'High', type: 'Datastra', score: 7.5, assignedTo: ['Eve'], status: 'Unsolved', startDate: new Date(), endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), comments: [{ id: '11', user: 'Eve', text: 'Assess impact on user safety', timestamp: new Date() }], priority: false },
        ],
    },
    underReview: {
        id: 'underReview',
        title: 'Under Review',
        items: [
            { id: 'card4', title: 'JSON Web Key Set Disclosed', severity: 'High', type: 'Source C...', score: 6.5, assignedTo: ['David'], status: 'Under Review', startDate: new Date(), endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), comments: [{ id: '4', user: 'David', text: 'Reviewing impact', timestamp: new Date() }], priority: true },
            { id: 'card5', title: 'WordPress Database Backup Found', severity: 'Medium', type: 'Datastra', score: 6.5, assignedTo: ['Eve'], status: 'Under Review', startDate: new Date(), endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), comments: [{ id: '5', user: 'Eve', text: 'Assessing data exposure', timestamp: new Date() }], priority: false },
            { id: 'card12', title: 'Sensitive Data Exposure', severity: 'Critical', type: 'Hyppsto', score: 8.0, assignedTo: ['Alice'], status: 'Under Review', startDate: new Date(), endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), comments: [{ id: '12', user: 'Alice', text: 'Reviewing data security policies', timestamp: new Date() }], priority: true },
        ],
    },
    solved: {
        id: 'solved',
        title: 'Solved',
        items: [
            { id: 'card6', title: 'Phpmayadmin Information Schema Disclosure', severity: 'Critical', type: 'Hyppsto', score: 6.5, assignedTo: ['Frank'], status: 'Solved', startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), endDate: new Date(), comments: [{ id: '6', user: 'Frank', text: 'Patched and verified', timestamp: new Date() }], priority: false },
            { id: 'card7', title: 'PII Disclosure', severity: 'Critical', type: 'Datastra', score: 6.5, assignedTo: ['Grace'], status: 'Solved', startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), endDate: new Date(), comments: [{ id: '7', user: 'Grace', text: 'Data removed and systems secured', timestamp: new Date() }], priority: false },
            { id: 'card13', title: 'Buffer Overflow Vulnerability', severity: 'Critical', type: 'Hyppsto', score: 9.0, assignedTo: ['Charlie'], status: 'Solved', startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), endDate: new Date(), comments: [{ id: '13', user: 'Charlie', text: 'Issue resolved with patch', timestamp: new Date() }], priority: true },
            { id: 'card14', title: 'Cross-Site Request Forgery (CSRF)', severity: 'High', type: 'Datastra', score: 7.0, assignedTo: ['Bob'], status: 'Solved', startDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), endDate: new Date(), comments: [{ id: '14', user: 'Bob', text: 'Implemented token validation', timestamp: new Date() }], priority: false },
        ],
    },
}


export const initialUsers: User[] = [
    { id: '1', name: 'Alice', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'Bob', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: '3', name: 'Charlie', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: '4', name: 'David', avatar: 'https://i.pravatar.cc/150?img=4' },
    { id: '5', name: 'Eve', avatar: 'https://i.pravatar.cc/150?img=5' },
]

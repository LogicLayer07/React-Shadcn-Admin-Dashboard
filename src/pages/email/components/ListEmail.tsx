import ComingSoon from '@/components/coming-soon';
import { useEffect } from 'react'
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { getMails } from '@/api/emailAPI'

export default function ListEmail() {
    // const [listEmails, setLitEmails] = useState([])
    useEffect(() => {
        const handleFetch = async () => {
            // const response = await getMails();
            // setLitEmails(response);
        }
        handleFetch();
    }, [])
    return (
        <>
            <ComingSoon />
            {/* <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Emails Management</h1> */}
                {/* <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {listEmails.map((listEmail: any) => (
                            <TableRow key={listEmail.id}>
                                <TableCell>{listEmail.to}</TableCell>
                                <TableCell>{listEmail.subject}</TableCell>
                                <TableCell>{listEmail.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table> */}
            {/* </div> */}
        </>
    )
}

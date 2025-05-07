import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Button } from '@mui/material';
import { useParams } from 'react-router-dom';

const columns = [
    { id: 'no', label: 'No', minWidth: 170 },
    { id: 'name', label: 'Name', minWidth: 170 },
    {
        id: 'score',
        label: 'Score',
        minWidth: 170,
        align: 'right',
        format: (value) => (value ? value.toFixed(2) : 'N/A'),
    },
];

export default function Rank() {
    const { courseId } = useParams();
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!courseId) {
                    setError('Invalid course ID');
                    setLoading(false);
                    return;
                }

                const response = await fetch(`http://localhost:5000/history/course/${courseId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();
                console.log('API Response:', result);

                if (result.testResults && result.testResults.length > 0) {
                    // Group data by student based on student.id
                    const studentMap = result.testResults.reduce((acc, testResult) => {
                        const studentId = testResult.student.id;
                        if (!acc[studentId]) {
                            acc[studentId] = {
                                name: testResult.student.name || 'Unknown',
                                id: testResult.student.id, // Store id for Contact
                                scores: [],
                            };
                        }
                        acc[studentId].scores.push(testResult.score);
                        return acc;
                    }, {});

                    // Create rows from grouped student data
                    const studentRows = Object.keys(studentMap).map((studentId, index) => {
                        const student = studentMap[studentId];
                        const validScores = student.scores.filter(
                            (score) => score !== null && score !== undefined
                        );
                        const avgScore =
                            validScores.length > 0
                                ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length
                                : null;
                        return {
                            no: index + 1,
                            name: student.name,
                            score: avgScore,
                            id: student.id, // Include id in row
                        };
                    });

                    // Sort rows by average score (descending)
                    const sortedRows = studentRows.sort((a, b) => (b.score || 0) - (a.score || 0));
                    setRows(sortedRows);
                    console.log('Processed Rows:', sortedRows);
                } else {
                    console.log('No testResults data in API response');
                    setRows([]);
                }
                setLoading(false);
            } catch (err) {
                console.error('Fetch error:', err);
                setError('Error fetching data: ' + err.message);
                setLoading(false);
            }
        };
        fetchData();
    }, [courseId]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleContact = async (row) => {
        // Retrieve token from localStorage (adjust key as needed)
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No authentication token found');
            alert('Please log in to send a request.');
            return;
        }

        if (!row.id) {
            console.log('No student ID available for this row:', row);
            alert('Cannot send request: Student ID is missing.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/view-requests/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include token in Authorization header
                },
                body: JSON.stringify({
                    studentId: row.id, // Send student id (e.g., 680dfe700ebe8a1c5c85a102) from row
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                console.log('Request sent successfully:', data);
                alert('Request sent successfully!');
            } else {
                console.log('Request failed:', data.message);
                alert(`Request failed: ${data.message}`);
            }
        } catch (err) {
            console.error('Error sending request:', err);
            alert(`Error sending request: ${err.message}`);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} align="center">
                                    No ranking data available.
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.no}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.format && typeof value === 'number'
                                                        ? column.format(value)
                                                        : value}
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell align="center">
                                            <Button
                                                variant="text"
                                                color="primary"
                                                onClick={() => handleContact(row)}
                                                sx={{
                                                    textTransform: 'none',
                                                    fontWeight: 'bold',
                                                    '&:hover': {
                                                        textDecoration: 'underline',
                                                        backgroundColor: 'transparent',
                                                    },
                                                }}
                                            >
                                                Contact
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
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
    { id: 'no', label: 'No', minWidth: 50 },
    { id: 'name', label: 'Name', minWidth: 150 },
    {
        id: 'score',
        label: 'Score',
        minWidth: 100,
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
    // const totalPages = Math.ceil(rows.length / rowsPerPage);

    useEffect(() => {
        const fetchStudentInfo = async (id) => {
            const response = await fetch(`http://localhost:5000/students/${id}`);
            if (!response.ok) throw new Error(`Student fetch error: ${response.status}`);

            return response.json();
        };

        const fetchData = async () => {
            try {
                if (!courseId) {
                    setError('Invalid course ID');
                    setLoading(false);
                    return;
                }

                const res = await fetch(`http://localhost:5000/history/course/${courseId}`);
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

                const result = await res.json();
                const { testResults } = result;

                if (!testResults || testResults.length === 0) {
                    setRows([]);
                    setLoading(false);
                    return;
                }

                // Group scores by studentId
                const scoreMap = {};
                testResults.forEach(({ studentId, score }) => {
                    if (!scoreMap[studentId]) scoreMap[studentId] = [];
                    scoreMap[studentId].push(score);
                });

                const studentIds = Object.keys(scoreMap);

                // Fetch all student info
                const studentInfoList = await Promise.all(
                    studentIds.map(async (id) => {
                        try {
                            const studentData = await fetchStudentInfo(id);
                            console.log(studentData)
                            return { id, name: studentData.userId.userName || 'Unknown' };
                        } catch (err) {
                            console.warn(`Could not fetch student ${id}`, err);
                            return { id, name: 'Unknown' };
                        }
                    })
                );

                // Combine info
                const combinedRows = studentIds.map((id, index) => {
                    const scores = scoreMap[id].filter((s) => s !== null && s !== undefined);
                    const avgScore = scores.length > 0
                        ? scores.reduce((a, b) => a + b, 0) / scores.length
                        : null;

                    const studentInfo = studentInfoList.find((s) => s.id === id);
                    return {
                        no: index + 1,
                        name: studentInfo?.name || 'Unknown',
                        score: avgScore,
                        id,
                    };
                });                // Sort by score in descending order
                const sortedRows = combinedRows.sort((a, b) => (b.score || 0) - (a.score || 0));
                
                // Update ranking numbers based on sorted order
                const rankedRows = sortedRows.map((row, index) => ({
                    ...row,
                    no: index + 1  // Assign rank based on sorted position
                }));
                
                setRows(rankedRows);
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
        const token = localStorage.getItem('token');
        console.log(token);
        if (!token) {
            alert('Please log in to send a request.');
            return;
        }

        if (!row.id) {
            alert('Student ID is missing.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/view-requests/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ studentId: row.id }),
            });

            const data = await response.json();
            if (data.success) {
                alert('Request sent successfully!');
            } else {
                alert(`Request failed: ${data.message}`);
            }
        } catch (err) {
            alert(`Error sending request: ${err.message}`);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    // console.log("page", page, " rowsPerPage", rowsPerPage);

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
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
                        ) : (                            rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                    <TableRow hover key={row.id}>
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
                // Hiển thị số trang
                // labelDisplayedRows={({ page }) =>
                //     `Page ${page + 1} of ${Math.ceil(rows.length / rowsPerPage)}`
                // }
                // Hiển thị đầy đủ: từ phần tử nào đến phần tử nào, tổng sl là bao nhiêu, số trang
                labelDisplayedRows={({ from, to, count, page }) =>
                    `${from}–${to} of ${count} (Page ${page + 1} of ${Math.ceil(count / rowsPerPage)})`
                }
            />
            {/* <Typography
                variant="body2"
                align="center"
                sx={{ mt: 1 }}
            >
                Page {page + 1} of {Math.ceil(rows.length / rowsPerPage)}
            </Typography> */}
        </Paper>
    );
}

import React from 'react'
import Grid from '@mui/material/Grid2';
import OurFeatureClassMgmt from "../../../assets/OurFeatureClassMgmt.png";
import Typography from '@mui/material/Typography';

const ClassMgmt = () => {

    return (
        <Grid container>
            <Grid size={6}>
                <div className='flex items-center justify-center mt-[150px]'>
                    <ul className='text-lg pr-[150px] pl-[200px]'>
                        <li className='text-2xl font-medium mb-3'>
                            <span className='bg-gradient-to-r from-blue-500 to-[#00CBB8] bg-clip-text text-transparent'>
                                Class Management
                            </span> Tools for Educators
                        </li>
                        <li>
                            <Typography variant="subtitle1" color='textDisabled' gutterBottom>
                                Class provides tools to help run and manage the class such as Class Roster, Attendance, and more.
                                With the Gradebook, teachers can review and grade tests and quizzes in real-tim
                            </Typography>
                        </li>
                    </ul>
                </div>
            </Grid>
            <Grid size={6}>
                <div className='flex items-center ml-5'>
                    <img src={OurFeatureClassMgmt} alt="" />
                </div>
            </Grid>
        </Grid >
    )
}

export default ClassMgmt

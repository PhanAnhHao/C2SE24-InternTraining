import React from 'react'
import Grid from '@mui/material/Grid2';
import OurFeatureQuizzes from "../../../assets/OurFeatureQuizzes.png";
import Typography from '@mui/material/Typography';

const Quizzes = () => {

    return (
        <Grid container>
            <Grid size={6}>
                <div className='flex items-center ml-5 ml-[150px]'>
                    <img src={OurFeatureQuizzes} alt="" />
                </div>
            </Grid>
            <Grid size={6}>
                <div className='flex items-center justify-center mt-[150px] px-[100px]'>
                    <ul className='text-lg'>
                        <li className='text-2xl font-medium mb-3'>
                            Assessments, <span className='bg-gradient-to-r from-blue-500 to-[#00CBB8] bg-clip-text text-transparent'>
                                Quizzes
                            </span>, Tests
                        </li>
                        <li className=''>
                            <Typography variant="subtitle1" color='textDisabled' gutterBottom>
                                Class has a dynamic set of teaching tools built to be deployed and used during class.
                                Teachers can handout assignments in real-time for students to complete and submit.
                            </Typography>
                        </li>
                    </ul>
                </div>
            </Grid>
        </Grid >
    )
}

export default Quizzes

import React from 'react'
import Grid from '@mui/material/Grid2';
import OurFeatureTool from "../../../assets/OurFeatureTool.png";
import Typography from '@mui/material/Typography';

const Tools = () => {

    return (
        <Grid container>
            <Grid size={6}>
                <div className='flex items-center justify-center mt-[150px]'>
                    <ul className='text-lg pr-[150px] pl-[200px]'>
                        <li className='text-2xl font-medium mb-3'>
                            <span className='bg-gradient-to-r from-blue-500 to-[#00CBB8] bg-clip-text text-transparent'>
                                Tools
                            </span> For Teachers And Learners
                        </li>
                        <li>
                            <Typography variant="subtitle1" color='textDisabled' gutterBottom>
                                Class has a dynamic set of teaching tools built to be deployed and used during class.
                                Teachers can handout assignments in real-time for students to complete and submit.
                            </Typography>
                        </li>
                    </ul>
                </div>
            </Grid>
            <Grid size={6}>
                <div className='flex items-center ml-5'>
                    <img src={OurFeatureTool} alt="" />
                </div>
            </Grid>
        </Grid >
    )
}

export default Tools

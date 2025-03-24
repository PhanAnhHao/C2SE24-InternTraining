import React from 'react'
import Grid from '@mui/material/Grid2';
import OurFeatureDiscuss from "../../../assets/OurFeatureDiscuss.png";
import Typography from '@mui/material/Typography';

const Discussions = () => {

    return (
        <Grid container>
            <Grid size={6}>
                <div className='flex items-center ml-5 ml-[150px]'>
                    <img src={OurFeatureDiscuss} alt="" />
                </div>
            </Grid>
            <Grid size={6}>
                <div className='flex items-center justify-center mt-[150px] px-[100px]'>
                    <ul className='text-lg'>
                        <li className='text-2xl font-medium mb-3'>
                            One-on-One <span className='bg-gradient-to-r from-blue-500 to-[#00CBB8] bg-clip-text text-transparent'>
                                Discussions
                            </span>
                        </li>
                        <li className=''>
                            <Typography variant="subtitle1" color='textDisabled' gutterBottom>
                                Teachers and teacher assistants can talk with students privately without leaving the Zoom environment.
                            </Typography>
                        </li>
                    </ul>
                </div>
            </Grid>
        </Grid >
    )
}

export default Discussions

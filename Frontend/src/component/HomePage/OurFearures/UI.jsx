import React from 'react'
import Grid from '@mui/material/Grid2';
import OurFeatureUI from "../../../assets/OurFeatureUI.png";
import GroupsIcon from '@mui/icons-material/Groups';
import GridViewIcon from '@mui/icons-material/GridView';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';

const UI = () => {

    return (
        <Grid container>
            <Grid size={6}>
                <div className='flex items-center ml-[100px]'>
                    <img src={OurFeatureUI} alt="" />
                </div>
            </Grid>
            <Grid size={6}>
                <div className='flex items-center justify-center mt-[150px]'>
                    <ul className='text-lg'>
                        <li className='text-2xl font-medium'>
                            A <span className='bg-gradient-to-r from-blue-500 to-[#00CBB8] bg-clip-text text-transparent'>
                                user interface
                            </span> designed for the classroom
                        </li>
                        <li className='ml-5 my-3 flex items-center gap-2 text-gray-400'><GridViewIcon color='primary' />Teachers dont get lost in the grid view and have a dedicated Podium space</li>
                        <li className='ml-5 my-3 flex items-center gap-2 text-gray-400'><DirectionsWalkIcon color='primary' />TAs and presenters can be moved to the front of the class.</li>
                        <li className='ml-5 my-3 flex items-center gap-2 text-gray-400'> <GroupsIcon color='primary' />Teachers can easily see all students and class data at one time.</li>
                    </ul>
                </div>
            </Grid>
        </Grid>
    )
}

export default UI

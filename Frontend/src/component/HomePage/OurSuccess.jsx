import { Typography } from '@mui/material'
import React from 'react'

const OurSuccess = () => {
    return (
        <div className='flex items-center flex-col mt-3 mb-6'>
            <Typography variant="h3" gutterBottom>
                Our Success
            </Typography>
            <div className='text-[16px] px-[100px] mt-4 mb-6'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora iure adipisci expedita fugiat beatae inventore facere nam sit voluptatum? Esse mollitia fugit, veniam perspiciatis aliquid corrupti reiciendis possimus architecto qui.
            </div>
            <div className='flex gap-6'>
                <div className='flex flex-col items-center'>
                    <label htmlFor="" className='bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-bold text-4xl'>15K+</label>
                    <span className='text-2xl font-medium text-gray-500'>Students</span>
                </div>
                <div className='flex flex-col items-center'>
                    <label htmlFor="" className='bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-bold text-4xl'>75%</label>
                    <span className='text-2xl font-medium text-gray-500'>Success</span>
                </div>
                <div className='flex flex-col items-center'>
                    <label htmlFor="" className='bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-bold text-4xl'>35</label>
                    <span className='text-2xl font-medium text-gray-500'>Main question</span>
                </div>
                <div className='flex flex-col items-center'>
                    <label htmlFor="" className='bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-bold text-4xl'>26</label>
                    <span className='text-2xl font-medium text-gray-500'>Chief experts</span>
                </div>
                <div className='flex flex-col items-center'>
                    <label htmlFor="" className='bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-bold text-4xl'>16</label>
                    <span className='text-2xl font-medium text-gray-500'>Years of experience</span>
                </div>
            </div>
        </div>
    )
}

export default OurSuccess

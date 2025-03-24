import { Typography } from '@mui/material'
import React from 'react'
import UI from './OurFearures/UI'
import Tools from './OurFearures/Tools'
import Quizzes from './OurFearures/Quizzes'
import ClassMgmt from './OurFearures/ClassMgmt'
import Discussions from './OurFearures/Discussions'

const OurFeatures = () => {
    return (
        <>
            <div className='flex items-center flex-col'>
                <Typography variant="h3" sx={{ fontWeight: "700" }} gutterBottom>
                    Our <span className='bg-gradient-to-r from-blue-500 to-[#00CBB8] bg-clip-text text-transparent'>Features</span>
                </Typography>
                <div className='text-[16px] px-[100px] mt-4 mb-6'>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae assumenda doloremque officiis?
                </div>
            </div>
            <div>
                <UI />
                <hr className='mx-[400px] text-gray-300 my-10' />
                <Tools />
                <hr className='mx-[400px] text-gray-300 my-10' />
                <Quizzes />
                <hr className='mx-[400px] text-gray-300 my-10' />
                <ClassMgmt />
                <hr className='mx-[400px] text-gray-300 my-10' />
                <Discussions />
            </div>
        </>
    )
}

export default OurFeatures

import { Typography } from '@mui/material'
import React from 'react'
import { motion } from "motion/react";


const OurSuccess = () => {

    const ball = {
        width: 200,
        height: 200,
        borderRadius: "50%",
        background: "var(--accent)",
    }

    return (
        <div className='flex items-center flex-col mt-10 mb-6'>
            <Typography variant="h3" sx={{ fontWeight: "700" }} gutterBottom>
                Our <span className='bg-gradient-to-r from-blue-500 to-[#00CBB8] bg-clip-text text-transparent'>Success</span>
            </Typography>
            <div className='text-[16px] px-[100px] mt-4 mb-6'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora iure adipisci expedita fugiat beatae inventore facere nam sit voluptatum? Esse mollitia fugit, veniam perspiciatis aliquid corrupti reiciendis possimus architecto qui.
            </div>
            <div className='flex gap-6'>
                <motion.div style={ball}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 0.8,
                        delay: 0.5,
                        ease: [0, 0.71, 0.2, 1.01],
                    }} className='flex flex-col items-center'>
                    <label htmlFor="" className='bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-bold text-4xl'>15K+</label>
                    <span className='text-2xl font-medium text-gray-500'>Students</span>
                </motion.div>
                <motion.div style={ball}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 0.8,
                        delay: 0.5,
                        ease: [0, 0.71, 0.2, 1.01],
                    }} className='flex flex-col items-center'>
                    <label htmlFor="" className='bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-bold text-4xl'>75%</label>
                    <span className='text-2xl font-medium text-gray-500'>Success</span>
                </motion.div>
                <motion.div style={ball}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 0.8,
                        delay: 0.5,
                        ease: [0, 0.71, 0.2, 1.01],
                    }} className='flex flex-col items-center'>
                    <label htmlFor="" className='bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-bold text-4xl'>35</label>
                    <span className='text-2xl font-medium text-gray-500'>Main question</span>
                </motion.div>
                <motion.div style={ball}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 0.8,
                        delay: 0.5,
                        ease: [0, 0.71, 0.2, 1.01],
                    }} className='flex flex-col items-center'>
                    <label htmlFor="" className='bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-bold text-4xl'>26</label>
                    <span className='text-2xl font-medium text-gray-500'>Chief experts</span>
                </motion.div>
                <motion.div
                    style={ball}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 0.8,
                        delay: 0.5,
                        ease: [0, 0.71, 0.2, 1.01],
                    }} className='flex flex-col items-center'>
                    <label htmlFor="" className='bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-bold text-4xl'>16</label>
                    <span className='text-2xl font-medium text-gray-500 text-nowrap'>Years of experience</span>
                </motion.div>
            </div>
        </div>
    )
}

export default OurSuccess

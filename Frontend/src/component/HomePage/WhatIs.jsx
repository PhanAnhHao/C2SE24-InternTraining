import { Typography } from '@mui/material'
import React from 'react'

const WhatIs = () => {
    return (
        <div className='flex items-center flex-col'>
            <Typography variant="h3" sx={{ fontWeight: "700" }} gutterBottom>
                What is <span className='bg-gradient-to-r from-blue-500 to-[#00CBB8] bg-clip-text text-transparent'>Intern Training?</span>
            </Typography>
            <div className='text-[16px] px-[100px] mt-4 mb-6'>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illo repellendus saepe corporis deleniti, natus sit asperiores consequuntur ullam! Reprehenderit ipsam similique numquam non quos nihil vero molestiae, perspiciatis nostrum nemo officiis repudiandae autem consequuntur, laboriosam aliquam deleniti assumenda quaerat, ab magni voluptas. Dolore, vero earum repellat amet perferendis ipsum maiores!
            </div>
        </div>
    )
}

export default WhatIs

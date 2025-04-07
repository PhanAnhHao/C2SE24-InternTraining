import React from 'react';
import Typography from '@mui/material/Typography';
import hero_img from "../../assets/hero_img.png";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react";

const HeroContent = () => {
    const navigate = useNavigate();
    return (
        <div className='grid grid-cols-12 bg-[#49BBBD] py-0 rounded-b-[21%] h-[800px]'>
            <motion.div initial={{ x: 0 }} whileInView={{ x: 50, transition: { duration: 1.5 } }} className='left-content col-span-6 text-white px-[120px] py-[200px]'>
                <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold" }} className="">
                    <span className="text-orange-400">Studying </span>
                    Online is now much easier
                </Typography>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: "300" }}>
                    <span className='font-bold'>Intern Training</span> is an interesting platform that will teach you in more an interactive way
                </Typography>
                <Stack spacing={2} direction="row">
                    <Button
                        variant="contained"
                        sx={{ borderRadius: "80px", backgroundColor: "#7fcfd1" }}
                        onClick={() => navigate("/user-login")}
                    >Join for free
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{
                            borderRadius: "80px",
                            borderColor: "#fff",
                            color: "#000"
                        }}
                    >
                        <PlayCircleIcon sx={{ color: "#fff", fontSize: "40px", marginRight: "4px" }} />
                        Watch how it works
                    </Button>
                </Stack>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 1.5,
                    delay: 0.5,
                    ease: [0, 0.71, 0.2, 1.01],
                }}
                className='right-content col-span-6 mt-[3.5px]'>
                <img src={hero_img} className='h-[81%] py-0 pr-[20px]' />
            </motion.div>
        </div>
    )
}

export default HeroContent

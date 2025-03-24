import React from "react";
import { Box, Typography, Button, Avatar, Card, CardContent, CardMedia, IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import StarIcon from "@mui/icons-material/Star";
import testimonial_img from "../../assets/testimonial_img.png"

const Testimonial = () => {
    return (
        <Box className="flex items-center gap-[150px] px-[250px] py-[70px]">
            {/* Left Section */}
            <Box className="max-w-lg flex flex-col gap-5">
                <Typography variant="body2" className="text-blue-500 font-bold tracking-widest">
                    --TESTIMONIAL
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: "700" }} className="mt-2">
                    <span className="bg-gradient-to-r from-blue-500 to-[#00CBB8] bg-clip-text text-transparent">What They Say?</span>
                </Typography>
                <Typography variant="body1" className="text-gray-500 mt-4">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam rerum optio excepturi? Vitae, impedit ipsa?
                </Typography>
                <Typography variant="body1" className="text-gray-500 mt-4">
                    Lorem ipsum dolor sit amet.
                </Typography>

                <Button
                    variant="outlined"
                    endIcon={<ArrowForwardIcon />}
                    className="mt-6 border-teal-400 text-teal-400 rounded-full px-6 py-2"
                >
                    Write your assessment
                </Button>
            </Box>

            {/* Right Section */}
            <Box className="relative">
                {/* Image Section */}
                <Box className="bg-blue-100 rounded-3xl overflow-hidden">
                    <CardMedia
                        component="img"
                        image={testimonial_img}
                        alt="User Image"
                        className="h-[400px] w-[300px] object-cover"
                    />
                </Box>

                {/* Testimonial Card */}
                <Card className="absolute bottom-[-30px] left-8 shadow-lg rounded-lg max-w-sm">
                    <CardContent>
                        <Typography variant="body1" className="text-gray-600 mb-4">
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quidem nisi hic suscipit voluptate quisquam ipsam dignissimos alias eius. Vero, inventore.
                        </Typography>
                        <Typography variant="h6" className="font-bold">Gloria Rose</Typography>

                        <Box className="flex items-center justify-between mt-2">
                            {/* Rating */}
                            <Box className="flex text-yellow-400">
                                {[...Array(5)].map((_, index) => (
                                    <StarIcon key={index} />
                                ))}
                            </Box>
                            <Typography variant="body2" className="text-gray-500">12 reviews at Yelp</Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default Testimonial;

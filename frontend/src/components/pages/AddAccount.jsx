import '../../css/Role.css'
import { TextField, Box, Paper, Typography, Autocomplete, Button } from '@mui/material';
import React from 'react'
import { useRef, useState, useEffect } from 'react';
import bgImg from '../../img/bg.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const options = ["manufacturer", "supplier", "retailer"]



const resizeAndCompressImage = (file, maxWidth, maxHeight, quality) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                let width = img.width;
                let height = img.height;

                // Calculate new dimensions
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                // Convert the canvas to a data URL with the desired quality
                canvas.toBlob(blob => {
                    if (blob) {
                        resolve(new File([blob], file.name, { type: file.type }));
                    } else {
                        reject(new Error('Failed to convert canvas to Blob'));
                    }
                }, file.type, quality);
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
};

const AddAccount = () => {
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [pwd2, setPwd2] = useState('');
    const [role, setRole] = React.useState(options[0])
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [website, setWebsite] = useState('');
    const [location, setLocation] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [image, setImage] = useState({
        file: [],
        filepreview: null
    });
    const [uploadUrl, setUploadUrl] = useState('');


    const errRef = useRef();
    const navigate = useNavigate()

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd]);



    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        try {
            // Resize and compress the image
            const resizedFile = await resizeAndCompressImage(file, 800, 800, 0.7); // Adjust dimensions and quality as needed
            setImage({
                file: resizedFile,
                filePreview: URL.createObjectURL(resizedFile)
            });
        } catch (error) {
            console.error('Error handling image change:', error);
            console.error('Error processing image:', error);
        }
    };

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'qedxcm3e'); // Replace with your upload preset

        try {
            const response = await axios.post('https://api.cloudinary.com/v1_1/drcgoyb28/image/upload', formData);
            return response.data.secure_url; // URL of the uploaded image
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };




    const handleBack = () => {
        navigate(-1)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();


        //image upload
        let url = "";

        if (image.file) {
            try {
                url = await uploadImage(image.file);
                setUploadUrl(url);
            } catch (error) {
                console.error('Upload failed:', error);
                return; // Stop execution if image upload fails
            }
        } else {
            console.log('No image selected.');
        }

        //create account and profile
        try {
            const accountData = JSON.stringify({
                "username": user,
                "password": pwd,
                "role": role,
                'fullname': name,
                'confirmPassword': pwd2
            });

            const profileData = JSON.stringify({
                "username": user,
                "name": name,
                "desc": description,
                "website": website,
                "location": location,
                "imageurl": url,
                "role": role,
                
            });

            const res = await axios.post('http://localhost:5000/api/auth/signup', accountData,
                {
                    headers: { 'Content-Type': 'application/json' },
                });

            // console.log(JSON.stringify(res.data));

            const res2 = await axios.post('http://localhost:5000/api/user/createAccount', profileData,
                {
                    headers: { 'Content-Type': 'application/json' },
                });

            console.log(JSON.stringify(res2.data));



            setUser('');
            setPwd('');
            setPwd2('');
            setRole(options[0]);
            setName('');
            setDescription('');
            setWebsite('');
            setLocation('');
            setImage({
                file: [],
                filepreview: null
            });

            navigate('/admin', { replace: true });

        } catch (err) {
            if (!err?.response) {
                setErrMsg('Server is down. Please try again later.');
            } else if (err.response?.status === 400) {
                setErrMsg('Invalid username or password.');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized access.');
            } else {
                console.log(err);
                setErrMsg('Login Failed. Please try again later.');
            }
            errRef.current.focus();
        }

    };


    return (
        <Box sx={{
            backgroundImage: `url(${bgImg})`,
            minHeight: "100vh",
            backgroundRepeat: "no-repeat",
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundSize: 'cover',
            zIndex: -2,
            overflowY: "scroll"

        }}>
            <Paper elevation={3} sx={{ width: "400px", margin: "auto", marginTop: "10%", marginBottom: "10%", padding: "3%", backgroundColor: "#e3eefc" }}>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

                <Typography
                    variant="h2"
                    sx={{
                        textAlign: "center", marginBottom: "3%",
                        fontFamily: 'Gambetta', fontWeight: "bold", fontSize: "2.5rem"
                    }}
                >
                    Add Account</Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        id="outlined-basic"
                        margin="normal"
                        label="Username"
                        variant="outlined"
                        inherit="False"
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                    />

                    <TextField
                        fullWidth
                        id="outlined-basic"
                        margin="normal"
                        label="Password"
                        type='password'
                        variant="outlined"
                        inherit="False"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                    />

                    <TextField
                        fullWidth
                        id="outlined-basic"
                        margin="normal"
                        label="Confirm Password"
                        type='password'
                        variant="outlined"
                        inherit="False"
                        onChange={(e) => setPwd2(e.target.value)}
                        value={pwd2}
                    />

                    {pwd === pwd2 ? null :
                        <Typography
                            variant="body2"
                            sx={{
                                textAlign: "center",
                                fontSize: "12px", color: "red"
                            }}
                        >
                            Passwords do not match
                        </Typography>

                    }

                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={options}
                        fullWidth
                        value={role}
                        onChange={(event, newRole) => {
                            setRole(newRole);
                        }}
                        renderInput={(params) =>
                            <TextField {...params}
                                fullWidth
                                id="outlined-basic"
                                margin="normal"
                                label="Role"
                                variant="outlined"
                                inherit="False"

                            />}
                    />

                    <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        // onChange = {handleImage}
                        sx={{ marginTop: "3%" }}
                    >
                        Upload Image
                        <input
                            type="file"
                            hidden
                            onChange={handleImageChange}
                        />
                    </Button>

                    {image.filePreview && (
                        <img src={image.filePreview} alt="preview" style={{ width: "100%", height: "100%" }} />
                    )}
                    <TextField
                        fullWidth
                        id="outlined-basic"
                        margin="normal"
                        label="Name"
                        variant="outlined"
                        inherit="False"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />

                    <TextField
                        fullWidth
                        id="outlined-basic"
                        margin="normal"
                        label="Description"
                        variant="outlined"
                        inherit="False"
                        multiline
                        minRows={2}
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                    />

                    <TextField
                        fullWidth
                        id="outlined-basic"
                        margin="normal"
                        label="Website"
                        variant="outlined"
                        inherit="False"
                        onChange={(e) => setWebsite(e.target.value)}
                        value={website}
                    />

                    <TextField
                        fullWidth
                        id="outlined-basic"
                        margin="normal"
                        label="Location"
                        variant="outlined"
                        inherit="False"
                        onChange={(e) => setLocation(e.target.value)}
                        value={location}
                    />

                    <Button
                        variant="contained"
                        type="submit"
                        sx={{ width: "100%", marginTop: "3%", backgroundColor: '#98b5d5', '&:hover': { backgroundColor: '#618dbd' } }}
                    >
                        Add Account
                    </Button>

                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >


                        <Button
                            onClick={handleBack}
                            sx={{
                                marginTop: "5%",
                            }}
                        >
                            Back
                        </Button>

                    </Box>

                </form>
            </Paper>
        </Box>
    );
}

export default AddAccount;
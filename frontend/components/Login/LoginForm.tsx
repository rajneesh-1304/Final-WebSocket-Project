"use client";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { Password, Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import "./login.css";
import { auth, db, gitProvider, provider } from "../../app/config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { loginThunk, registerThunk } from "@/app/redux/features/users/userSlice";
import { useAppSelector } from "@/app/redux/hooks";
import { signOut } from "firebase/auth";
import connectWebSocket from "../websocket/websocket";
import { io } from "socket.io-client";

const LoginUserSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(8, { message: "Password is required" }),
});

type LoginFormInputs = z.infer<typeof LoginUserSchema>;

interface UserState {
  users: LoginFormInputs[];
  isAuthenticated: boolean;
}

interface RootState {
  users: UserState;
}
const socket = io('http://localhost:5000');

export default function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const err = useAppSelector((state: any) => state.users.error)
  const currentUser = useAppSelector(state => state.users.currentUser);
  // const socket = io("http://localhost:5000");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  useEffect(()=>{
    if(currentUser){
      connectWebSocket(currentUser.id);
    }
  },[currentUser])

  // useEffect(()=>
  //    {
  //   socket.on('otp_sent', (data) => {
  //     alert('OTP Sent! Status: ' + data.status);
  //   });

  //   return () => socket.off('otp_sent');
  // }, []);

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.email) {
        throw new Error("Google account has no email");
      }

      const loginData = {
        email: user.email,
        password: 'Pass@123'
      }

      const loginResponse = await dispatch(loginThunk(loginData));

      if (loginThunk.fulfilled.match(loginResponse)) {
        setSnackbarMessage("Login successful!");
        setSnackbarOpen(true);
        router.push('/')
      }
    } catch (error) {
      await signOut(auth);
      setSnackbarMessage(error);
      setSnackbarOpen(true);
    }
  };

  const verifyOtp = () => {
    socket.connect();
    const payload = {
      userId:currentUser?.id,
      otp:otp,
    }
    console.log(otp,"otp")
    socket.emit('otp', payload);
    console.log('OTP event sent');
  }


  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await signInWithEmailAndPassword(auth, data.email, data.password);

      const loginData = {
        email: data.email,
        password: data.password
      }
      const loginResponse = await dispatch(loginThunk(loginData));

      if (loginThunk.fulfilled.match(loginResponse)) {
        setSnackbarMessage("Login successful!");
        setSnackbarOpen(true);
        setTimeout(() => router.push('/'), 1200);
      } else {
        await signOut(auth);
        setSnackbarMessage(`${err.message ? err.message : err}`);
        setSnackbarOpen(true);
        setShowOtpInput(true);
      }

    } catch (error: any) {
      setSnackbarMessage(`${error.message ? error.message : error}`);
      setSnackbarOpen(true);
    }

  };

  return (
    <div className="main-form">

      <Button
        variant="contained"
        sx={{ mb: 4, width: 320, }}
        onClick={handleSignIn}
      >
        Sign in With Google
      </Button>

      <form className="formm" onSubmit={handleSubmit(onSubmit)}>
        <h1 className='register_heading'>Login</h1>
        <Box sx={{ display: "flex", flexDirection: "column", width: 300, gap: 1, mt: 1, padding: 1, paddingBottom: 1 }}>
          <FormControl variant="standard">
            <TextField
              label="Email"
              variant="standard"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
            />
          </FormControl>

          <FormControl variant="standard">
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="standard"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>



          <Button variant="contained" sx={{ mt: 2 }} type="submit">
            Login
          </Button>
        </Box>


      </form>


      <div className="register">
        <p>
          Not Registered{" "}
          <span className="register_link" onClick={() => router.push("/register")}>
            Register
          </span>
        </p>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleClose}
        message={snackbarMessage}
      />

      {showOtpInput && (

        <Box display="flex" marginTop="10px" flexDirection="column" gap={2}>
          <TextField
            label="Enter OTP"
            variant="outlined"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          // error={!!errors.email}
          // helperText={errors.email ? errors.email.message : ""}
          />
          <Button variant="contained" color="primary" onClick={verifyOtp}>
            Verify OTP
          </Button>
        </Box>

      )}
    </div>
  );
}

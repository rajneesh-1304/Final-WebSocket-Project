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
import { loginThunk, logout, registerThunk } from "@/app/redux/features/users/userSlice";
import { useAppSelector } from "@/app/redux/hooks";
import { signOut } from "firebase/auth";
import { connectSocket, getSocket } from "../websocket/websocket";
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

export default function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const err = useAppSelector((state: any) => state.users.error)
  const currentUser = useAppSelector(state => state.users.currentUser);
  let emaill: string = "";
  // const socket = io("http://localhost:5000")
  const forceLogout = (message?: string) => {
    dispatch(logout());
    signOut(auth).catch(() => { });
    setSnackbarMessage(message || "Session expired. Please login again.");
    setSnackbarOpen(true);
    router.push("/login");
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
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

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("session_removed", async (data) => {
      console.log("Session removed:", data.message);
      dispatch(logout());
      router.push("/login");
    });

    socket.on("disconnect", async (reason) => {
      console.log("Socket disconnected:", reason);
      dispatch(logout());
      router.push("/login");
    });

    socket.on("otp_generated", (data) => {
      console.log("OTP received:", data.otp);
      setGeneratedOtp(data.otp);
    });

    return () => {
      socket.off("session_removed");
      socket.off("disconnect");
      socket.off("otp_generated");
    };
  }, [dispatch, router]);

  useEffect(() => {
    if (currentUser?.id) {
      connectSocket(currentUser?.id);

      const socket = getSocket();
      if (!socket) return;
      const handleSessionRemoved = (data: any) => {
        console.log("Session removed:", data.message);
        forceLogout(data.message);
      };

      const handleDisconnect = (reason: string) => {
        console.log("Socket disconnected:", reason);
        if (reason === "io server disconnect") {
          forceLogout("You were logged out from another device");
        }
      };

      socket.on("session_removed", handleSessionRemoved);
      socket.on("disconnect", handleDisconnect);

      return () => {
        socket.off("session_removed", handleSessionRemoved);
        socket.off("disconnect", handleDisconnect);
      };
    }
  }, [currentUser?.id]);


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
    const socket = getSocket();
    if (!socket) {
      return;
    }

    socket.emit("verify_otp", { otp, emaill });
    setSnackbarMessage("Now you can login");
    setSnackbarOpen(true);
  };


  const generateOtp = () => {
    const socket = getSocket();
    if (!socket) {
      console.error("❌ Socket not connected");
      return;
    }

    socket.emit("generate_otp");

    setSnackbarMessage("OTP sent to your device");
    setSnackbarOpen(true);
  };



  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await signInWithEmailAndPassword(auth, data.email, data.password);

      const loginData = {
        email: data.email,
        password: data.password
      }
      const loginResponse = await dispatch(loginThunk(loginData));
      emaill = data.email;

      if (loginThunk.fulfilled.match(loginResponse)) {
        setSnackbarMessage("Login successful!");
        setSnackbarOpen(true);
        setTimeout(() => router.push('/'), 1200);
      } else {
        await signOut(auth);
        const userId = 123;
        if (userId) {
          connectSocket(userId, "otp");
        }
        setSnackbarMessage(`Max Reach of Login, Verify with Otp to login`);
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
          <Button
            variant="outlined"
            color="secondary"
            onClick={generateOtp}
          >
            Generate OTP
          </Button>
          {generatedOtp && (
            <Box
              sx={{
                padding: "10px",
                border: "1px dashed #1976d2",
                borderRadius: "6px",
                textAlign: "center",
                fontWeight: "bold",
                color: "#1976d2",
              }}
            >
              Generated OTP: {generatedOtp}
            </Box>
          )}
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

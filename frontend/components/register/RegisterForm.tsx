"use client";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import "./register.css";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { auth, provider, db, gitProvider } from "../../app/config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { collection, addDoc, serverTimestamp, setDoc, doc, } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/app/redux/store";
import { registerThunk } from "@/app/redux/features/users/userSlice";
import { FormHelperText } from "@mui/material";
import './register.css'
import { useAppDispatch } from "@/app/redux/hooks";


const RegisterUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .regex(/^[A-Za-z ]+$/, "Name can only contain letters and spaces"),

  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password cannot exceed 20 characters")
    .regex(/^\S*$/, "Password cannot contain spaces")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[!@#$%^&*]/, "Must contain at least one special character"),
});

type RegisterFormInputs = z.infer<typeof RegisterUserSchema>;

export default function RegisterForm() {
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleTogglePassword = () => setShowPassword((prev) => !prev);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");


  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.email) {
        throw new Error("Google account has no email");
      }

      const registerData = {
        displayName: user.displayName,
        email: user.email,
        password: 'Pass@123'
      };

      const registerResponse = await dispatch(registerThunk(registerData));

      if (!registerThunk.fulfilled.match(registerResponse)) {
        await signOut(auth);
        throw new Error("Registration failed");
      } else {
        setSnackbarMessage("Account created successfully");
        setSnackbarOpen(true);
        router.push('/login')
      }
    } catch (error: any) {
      const message =
        error?.message?.includes("Email already registered") ||
          error?.response?.data?.message?.includes("Email already registered")
          ? "User already exists, please login"
          : "Something went wrong";

      setSnackbarMessage(message);
      setSnackbarOpen(true);
    }
  };

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      const docRef = await addDoc(collection(db, 'auth'), {
        name: data.name,
        email: data.email,
        password: data.password
      });

      const dat = {
        displayName: data.name,
        email: data.email,
        password: data.password
      }
      await dispatch(registerThunk(dat)).unwrap();
      setSnackbarMessage('User created successfully!');
      setSnackbarOpen(true);
      setTimeout(() => {
        router.push('/login');
      }, 1200);
    }
    catch (err: any) {
      console.log(err, 'error is here ')
      const message =
        err?.message?.includes("email-already-in-use") ||
          err?.response?.data?.message?.includes("Email already registered")
          ? "User already exists, please login"
          : err?.message || "Registration failed";

      setSnackbarMessage(message);
      setSnackbarOpen(true);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });


  useEffect(() => {
    console.log(errors)
  }, [errors])


  return (
    <div className="main-form">
      <form className="formm" onSubmit={handleSubmit(onSubmit)}>
        <h1 className='register_heading'>Create Account</h1>
        <Box sx={{ display: "flex", flexDirection: "column", width: 300, gap: 1, mt: 1, padding: 1, paddingBottom: 1 }}>

          <FormControl variant="standard">
            <TextField
              label="Name"
              variant="standard"
              size="small"
              {...register("name", { required: "Name is required" })}
              error={!!errors.name}
              helperText={errors.name ? errors.name.message : ""}
            />
          </FormControl>

          <FormControl variant="standard">
            <TextField
              label="Email"
              size="small"
              variant="standard"
              {...register("email", { required: "Email is required" })}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
            />
          </FormControl>

          <FormControl variant="standard" fullWidth>
            <TextField
              label="Password"
              size="small"
              type={showPassword ? "text" : "password"}
              variant="standard"
              {...register("password", { required: "Password is required" })}
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

          <Button variant="contained" sx={{ mt: 1.5, mb: 1 }} type="submit">
            Register
          </Button>
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={handleClose}
          message={snackbarMessage}
        ></Snackbar>
      </form>
      <Button variant="contained" sx={{ mt: 1.5, width: 320, }} onClick={handleSignIn}>
        Sign Up With Google
      </Button>

      <div
        className='login'><p>Already Registered <span className='login_link' onClick={() => { router.push('/login') }}>Login</span></p>
      </div>

    </div>
  );
}

'use client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Input, { ExInput } from '../extra/Input';
import Logo from '../assets/images/logo.png';
import Image from 'next/image';
import Button from '../extra/Button';
import { useAppDispatch } from '@/store/store';
import { useRouter } from 'next/router';
import { login } from '@/store/adminSlice';
import LoginImage from '../../src/assets/images/login12.png';
import drplus from '../../src/assets/images/drplus.png';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { projectName } from '@/utils/config';

interface RootState {
  admin: {
    isAuth: boolean;
    admin: Object;
  };
}

export default function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuth, admin } = useSelector((state: RootState) => state.admin);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
 

  const [error, setError] = useState({
    email: '',
    password: '',
  });

  const [type, setType] = useState("password")
  const hideShow = () => {
    type === "password" ? setType("text") : setType("password");
  };

  

  

  const handleSubmit = () => {
    if (!email || !password) {
      let errorObj: any = {};
      if (!email) errorObj = { ...errorObj, email: 'Email Is Required !' };
      if (!password)
        errorObj = { ...errorObj, password: 'Password is required !' };
      return setError(errorObj);
    } else {
      let payload: any = {
        email,
        password,
      };
      setLoginLoading(true);
      dispatch(login(payload))
        .unwrap()
        .catch(() => {
          // error toast handled in slice
        })
        .finally(() => {
          setLoginLoading(false);
        });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    
      if (event.key === 'Enter') {
        event.preventDefault();
        handleSubmit();
      
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      router.replace('/dashboard');
    }
  }, []);

  return (

    <div className=" d-flex " style={{ height: "100vh" }}>
      <div className="d-none d-md-flex flex-column vh-100 w-100 bg-primary-custom ">
        {/* Logo / Content Section */}
        <div className="d-flex justify-content-center align-items-center text-white flex-grow-1 ">
          <img
            src={`/images/drplus.png`}
            alt="Dr Plus"
            className="img-fluid object-cover"
            style={{ objectPosition: "right" }}
          />
        </div>

        {/* Bottom Illustration */}
        <div className="w-85 mx-auto">
          <img
            src={`/images/login12.png`}
            alt="Login Illustration"
            className="img-fluid object-cover"
            style={{ objectPosition: "right" }}
          />
        </div>
      </div>



      <div className=" w-100">
        <div className="align-items-center d-flex h-100  object-fit-cover justify-content-center w-100">
          <div className="w-50 w-md-100">
            <div>
              <img
                src={`/images/logo.png`}
                alt="Logo"
                className="mb-2"
                height={75}
                width={75}
              />
            </div>
            <h2 className="fw-semibold">Login to your account</h2>
            <p className="text-secondary">
              Let's connect, chat, and spark real connections. Enter your
              credentials to continue your journey on {projectName}.
            </p>
            <div className="custom-input">
              <label >Email</label>
              <input
                className="form-control border"
                name={"email"}
                id={`loginEmail`}
                placeholder={"Enter Email"}
                type={`email`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      email: `Email Is Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      email: "",
                    });
                  }
                }}
                autoComplete="username"
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="custom-input">
              <label >Password</label>
              <div className="input-group">
                <input
                  type={type}
                  value={password}
                  name="password"
                  className="form-control border border-end-0 password-input"
                  placeholder="Enter Password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (!e.target.value) {
                      return setError({
                        ...error,
                        password: `Password Is Required`,
                      });
                    } else {
                      return setError({
                        ...error,
                        password: "",
                      });
                    }
                  }}
                  autoComplete="current-password"
                  onKeyPress={handleKeyPress}
                />
                <span
                  className="input-group-text border border-start-0 bg-white"
                  id="basic-addon2"
                >
                  {
                    type === "password" ? (
                      <IconEyeOff onClick={hideShow} className="text-secondary cursor-pointer" />
                    ) : (
                      <IconEye onClick={hideShow} className="text-secondary cursor-pointer" />
                    )
                  }
                </span>
              </div>
              <p className="errorMessage">
                {error.password && error.password}
              </p>
            </div>
            <div className="d-flex flex-column justify-content-center w-100 gap-3 mt-4">
              <Button
                text={loginLoading ? "Logging in..." : "Login"}
                className={"login-btn  w-100 py-2 fw-medium"}
                onClick={handleSubmit}
                disabled={loginLoading}
                btnColor={loginLoading ? "btn-disabled" : ""}
              />
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';
import React, { useState } from 'react';
import Button from '../extra/Button';
import { useAppDispatch } from '@/store/store';
import { useRouter } from 'next/router';
import { signUpAdmin } from '@/store/adminSlice';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { projectName } from '@/utils/config';
import { ExInput } from '@/extra/Input';

interface RootState {
  admin: {
    isAuth: boolean;
    admin: Object;
  };
}

export default function Registration() {
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [userPurchaseCode, setUserPurchaseCode] = useState('');
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [error, setError] = useState({
    email: '',
    password: '',
    newPassword: '',
    userPurchaseCode: '',
  });
  const [type, setType] = useState("password")
  const hideShow = () => {
    type === "password" ? setType("text") : setType("password");
  };

  const handleSubmit = async () => {
    if (
      !email ||
      !password ||
      
      !newPassword ||
      newPassword !== password ||
      !userPurchaseCode
    ) {
      let errorObj: any = {};
      if (!email) errorObj = { ...errorObj, email: 'Email Is Required !' };
      if (!password)
        errorObj = { ...errorObj, password: 'Password is required !' };
      if (!newPassword)
        errorObj = {
          ...errorObj,
          newPassword: 'Confirm Password is required !',
        };

      if (newPassword !== password)
        errorObj = {
          ...errorObj,
          newPassword: "Password and Confirm Password doesn't match !",
        };
      

      if (!userPurchaseCode)
        errorObj = {
          ...errorObj,
          userPurchaseCode: 'User purchase code is required !',
        };

      return setError(errorObj);
    } else {
      let payload: any = {
        email,
        password,
        userLicenseKey: userPurchaseCode,
      };
      setSignUpLoading(true);
      dispatch(signUpAdmin(payload))
        .unwrap()
        .then((res: any) => {
          if (res?.status) {
            window.location.reload();
          }
        })
        .catch(() => {
          // error toast handled in slice
        })
        .finally(() => {
          setSignUpLoading(false);
        });
    }
  };

  return (
    <>
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
          <div className="align-items-center d-flex h-100 justify-content-center w-100">
            <div className="w-50">
              <div>
                <img
                  src={`/images/logo.png`}
                  alt="Logo"
                  className="mb-2"
                  height={75}
                  width={75}
                />
              </div>
              <h2 className="fw-semibold">Sign Up to your account</h2>
              <p className="text-secondary">
                Let's connect, chat, and spark real connections. Enter your
                credentials to continue your journey on {projectName}.
              </p>
              <ExInput
                label={`Email`}
                placeholder={"Enter Email"}
                id={`loginEmail`}
                type={`email`}
                value={email}
                errorMessage={error.email && error.email}
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
              />
              <div className="custom-input">
                <label>Password</label>
                <div className="input-group">
                  <input
                    type={type}
                    value={password}

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
                  />
                  <span
                    className="input-group-text border border-start-0"
                    id="basic-addon2"
                  >
                    {type === "password" ? (
                      <IconEye
                        onClick={hideShow}
                        className="text-secondary cursor-pointer"
                      />
                    ) : (
                      <IconEyeOff
                        onClick={hideShow}
                        className="text-secondary cursor-pointer"
                      />
                    )}
                  </span>
                </div>
                <p className="errorMessage">
                  {error.password && error.password}
                </p>
              </div>
              <div className="custom-input">
                <label>Confirm Password</label>
                <div className="input-group">
                  <input
                    type={type}
                    value={newPassword}
                    className="form-control border border-end-0 password-input"
                    placeholder="Enter Confirm Password"
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          newPassword: `Confirm Password Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          newPassword: "",
                        });
                      }
                    }}
                  />
                  <span
                    className="input-group-text border border-start-0"
                    id="basic-addon2"
                  >
                    {type === "password" ? (
                      <IconEyeOff
                        onClick={hideShow}
                        className="text-secondary cursor-pointer"
                      />
                    ) : (
                      <IconEye
                        onClick={hideShow}
                        className="text-secondary cursor-pointer"
                      />
                    )}
                  </span>
                </div>
                <p className="errorMessage">
                  {error.newPassword && error.newPassword}
                </p>
              </div>

              

              <div className="col-12 ">
                <ExInput
                  type={`text`}
                  id={`userpurchasecode`}
                  name={`userpurchasecode`}
                  value={userPurchaseCode}
                  label={`Purchase code`}
                  placeholder={`Enter User Purchase code`}
                  errorMessage={error.userPurchaseCode && error.userPurchaseCode}
                  onChange={(e: any) => {
                    setUserPurchaseCode(e.target.value);
                    if (!e.target.value) {
                      return setError({
                        ...error,
                        userPurchaseCode: `User Purchase Code Is Required`,
                      });
                    } else {
                      return setError({
                        ...error,
                        userPurchaseCode: "",
                      });
                    }
                  }}
                />
              </div>

              <div className="d-flex flex-column justify-content-center w-100 gap-3 mt-4">
                <Button
                  text={signUpLoading ? "Signing up..." : "Sign Up"}
                  newClass={"login-btn login w-100 py-2 fw-medium"}
                  onClick={handleSubmit}
                  disabled={signUpLoading}
                  btnColor={signUpLoading ? "btn-disabled" : ""}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

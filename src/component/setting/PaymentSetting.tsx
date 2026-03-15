import { getSetting, handleSetting, updateSetting } from '@/store/settingSlice';
import { RootStore, useAppDispatch } from '@/store/store';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import InfoTooltip from '../../extra/InfoTooltip';
import ToggleSwitch from '../../extra/TogggleSwitch';
import { cashfreeContent, flutterWaveContent, paypalContent, paystackContent, razorpayContent, resendApiSetting, stripeContent, zegoSetting } from '../../extra/infoContent';

interface ErrorState {
  razorPaySecretKeyText: string;
  razorPayIdText: string;
  stripeSecretKeyText: string;
  stripePublishableKeyText: string;
  flutterWaveKeyText: string;
  paystackPublicKey: string;
  paystackSecretKey: string;
  cashfreeClientId: string;
  cashfreeClientSecret: string;
  paypalClientId: string;
  paypalSecretKey: string;
}

const PaymentSetting = () => {
  const { setting }: any = useSelector((state: RootStore) => state?.setting);


  const [razorPaySecretKeyText, setrazorPaySecretKeyText] = useState<any>();
  const [razorPayIdText, setRazorPayIdText] = useState<any>();
  const [stripeSecretKeyText, setStripeSecretKeyText] = useState<any>();
  const [stripePublishableKeyText, setstripePublishableKeyText] =
    useState<any>();
  const [flutterWaveKeyText, setFlutterWaveKeyText] = useState<any>();
  const [paystackPublicKey, setPaystackPublicKey] = useState<any>();
  const [paystackSecretKey, setPaystackSecretKey] = useState<any>();
  const [cashfreeClientId, setCashfreeClientId] = useState<any>();
  const [cashfreeClientSecret, setCashfreeClientSecret] = useState<any>();
  const [paypalClientId, setPaypalClientId] = useState<any>();
  const [paypalSecretKey, setPaypalSecretKey] = useState<any>();
  const [data, setData] = useState<any>();

  const [error, setError] = useState<any>({
    razorPaySecretKeyText: '',
    razorPayIdText: '',
    stripeSecretKeyText: '',
    stripePublishableKeyText: '',
    flutterWaveKeyText: '',
    paystackPublicKey: '',
    paystackSecretKey: '',
    cashfreeClientId: '',
    cashfreeClientSecret: '',
    paypalClientId: '',
    paypalSecretKey: '',
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    
      dispatch(getSetting());
    
  }, [dispatch]);

  useEffect(() => {
    setData(setting);
  }, [setting]);

  useEffect(() => {
    setrazorPaySecretKeyText(setting?.razorSecretKey);
    setRazorPayIdText(setting?.razorPayId);
    setStripeSecretKeyText(setting?.stripeSecretKey);
    setstripePublishableKeyText(setting?.stripePublishableKey);
    setFlutterWaveKeyText(setting?.flutterWaveKey);
    setPaystackPublicKey(setting?.paystackPublicKey);
    setPaystackSecretKey(setting?.paystackSecretKey);
    setCashfreeClientId(setting?.cashfreeClientId);
    setCashfreeClientSecret(setting?.cashfreeClientSecret);
    setPaypalClientId(setting?.paypalClientId);
    setPaypalSecretKey(setting?.paypalSecretKey);
  }, [setting]);

  const handleSubmit = (e) => {


    if (
      !razorPaySecretKeyText ||
      !razorPayIdText ||
      !stripeSecretKeyText ||
      !stripePublishableKeyText ||
      !flutterWaveKeyText ||
      !paystackPublicKey ||
      !paystackSecretKey ||
      !cashfreeClientId ||
      !cashfreeClientSecret ||
      !paypalClientId ||
      !paypalSecretKey
    ) {
      {
        let error = {} as ErrorState;
        if (!razorPaySecretKeyText)
          error.razorPaySecretKeyText = 'RazorPay SecretKey Is Required !';
        if (!razorPayIdText) error.razorPayIdText = 'RazorPayId Is Required !';

        if (!stripeSecretKeyText)
          error.stripeSecretKeyText = 'stripePay SecretKey is Required!';
        if (!stripePublishableKeyText)
          error.stripePublishableKeyText =
            'stripePay PublishableKey Is Required !';
        if (!flutterWaveKeyText)
          error.flutterWaveKeyText = 'FlutterWaveKey Is Required !';
        if (!paystackPublicKey)
          error.paystackPublicKey = 'Paystack Public Key is Required !';
        if (!paystackSecretKey)
          error.paystackSecretKey = 'Paystack Secret Key is Required !';
        if (!cashfreeClientId)
          error.cashfreeClientId = 'Cashfree Client Id is Required !';
        if (!cashfreeClientSecret)
          error.cashfreeClientSecret = 'Cashfree Client Secret is Required !';
        if (!paypalClientId)
          error.paypalClientId = 'Paypal Client Id is Required !';
        if (!paypalSecretKey)
          error.paypalSecretKey = 'Paypal Secret Key is Required !';

        return setError({ ...error });
      }
    } else {
      const payload: any = { settingId: data?._id };

      if (razorPaySecretKeyText !== setting?.razorSecretKey) {
        payload.razorSecretKey = razorPaySecretKeyText;
      }
      if (razorPayIdText !== setting?.razorPayId) {
        payload.razorPayId = razorPayIdText;
      }
      if (stripeSecretKeyText !== setting?.stripeSecretKey) {
        payload.stripeSecretKey = stripeSecretKeyText;
      }
      if (stripePublishableKeyText !== setting?.stripePublishableKey) {
        payload.stripePublishableKey = stripePublishableKeyText;
      }
      if (flutterWaveKeyText !== setting?.flutterWaveKey) {
        payload.flutterWaveKey = flutterWaveKeyText;
      }
      if (paystackPublicKey !== setting?.paystackPublicKey) {
        payload.paystackPublicKey = paystackPublicKey;
      }
      if (paystackSecretKey !== setting?.paystackSecretKey) {
        payload.paystackSecretKey = paystackSecretKey;
      }
      if (cashfreeClientId !== setting?.cashfreeClientId) {
        payload.cashfreeClientId = cashfreeClientId;
      }
      if (cashfreeClientSecret !== setting?.cashfreeClientSecret) {
        payload.cashfreeClientSecret = cashfreeClientSecret;
      }
      if (paypalClientId !== setting?.paypalClientId) {
        payload.paypalClientId = paypalClientId;
      }
      if (paypalSecretKey !== setting?.paypalSecretKey) {
        payload.paypalSecretKey = paypalSecretKey;
      }

      if (Object.keys(payload).length > 1) {
        dispatch(updateSetting(payload));
      }
    }
  };

  const handleSettingSwitch: any = (id: any, type: any) => {
    const payload = {
      id,
      type,
    };
    dispatch(handleSetting(payload));
  };

  return (
    <div>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h6 style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>Payment Setting</h6>
          <p style={{ margin: 0, fontSize: 12, color: '#9CA3AF' }}>Configure payment gateways for your app</p>
        </div>
        <button onClick={handleSubmit} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#6366F1', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Save Changes
        </button>
      </div>
      <div className="row" style={{ padding: '15px' }}>
          <div className="col-12 col-md-6">
            <div className="withdrawal-box payment-box">
              <h6 className='d-flex align-items-center justify-content-between'>Stripe Pay Setting
                <InfoTooltip title="Stripe Pay Setting" content={stripeContent} />
              </h6>
              <div className="row">
                <div className="col-12 withdrawal-input border-setting">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>Stripe Android</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>(enable/disable for payment in app)</p>
                  </div>
                  <ToggleSwitch
                      value={setting?.isStripePay}
                      onClick={() => handleSettingSwitch(setting?._id, 2)}
                    />
                  </div>
                </div>
                <div className="col-12 withdrawal-input border-setting">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>Stripe iOS</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>(enable/disable for payment in app)</p>
                  </div>
                  <ToggleSwitch
                      value={setting?.stripeIosEnabled}
                      onClick={() => handleSettingSwitch(setting?._id, 11)}
                    />
                  </div>
                </div>
                <div className="col-12 withdrawal-input border-setting">
                  <label htmlFor="stripePublishableKey">Stripe Publishable Key</label>
                  <input
                    type={`text`}
                    id={`stripePublishableKey`}
                    name={`stripePublishableKey`}
                    placeholder={` Stripe Publishable Key`
                        
                    }
                    className="form-control mt-1"
                    value={stripePublishableKeyText}
                    onChange={(e: any) => {
                      setstripePublishableKeyText(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          stripePublishableKeyText: `Stripe Pay Publishable Key is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          stripePublishableKeyText: '',
                        });
                      }
                    }}
                  />
                  {error.stripePublishableKeyText &&
                    <p className="errorMessage text-start">{error.stripePublishableKeyText && error.stripePublishableKeyText}</p>
                  }
                </div>
                <div className="col-12 withdrawal-input border-setting">
                  <div className="inputData text  flex-row justify-content-start text-start">
                    <label htmlFor="stripeSecretKey"
                      className="">Stripe Secret key</label>
                    <input
                      type={`text`}
                      id={`stripeSecretKey`}
                      name={`stripeSecretKey`}
                      placeholder={ `Stripe Secret Key`
                          
                      }
                      className="form-control mt-1"
                      value={stripeSecretKeyText}
                      onChange={(e: any) => {
                        setStripeSecretKeyText(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            stripeSecretKeyText: `StripePay SecretKey is Required`,
                          });
                        } else {
                          return setError({
                            ...error,
                            stripeSecretKeyText: '',
                          });
                        }
                      }}
                    />
                    {error.stripeSecretKeyText &&
                      <p className="errorMessage text-start">{error.stripeSecretKeyText && error.stripeSecretKeyText}</p>
                    }
                  </div>
                </div>


              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="withdrawal-box payment-box">
              <h6 className='d-flex align-items-center justify-content-between'>Razor Pay Setting
                <InfoTooltip title="Razor Pay Setting" content={razorpayContent} />
              </h6>
              <div className="row">
                <div className="col-12 withdrawal-input border-setting">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>Razorpay Android</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>(enable/disable for payment in app)</p>
                  </div>
                  <ToggleSwitch value={setting?.isRazorPay} onClick={() => handleSettingSwitch(setting?._id, 1)} />
                  </div>
                </div>
                <div className="col-12 withdrawal-input border-setting">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>Razorpay iOS</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>(enable/disable for payment in app)</p>
                  </div>
                  <ToggleSwitch value={setting?.razorpayIosEnabled} onClick={() => handleSettingSwitch(setting?._id, 10)} />
                  </div>
                </div>
                <div className="col-12 withdrawal-input border-setting">
                  <div className="inputData text  flex-row justify-content-start text-start">
                    <label htmlFor='razorSecretKey'>Razorpay Secret Key</label>
                    <input
                      type={`text`}
                      id={`razorSecretKey`}
                      name={`razorSecretKey`}
                      className="form-control mt-1"
                      placeholder={`Razorpay Secret Key` }
                      value={razorPaySecretKeyText}
                      onChange={(e: any) => {
                        setrazorPaySecretKeyText(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            razorPaySecretKeyText: `RazorPay Secret Key Is Required`,
                          });
                        } else {
                          return setError({
                            ...error,
                            razorPaySecretKeyText: '',
                          });
                        }
                      }}
                    />
                    {error.razorPaySecretKeyText &&
                      <p className="errorMessage text-start">{error.razorPaySecretKeyText && error.razorPaySecretKeyText}</p>
                    }
                  </div>
                </div>
                <div className="col-12 withdrawal-input border-setting">
                  <div className="inputData text  flex-row justify-content-start text-start">
                    <label htmlFor="razorPayId">Razorpay Id</label>
                    <input
                      type={`text`}
                      id={`razorPayId`}
                      name={`razorPayId`}
                      className='form-control mt-1'
                      placeholder={
                       ` RazorPay Id`
                      }
                      value={razorPayIdText}
                      onChange={(e: any) => {
                        setRazorPayIdText(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            razorPayIdText: `RazorPay is Required`,
                          });
                        } else {
                          return setError({
                            ...error,
                            razorPayIdText: '',
                          });
                        }
                      }}
                    />
                    {error.razorPayIdText &&
                      <p className="errorMessage text-start">{error.razorPayIdText && error.razorPayIdText}</p>
                    }
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 mt-3">
            <div className="withdrawal-box payment-box">
              <h6 className='d-flex align-items-center justify-content-between'>Paystack Setting
                <InfoTooltip title="Paystack Setting" content={paystackContent} />
              </h6>
              <div className="row">
                <div className="col-12 withdrawal-input border-setting">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>Paystack Android</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>(enable/disable for payment in app)</p>
                  </div>
                  <ToggleSwitch value={setting?.paystackAndroidEnabled} onClick={() => handleSettingSwitch(setting?._id, 14)} />
                  </div>
                </div>
                <div className="col-12 withdrawal-input border-setting">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>Paystack iOS</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>(enable/disable for payment in app)</p>
                  </div>
                  <ToggleSwitch value={setting?.paystackIosEnabled} onClick={() => handleSettingSwitch(setting?._id, 15)} />
                  </div>
                </div>
                <div className="col-12 withdrawal-input border-setting">
                  <div className="inputData text  flex-row justify-content-start text-start">
                    <label htmlFor="paystackPublicKey">Paystack Public Key</label>
                    <input
                      type={`text`}
                      id={`paystackPublicKey`}
                      name={`paystackPublicKey`}
                      placeholder={
                       `Paystack Public Key`

                      }
                      className='form-control mt-1'
                      value={paystackPublicKey}
                      onChange={(e: any) => {
                        setPaystackPublicKey(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            paystackPublicKey: `FlutterWave Key is Required`,
                          });
                        } else {
                          return setError({
                            ...error,
                            paystackPublicKey: '',
                          });
                        }
                      }}
                    />
                    {error.paystackPublicKey &&
                      <p className="errorMessage text-start">{error.paystackPublicKey && error.paystackPublicKey}</p>
                    }
                  </div>
                </div>
                <div className="col-12 withdrawal-input border-setting">
                  <div className="inputData text  flex-row justify-content-start text-start">
                    <label htmlFor="paystackSecretKey">Paystack Secret Key</label>
                    <input
                      type={`text`}
                      id={`paystackSecretKey`}
                      name={`paystackSecretKey`}
                      placeholder={`Paystack Secret Key`
                          
                      }
                      className='form-control mt-1'
                      value={paystackSecretKey}
                      onChange={(e: any) => {
                        setPaystackSecretKey(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            paystackSecretKey: `Paystack Secret Key is Required`,
                          });
                        } else {
                          return setError({
                            ...error,
                            paystackSecretKey: '',
                          });
                        }
                      }}
                    />
                    {error.paystackSecretKey &&
                      <p className="errorMessage text-start">{error.paystackSecretKey && error.paystackSecretKey}</p>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 mt-3">
            <div className="withdrawal-box payment-box">
              <h6 className='d-flex align-items-center justify-content-between'>Cashfree Setting
                <InfoTooltip title="Cashfree Setting" content={cashfreeContent} />
              </h6>
              <div className="row">
                <div className="col-12 withdrawal-input border-setting">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>Cashfree Android</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>(enable/disable cashfree in app)</p>
                  </div>
                  <ToggleSwitch value={setting?.cashfreeAndroidEnabled} onClick={() => handleSettingSwitch(setting?._id, 16)} />
                  </div>
                </div>
                <div className="col-12 withdrawal-input border-setting">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>Cashfree iOS</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>(enable/disable cashfree in app)</p>
                  </div>
                  <ToggleSwitch value={setting?.cashfreeIosEnabled} onClick={() => handleSettingSwitch(setting?._id, 17)} />
                  </div>
                </div>
                <div className="col-12 withdrawal-input border-setting">
                  <div className="inputData text  flex-row justify-content-start text-start">
                    <label htmlFor="cashfreeClientId">Cashfree Client Id</label>
                    <input
                      type={`text`}
                      id={`cashfreeClientId`}
                      name={`cashfreeClientId`}
                      placeholder={ `Cashfree Client Id`
                        
                      }
                      className='form-control mt-1'
                      value={cashfreeClientId}
                      onChange={(e: any) => {
                        setCashfreeClientId(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            cashfreeClientId: `Cashfree Client Id is Required`,
                          });
                        } else {
                          return setError({
                            ...error,
                            cashfreeClientId: '',
                          });
                        }
                      }}
                    />
                    {error.cashfreeClientId &&
                      <p className="errorMessage text-start">{error.cashfreeClientId && error.cashfreeClientId}</p>
                    }
                  </div>
                </div>
                <div className="col-12 withdrawal-input border-setting">
                  <div className="inputData text  flex-row justify-content-start text-start">
                    <label htmlFor="cashfreeClientSecret">Cashfree Client Secret</label>
                    <input
                      type={`text`}
                      id={`cashfreeClientSecret`}
                      name={`cashfreeClientSecret`}
                      placeholder={`Cashfree Client Secret`
                          
                      }
                      className='form-control mt-1'
                      value={cashfreeClientSecret}
                      onChange={(e: any) => {
                        setCashfreeClientSecret(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            cashfreeClientSecret: `Cashfree Client Secret is Required`,
                          });
                        } else {
                          return setError({
                            ...error,
                            cashfreeClientSecret: '',
                          });
                        }
                      }}
                    />
                    {error.cashfreeClientSecret &&
                      <p className="errorMessage text-start">{error.cashfreeClientSecret && error.cashfreeClientSecret}</p>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 mt-3">
            <div className="withdrawal-box payment-box">
              <h6 className='d-flex align-items-center justify-content-between'>Paypal Setting
                <InfoTooltip title="Paypal Setting" content={paypalContent} />
              </h6>
              <div className="row">
                <div className="col-12 withdrawal-input border-setting">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>Paypal Android</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>(enable/disable paypal in app)</p>
                  </div>
                  <ToggleSwitch value={setting?.paypalAndroidEnabled} onClick={() => handleSettingSwitch(setting?._id, 18)} />
                  </div>
                </div>
                <div className="col-12 withdrawal-input border-setting">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>Paypal iOS</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>(enable/disable paypal in app)</p>
                  </div>
                  <ToggleSwitch value={setting?.paypalIosEnabled} onClick={() => handleSettingSwitch(setting?._id, 19)} />
                  </div>
                </div>
                <div className="col-12 withdrawal-input border-setting">
                  <div className="inputData text  flex-row justify-content-start text-start">
                    <label htmlFor="paypalClientId">Paypal Client Id</label>
                    <input
                      type={`text`}
                      id={`paypalClientId`}
                      name={`paypalClientId`}
                      placeholder={`Paypal Client Id`
                          
                      }
                      className='form-control mt-1'
                      value={paypalClientId}
                      onChange={(e: any) => {
                        setPaypalClientId(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            paypalClientId: `Paypal Client Id is Required`,
                          });
                        } else {
                          return setError({
                            ...error,
                            paypalClientId: '',
                          });
                        }
                      }}
                    />
                    {error.paypalClientId &&
                      <p className="errorMessage text-start">{error.paypalClientId && error.paypalClientId}</p>
                    }
                  </div>
                </div>
                <div className="col-12 withdrawal-input border-setting">
                  <div className="inputData text  flex-row justify-content-start text-start">
                    <label htmlFor="paypalSecretKey">Paypal Secret Key</label>
                    <input
                      type={`text`}
                      id={`paypalSecretKey`}
                      name={`paypalSecretKey`}
                      placeholder={`Paypal Secret Key`
                         
                      }
                      className='form-control mt-1'
                      value={paypalSecretKey}
                      onChange={(e: any) => {
                        setPaypalSecretKey(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            paypalSecretKey: `Paypal Secret Key is Required`,
                          });
                        } else {
                          return setError({
                            ...error,
                            paypalSecretKey: '',
                          });
                        }
                      }}
                    />
                    {error.paypalSecretKey &&
                      <p className="errorMessage text-start">{error.paypalSecretKey && error.paypalSecretKey}</p>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 mt-3">
            <div className="withdrawal-box payment-box">
              <h6 className='d-flex align-items-center justify-content-between'>Flutter Wave Setting
                <InfoTooltip title="Flutter Wave Setting" content={flutterWaveContent} />
              </h6>
              <div className="row">
                <div className="col-12 withdrawal-input border-setting">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>Flutter Wave Android</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>(enable/disable flutterwave in app)</p>
                  </div>
                  <ToggleSwitch value={setting?.isFlutterWave} onClick={() => handleSettingSwitch(setting?._id, 12)} />
                  </div>
                </div>
                <div className="col-12 withdrawal-input border-setting">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>Flutter Wave iOS</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>(enable/disable flutterwave in app)</p>
                  </div>
                  <ToggleSwitch value={setting?.isFlutterWaveIos} onClick={() => handleSettingSwitch(setting?._id, 13)} />
                  </div>
                </div>
                <div className="col-12 withdrawal-input border-setting">
                  <div className="inputData text  flex-row justify-content-start text-start">
                    <label htmlFor="flutterwaveKey">Flutterwave Key</label>
                    <input
                      type={`text`}
                      id={`flutterWaveKey`}
                      name={`flutterWaveKey`}
                      placeholder={`FlutterWave Key`
                         
                      }
                      className='form-control mt-1'
                      value={flutterWaveKeyText}
                      onChange={(e: any) => {
                        setFlutterWaveKeyText(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            flutterWaveKeyText: `FlutterWave Key is Required`,
                          });
                        } else {
                          return setError({
                            ...error,
                            flutterWaveKeyText: '',
                          });
                        }
                      }}
                    />
                    {error.flutterWaveKeyText &&
                      <p className="errorMessage text-start">{error.flutterWaveKeyText && error.flutterWaveKeyText}</p>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default PaymentSetting;

import { getSetting, handleSetting, updateSetting } from "@/store/settingSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import InfoTooltip from "../../extra/InfoTooltip";
import ToggleSwitch from "../../extra/TogggleSwitch";
import {
  livekitSetting,
  resendApiSetting,
  zegoSetting,
} from "../../extra/infoContent";
interface ErrorState {
  privacyPolicyLinkText: string;
  currencyNameText: string;
  currencySymbolText: string;
  tncText: any;
  taxText: any;
  commissionPercentText: any;
  firebaseKeyText: string;
  minWithdrawText: string;
  durationOfvideo: any;

  zegoAppId: string;
  zegoAppSignIn: string;
  zegoServerSecret: string;
  livekitApiKey: string;
  livekitApiSecret: string;
  wsURL: string;
  openAIkey: string;
  resendKey: string;
  androidAppVersion: string;
  iosAppVersion: string;
  androidAppLink: string;
  iosAppLink: string;
}
const AdminSetting = () => {
  const { setting }: any = useSelector((state: RootStore) => state?.setting);


  const [privacyPolicyLinkText, setPrivacyPolicyLinkText] = useState<any>();
  const [currencyNameText, setCurrencyNameText] = useState<any>();
  const [currencySymbolText, setcurrencySymbolText] = useState<any>();
  const [tncText, setTncText] = useState<any>();
  const [taxText, setTaxText] = useState<any>();
  const [commissionPercentText, setCommissionPercentText] = useState<any>();
  const [firebaseKeyText, setFirebaseKeyText] = useState<any>();
  const [minWithdrawText, setmMinWithdrawText] = useState<any>();
  const [durationOfvideo, setDurationOfVideo] = useState<any>();

  const [openAIkey, setOpenAIkey] = useState<any>();
  const [zegoAppId, setZegoAppId] = useState<any>();
  const [livekitApiKey, setLiveKitKey] = useState<any>();
  const [livekitApiSecret, setLivekitSecret] = useState<any>();
  const [wsURL, setWsUrl] = useState<any>();
  const [resendKey, setResendKey] = useState<any>();
  const [zegoAppSignIn, setZegoAppSignIn] = useState<any>();

  const [androidAppVersion, setAndroidAppVersion] = useState<any>("");
  const [iosAppVersion, setIosAppVersion] = useState<any>("");
  const [androidAppLink, setAndroidAppLink] = useState<any>("");
  const [iosAppLink, setIosAppLink] = useState<any>("");

  const [data, setData] = useState<any>();

  const [error, setError] = useState<any>({
    privacyPolicyLinkText: "",
    currencyNameText: "",
    currencySymbolText: "",
    tncText: "",
    taxText: "",
    commissionPercentText: "",
    firebaseKey: "",
    minWithdrawText: "",
    durationOfvideo: "",
    openAIkey: "",
    zegoAppId: "",
    zegoAppSignIn: "",
    livekitApiKey: "",
    livekitApiSecret: "",
    wsURL: "",
    resendKey: "",
    androidAppVersion,
    iosAppVersion,
    androidAppLink,
    iosAppLink,
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    
      dispatch(getSetting());
    
  }, [dispatch]);

  useEffect(() => {
    setData(setting);
  }, [setting]);

  useEffect(() => {
    setPrivacyPolicyLinkText(setting?.privacyPolicyLink);
    setCurrencyNameText(setting?.currencyName);
    setcurrencySymbolText(setting?.currencySymbol);
    setTncText(setting?.tnc);
    setTaxText(setting?.tax);
    setCommissionPercentText(setting?.commissionPercent);
    setFirebaseKeyText(JSON.stringify(setting?.firebaseKey));
    setmMinWithdrawText(setting?.minWithdraw);
    setDurationOfVideo(setting?.durationOfvideo);

    setOpenAIkey(setting?.openAIkey);
    setResendKey(setting?.resendApiKey);
    setZegoAppId(setting?.zegoAppId);
    setZegoAppSignIn(setting?.zegoAppSignIn);
    setLiveKitKey(setting?.livekitApiKey);
    setLivekitSecret(setting?.livekitApiSecret);
    setWsUrl(setting?.wsURL);

    setAndroidAppVersion(setting?.androidAppVersion);
    setIosAppVersion(setting?.iosAppVersion);
    setAndroidAppLink(setting?.androidAppLink);
    setIosAppLink(setting?.iosAppLink);
  }, [setting]);

  const handleSettingSwitch: any = (id: any, type: any) => {

    const payload = {
      id,
      type,
    };
    dispatch(handleSetting(payload));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();


    if (
      !privacyPolicyLinkText ||
      !currencyNameText ||
      !currencySymbolText ||
      !tncText ||
      !taxText ||
      !commissionPercentText ||
      !firebaseKeyText ||
      !minWithdrawText ||
      !durationOfvideo ||
      !openAIkey ||
      !zegoAppId ||
      !resendKey ||
      !zegoAppSignIn ||
      !livekitApiKey ||
      !livekitApiSecret ||
      !wsURL ||
      !androidAppVersion ||
      !iosAppVersion ||
      !androidAppLink ||
      !iosAppLink
    ) {
      {
        let error = {} as ErrorState;
        if (!privacyPolicyLinkText)
          error.privacyPolicyLinkText = "privacyPolicyLink Is Required !";
        if (!currencyNameText)
          error.currencyNameText = "currencyName Is Required !";

        if (!currencySymbolText)
          error.currencySymbolText = "Currency Symbol Text is Required!";
        if (!tncText) error.tncText = "Terms and Condition Is Required !";
        if (!taxText) error.taxText = "Tax Is Required !";
        if (!commissionPercentText)
          error.commissionPercentText = "CommisionPenrcent Is Required !";
        if (!firebaseKeyText)
          error.firebaseKeyText = "FirbaseKey Is Required !";
        if (!minWithdrawText)
          error.minWithdrawText = "Minimum Withdraw Is Required !";
        if (!durationOfvideo)
          error.durationOfvideo = "Maximum Duration Of Video Is Required !";
        if (!zegoAppId) error.zegoAppId = "Zegoappid is Required";
        if (!zegoAppSignIn) error.zegoAppSignIn = "Zegoappsignin is Required";
       
        if (!openAIkey) error.openAIkey = "Open Ai Key is Required";
        if (!resendKey) error.resendKey = "Resend API Key is Required";
        if (!livekitApiKey) error.livekitApiKey = "Livekit API Key is Required";
        if (!livekitApiSecret)
          error.livekitApiSecret = "LiveKit API Secret is Required";
        if (!wsURL) error.wsURL = "LiveKit Ws Url is Required";
        if (!androidAppVersion)
          error.androidAppVersion = "Android App Version Is Required !";
        if (!iosAppVersion)
          error.iosAppVersion = "IOS App Version Is Required !";
        if (!androidAppLink)
          error.androidAppLink = "Android App Link Is Required !";
        if (!iosAppLink) error.iosAppLink = "IOS App Link Is Required !";

        return setError({ ...error });
      }
    } else {
      const payload: any = { settingId: data?._id };

      if (privacyPolicyLinkText !== setting?.privacyPolicyLink) {
        payload.privacyPolicyLink = privacyPolicyLinkText;
      }
      if (tncText !== setting?.tnc) {
        payload.tnc = tncText;
      }
      if (currencySymbolText !== setting?.currencySymbol) {
        payload.currencySymbol = currencySymbolText;
      }
      if (currencyNameText !== setting?.currencyName) {
        payload.currencyName = currencyNameText;
      }
      if (parseInt(taxText) !== setting?.tax) {
        payload.tax = parseInt(taxText);
      }
      if (parseInt(commissionPercentText) !== setting?.commissionPercent) {
        payload.commissionPercent = parseInt(commissionPercentText);
      }
      if (firebaseKeyText !== JSON.stringify(setting?.firebaseKey)) {
        payload.firebaseKey = firebaseKeyText;
      }
      if (parseInt(minWithdrawText) !== setting?.minWithdraw) {
        payload.minWithdraw = parseInt(minWithdrawText);
      }
      if (parseInt(durationOfvideo) !== setting?.durationOfvideo) {
        payload.durationOfvideo = parseInt(durationOfvideo);
      }
      if (openAIkey !== setting?.openAIkey) {
        payload.openAIkey = openAIkey;
      }
      if (resendKey !== setting?.resendApiKey) {
        payload.resendApiKey = resendKey;
      }
      if (zegoAppId !== setting?.zegoAppId) {
        payload.zegoAppId = zegoAppId;
      }
      if (zegoAppSignIn !== setting?.zegoAppSignIn) {
        payload.zegoAppSignIn = zegoAppSignIn;
      }
      
      if (livekitApiKey !== setting?.livekitApiKey) {
        payload.livekitApiKey = livekitApiKey;
      }
      if (livekitApiSecret !== setting?.livekitApiSecret) {
        payload.livekitApiSecret = livekitApiSecret;
      }
      if (wsURL !== setting?.wsURL) {
        payload.wsURL = wsURL;
      }
      if (androidAppVersion !== setting.androidAppVersion) {
        payload.androidAppVersion = androidAppVersion;
      }
      if (iosAppVersion !== setting.iosAppVersion) {
        payload.iosAppVersion = iosAppVersion;
      }
      if (androidAppLink !== setting.androidAppLink) {
        payload.androidAppLink = androidAppLink;
      }
      if (iosAppLink !== setting.iosAppLink) {
        payload.iosAppLink = iosAppLink;
      }

      if (Object.keys(payload).length > 1) {
        dispatch(updateSetting(payload));
      }
    }
  };



  return (
    <div>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h6 style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>General Setting</h6>
          <p style={{ margin: 0, fontSize: 12, color: '#9CA3AF' }}>Configure app, currency, API keys and more</p>
        </div>
        <button onClick={handleSubmit} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#6366F1', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Save Changes
        </button>
      </div>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* App Setting Box  */}
          <div className="col-lg-6 col-sm-12">
            <div className="withdrawal-box payment-box">
              <h6>App Setting</h6>
              <div className="row">
                <div className="col-12 withdrawal-input border-setting">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>Maintenance Mode</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>(enable/disable maintenance in app & web)</p>
                  </div>
                  <ToggleSwitch
                      value={setting?.maintenanceMode}
                      onClick={() => handleSettingSwitch(setting?._id, 3)}
                    />
                  </div>
                </div>
                <div className="col-12 withdrawal-input border-setting">
                  <div className="inputData text flex-row justify-content-start text-start">
                    <label htmlFor="privacyPolicyLink">
                      Privacy policy link (redirect user to this link from app)
                    </label>
                    <input
                      type={`text`}
                      className="rounded-2 form-control mt-1"
                      id="privacyPoliyLink"
                      value={privacyPolicyLinkText}
                      placeholder={
                       `Enter Privacy policy link`
                      }
                      onChange={(e: any) => {
                        setPrivacyPolicyLinkText(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            privacyPolicyLinkText: `PrivacyPolicyLink Is Required`,
                          });
                        } else {
                          return setError({
                            ...error,
                            privacyPolicyLinkText: "",
                          });
                        }
                      }}
                    />
                    {error?.privacyPolicyLinkText && (
                      <p className="errorMessage text-start">
                        {error.privacyPolicyLinkText &&
                          error.privacyPolicyLinkText}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-12 withdrawal-input border-setting">
                  <div className="inputData text flex-row justify-content-start text-start">
                    <label htmlFor="privacyPolicyLink">
                      Terms and condition link
                    </label>
                    <input
                      type={`text`}
                      id={`tnc`}
                      name={`tnc`}
                      className="rounded-2 form-control  mt-1"
                      placeholder={ `Enter Terms and condition link`
                          
                      }
                      value={tncText}
                      onChange={(e: any) => {
                        setTncText(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            tncText: `Terms and Condition is Required`,
                          });
                        } else {
                          return setError({
                            ...error,
                            tncText: "",
                          });
                        }
                      }}
                    />
                    {error?.tncText && (
                      <p className="errorMessage text-start">
                        {error.tncText && error.tncText}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-12 withdrawal-input border-setting">
                  <div className="inputData text flex-row justify-content-start text-start">
                    <label htmlFor="tax">Tax (%)</label>
                    <input
                      type={`text`}
                      id={`tax`}
                      className="rounded-2 form-control mt-1"
                      name={`tax`}
                      placeholder={`Enter Tax`}
                      value={taxText}
                      onChange={(e: any) => {
                        setTaxText(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            taxText: `Tax Is Required`,
                          });
                        } else {
                          return setError({
                            ...error,
                            taxText: "",
                          });
                        }
                      }}
                    />
                    {error?.taxText && (
                      <p className="errorMessage text-start">
                        {error.taxText && error.taxText}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-12 withdrawal-input border-setting">
                  <div className="inputData text flex-row justify-content-start text-start">
                    <label htmlFor="androidAppVersion">Android App Version</label>
                    <input
                      type={`text`}
                      id={`androidAppVersion`}
                      className="rounded-2 form-control mt-1"
                      name={`androidAppVersion`}
                      placeholder={ `Enter Android App Version`}
                      value={androidAppVersion}
                      onChange={(e: any) => {
                        setAndroidAppVersion(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            androidAppVersion: `Tax Is Required`,
                          });
                        } else {
                          return setError({
                            ...error,
                            androidAppVersion: "",
                          });
                        }
                      }}
                    />
                    {error?.androidAppVersion && (
                      <p className="errorMessage text-start">
                        {error.androidAppVersion && error.androidAppVersion}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-12 withdrawal-input border-setting">
                  <div className="inputData text flex-row justify-content-start text-start">
                    <label htmlFor="iosAppVersion">IOS App Version</label>
                    <input
                      type={`text`}
                      id={`iosAppVersion`}
                      className="rounded-2 form-control mt-1"
                      name={`iosAppVersion`}
                      placeholder={`Enter IOS App Version`}
                      value={iosAppVersion}
                      onChange={(e: any) => {
                        setIosAppVersion(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            iosAppVersion: `Tax Is Required`,
                          });
                        } else {
                          return setError({
                            ...error,
                            iosAppVersion: "",
                          });
                        }
                      }}
                    />
                    {error?.iosAppVersion && (
                      <p className="errorMessage text-start">
                        {error?.iosAppVersion && error?.iosAppVersion}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-12 withdrawal-input border-setting">
                  <div className="inputData text flex-row justify-content-start text-start">
                    <label htmlFor="androidAppLink">Android App Link</label>
                    <input
                      type={`text`}
                      id={`androidAppLink`}
                      className="rounded-2 form-control mt-1"
                      name={`androidAppLink`}
                      placeholder={ `Enter Android App Link`}
                      value={androidAppLink}
                      onChange={(e: any) => {
                        setAndroidAppLink(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            androidAppLink: `Tax Is Required`,
                          });
                        } else {
                          return setError({
                            ...error,
                            androidAppLink: "",
                          });
                        }
                      }}
                    />
                    {error.androidAppLink && (
                      <p className="errorMessage text-start">
                        {error.androidAppLink && error.androidAppLink}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-12 withdrawal-input border-setting">
                  <div className="inputData text flex-row justify-content-start text-start">
                    <label htmlFor="iosAppLink">IOS App Link</label>
                    <input
                      type={`text`}
                      id={`iosAppLink`}
                      className="rounded-2 form-control mt-1"
                      name={`iosAppLink`}
                      placeholder={`Enter IOS App Link`}
                      value={iosAppLink}
                      onChange={(e: any) => {
                        setIosAppLink(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            iosAppLink: `Tax Is Required`,
                          });
                        } else {
                          return setError({
                            ...error,
                            iosAppLink: "",
                          });
                        }
                      }}
                    />
                    {error.iosAppLink && (
                      <p className="errorMessage text-start">
                        {error.iosAppLink && error.iosAppLink}
                      </p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Firebase setting box */}
          <div className="col-12 col-md-6">
            <div className="withdrawal-box payment-box h-100">
              <h6>Firebase Notification Setting</h6>
              <div className="row">
                <div className="col-12 withdrawal-input border-setting">
                  <div className="inputData text  flex-row justify-content-start text-start">
                    <label className="float-left" htmlFor="firebaseKey">
                      Private key JSON (use for firebase push notification in
                      app)
                    </label>
                    <textarea
                      name={`firebaseKey`}
                      rows={30}
                      className=" mt-2"
                      id={`firebaseKey`}
                      placeholder={ `Enter firebaseKey`
                          
                      }
                      value={firebaseKeyText}
                      onChange={(e: any) => {
                        setFirebaseKeyText(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            firebaseKeyText: `Private Key Is Required`,
                          });
                        } else {
                          return setError({
                            ...error,
                            firebaseKeyText: "",
                          });
                        }
                      }}
                    />
                    {error.firebaseKeyText && (
                      <div className="pl-1 text-left">
                        <p className="errorMessage">
                          {error.firebaseKeyText && error.firebaseKeyText}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Currency Setting  */}
          <div className="col-12 col-md-6 mt-3">
            <div className="withdrawal-box payment-box">
              <h6>Currency Setting</h6>
              <div className="row">
                <div className="inputData col-12 withdrawal-input border-setting">
                  <label htmlFor="currencyName" className="">
                    Currency name
                  </label>
                  <input
                    type={`text`}
                    id={`currencyName`}
                    name={`currencyName`}
                    placeholder={`Currency Name`}
                    className="form-control mt-1"
                    value={currencyNameText}
                    onChange={(e: any) => {
                      setCurrencyNameText(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          currencyNameText: `Currency Name Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          currencyNameText: "",
                        });
                      }
                    }}
                  />
                  {error.currencyNameText && (
                    <p className="errorMessage text-start">
                      {error.currencyNameText && error.currencyNameText}
                    </p>
                  )}
                </div>
                <div className="inputData col-12 withdrawal-input border-setting">
                  <label htmlFor="currencySymbol" className="">
                    Currency Symbol
                  </label>
                  <input
                    type={`text`}
                    id={`currencySymbol`}
                    name={`currencySymbol`}
                    placeholder={`Currency Symbol`}
                    value={currencySymbolText}
                    className="form-control mt-1"
                    onChange={(e: any) => {
                      setcurrencySymbolText(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          currencySymbolText: `Currency Symbol Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          currencySymbolText: "",
                        });
                      }
                    }}
                  />
                  {error.currencySymbolText && (
                    <p className="errorMessage text-start">
                      {error.currencySymbolText && error.currencySymbolText}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Financial Setting  */}
          <div className="col-12 col-md-6 mt-3">
            <div className="withdrawal-box payment-box">
              <h6>Financial Setting </h6>
              <div className="row">
                <div className="inputData col-12 withdrawal-input border-setting">
                  <label htmlFor="commissionPercent" className="">
                    Commision Percent (%)
                  </label>
                  <input
                    type={`number`}
                    id={`commissionPercent`}
                    name={`commissionPercent`}
                    className="form-control mt-1"
                    placeholder={`commission Percent `}
                    value={commissionPercentText}
                    onChange={(e: any) => {
                      setCommissionPercentText(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          commissionPercentText: `Commision Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          commissionPercentText: "",
                        });
                      }
                    }}
                  />
                  {error.commissionPercentText && (
                    <p className="errorMessage text-start">
                      {error.commissionPercentText &&
                        error.commissionPercentText}
                    </p>
                  )}
                </div>

                <div className="inputData col-12 withdrawal-input border-setting">
                  <label htmlFor="currencyName" className="">
                    Minimum Withdraw Amount (Doctor)
                  </label>
                  <input
                    type={`text`}
                    id={`minWithdraw`}
                    name={`minWithdraw`}
                    className="form-control mt-1"
                    placeholder={`minWithdraw`}
                    value={minWithdrawText}
                    onChange={(e: any) => {
                      setmMinWithdrawText(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          minWithdrawText: `Withdraw Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          minWithdrawText: "",
                        });
                      }
                    }}
                  />
                  {error.minWithdrawText && (
                    <p className="errorMessage text-start">
                      {error.minWithdrawText && error.minWithdrawText}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Open AI setting  */}
          <div className="col-12 col-md-6 mt-3">
            <div className="withdrawal-box payment-box">
              <h6>Open AI Setting</h6>
              <div className="row">
                <div className="inputData col-12 withdrawal-input border-setting">
                  <label htmlFor="openAIkey" className="">
                    Open AI Key
                  </label>
                  <input
                    type={`text`}
                    id={`openAIkey`}
                    name={`openAIkey`}
                    className="form-control mt-1"
                    placeholder={`OpenAI Key`}
                    value={openAIkey}
                    onChange={(e: any) => {
                      setOpenAIkey(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          openAIkey: `OpenAI Key Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          openAIkey: "",
                        });
                      }
                    }}
                  />
                  {error.openAIkey && (
                    <p className="errorMessage text-start">
                      {error.openAIkey && error.openAIkey}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Med Clips setting  */}
          <div className="col-12 col-md-6 mt-3">
            <div className="withdrawal-box payment-box">
              <h6>Maximum Duration of Med Clips Setting</h6>
              <div className="row">
                <div className="inputData col-12 withdrawal-input border-setting">
                  <label htmlFor="maxDuration">
                    Maximum Duration of Med Clips (in seconds)
                  </label>
                  <input
                    type={`text`}
                    id={`maxDuration`}
                    name={`maxDuration`}
                    className="form-control mt-1"
                    placeholder={`commission Percent`}
                    value={durationOfvideo}
                    onChange={(e: any) => {
                      setDurationOfVideo(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          durationOfvideo: `Maximum Duration Of Video Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          durationOfvideo: "",
                        });
                      }
                    }}
                  />
                  {error.durationOfvideo && (
                    <p className="errorMessage text-start">
                      {error.durationOfvideo && error.durationOfvideo}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Zego Setting  */}
          <div className="col-12 col-md-6 mt-3">
            <div className="withdrawal-box payment-box">
              <h6 className="d-flex justify-content-between align-items-center">
                Zego Setting
                <InfoTooltip title="Zego Setting" content={zegoSetting} />
              </h6>
              <div className="row">
                <div className="col-12 withdrawal-input border-setting">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>Zego</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>(enable/disable zego in app)</p>
                  </div>
                  <ToggleSwitch
                      value={setting?.zegoEnabled}
                      onClick={() => handleSettingSwitch(setting?._id, 6)}
                    />
                  </div>
                </div>
                <div className="inputData col-12 withdrawal-input border-setting">
                  <label htmlFor="zegoAppId">Zego App Id</label>
                  <input
                    type={`text`}
                    id={`zegoAppId`}
                    name={`zegoAppId`}
                    placeholder={`Zego AppId`}
                    value={zegoAppId}
                    className="form-control mt-1"
                    onChange={(e: any) => {
                      setZegoAppId(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          zegoAppId: `Zego App Id Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          zegoAppId: "",
                        });
                      }
                    }}
                  />
                  {error.zegoAppId && (
                    <p className="errorMessage text-start">
                      {error.zegoAppId && error.zegoAppId}
                    </p>
                  )}
                </div>

                <div className="inputData col-12 withdrawal-input border-setting">
                  <label className="zegoAppSignIn">Zego App Sign In</label>
                  <input
                    type={`text`}
                    id={`zegoAppSignIn`}
                    name={`zegoAppSignIn`}
                    className="form-control mt-1"
                    placeholder={
                     `App Sign In` 
                    }
                    value={zegoAppSignIn}
                    onChange={(e: any) => {
                      setZegoAppSignIn(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          zegoAppSignIn: `App Sign In Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          zegoAppSignIn: "",
                        });
                      }
                    }}
                  />
                  {error.zegoAppSignIn && (
                    <p className="errorMessage text-start">
                      {error.zegoAppSignIn && error.zegoAppSignIn}
                    </p>
                  )}
                </div>
                
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 mt-3">
            <div className="withdrawal-box payment-box">
              <h6 className="d-flex justify-content-between align-items-center">
                LiveKit Setting
                <InfoTooltip title="LiveKit Setting" content={livekitSetting} />
              </h6>
              <div className="row">
                <div className="col-12 withdrawal-input border-setting">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>LiveKit</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>(enable/disable livekit in app)</p>
                  </div>
                  <ToggleSwitch
                      value={setting?.livekitEnabled}
                      onClick={() => handleSettingSwitch(setting?._id, 7)}
                    />
                  </div>
                </div>
                <div className="inputData col-12 withdrawal-input border-setting">
                  <label htmlFor="livekitApiKey">LiveKit API Key</label>
                  <input
                    type={`text`}
                    id={`livekitApiKey`}
                    name={`livekitApiKey`}
                    placeholder={
                     `LiveKit API Key`
                    }
                    value={livekitApiKey}
                    className="form-control mt-1"
                    onChange={(e: any) => {
                      setLiveKitKey(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          livekitApiKey: `LiveKit API Key Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          livekitApiKey: "",
                        });
                      }
                    }}
                  />
                  {error.livekitApiKey && (
                    <p className="errorMessage text-start">
                      {error.livekitApiKey && error.livekitApiKey}
                    </p>
                  )}
                </div>

                <div className="inputData col-12 withdrawal-input border-setting">
                  <label htmlFor="livekitApiSecret">LiveKit API Secret</label>
                  <input
                    type={`text`}
                    id={`livekitApiSecret`}
                    name={`livekitApiSecret`}
                    className="form-control mt-1"
                    placeholder={ `LiveKit API Secret`}
                    value={livekitApiSecret}
                    onChange={(e: any) => {
                      setLivekitSecret(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          livekitApiSecret: `LiveKit API Secret Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          livekitApiSecret: "",
                        });
                      }
                    }}
                  />
                  {error.livekitApiSecret && (
                    <p className="errorMessage text-start">
                      {error.livekitApiSecret && error.livekitApiSecret}
                    </p>
                  )}
                </div>
                <div className="inputData col-12 withdrawal-input border-setting">
                  <label htmlFor="wsURL">LiveKit WS URL</label>
                  <input
                    type={`text`}
                    id={`wsURL`}
                    name={`wsURL`}
                    className="form-control mt-1"
                    placeholder={`LiveKit WS Url`}
                        
                    
                    value={wsURL}
                    onChange={(e: any) => {
                      setWsUrl(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          wsURL: `Livekit WS Url Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          wsURL: "",
                        });
                      }
                    }}
                  />
                  {error.wsURL && (
                    <p className="errorMessage text-start">
                      {error.wsURL && error.wsURL}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Email Setting  */}
          <div className="col-12 col-md-6 mt-3">
            <div className="withdrawal-box payment-box">
              <h6 className="d-flex align-items-center justify-content-between">
                Email Setting
                <InfoTooltip title="Email Setting" content={resendApiSetting} />
              </h6>
              <div className="row">
                <div className="inputData col-12 withdrawal-input border-setting">
                  <label htmlFor="resendKey">Resend API Key</label>
                  <input
                    type={`text`}
                    id={`resendKey`}
                    name={`resendKey`}
                    placeholder={`Enter Resend API key`}
                
                    className="form-control mt-1"
                    value={resendKey}
                    onChange={(e: any) => {
                      setResendKey(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          resendKey: `Resend Api Key Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          resendKey: "",
                        });
                      }
                    }}
                  />
                  {error.resendKey && (
                    <p className="errorMessage text-start">
                      {error.resendKey && error.resendKey}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default AdminSetting;

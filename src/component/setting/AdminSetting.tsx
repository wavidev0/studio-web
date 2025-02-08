import Button from "@/extra/Button";
import { ExInput, Textarea } from "@/extra/Input";
import ToggleSwitch from "@/extra/TogggleSwitch";
import { getSetting, handleSetting, updateSetting } from "@/store/settingSlice";
import { RootStore, useAppDispatch } from "@/store/store";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

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
  geminiKey: string;
  zegoAppId: string;
  zegoAppSignIn: string;
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
  const [geminiKey, setGeminiKey] = useState<any>();
  const [zegoAppId, setZegoAppId] = useState<any>();
  const [zegoAppSignIn, setZegoAppSignIn] = useState<any>();

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
    geminiKey: "",
    zegoAppId: "",
    zegoAppSignIn: "",
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
    setGeminiKey(setting?.geminiKey);
    setZegoAppId(setting?.zegoAppId);
    setZegoAppSignIn(setting?.zegoAppSignIn);
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
      !geminiKey ||
      !zegoAppId ||
      !zegoAppSignIn
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
        if (!geminiKey) error.geminiKey = "Geminikey is Required";
        if (!zegoAppId) error.zegoAppId = "Zegoappid is Required";
        if (!zegoAppSignIn) error.zegoAppSignIn = "Zegoappsignin is Required";

        return setError({ ...error });
      }
    } else {
      let settingDataSubmit = {
        settingId: data?._id,
        privacyPolicyLink: privacyPolicyLinkText,
        currencySymbol: currencySymbolText,
        currencyName: currencyNameText,
        tax: parseInt(taxText),
        tnc: parseInt(tncText),
        commissionPercent: parseInt(commissionPercentText),
        firebaseKey: firebaseKeyText,
        minWithdraw: parseInt(minWithdrawText),
        durationOfvideo: parseInt(durationOfvideo),
        geminiKey: geminiKey,
        zegoAppId: zegoAppId,
        zegoAppSignIn: zegoAppSignIn,
      };
      dispatch(updateSetting(settingDataSubmit));
    }
  };

  return (
    <div className="mainSetting">
      <form onSubmit={handleSubmit} id="expertForm">
        <div className=" d-flex justify-content-end">
          <div className="  formFooter">
            <Button
              type={`submit`}
              className={`text-light m10-left fw-bold`}
              text={`Submit`}
              style={{ backgroundColor: "#1ebc1e" }}
            />
          </div>
        </div>
        <div className="settingBox row">
          <div className="col-6 col-md-6 mt-3 ">
            <div className="settingBoxOuter">
              <div className="settingBoxHeader">
                <h4>APP SETTING</h4>
              </div>
              <div>
                <div className="row d-flex justify-content-center d-flex align-items-baseline">
                  <div className="col-8">
                    <ExInput
                      type={`text`}
                      id={`privacyPolicyLink`}
                      name={`privacyPolicyLink`}
                      label={`Privacy policy link`}
                      value={privacyPolicyLinkText}
                      errorMessage={
                        error.privacyPolicyLinkText &&
                        error.privacyPolicyLinkText
                      }
                      placeholder={`Privacy policy link`}
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
                  </div>

                  <div className="col-4 inputData">
                    <div>
                      <label className="my-3">Maintenance mode</label>
                    </div>
                    <ToggleSwitch
                      onClick={() => handleSettingSwitch(setting?._id, 3)}
                      value={setting?.maintenanceMode}
                    />
                  </div>
                </div>
              </div>
              <div className="col-12">
                <ExInput
                  type={`text`}
                  id={`tnc`}
                  name={`tnc`}
                  label={`Terms and condition`}
                  placeholder={`Terms and condition`}
                  errorMessage={error.tncText && error.tncText}
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
              </div>
              <div className="col-12">
                <ExInput
                  type={`text`}
                  id={`tax`}
                  name={`tax`}
                  label={`Tax (%)`}
                  placeholder={`Tax`}
                  errorMessage={error.taxText && error.taxText}
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
              </div>
            </div>
          </div>

          <div className="col-6 col-md-6 mt-3 ">
            <div className="settingBoxOuter">
              <div className="settingBoxHeader">
                <h4>CURRENCY SETTING</h4>
              </div>
              <div className="col-12 ">
                <ExInput
                  type={`text`}
                  id={`currencyName`}
                  name={`currencyName`}
                  label={`Currency name`}
                  placeholder={`Currency Name`}
                  errorMessage={
                    error.currencyNameText && error.currencyNameText
                  }
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
              </div>
              <div className="col-12">
                <ExInput
                  type={`text`}
                  id={`currencySymbol`}
                  name={`currencySymbol`}
                  label={`Currency symbol`}
                  placeholder={`Currency Symbol`}
                  errorMessage={
                    error.currencySymbolText && error.currencySymbolText
                  }
                  value={currencySymbolText}
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
              </div>
            </div>
          </div>

          <div className="col-6 col-md-6 mt-3">
            <div className="settingBoxOuter">
              <div className="settingBoxHeader">
                <h4>FINANCIAL SETTING</h4>
              </div>
              <div className="col-12 ">
                <ExInput
                  type={`number`}
                  id={`commissionPercent`}
                  name={`commissionPercent`}
                  label={`Commission percent`}
                  placeholder={`commission Percent`}
                  errorMessage={
                    error.commissionPercentText && error.commissionPercentText
                  }
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

                <ExInput
                  type={`text`}
                  id={`minWithdraw`}
                  name={`minWithdraw`}
                  label={`Minwithdraw (Doctor)`}
                  placeholder={`minWithdraw`}
                  errorMessage={error.minWithdrawText && error.minWithdrawText}
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
              </div>
            </div>

            <div className="settingBoxOuter" style={{ marginTop: "15px" }}>
              <div className="settingBoxHeader">
                <h4>MAXIMUM DURATION OF MED CLIPS SETTING</h4>
              </div>

              <div className="col-12">
                <ExInput
                  type={`text`}
                  id={`commissionPercent`}
                  name={`commissionPercent`}
                  label={`Maximum duration of med clips(Second)`}
                  placeholder={`commission Percent`}
                  errorMessage={error.durationOfvideo && error.durationOfvideo}
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
              </div>
            </div>
          </div>

          <div className="col-6 col-md-6 mt-3 ">
            <div className="settingBoxOuter">
              <div className="settingBoxHeader">
                <h4>FIREBASE NOTIFICATION SETTING</h4>
              </div>
              <div className="col-12 ">
                <Textarea
                  row={10}
                  type={`text`}
                  id={`firebaseKey`}
                  name={`firebaseKey`}
                  label={`Private key JSON`}
                  placeholder={`Enter firebaseKey`}
                  errorMessage={error.firebaseKeyText && error.firebaseKeyText}
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
              </div>
            </div>
          </div>

          <div className="col-6 col-md-6 mt-3 ">
            <div className="settingBoxOuter">
              <div className="settingBoxHeader">
                <h4>GEMINIKEY API SETTING</h4>
              </div>
              <div className="col-12 ">
                <ExInput
                  type={`text`}
                  id={`geminiKey`}
                  name={`geminiKey`}
                  label={`Gemini key`}
                  placeholder={`Gemini Key`}
                  errorMessage={error.geminiKey && error.geminiKey}
                  value={geminiKey}
                  onChange={(e: any) => {
                    setGeminiKey(e.target.value);
                    if (!e.target.value) {
                      return setError({
                        ...error,
                        geminiKey: `Gemini Key Is Required`,
                      });
                    } else {
                      return setError({
                        ...error,
                        geminiKey: "",
                      });
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="col-6 col-md-6 mt-3 ">
            <div className="settingBoxOuter">
              <div className="settingBoxHeader">
                <h4>ZEGO SETTING</h4>
              </div>
              <div className="col-12 ">
                <ExInput
                  type={`text`}
                  id={`zegoAppId`}
                  name={`zegoAppId`}
                  label={`Zegoapp id`}
                  placeholder={`Zego AppId`}
                  errorMessage={error.zegoAppId && error.zegoAppId}
                  value={zegoAppId}
                  onChange={(e: any) => {
                    setZegoAppId(e.target.value);
                    if (!e.target.value) {
                      return setError({
                        ...error,
                        zegoAppId: `Gemini Key Is Required`,
                      });
                    } else {
                      return setError({
                        ...error,
                        zegoAppId: "",
                      });
                    }
                  }}
                />
              </div>

              <div className="col-12 ">
                <ExInput
                  type={`text`}
                  id={`zegoAppSignIn`}
                  name={`zegoAppSignIn`}
                  label={`Gemini key`}
                  placeholder={`Gemini Key`}
                  errorMessage={error.zegoAppSignIn && error.zegoAppSignIn}
                  value={zegoAppSignIn}
                  onChange={(e: any) => {
                    setZegoAppSignIn(e.target.value);
                    if (!e.target.value) {
                      return setError({
                        ...error,
                        zegoAppSignIn: `Gemini Key Is Required`,
                      });
                    } else {
                      return setError({
                        ...error,
                        zegoAppSignIn: "",
                      });
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminSetting;

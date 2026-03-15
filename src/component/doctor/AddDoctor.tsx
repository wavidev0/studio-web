import Button from "@/extra/Button";
import { ExInput, Textarea } from "@/extra/Input";
import { RootStore, useAppDispatch } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { closeDialog } from "@/store/dialogSlice";
import { updateDoctor } from "@/store/doctorSlice";
import { getServices } from "@/store/serviceSlice";
import { getSetting } from "@/store/settingSlice";

const AddDoctor = () => {
  const { dialogueData } = useSelector((state: any) => state.dialogue);
  const { setting }: any = useSelector((state: RootStore) => state?.setting);
  const { service } = useSelector((state: RootStore) => state.service);
  const dispatch = useAppDispatch();

  const [studioName, setStudioName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [charge, setCharge] = useState<any>("");
  const [commission, setCommission] = useState<any>("");
  const [equipment, setEquipment] = useState("");
  const [studioDescription, setStudioDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<any>();
  const [imagePath, setImagePath] = useState<any>();

  const [error, setError] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(getSetting());
    dispatch(getServices({ search: "ALL" } as any));
  }, []);

  useEffect(() => {
    if (!dialogueData) return;
    setStudioName(dialogueData?.studioName || "");
    setOwnerName(dialogueData?.name || "");
    setEmail(dialogueData?.email || "");
    setPassword(dialogueData?.password || "");
    setMobile(dialogueData?.mobile || "");
    setCountry(dialogueData?.country || "");
    setCity(dialogueData?.designation || "");
    setAddress(dialogueData?.address || "");
    setCharge(dialogueData?.charge || "");
    setCommission(dialogueData?.commission || "");
    setEquipment(dialogueData?.equipment?.join(", ") || "");
    setStudioDescription(dialogueData?.studioDescription || dialogueData?.yourSelf || "");
    setCategory(dialogueData?.service?.[0]?._id || dialogueData?.service?.[0] || "");
    setImagePath(dialogueData?.image || "");
  }, [dialogueData]);

  const handleInputImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
      setImagePath(URL.createObjectURL(e.target.files[0]));
      setError((prev) => ({ ...prev, image: "" }));
    }
  };

  const field = (key: string, val: any) => {
    if (!val) setError((prev) => ({ ...prev, [key]: `${key} is required` }));
    else setError((prev) => ({ ...prev, [key]: "" }));
  };

  const handleSubmit = () => {
    if (!studioName || !ownerName || !email || !mobile || !country || !city || !address || !charge) {
      setError({
        studioName: !studioName ? "Studio name is required" : "",
        ownerName: !ownerName ? "Owner name is required" : "",
        email: !email ? "Email is required" : "",
        mobile: !mobile ? "Mobile is required" : "",
        country: !country ? "Country is required" : "",
        city: !city ? "City is required" : "",
        address: !address ? "Address is required" : "",
        charge: !charge ? "Price is required" : "",
      });
      return;
    }

    const formData = new FormData();
    formData.append("clinicName", studioName);
    formData.append("name", ownerName);
    formData.append("email", email);
    if (password) formData.append("password", password);
    formData.append("mobile", mobile);
    formData.append("country", country);
    formData.append("designation", city);
    formData.append("address", address);
    formData.append("charge", charge);
    formData.append("commission", commission || "0");
    formData.append("equipment", equipment);
    formData.append("yourSelf", studioDescription);
    formData.append("studioDescription", studioDescription);
    if (category) formData.append("service", category);
    if (image) formData.append("image", image);

    dispatch(updateDoctor({ doctorId: dialogueData?._id, data: formData } as any));
    dispatch(closeDialog());
  };

  return (
    <div className="p-3">
      <div className="card1">
        <div className="cardHeader p-3">
          <h5 className="mb-0">Update Studio</h5>
        </div>
        <div className="cardBody">
          <div className="p-3">
            <div className="row align-items-start formBody">

              <div className="col-12"><h5 className="fw-semibold my-3">Studio Information</h5></div>

              <div className="col-12 col-md-6 col-lg-4">
                <ExInput type="text" label="Studio Name" placeholder="Studio name"
                  value={studioName} errorMessage={error.studioName}
                  onChange={(e: any) => { setStudioName(e.target.value); field("studioName", e.target.value); }} />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <ExInput type="text" label="Owner Name" placeholder="Owner name"
                  value={ownerName} errorMessage={error.ownerName}
                  onChange={(e: any) => { setOwnerName(e.target.value); field("ownerName", e.target.value); }} />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <ExInput type="text" label="Mobile Number" placeholder="Mobile number"
                  value={mobile} errorMessage={error.mobile}
                  onChange={(e: any) => { setMobile(e.target.value); field("mobile", e.target.value); }} />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <ExInput type="email" label="Email" placeholder="Email"
                  value={email} errorMessage={error.email}
                  onChange={(e: any) => { setEmail(e.target.value); field("email", e.target.value); }} />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <ExInput type="password" label="Password (leave blank to keep current)" placeholder="New password"
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)} />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <ExInput type="number" label={`Price/Hr (${setting?.currencySymbol || "$"})`} placeholder="Price per hour"
                  value={charge} errorMessage={error.charge}
                  onChange={(e: any) => { setCharge(e.target.value); field("charge", e.target.value); }} />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <ExInput type="number" label="Admin Commission (%)" placeholder="Commission"
                  value={commission}
                  onChange={(e: any) => setCommission(e.target.value)} />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <ExInput type="text" label="Equipment (comma separated)" placeholder="e.g. Mic, Mixer"
                  value={equipment}
                  onChange={(e: any) => setEquipment(e.target.value)} />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <ExInput type="file" label="Studio Image" accept="image/png, image/jpeg"
                  errorMessage={error.image} onChange={handleInputImage} />
                {imagePath && (
                  <img src={imagePath} alt="preview" className="mt-2 rounded mb-2"
                    style={{ width: 80, height: 80, objectFit: "cover" }} />
                )}
              </div>

              <div className="col-12"><h5 className="fw-semibold my-3">Location</h5></div>

              <div className="col-12 col-md-6 col-lg-4">
                <ExInput type="text" label="Country" placeholder="Country"
                  value={country} errorMessage={error.country}
                  onChange={(e: any) => { setCountry(e.target.value); field("country", e.target.value); }} />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <ExInput type="text" label="City" placeholder="City"
                  value={city} errorMessage={error.city}
                  onChange={(e: any) => { setCity(e.target.value); field("city", e.target.value); }} />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <ExInput type="text" label="Address" placeholder="Full address"
                  value={address} errorMessage={error.address}
                  onChange={(e: any) => { setAddress(e.target.value); field("address", e.target.value); }} />
              </div>

              <div className="col-12"><h5 className="fw-semibold my-3">Details</h5></div>

              <div className="col-12 col-md-6 col-lg-4">
                <div className="inputData text-start">
                  <label>Category</label>
                  <select className="form-control mt-1 mb-3" value={category}
                    onChange={(e) => setCategory(e.target.value)}>
                    <option value="">-- Select Category --</option>
                    {service?.map((s: any) => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-8">
                <Textarea row={4} label="Studio Description" placeholder="Describe the studio..."
                  value={studioDescription}
                  onChange={(e: any) => setStudioDescription(e.target.value)} />
              </div>

            </div>
          </div>
        </div>
        <div className="cardFooter p-3">
          <div className="d-flex justify-content-end gap-3">
            <Button className="close-model-btn" text="Cancel" type="button"
              onClick={() => dispatch(closeDialog())} />
            <Button type="submit" text="Update Studio"
              onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDoctor;

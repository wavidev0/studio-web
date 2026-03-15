import RootLayout from "@/component/layout/Layout";
import Button from "@/extra/Button";
import { createStudio } from "@/store/doctorSlice";
import { getServices } from "@/store/serviceSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ImagePlus, X, Eye, EyeOff, Upload } from "lucide-react";

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div className="as-field">
    <label className="as-label">{label}</label>
    {children}
    {error && <p className="as-error">{error}</p>}
  </div>
);

const AddStudio = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { service } = useSelector((state: RootStore) => state.service);
  const { isLoading } = useSelector((state: RootStore) => state.doctor);

  const [form, setForm] = useState({
    studioName: "", ownerName: "", mobile: "", email: "",
    password: "", country: "", city: "", address: "",
    pricePerHour: "", equipment: "", studioDescription: "", category: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { dispatch(getServices({ search: "ALL" } as any)); }, [dispatch]);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(p => ({ ...p, [field]: e.target.value }));
    if (e.target.value) setErrors(p => ({ ...p, [field]: "" }));
  };

  const addFiles = (files: File[]) => {
    setImages(p => [...p, ...files]);
    setImagePreviews(p => [...p, ...files.map(f => URL.createObjectURL(f))]);
    setErrors(p => ({ ...p, images: "" }));
  };

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    if (files.length) addFiles(files);
  };

  const removeImage = (idx: number) => {
    setImages(p => p.filter((_, i) => i !== idx));
    setImagePreviews(p => p.filter((_, i) => i !== idx));
  };

  const validate = () => {
    const required = ["studioName","ownerName","mobile","email","password","country","city","address","pricePerHour"] as const;
    const e: Record<string, string> = {};
    required.forEach(k => { if (!form[k]) e[k] = `${k.replace(/([A-Z])/g," $1")} is required`; });
    if (images.length === 0) e.images = "At least one image is required";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);
    const fd = new FormData();
    fd.append("name", form.studioName); fd.append("ownerName", form.ownerName);
    fd.append("mobile", form.mobile); fd.append("email", form.email);
    fd.append("password", form.password); fd.append("country", form.country);
    fd.append("city", form.city); fd.append("address", form.address);
    fd.append("pricePerHour", form.pricePerHour); fd.append("equipment", form.equipment);
    fd.append("studioDescription", form.studioDescription);
    if (form.category) fd.append("category", form.category);
    images.forEach(img => fd.append("images", img));
    const result = await dispatch(createStudio({ data: fd } as any));
    if ((result.payload as any)?.data?.status) router.push("/DoctorTable");
  };

  return (
    <div className="as-page">
      <form onSubmit={handleSubmit}>

        {/* ── Image Upload — full width ── */}
        <div className="as-section">
          <div className="as-section-title">
            <ImagePlus size={16} />
            Studio Images
          </div>

          {/* Drop zone */}
          <div
            className={`as-dropzone ${dragging ? "as-dropzone-drag" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handleImages} />
            <Upload size={28} className="as-dropzone-icon" />
            <p className="as-dropzone-text">Drag & drop images here, or <span>browse</span></p>
            <p className="as-dropzone-hint">PNG, JPG, WEBP up to 10MB each</p>
          </div>
          {errors.images && <p className="as-error">{errors.images}</p>}

          {/* Previews */}
          {imagePreviews.length > 0 && (
            <div className="as-previews">
              {imagePreviews.map((src, i) => (
                <div key={i} className="as-preview-item">
                  <img src={src} alt={`preview-${i}`} />
                  <button type="button" className="as-preview-remove" onClick={() => removeImage(i)}>
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Studio Information ── */}
        <div className="as-section">
          <div className="as-section-title"><span>Studio Information</span></div>
          <div className="as-grid">
            <Field label="Studio Name" error={errors.studioName}>
              <input className="as-input" type="text" placeholder="e.g. WAVI Podcast Studio" value={form.studioName} onChange={set("studioName")} />
            </Field>
            <Field label="Owner Name" error={errors.ownerName}>
              <input className="as-input" type="text" placeholder="Owner full name" value={form.ownerName} onChange={set("ownerName")} />
            </Field>
            <Field label="Mobile Number" error={errors.mobile}>
              <input className="as-input" type="text" placeholder="+91 98765 43210" value={form.mobile} onChange={set("mobile")} />
            </Field>
            <Field label="Email" error={errors.email}>
              <input className="as-input" type="email" placeholder="studio@email.com" value={form.email} onChange={set("email")} />
            </Field>
            <Field label="Password" error={errors.password}>
              <div className="as-input-wrap">
                <input className="as-input" type={showPass ? "text" : "password"} placeholder="Login password" value={form.password} onChange={set("password")} />
                <button type="button" className="as-eye" onClick={() => setShowPass(p => !p)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>
            <Field label="Price Per Hour" error={errors.pricePerHour}>
              <input className="as-input" type="number" placeholder="e.g. 1500" value={form.pricePerHour} onChange={set("pricePerHour")} />
            </Field>
            <Field label="Equipment">
              <input className="as-input" type="text" placeholder="Mic, Mixer, Headphones..." value={form.equipment} onChange={set("equipment")} />
            </Field>
          </div>
        </div>

        {/* ── Location ── */}
        <div className="as-section">
          <div className="as-section-title"><span>Location</span></div>
          <div className="as-grid">
            <Field label="Country" error={errors.country}>
              <input className="as-input" type="text" placeholder="Country" value={form.country} onChange={set("country")} />
            </Field>
            <Field label="City" error={errors.city}>
              <input className="as-input" type="text" placeholder="City" value={form.city} onChange={set("city")} />
            </Field>
            <Field label="Address" error={errors.address}>
              <input className="as-input" type="text" placeholder="Full address" value={form.address} onChange={set("address")} />
            </Field>
          </div>
        </div>

        {/* ── Details ── */}
        <div className="as-section">
          <div className="as-section-title"><span>Details</span></div>
          <div className="as-grid">
            <Field label="Category">
              <select className="as-input" value={form.category} onChange={set("category")}>
                <option value="">— Select Category —</option>
                {service?.map((s: any) => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </Field>
            <div className="as-field as-col-2">
              <label className="as-label">Studio Description</label>
              <textarea className="as-input as-textarea" rows={4} placeholder="Describe the studio, vibe, facilities..." value={form.studioDescription} onChange={set("studioDescription")} />
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="as-footer">
          <Button className="close-model-btn" text="Cancel" type="button" onClick={() => router.push("/DoctorTable")} />
          <Button type="submit" text={isLoading ? "Saving..." : "Save Studio"} disabled={isLoading} />
        </div>

      </form>
    </div>
  );
};

AddStudio.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default AddStudio;

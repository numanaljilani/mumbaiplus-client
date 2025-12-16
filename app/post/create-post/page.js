// app/upload/page.jsx (Yellow Theme)
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { usePostMutation } from "../../../service/api/api";
import {
  Newspaper,
  Camera,
  Send,
  Loader2,
  AlertTriangle,
  CheckCircle,
  X,
  MapPin,
  CornerUpLeft,
  BookOpen,
  ChevronDown,
} from "lucide-react";

// --- Configuration ---

// पीला कलर पैलेट (न्यूज़ थीम)
const PRIMARY_COLOR = "#FFC300"; // गहरा सुनहरा पीला
const ACCENT_COLOR = "#DAA520"; // पीला/गोल्ड एक्सेंट
const BG_COLOR = "#0f172a"; // गहरा नीला/स्लेटी (लगभग काला)

// हिंदी → इंग्लिश कैटेगरी मैप (बैकएंड के लिए)
const categoryMap = {
  राजनीति: "politics",
  तकनीक: "tech",
  भ्रष्टाचार: "corruption",
  पानी: "water",
  सड़क: "roads",
  "अवैध निर्माण": "illegal_construction",
  BMC: "bmc",
  स्वास्थ्य: "health",
  शिक्षा: "education",
  अपराध: "crime",
  अन्य: "other",
  मुंबई: "mumbai",
  महाराष्ट्र: "maharashtra",
  "देश-विदेश": "national",
  फिल्म: "film",
  खेल: "sports",
};

// नई कैटेगरी लिस्ट
const categories = [
  "मुंबई",
  "महाराष्ट्र",
  "देश-विदेश",
  "फिल्म",
  "खेल",
  "राजनीति",
  "भ्रष्टाचार",
  "पानी",
  "सड़क",
  "BMC",
  "स्वास्थ्य",
  "शिक्षा",
  "अपराध",
  "अवैध निर्माण",
  "तकनीक",
  "अन्य",
];

const newsSchema = z.object({
  title: z.string().min(10, "शीर्षक कम से कम 10 अक्षर का हो"),
  description: z.string().min(50, "विवरण कम से कम 50 अक्षर का हो"),
  ward: z.string().min(2, "वार्ड/क्षेत्र भरें"),
  location: z.string().optional(),
  category: z.string().min(1, "कैटेगरी चुनें"),
});

// --- Main Component ---

export default function UploadNewsPage() {
  const router = useRouter();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const savedUser = useSelector((state) => state.user.userData?.user);
  const token = useSelector((state) => state.user.token?.token);

  const [postNews, { isLoading, isSuccess, isError, error }] =
    usePostMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(newsSchema),
  }); // प्रमाणीकरण (Authentication)

  useEffect(() => {
    if (!token || !savedUser) {
      router.push("/login");
    }
  }, [router, token, savedUser]); // इमेज चुनने पर प्रीव्यू दिखाएँ

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.size < 10 * 1024 * 1024) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert("फ़ाइल 10MB से छोटी होनी चाहिए।");
      e.target.value = null;
      setImageFile(null);
      setImagePreview(null);
    }
  }; // RTK Mutation का उपयोग करके डेटा भेजना

  const onSubmit = async (data) => {
    if (!savedUser || !token) {
      router.push("/login");
      return;
    }

    const formData = new FormData();
    formData.append("heading", data.title);
    formData.append("description", data.description);
    formData.append("ward", data.ward);
    formData.append("location", data.location || "");
    formData.append("category", categoryMap[data.category]);
    formData.append("userId", savedUser.id);
    if (imageFile) formData.append("image", imageFile);

    try {
      await postNews(formData).unwrap();
      alert(
        "आपकी खबर सफलतापूर्वक भेजी गई! 3 सेकंड में होमपेज पर रीडायरेक्ट हो रहे हैं।"
      );
      setTimeout(() => router.push("/"), 3000);
    } catch (err) {
      const errorMessage =
        err?.data?.message ||
        "खबर भेजने में कोई अज्ञात त्रुटि हुई। कृपया दोबारा प्रयास करें।";
      alert(`त्रुटि: ${errorMessage}`);
    }
  }; // सफलता संदेश (यदि isSuccess TRUE है)

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center  p-4">
               {" "}
        <div className="bg-white border-4 border-green-500 text-gray-800 p-8 md:p-12 rounded-3xl text-center shadow-2xl max-w-lg w-full">
                   {" "}
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6 animate-pulse" />
                    <h2 className="text-3xl font-bold mb-4">धन्यवाद!</h2>       
            <p className="text-xl">आपकी खबर सफलतापूर्वक प्राप्त हो गई है।</p>   
               {" "}
          <p className="text-lg mt-3">
            हमारी टीम जल्द ही इसकी समीक्षा कर प्रकाशित करेगी।
          </p>
                   {" "}
          <button
            onClick={() => router.push("/")}
            className="mt-6 bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-full flex items-center mx-auto gap-2 transition"
          >
            <CornerUpLeft size={20} /> होम पेज पर जाएँ
          </button>
                 {" "}
        </div>
             {" "}
      </div>
    );
  }

  return (
    <div className="min-h-screen  font-body  md:py-6 px-4">
           {" "}
      <div className=" mx-auto max-w-4xl">
                {/* हीरो सेक्शन (गहरे रंग की पृष्ठभूमि पर पीला टेक्स्ट) */}     
         {/* RTK Error Display */}
        {isError && error && (
          <div className="bg-red-900 border-l-4 border-red-500 text-red-300 px-4 mb-6 rounded-lg shadow-md flex items-center gap-3">
            <AlertTriangle size={24} className="text-red-400" />
            <p className="font-semibold text-sm md:text-base">
              त्रुटि:{" "}
              {error?.data?.message || "खबर भेजने में कोई अज्ञात त्रुटि हुई।"}
            </p>
          </div>
        )}
                {/* फॉर्म कार्ड (सफेद रंग में) */}       {" "}
        <div className="bg-white rounded-3xl shadow-2xl border-t-8 border-yellow-500 overflow-hidden">
                   {" "}
          <div className="bg-yellow-500 text-gray-900 text-center ">
                       {" "}
            <h2 className="text-xl md:text-2xl font-bold flex items-center justify-center gap-1">
              <BookOpen size={24} /> अपनी खबर यहाँ लिखें
            </h2>
                     {" "}
          </div>
                   {" "}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-2 md:px-5 "
          >
                        {/* वार्ड + कैटेगरी */}           {" "}
            <div className="  gap-1 ">
                           {" "}
              <InputField
                label="वार्ड / इलाका"
                placeholder="दादर, घाटकोपर..."
                name="ward"
                register={register}
                error={errors.ward}
                icon={MapPin}
              />
                           {" "}
              <SelectField
                label="कैटेगरी"
                name="category"
                register={register}
                error={errors.category}
                categories={categories}
              />
                         {" "}
            </div>
                        {/* शीर्षक */}
                       {" "}
            <InputField
              label="खबर का शीर्षक"
              placeholder="अवैध कब्ज़ा, पानी की किल्लत, नई मेट्रो लाइन..."
              name="title"
              register={register}
              error={errors.title}
            />
                        {/* विवरण */}           {" "}
            <div>
                           {" "}
              <label className="block font-bold text-gray-800 mb-2 text-sm md:text-base">
                पूरा विवरण *
              </label>
                           {" "}
              <textarea
                {...register("description")}
                rows={6}
                className={`w-full px-4 py-3 md:px-5 md:py-4 rounded-xl border-2 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } focus:border-yellow-500 outline-none resize-none transition duration-200 text-gray-700 text-sm md:text-base`}
                placeholder="क्या हुआ? कब? कहाँ? कौन जिम्मेदार? पूरी जानकारी दें..."
              />
                           {" "}
              {errors.description && (
                <p className="text-red-500 text-xs md:text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
                         {" "}
            </div>
                        {/* इमेज अपलोड + प्रीव्यू */}
                       {" "}
            <ImageUploadField
              imagePreview={imagePreview}
              imageFile={imageFile}
              handleImageChange={handleImageChange}
            />
                        {/* सबमिट बटन */}           {" "}
            <div className="text-center pt-1 md:pt-1">
                           {" "}
              <button
                type="submit"
                disabled={isLoading}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold text-lg md:text-xl px-12 py-2 md:px-16 md:py-2 rounded-full shadow-lg transition transform hover:scale-[1.02] disabled:opacity-70 flex items-center justify-center mx-auto gap-3 w-full md:w-auto"
              >
                               {" "}
                {isLoading ? (
                  <>
                                       {" "}
                    <Loader2 className="animate-spin h-5 w-5 md:h-6 md:w-6 text-gray-800" />
                                        भेजा जा रहा है...                  {" "}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" /> खबर प्रकाशन के लिए भेजें
                  </>
                )}
                             {" "}
              </button>
                         {" "}
            </div>
                        {/* नोट */}           {" "}
            <div className="bg-gray-100 border-l-4 border-yellow-500 rounded-lg px-4 md:px-6 text-center mt-2">
                           {" "}
              <p className="text-gray-700 text-sm md:text-base">
                                आपकी खबर की जाँच के बाद <strong>24 घंटे</strong>{" "}
                में प्रकाशित की जाएगी।                {" "}
                <br/>
                <br className="hidden sm:inline" />                संपर्क:{" "}
                <strong className="text-yellow-600">9594939595</strong> |
                mumbaiplusnews@gmail.com              {" "}
              </p>
                         {" "}
            </div>
                     {" "}
          </form>
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </div>
  );
}

// --- Reusable and Responsive Form Components ---

const InputField = ({
  label,
  name,
  register,
  error,
  placeholder,
  icon: Icon,
}) => (
  <div  className=''>
    <label className="block font-bold text-gray-800 mb-1 text-sm md:text-base">
      {label} *
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
      )}
      <input
        {...register(name)}
        className={`w-full px-4 py-3 md:px-5 md:py-4 rounded-xl border-2 ${
          error ? "border-red-500" : "border-gray-300"
        } focus:border-yellow-500 outline-none transition duration-200 text-gray-700 text-sm md:text-base ${
          Icon ? "pl-10" : ""
        }`}
        placeholder={placeholder}
      />
    </div>
    {error && (
      <p className="text-red-500 text-xs md:text-sm mt-1">{error.message}</p>
    )}
  </div>
);

const SelectField = ({ label, name, register, error, categories }) => (
  <div>
    <label className="block font-bold text-gray-800 mb-2 text-sm md:text-base">
      {label} *
    </label>
    <div className="relative">
      <select
        {...register(name)}
        className={`w-full px-4 py-3 md:px-5 md:py-4 rounded-xl border-2 appearance-none bg-white ${
          error ? "border-red-500" : "border-gray-300"
        } focus:border-yellow-500 outline-none transition duration-200 text-gray-700 text-sm md:text-base`}
      >
        <option value="">कैटेगरी चुनें</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-500 pointer-events-none" />
    </div>
    {error && (
      <p className="text-red-500 text-xs md:text-sm mt-1">{error.message}</p>
    )}
  </div>
);

const ImageUploadField = ({ imagePreview, imageFile, handleImageChange }) => (
  <div>
    <label className="block font-bold text-gray-800 mb-3 text-sm md:text-base">
      फोटो / वीडियो (वैकल्पिक)
    </label>

    {/* अपलोड एरिया */}
    {!imagePreview && (
      <div className="border-4 border-dashed border-yellow-500/50 rounded-2xl p-6 md:p-8 text-center bg-yellow-50 hover:bg-yellow-100 transition duration-300 cursor-pointer">
        <input
          type="file"
          accept="image/*"
          id="image-upload"
          className="hidden"
          onChange={handleImageChange}
        />
        <label htmlFor="image-upload" className="cursor-pointer block">
          <Camera className="text-yellow-600 w-12 h-12 md:w-16 md:h-16 mx-auto mb-3" />
          <p className="text-base md:text-xl font-bold text-gray-800">
            क्लिक करें या फोटो ड्रैग करें
          </p>
          <p className="text-xs md:text-sm text-gray-600 mt-1">
            JPG, PNG (10MB तक)
          </p>
        </label>
      </div>
    )}

    {/* इमेज प्रीव्यू */}
    {imagePreview && (
      <div className="mt-4 md:mt-6 bg-gray-100 rounded-2xl p-4 shadow-lg relative">
        <button
          onClick={() => {
            document.getElementById("image-upload").value = null;
            setImagePreview(null);
            setImageFile(null);
          }}
          type="button"
          className="absolute top-4 right-4 bg-red-600 text-white rounded-full p-2 shadow-xl hover:bg-red-700 transition z-10"
          title="फोटो हटाएँ"
        >
          <X size={16} />
        </button>
        <p className="text-sm font-bold text-gray-700 mb-3 text-center">
          चुनी गई फोटो:
        </p>
        <div className="relative h-48 md:h-72 rounded-xl overflow-hidden shadow-xl border-4 border-white">
          <Image
            src={imagePreview}
            alt="Preview"
            fill
            className="object-cover"
          />
        </div>
        <p className="text-center mt-3 text-green-600 font-bold text-sm">
          {imageFile.name}
        </p>
      </div>
    )}
  </div>
);

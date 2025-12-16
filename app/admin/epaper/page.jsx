"use client"
import React, { useState, useEffect, useMemo } from 'react';
// IMPORTING YOUR ACTUAL RTK QUERY HOOKS HERE
// सुनिश्चित करें कि ये हुक्स आपके 'api.js' या संबंधित फाइल में परिभाषित हैं।
import { 
    useGetAllEPapersQuery, // ई-पेपर सूची प्राप्त करने के लिए
    useCreateEpaperMutation, // नया ई-पेपर अपलोड करने के लिए
    useUpdateEpaperMutation, // ई-पेपर मेटाडेटा (तारीख, सक्रियता) अपडेट करने के लिए
    useDeleteEpaperMutation // ई-पेपर डिलीट करने के लिए
} from '../../../service/api/api'; 
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

// SVG Icons for Actions (using Lucide icons style)
const EditIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
    </svg>
);

const TrashIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
        <line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
    </svg>
);


// Utility function to format date to Hindi
const formatToHindi = (dateString) => {
    try {
        if (!dateString) return 'अज्ञात तारीख';
        const date = new Date(dateString);
        return date.toLocaleDateString('hi-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    } catch (error) {
        return dateString;
    }
};

// --- Main Component ---

const EpaperAdminDashboard = () => {
      const userState = useSelector((state) => state?.user?.userData?.user || {});
      const router = useRouter()
      useEffect(()=>{
        if(userState.role != "admin"){
            return router.back()
        }
      },[])
    // --- API Hook Integration ---
    // RTK Query hooks का उपयोग करें
    const { 
        data: epapers, // API से प्राप्त ई-पेपर की सूची
        isLoading: isFetching, // डेटा फेच हो रहा है या नहीं
        isSuccess, 
        isError,
        refetch // सूची को मैन्युअल रूप से रीलोड करने के लिए
    } = useGetAllEPapersQuery(); 
 
    
    // Mutation hooks
    const [createEpaper, { isLoading: isCreating }] = useCreateEpaperMutation();
    const [updateEpaper, { isLoading: isUpdating }] = useUpdateEpaperMutation();
    const [deleteEpaper, { isLoading: isDeleting }] = useDeleteEpaperMutation();

    // UI State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null); // Item being edited
    const [globalMessage, setGlobalMessage] = useState(null); // Toast/Notification message

    // State for form data (Create/Update)
    const [formData, setFormData] = useState({
        date: '',
        pdfFile: null, // PDF File object for upload
        isActive: true,
        // Read-only fields for update context
        pdfUrl: '',
        thumbnailUrl: '',
    });

    const epaperList = epapers?.epapers || []; // सुनिश्चित करें कि यह एक ऐरे है
    const isEditing = currentItem !== null;
    const modalTitle = isEditing ? 'ई-पेपर अपडेट करें' : 'नया ई-पेपर अपलोड करें';
    const isLoading = isFetching || isCreating || isUpdating || isDeleting;

    // Custom Toast/Message Handler
    const showMessage = (msg, isError = false, duration = 3000) => {
        setGlobalMessage({ msg, isError });
        setTimeout(() => setGlobalMessage(null), duration);
    };
    
    // Error handling for initial fetch
    useEffect(() => {
        if (isError) {
            showMessage("ई-पेपर सूची लोड करने में त्रुटि आई।", true, 5000);
        }
    }, [isError]);

    // --- CRUD Logic Handlers ---

    // CREATE/UPDATE (Save operation)
    const handleSave = async (e) => {
        e.preventDefault();

        if (!formData.date || (!isEditing && !formData.pdfFile)) {
            showMessage("तारीख और PDF फ़ाइल अनिवार्य है।", true);
            return;
        }

        try {
            if (isEditing) {
                // UPDATE: केवल मेटाडेटा (date, isActive) अपडेट करें
                const payload = {
                    id: currentItem.id, // ID is crucial for update mutation endpoint
                    date: formData.date,
                    isActive: formData.isActive,
                };
                await updateEpaper(payload).unwrap(); // unwrap() to handle error state
                showMessage(`ई-पेपर ${formData.date} सफलतापूर्वक अपडेट किया गया।`);
            } else {
                // CREATE: FormData के साथ फ़ाइल अपलोड करें
                const uploadFormData = new FormData();
                uploadFormData.append('date', formData.date);
                // Note: Boolean values in FormData might need to be converted to strings 'true'/'false'
                uploadFormData.append('isActive', formData.isActive ? 'true' : 'false'); 
                uploadFormData.append('pdfFile', formData.pdfFile); // PDF file

                // Note: The createEpaper mutation must be configured to accept FormData
                await createEpaper(uploadFormData).unwrap();
                showMessage(`नया ई-पेपर ${formData.date} सफलतापूर्वक अपलोड किया गया।`);
            }
            
            // RTK Query आमतौर पर टैग इनवैलिडेशन द्वारा कैशे को अपडेट करता है, 
            // इसलिए refetch() की शायद ज़रूरत न हो, लेकिन यह एक फॉलबैक है।
            // refetch(); 
            resetFormAndCloseModal();

        } catch (error) {
            console.error("सेव करने में त्रुटि:", error);
            const errorMessage = error?.data?.message || error?.error || 'अज्ञात त्रुटि';
            showMessage(`सेव करने में त्रुटि: ${errorMessage}`, true, 5000);
        }
    };

    // DELETE
    const handleDelete = async (id, date) => {
        // IMPORTANT: Use a custom modal instead of window.confirm in real apps
        // Replacing window.confirm with a custom modal is recommended, but for this exercise, 
        // using confirm() for a quick fix based on the original code, but adding a note.
        // NOTE: Please replace the standard 'confirm' with a custom modal component for production apps.
        if (!confirm(`क्या आप वाकई ${formatToHindi(date)} का ई-पेपर हटाना चाहते हैं?`)) return;

        try {
            await deleteEpaper(id).unwrap();
            showMessage(`ई-पेपर ${date} सफलतापूर्वक डिलीट किया गया।`);
            // refetch(); 
        } catch (error) {
            console.error("डिलीट करने में त्रुटि:", error);
            const errorMessage = error?.data?.message || error?.error || 'अज्ञात त्रुटि';
            showMessage(`डिलीट करने में त्रुटि: ${errorMessage}`, true, 5000);
        }
    };

    // --- Modal and Form Handlers ---

    const handleOpenCreateModal = () => {
        setCurrentItem(null);
        setFormData({ date: '', pdfFile: null, isActive: true, pdfUrl: '', thumbnailUrl: '' });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (epaper) => {
        setCurrentItem(epaper);
        setFormData({
            date: epaper.date,
            pdfFile: null, 
            pdfUrl: epaper.pdfUrl,
            thumbnailUrl: epaper.thumbnailUrl,
            isActive: epaper.isActive,
        });
        setIsModalOpen(true);
    };

    const resetFormAndCloseModal = () => {
        setCurrentItem(null);
        setFormData({ date: '', pdfFile: null, pdfUrl: '', thumbnailUrl: '', isActive: true });
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            setFormData(prev => ({ ...prev, pdfFile: files[0] }));
        } else if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // --- Render Component ---

    return (
        <div className="min-h-screen bg-gray-50 font-inter py-8">
            
            {/* Global Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 backdrop-blur-sm">
                    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-2xl">
                        <svg className="animate-spin h-8 w-8 text-yellow-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <p className="text-gray-700 font-semibold">
                            {isFetching && 'डेटा लोड हो रहा है...'}
                            {isCreating && 'अपलोड हो रहा है...'}
                            {isUpdating && 'अपडेट हो रहा है...'}
                            {isDeleting && 'डिलीट हो रहा है...'}
                        </p>
                    </div>
                </div>
            )}
            
            {/* Global Message/Toast */}
            {globalMessage && (
                <div 
                    className={`fixed top-4 right-4 z-50 p-4 text-white rounded-lg shadow-xl transition-all duration-300 ${
                        globalMessage.isError ? 'bg-red-600' : 'bg-green-600'
                    }`}
                >
                    {globalMessage.msg}
                </div>
            )}

            <main className="container mx-auto px-4 max-w-7xl">

                {/* Header & Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 p-6 bg-white rounded-2xl shadow-lg border-b-4 border-yellow-600/70">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 sm:mb-0">
                        ई-पेपर एडमिन डैशबोर्ड
                    </h1>
                    <button
                        onClick={handleOpenCreateModal}
                        className="w-full sm:w-auto bg-yellow-600 text-gray-900 px-6 py-3 rounded-full font-bold shadow-md hover:bg-yellow-700 hover:text-white transition duration-300 transform hover:scale-105 text-sm md:text-base flex items-center justify-center space-x-2"
                        disabled={isLoading}
                    >
                         {/* Plus Icon using SVG for a modern look */}
                         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        <span>नया ई-पेपर अपलोड करें</span>
                    </button>
                </div>

                {/* Epaper List */}
                <div className="bg-white rounded-xl shadow-xl overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider hidden sm:table-cell">तारीख (फाइल)</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">तारीख (हिन्दी)</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider hidden md:table-cell">प्रीव्यू</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider hidden lg:table-cell">स्थिति</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">एक्शन</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {epaperList.length > 0 ? (
                                epaperList.map((epaper) => (
                                    <tr key={epaper.id} className="hover:bg-yellow-50/50 transition">
                                        
                                        {/* Date (Raw) */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium hidden sm:table-cell">
                                            {epaper.date}
                                        </td>
                                        
                                        {/* Date (Hindi Virtual) */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {formatToHindi(epaper.date)}
                                        </td>
                                        
                                        {/* Thumbnail */}
                                        <td className="px-6 py-4 whitespace-nowrap text-center hidden md:table-cell">
                                            <a href={epaper.pdfUrl} target="_blank" rel="noopener noreferrer">
                                                {/* Note: Thumbnail is assumed to be provided by the API post-upload */}
                                                <img 
                                                    className="h-16 w-auto inline-block rounded border hover:opacity-80 transition" 
                                                    src={epaper.thumbnailUrl || "https://placehold.co/150x200/CCC/000?text=No+Thumb"} 
                                                    alt={`Thumbnail for ${epaper.date}`} 
                                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x200/CCC/000?text=No+Thumb"; }}
                                                />
                                            </a>
                                        </td>
                                        
                                        {/* Status */}
                                        <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                                            <span 
                                                className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    epaper.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {epaper.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                                            </span>
                                        </td>

                                        {/* Actions: Replaced Text with Icons */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            {/* Update Button (Pencil Icon) */}
                                            <button
                                                onClick={() => handleOpenEditModal(epaper)}
                                                className="p-2 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition duration-200 shadow-md disabled:opacity-50"
                                                disabled={isLoading}
                                                aria-label={`अपडेट करें ${epaper.date}`}
                                                title={`अपडेट करें ${formatToHindi(epaper.date)}`}
                                            >
                                                <EditIcon className="w-4 h-4" />
                                            </button>
                                            
                                            {/* Delete Button (Trash Icon) */}
                                            <button
                                                onClick={() => handleDelete(epaper.id, epaper.date)}
                                                className="p-2 inline-flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition duration-200 shadow-md disabled:opacity-50"
                                                disabled={isLoading}
                                                aria-label={`डिलीट करें ${epaper.date}`}
                                                title={`डिलीट करें ${formatToHindi(epaper.date)}`}
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        {isFetching ? 'ई-पेपर लोड हो रहा है...' : 'कोई ई-पेपर रिकॉर्ड नहीं मिला।'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Modal for Create/Update */}
            {isModalOpen && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-8 transform transition-all scale-100">
                        
                        {/* Modal Header */}
                        <div className="flex justify-between items-center border-b pb-3 mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">{modalTitle}</h2>
                            <button onClick={resetFormAndCloseModal} className="text-gray-500 hover:text-gray-800 text-3xl font-light">
                                &times;
                            </button>
                        </div>
                        
                        {/* Form */}
                        <form onSubmit={handleSave}>
                            <div className="mb-4">
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">तारीख <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {!isEditing && (
                                <div className="mb-4">
                                    <label htmlFor="pdfFile" className="block text-sm font-medium text-gray-700 mb-2">PDF फ़ाइल अपलोड करें <span className="text-red-500">*</span></label>
                                    <input
                                        type="file"
                                        id="pdfFile"
                                        name="pdfFile"
                                        accept="application/pdf"
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200"
                                        required={!isEditing}
                                        disabled={isLoading}
                                    />
                                    {formData.pdfFile && (
                                        <p className="mt-2 text-sm text-gray-500">चुनी गई फ़ाइल: {formData.pdfFile.name}</p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500">
                                        * यह फ़ाइल **FormData** के रूप में API को भेजी जाएगी, जहाँ backend इसे क्लाउड स्टोरेज (जैसे Cloudinary) पर अपलोड करेगा।
                                    </p>
                                </div>
                            )}

                            {isEditing && (
                                <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
                                    <p className="text-sm font-medium text-gray-700 mb-2">मौजूदा PDF और थंबनेल URL:</p>
                                    <a href={formData.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all text-xs">
                                        PDF: {formData.pdfUrl || 'N/A'}
                                    </a>
                                    <p className="mt-1">
                                        <a href={formData.thumbnailUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all text-xs">
                                            Thumbnail: {formData.thumbnailUrl || 'N/A'}
                                        </a>
                                    </p>
                                    <p className="mt-3 text-xs text-red-500">
                                        * **अपडेट** मोड में, हम केवल मेटाडेटा (तारीख और सक्रियता) को अपडेट कर रहे हैं। फ़ाइल को बदलने के लिए एक नया अपलोड ऑपरेशन (Create) करना या एक अलग 'अपलोड फाइल' API का उपयोग करना उचित होता है।
                                    </p>
                                </div>
                            )}
                            
                            <div className="mb-6">
                                <label htmlFor="isActive" className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                                        disabled={isLoading}
                                    />
                                    <span className="text-sm font-medium text-gray-700">ई-पेपर सक्रिय (Active) है?</span>
                                </label>
                                <p className="text-xs text-gray-500 mt-1">यह निर्धारित करता है कि यह पब्लिक व्यूअर को दिखेगा या नहीं।</p>
                            </div>


                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-yellow-600 text-gray-900 py-3 rounded-full font-bold text-lg hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition shadow-lg"
                            >
                                {isLoading ? 'सेव हो रहा है...' : (isEditing ? 'अपडेट करें' : 'अपलोड और सेव करें')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EpaperAdminDashboard;
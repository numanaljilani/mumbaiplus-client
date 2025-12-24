/**
 * EpaperViewer.jsx
 * Fixed version with proper PDF handling
 */
"use client"
import React, { useState, useEffect } from 'react';
import { useGetEPaperQuery } from '../../service/api/api';

const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

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

const EpaperViewer = () => {
    const [selectedDate, setSelectedDate] = useState(getTodayDate());
    const [globalMessage, setGlobalMessage] = useState(null);

    const { 
        data: apiResponse,
        isLoading: isFetching, 
        isSuccess, 
        isError,
        error
    } = useGetEPaperQuery(selectedDate);

    // Extract the paper data from the API response
    const selectedPaper = apiResponse?.data;

    const showMessage = (msg, isError = false, duration = 3000) => {
        setGlobalMessage({ message: msg, isError });
        setTimeout(() => setGlobalMessage(null), duration);
    };

    useEffect(() => {
        if (isFetching) return;

        if (isError) {
            const errorMessage = error?.data?.message || 'ई-पेपर डेटा लाने में कोई त्रुटि हुई।';
            showMessage(errorMessage, true, 5000);
            return;
        }

        if (isSuccess && (!selectedPaper || !selectedPaper.isActive)) {
            showMessage(`इस तारीख (${formatToHindi(selectedDate)}) का कोई सक्रिय ई-पेपर उपलब्ध नहीं है।`, true, 4000);
        }

    }, [selectedDate, isFetching, isSuccess, isError, error, selectedPaper]);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    // Get PDF URL with proper handling
    const getPdfUrl = () => {
        if (!selectedPaper?.isActive) return null;
        
        let pdfUrl = selectedPaper.pdfUrl;
        
        // Option 1: Use Google Docs Viewer as fallback (if S3 has issues)
        // return `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
        
        // Option 2: Direct S3 URL (requires proper CORS)
        // Add timestamp to prevent caching issues
        return `${pdfUrl}?t=${Date.now()}`;
    };

    const pdfUrl = getPdfUrl();

    return (
        <div className="min-h-screen bg-gray-50 font-inter py-8">
            
            {globalMessage && (
                <div 
                    className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-xl animate-pulse ${globalMessage.isError ? 'bg-red-600' : 'bg-green-600'} text-white transition-all`}
                >
                    {globalMessage.message}
                </div>
            )}

            <main className="container mx-auto px-4 max-w-7xl">

                <div className="flex flex-col md:flex-row justify-between items-center mb-8 p-6 bg-white rounded-2xl shadow-xl border-t-4 border-yellow-600/70">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 md:mb-0">
                        दैनिक ई-पेपर
                    </h1>
                    <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                        <label htmlFor="epaper-date" className="text-lg font-semibold text-gray-700 whitespace-nowrap">तारीख चुनें:</label>
                        <input
                            type="date"
                            id="epaper-date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 shadow-sm w-full sm:w-auto transition duration-300"
                            max={getTodayDate()}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 mb-8 min-h-[70vh]">
                    <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">
                        {selectedDate ? `ई-पेपर: ${formatToHindi(selectedDate)}` : 'ई-पेपर लोड हो रहा है...'}
                    </h2>

                    {isFetching ? (
                        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
                             <svg className="animate-spin h-10 w-10 text-yellow-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                             </svg>
                             <p className="text-lg">डेटा लोड हो रहा है, कृपया प्रतीक्षा करें...</p>
                        </div>
                    ) : pdfUrl && selectedPaper?.isActive ? (
                        <>
                            <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
                                <div>
                                    <p className="text-gray-600">
                                        <strong>फ़ाइल:</strong> {selectedPaper.fileInfo?.originalName}
                                    </p>
                                    <p className="text-gray-600">
                                        <strong>आकार:</strong> {(selectedPaper.fileInfo?.fileSize / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                                
                                <div className="flex gap-3">
                                    <a 
                                        href={selectedPaper.pdfUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                                        download
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        डाउनलोड PDF
                                    </a>
                                    
                                    <a 
                                        href={selectedPaper.pdfUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-150 ease-in-out"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        नई विंडो में खोलें
                                    </a>
                                </div>
                            </div>
                            
                            <div className="w-full border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden" style={{ height: '75vh' }}>
                                <iframe 
                                    src={pdfUrl}
                                    className="w-full h-full"
                                    title={`E-Paper for ${selectedDate}`}
                                    frameBorder="0"
                                    loading="lazy"
                                >
                                    <p className="p-4 text-center text-red-500">
                                        इस ब्राउज़र में PDF फ़ाइलों को प्रदर्शित करने में समस्या है। 
                                        कृपया <a href={selectedPaper.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">यहां क्लिक करके</a> फ़ाइल डाउनलोड करें।
                                    </p>
                                </iframe>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[50vh] text-center text-gray-600 p-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h2 className="text-2xl font-semibold mb-2">
                                {selectedDate ? `ई-पेपर उपलब्ध नहीं (${formatToHindi(selectedDate)})` : 'ई-पेपर उपलब्ध नहीं'}
                            </h2>
                            <p className="mt-2 text-lg max-w-md">
                                इस तारीख के लिए कोई सक्रिय ई-पेपर नहीं मिला। कृपया कोई अन्य तारीख चुनें।
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default EpaperViewer;
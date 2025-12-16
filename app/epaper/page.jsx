/**
 * EpaperViewer.jsx
 * * This component acts as a public-facing E-Paper viewer.
 * It allows the user to select a date from a calendar, fetches the corresponding 
 * E-Paper PDF URL using the API hook, and displays the PDF in an iframe.
 * It defaults to showing today's paper.
 */
"use client"
import React, { useState, useEffect } from 'react';
// ASSUMPTION: The imported hook is named useGetEPaperQuery and accepts a date string.
import { useGetEPaperQuery } from '../../service/api/api'; 

// ==========================================================
// UTILITY FUNCTIONS
// ==========================================================

/**
 * Function to get today's date in 'YYYY-MM-DD' format.
 * @returns {string} Today's date (e.g., '2025-11-28').
 */
const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Function to format date to Hindi locale string.
 * @param {string} dateString - Date in 'YYYY-MM-DD' format.
 * @returns {string} Formatted date in Hindi.
 */
const formatToHindi = (dateString) => {
    try {
        if (!dateString) return 'अज्ञात तारीख';
        const date = new Date(dateString);
        // Correct time zone for safe formatting, use UTC date to avoid local timezone issues
        const utcDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
        return utcDate.toLocaleDateString('hi-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    } catch (error) {
        return dateString;
    }
};

// ==========================================================
// MAIN COMPONENT: EpaperViewer
// ==========================================================

const EpaperViewer = () => {
    // 1. State for date selection and the paper object
    const [selectedDate, setSelectedDate] = useState(getTodayDate());
    const [globalMessage, setGlobalMessage] = useState(null);

    // API Hooks Integration: Fetch the single E-Paper for the selected date
    const { 
        data: selectedPaper, // Paper object for the selected date
        isLoading: isFetching, 
        isSuccess, 
        isError,
        error
    } = useGetEPaperQuery(selectedDate);

    // Custom Toast/Message Handler
    const showMessage = (msg, isError = false, duration = 3000) => {
        setGlobalMessage({ message: msg, isError });
        setTimeout(() => setGlobalMessage(null), duration);
    };

    // 2. Effect to handle data fetching results and messages
    useEffect(() => {
        if (isFetching) return;

        if (isError) {
             // Handle API error (e.g., network issue, 404/400 from server)
            const errorMessage = error?.data?.message || 'ई-पेपर डेटा लाने में कोई त्रुटि हुई।';
            showMessage(errorMessage, true, 5000);
            return;
        }

        if (isSuccess && !selectedPaper) {
            // This case handles a successful fetch where the paper is simply not found/null/inactive.
            showMessage(`इस तारीख (${formatToHindi(selectedDate)}) का कोई सक्रिय ई-पेपर उपलब्ध नहीं है।`, true, 4000);
        }

    }, [selectedDate, isFetching, isSuccess, isError, error, selectedPaper]);


    // Handler for date change
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    // Determine the PDF URL from the fetched data and enforce HTTPS for security/CORS fix
    let rawPdfUrl = selectedPaper?.isActive ? selectedPaper.pdfUrl : null;
    
    // 🔑 FIX: Ensure the URL uses HTTPS to prevent mixed content/authorization issues.
    const pdfUrl = rawPdfUrl 
        ? rawPdfUrl.replace(/^http:\/\//i, 'https://') // Replace http:// with https://
        : null;

    // --- Render Component ---

    return (
        <div className="min-h-screen bg-gray-50 font-inter py-8">
            
            {/* Global Message/Toast */}
            {globalMessage && (
                <div 
                    className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-xl animate-pulse ${globalMessage.isError ? 'bg-red-600' : 'bg-green-600'} text-white transition-all`}
                >
                    {globalMessage.message}
                </div>
            )}

            <main className="container mx-auto px-4 max-w-7xl">

                {/* Header & Date Selection */}
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
                            max={getTodayDate()} // Prevent selecting future dates
                        />
                    </div>
                </div>

                {/* Epaper Viewer Area (Single Paper) */}
                <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 mb-8 min-h-[70vh]">
                    <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">
                        {selectedDate ? `ई-पेपर: ${formatToHindi(selectedDate)}` : 'ई-पेपर लोड हो रहा है...'}
                    </h2>

                    {isFetching ? (
                        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
                             <svg className="animate-spin h-10 w-10 text-yellow-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                             <p className="text-lg">डेटा लोड हो रहा है, कृपया प्रतीक्षा करें...</p>
                        </div>
                    ) : pdfUrl ? (
                        <>
                            {/* --- Direct Link/Action Button --- */}
                            <div className="mb-4 text-right">
                                <a 
                                    href={pdfUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-150 ease-in-out"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 7.5 7.5-.75 7.5m-.75 7.5-7.5-7.5" />
                                    </svg>
                                    पूरी स्क्रीन पर PDF खोलें (Open Full Screen)
                                </a>
                            </div>
                            
                            {/* PDF Viewer using iframe */}
                            <div className="w-full aspect-[4/5] md:h-[80vh] border-4 border-yellow-500/50 rounded-lg shadow-2xl overflow-hidden">
                                <iframe 
                                    src={pdfUrl} 
                                    className="w-full h-full" 
                                    title={`E-Paper for ${selectedDate}`}
                                    frameBorder="0"
                                    loading="lazy"
                                >
                                    <p className="p-4 text-center text-red-500">
                                        इस ब्राउज़र में PDF फ़ाइलों को प्रदर्शित करने में समस्या है। 
                                        कृपया <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">यहां क्लिक करके</a> फ़ाइल डाउनलोड करें।
                                    </p>
                                </iframe>
                            </div>
                        </>
                    ) : (
                        // Not Found State
                        <div className="flex flex-col items-center justify-center h-[50vh] text-center text-gray-600 p-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-red-500 mb-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.23 2.361L14.652 7.6H2.25a2.25 2.25 0 0 0-2.25 2.25v10.5a2.25 2.25 0 0 0 2.25 2.25h16.5a2.25 2.25 0 0 0 2.25-2.25V9.75M16.5 7.5a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5z" />
                            </svg>
                            <h2 className="text-2xl font-semibold">
                                {selectedDate ? `ई-पेपर उपलब्ध नहीं (${formatToHindi(selectedDate)})` : 'ई-पेपर उपलब्ध नहीं'}
                            </h2>
                            <p className="mt-2 text-lg max-w-md">
                                कृपया सुनिश्चित करें कि आपने सही तारीख चुनी है और उस तारीख का ई-पेपर सक्रिय (Active) स्थिति में मौजूद है।
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default EpaperViewer;
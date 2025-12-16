'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
    Search, Trash2, CheckCircle, XCircle, Info, Ban, User, 
    Loader2, RefreshCw, AlertTriangle, X 
} from 'lucide-react';
// X Icon is needed for BaseModal, importing it here for completeness

// --- REAL RTK Query Hooks Import ---
// यहाँ आपको अपनी वास्तविक API फ़ाइल से हुक आयात करने होंगे।
import { 
    useGetReportersQuery, 
    useUpdateReporterMutation, 
    useDeleteReporterMutation 
} from '../../../service/api/api'; 
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
// पाथ को अपने फ़ाइल स्ट्रक्चर के अनुसार बदलें।

// --- Type Definitions (Recommended for real-world) ---
/**
 * @typedef {'active' | 'pending' | 'suspended'} ReporterStatus
 * @typedef {{
 * id: string;
 * name: string;
 * email: string;
 * mobile: string;
 * isVerified: boolean;
 * status: ReporterStatus;
 * registered: string;
 * articles: number;
 * }} Reporter
 * @typedef {'delete' | 'suspend' | 'verify'} ActionType
 */

// Utility Functions
/**
 * @param {ReporterStatus} status
 */
const getStatusColor = (status) => {
    switch (status) {
        case 'active': return 'bg-green-100 text-green-800 border-green-300';
        case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'suspended': return 'bg-red-100 text-red-800 border-red-300';
        default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
};

/**
 * @param {boolean} isVerified
 */
const getVerifiedIcon = (isVerified) => {
    return isVerified 
        ? <CheckCircle size={18} className="text-green-500" />
        : <XCircle size={18} className="text-red-500" />;
};

// --- Modals ---

// BaseModal is fine, assuming X is imported from 'lucide-react'

const BaseModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border-t-8 border-red-600 animate-slide-up">
                <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-600 transition p-1 rounded-full">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ label, value, icon }) => (
    <div className="flex justify-between border-b pb-2">
        <span className="font-semibold text-gray-600">{label}:</span>
        <span className="flex items-center space-x-2">
            {icon}
            <span className="font-medium text-gray-900">{value}</span>
        </span>
    </div>
);

/**
 * @param {{isOpen: boolean, onClose: () => void, reporter: Reporter | null}} props
 */
const ReporterDetailsModal = ({ isOpen, onClose, reporter }) => {
    if (!reporter) return null;
    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title={`विवरण: ${reporter.name}`}>
            <div className="space-y-4 text-gray-700">
                <DetailItem label="ID" value={reporter.id} />
                <DetailItem label="ईमेल" value={reporter.email} />
                <DetailItem label="मोबाइल" value={reporter.mobile} />
                <DetailItem label="पंजीकरण तिथि" value={reporter.registered} />
                <DetailItem label="सत्यापित?" value={reporter.isVerified ? 'हाँ' : 'नहीं'} icon={getVerifiedIcon(reporter.isVerified)} />
                <DetailItem label="लेख प्रकाशित" value={reporter.articles} />
                <div className="flex items-center space-x-2">
                    <span className="font-bold">स्थिति:</span>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(reporter.status)}`}>
                        {reporter.status === 'pending' ? 'लंबित' : reporter.status === 'active' ? 'सक्रिय' : 'निलंबित'}
                    </span>
                </div>
            </div>
        </BaseModal>
    );
};

/**
 * @param {{isOpen: boolean, onClose: () => void, reporter: Reporter | null, action: ActionType | null, onConfirm: () => void, isLoading: boolean}} props
 */
const ActionConfirmationModal = ({ isOpen, onClose, reporter, action, onConfirm, isLoading }) => {
    if (!reporter || !action) return null;

    const actionText = action === 'delete' ? 'हटाएं' : 
                       action === 'suspend' ? (reporter.status === 'suspended' ? 'सक्रिय करें' : 'निलंबित करें') : 
                       action === 'verify' ? (reporter.isVerified ? 'असत्यापित करें' : 'सत्यापित करें') : 'कार्रवाई करें';
                       
    const message = action === 'delete' 
        ? `क्या आप वाकई रिपोर्टर ${reporter.name} (${reporter.email}) को स्थायी रूप से हटाना चाहते हैं? यह कार्रवाई वापस नहीं ली जा सकती।`
        : action === 'suspend' 
        ? (reporter.status === 'suspended' 
            ? `क्या आप वाकई रिपोर्टर ${reporter.name} (${reporter.email}) के अकाउंट को सक्रिय करना चाहते हैं?`
            : `क्या आप वाकई रिपोर्टर ${reporter.name} (${reporter.email}) के अकाउंट को निलंबित करना चाहते हैं?`)
        : `क्या आप रिपोर्टर ${reporter.name} (${reporter.email}) को ${reporter.isVerified ? 'असत्यापित' : 'सत्यापित'} करना चाहते हैं?`;

    const buttonClass = action === 'delete' ? 'bg-red-600 hover:bg-red-700' : 
                        (action === 'suspend' && reporter.status === 'suspended') ? 'bg-green-600 hover:bg-green-700' :
                        'bg-yellow-600 hover:bg-yellow-700';

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title={`${actionText} की पुष्टि`}>
            <div className="flex items-start space-x-3 mb-6 bg-red-50 p-4 rounded-lg border border-red-200">
                <AlertTriangle className="text-red-500 mt-1 flex-shrink-0" size={24} />
                <p className="text-gray-800">{message}</p>
            </div>
            
            <div className="flex justify-end space-x-4">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                    disabled={isLoading}
                >
                    रद्द करें
                </button>
                <button
                    onClick={onConfirm} // Call onConfirm directly which is set up to call handleConfirmAction
                    className={`px-4 py-2 text-white rounded-lg font-bold transition disabled:opacity-50 ${buttonClass}`}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : actionText}
                </button>
            </div>
        </BaseModal>
    );
};

// --- Main Component ---

export const ReporterAdminPage = () => {
    // 1. RTK Query Hooks का उपयोग
    const { 
        data: reporters, 
        isLoading: isFetching, 
        isError, 
        error, 
        refetch 
    } = useGetReportersQuery();

        const userState = useSelector((state) => state?.user?.userData?.user || {});
              const router = useRouter()
              useEffect(()=>{
                if(userState.role != "admin"){
                    return router.back()
                }
              },[])

    // The update and delete mutations automatically trigger a re-render and often 
    // update the cache. We'll add error and success states for better UX in a real app.
    const [updateReporter, { isLoading: isUpdating }] = useUpdateReporterMutation();
    const [deleteReporter, { isLoading: isDeleting }] = useDeleteReporterMutation();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    
    // Modal states
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    /** @type {[Reporter | null, React.Dispatch<React.SetStateAction<Reporter | null>>]} */
    const [selectedReporter, setSelectedReporter] = useState(null);
    /** @type {[ActionType | null, React.Dispatch<React.SetStateAction<ActionType | null>>]} */
    const [pendingAction, setPendingAction] = useState(null);
    // [NOTE: Added a state for showing an action feedback message, though implementation is skipped for brevity]
    // const [feedbackMessage, setFeedbackMessage] = useState(null);

    // Filtered Reporters List
    const filteredReporters = useMemo(() => {
        if (!reporters === undefined || !reporters) return []; // Handle undefined/null case

        // Assuming reporters is an array of Reporter objects
        const reporterArray = Array.isArray(reporters) ? reporters : [];

        return reporterArray.filter(reporter => {
            const matchesSearch = reporter.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  reporter.email.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = filterStatus === 'all' || 
                                  (filterStatus === 'verified' ? reporter.isVerified : 
                                   filterStatus === 'unverified' ? !reporter.isVerified : 
                                   reporter.status === filterStatus);

            return matchesSearch && matchesStatus;
        });
    }, [reporters, searchTerm, filterStatus]);

    // Action Handlers
    /**
     * @param {Reporter} reporter
     */
    const handleOpenDetails = (reporter) => {
        setSelectedReporter(reporter);
        setIsDetailModalOpen(true);
    };

    /**
     * @param {Reporter} reporter
     * @param {ActionType} action
     */
    const handleOpenConfirmation = (reporter, action) => {
        setSelectedReporter(reporter);
        setPendingAction(action);
        setIsConfirmModalOpen(true);
    };

    const handleCloseConfirmation = () => {
        setIsConfirmModalOpen(false);
        setPendingAction(null);
        setSelectedReporter(null);
    }

    const handleConfirmAction = async () => {
        if (!selectedReporter || !pendingAction) return;

        const reporterId = selectedReporter._id;
        let updateData = null;
        let actionFunction = null;

        if (pendingAction === 'delete') {
            actionFunction = deleteReporter;
            updateData = reporterId;
        } else if (pendingAction === 'suspend') {
            actionFunction = updateReporter;
            // Toggle status between 'active' and 'suspended'
            const newStatus = selectedReporter.status === 'suspended' ? 'active' : 'suspended';
            updateData = { id: reporterId, status: newStatus };
        } else if (pendingAction === 'verify') {
            actionFunction = updateReporter;
            const newVerifiedStatus = !selectedReporter.isVerified;
            // If verifying an unverified user, also set status to 'active' if it's 'pending'
            const newStatus = !selectedReporter.isVerified && selectedReporter.status === 'pending' ? 'active' : selectedReporter.status;
            updateData = { id: reporterId, isVerified: newVerifiedStatus, status: newStatus };
        }

        if (actionFunction && updateData) {
            try {
                // Execute the mutation
                // RTK Query is optimized to automatically update the cached list after a successful mutation
                await actionFunction(updateData).unwrap();
                // setFeedbackMessage({ type: 'success', text: 'Action successful!' });
            } catch (error) {
                console.error(`Action failed (${pendingAction}):`, error);
                // setFeedbackMessage({ type: 'error', text: 'Action failed. See console for details.' });
            } finally {
                handleCloseConfirmation();
            }
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-body">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Roboto:wght@400;700&display=swap');
                .font-headline { font-family: 'Playfair Display', serif; }
                .font-body { font-family: 'Roboto', sans-serif; }
                @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
            `}</style>

            {/* Header / Masthead Style */}
            <div className="bg-yellow-600 text-white p-6 rounded-t-lg shadow-md mb-8">
                <p className="text-xl font-medium flex items-center gap-2">
                    <User size={24} /> रिपोर्टर प्रबंधन
                </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-xl">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="नाम या ईमेल से खोजें..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 outline-none transition"
                        />
                    </div>
                    
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="py-3 px-4 border-2 border-gray-300 rounded-lg focus:border-red-600 outline-none w-full sm:w-auto"
                    >
                        <option value="all">सभी रिपोर्टर</option>
                        <option value="verified">सत्यापित (Verified)</option>
                        <option value="unverified">असत्यापित (Unverified)</option>
                        <option value="active">सक्रिय (Active)</option>
                        <option value="pending">लंबित (Pending)</option>
                        <option value="suspended">निलंबित (Suspended)</option>
                    </select>

                    <button
                        onClick={refetch}
                        disabled={isFetching || isUpdating || isDeleting}
                        className="py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2 disabled:opacity-50 w-full sm:w-auto"
                        title="डेटा रिफ्रेश करें"
                    >
                        {isFetching ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw size={18} />}
                        रिफ्रेश
                    </button>
                </div>

                {/* Error Message */}
                {isError && (
                    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg flex items-center gap-2" role="alert">
                        <AlertTriangle size={20} />
                        <div>
                            **डेटा प्राप्त करने में त्रुटि:** {(error?.data?.message) || 'सर्वर से डेटा प्राप्त नहीं हो सका।'}
                        </div>
                    </div>
                )}


                {/* Reporter Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-inner">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                {['नाम', 'ईमेल', 'सत्यापित', 'स्थिति', 'लेख', 'एक्शन'].map(header => (
                                    <th
                                        key={header}
                                        className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isFetching ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-lg text-red-600 font-medium">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                        रिपोर्टर डेटा लोड हो रहा है...
                                    </td>
                                </tr>
                            ) : filteredReporters.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-lg text-gray-500 font-medium">
                                        कोई रिकॉर्ड नहीं मिला।
                                    </td>
                                </tr>
                            ) : (
                                filteredReporters.map((reporter) => (
                                    <tr key={reporter.id} className="hover:bg-red-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {reporter.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {reporter.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center space-x-2">
                                                {getVerifiedIcon(reporter.isVerified)}
                                                <span className={reporter.isVerified ? 'text-green-600' : 'text-red-600'}>
                                                    {reporter.isVerified ? 'सत्यापित' : 'असत्यापित'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(reporter.status)}`}>
                                                {reporter.status === 'pending' ? 'लंबित' : reporter.status === 'active' ? 'सक्रिय' : 'निलंबित'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {reporter.articles}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                {/* Info Button */}
                                                <button
                                                    onClick={() => handleOpenDetails(reporter)}
                                                    className="p-2 text-blue-600 hover:text-blue-800 rounded-full bg-blue-100 hover:bg-blue-200 transition"
                                                    title="विवरण देखें"
                                                >
                                                    <Info size={18} />
                                                </button>

                                                {/* Verify Toggle Button */}
                                                <button
                                                    onClick={() => handleOpenConfirmation(reporter, 'verify')}
                                                    className={`p-2 rounded-full transition ${
                                                         reporter.isVerified ? 'text-red-600 hover:text-red-800 bg-red-100 hover:bg-red-200' : 'text-green-600 hover:text-green-800 bg-green-100 hover:bg-green-200'
                                                    }`}
                                                    title={reporter.isVerified ? 'असत्यापित करें' : 'सत्यापित करें'}
                                                >
                                                    {reporter.isVerified ? <XCircle size={18} /> : <CheckCircle size={18} />}
                                                </button>

                                                {/* Suspend Toggle Button */}
                                                <button
                                                    onClick={() => handleOpenConfirmation(reporter, 'suspend')}
                                                    className={`p-2 rounded-full transition ${
                                                         reporter.status === 'suspended' ? 'text-green-600 hover:text-green-800 bg-green-100 hover:bg-green-200' : 'text-yellow-600 hover:text-yellow-800 bg-yellow-100 hover:bg-yellow-200'
                                                    }`}
                                                    title={reporter.status === 'suspended' ? 'सक्रिय करें' : 'निलंबित करें'}
                                                >
                                                    <Ban size={18} />
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleOpenConfirmation(reporter, 'delete')}
                                                    className="p-2 text-gray-600 hover:text-red-600 rounded-full bg-gray-100 hover:bg-red-100 transition"
                                                    title="हटाएं"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Info */}
                <div className="mt-6 text-sm text-gray-500 text-right">
                    कुल रिपोर्टर: {reporters?.length || 0} | प्रदर्शित: {filteredReporters.length}
                </div>
            </div>

            {/* Modals */}
            <ReporterDetailsModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                reporter={selectedReporter}
            />

            <ActionConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={handleCloseConfirmation}
                reporter={selectedReporter}
                action={pendingAction}
                onConfirm={handleConfirmAction}
                isLoading={isUpdating || isDeleting}
            />
        </div>
    );
};

export default ReporterAdminPage;
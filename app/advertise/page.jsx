import React from 'react';

// Using inline SVG icons as a reliable alternative to external libraries like lucide-react/font-awesome
const icons = {
  Phone: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-3.67-3.67A19.79 19.79 0 0 1 2 4.18 2 2 0 0 1 4.1 2h3.17a2 2 0 0 1 2 1.73c.12 1.13.36 2.22.76 3.25a2 2 0 0 1-.45 2.15l-1.63 1.63a15.42 15.42 0 0 0 5.66 5.66l1.63-1.63a2 2 0 0 1 2.15-.45c1.03.4 2.12.64 3.25.76a2 2 0 0 1 1.73 2v3Z" /></svg>
  ),
  Mail: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6" /></svg>
  ),
  MapPin: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.9 10.95c0 5.5-8.9 10.5-8.9 10.5S3.1 16.45 3.1 10.95a8.9 8.9 0 1 1 17.8 0z" /><circle cx="12" cy="10.95" r="3" /></svg>
  ),
  WhatsApp: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12.002 0C6.111 0 1.5 4.612 1.5 10.5C1.5 12.443 2.053 14.309 3.085 15.932L1.87 22.5L8.527 21.312C10.198 22.35 12.08 22.95 14.002 22.95C19.893 22.95 24.502 18.337 24.502 12.45C24.502 6.563 19.893 1.95 14.002 1.95C14.002 1.95 14.002 0 12.002 0ZM18.595 16.59C18.238 17.433 17.067 18.27 16.326 18.336C15.688 18.402 14.86 18.396 12.502 17.4C10.15 16.404 8.65 14.868 7.654 12.52C6.657 10.17 6.657 9.345 6.723 8.708C6.79 7.965 7.625 6.79 8.468 6.433C8.567 6.39 8.75 6.37 8.902 6.37C9.034 6.37 9.172 6.38 9.29 6.402C9.444 6.43 9.53 6.48 9.68 6.82C10.08 7.74 10.824 9.51 10.9 9.63C10.975 9.775 11.05 9.94 10.887 10.17C10.72 10.407 10.61 10.55 10.46 10.72C10.315 10.89 10.21 11.01 10.05 11.19C9.887 11.37 9.77 11.51 9.9 11.75C10.03 11.99 11.2 13.88 12.92 14.99C14.28 15.89 15.35 16.2 15.77 16.35C16.27 16.53 16.63 16.52 17.05 16.45C17.47 16.39 18.52 15.75 18.73 15.06C18.94 14.37 18.94 14.49 19.04 14.65C19.14 14.81 19.45 16.03 18.595 16.59Z" /></svg>
  )
};


const AdContactPage = () => {
  const adData = {
    phone: '9594939595',
    whatsappLink: 'https://wa.me/919594939595?text=I am interested in advertising with Mumbai Plus.',
    email: 'mumbaiplusnews@gmail.com',
    address: 'ओम शिव साई सीएचएस, ए-06, नियर रुनवाल एंड ओमकार एस्क्वायर, सायन (पूर्व), मुंबई - 400022 (MH) India',
    // Benefits translated from Hindi for the code readability:
    benefits: [
      "मुंबई के 50+ वार्डों तक सीधा पहुँच (Direct reach to 50+ Mumbai wards)",
      "दैनिक ई-पेपर और वेबसाइट पर प्रीमियम प्लेसमेंट (Premium placement on Daily E-Paper & Website)",
      "स्थानीय नागरिकों और निर्णय निर्माताओं पर लक्षित विज्ञापन (Targeted ads on local citizens and policymakers)",
      "उच्च रूपांतरण दर के लिए अनुकूलित पैकेज (Customized packages for high conversion rate)",
    ]
  };

  return (
    // Main container with light background and dark text
    <div className="min-h-screen bg-gray-50 text-gray-800 flex items-center justify-center p-4 sm:p-8 font-inter">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header Section (Kept yellow-600 background as requested) */}
        <div className="bg-yellow-600 p-8 sm:p-10 text-center relative">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            विज्ञापन के लिए संपर्क करें
          </h1>
          <p className="text-gray-700 text-lg font-medium">
            मुंबई की सच्ची आवाज़ के साथ अपनी पहुँच बढ़ाएँ।
          </p>
          {/* Decorative element */}
          <div className="absolute top-0 left-0 w-full h-full bg-cover opacity-10" style={{backgroundImage: "url('/logo.png')"}}></div>
        </div>

        {/* Main Content Grid */}
        <div className="p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* 1. Value Proposition / Ad Information */}
          <div>
            <h2 className="text-2xl font-bold border-b-2 border-yellow-600 pb-2 mb-6 text-yellow-600">
              विज्ञापन क्यों?
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              मुंबई प्लस पिछले 2009 से मुंबई के हर वार्ड की ज़मीनी खबरें प्रकाशित कर रहा है। हमारा पाठक वर्ग अत्यंत लक्षित (highly targeted) है जिसमें स्थानीय व्यापारी, निवासी और बीएमसी (BMC) व सरकारी अधिकारी शामिल हैं।
            </p>

            <ul className="space-y-4">
              {adData.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start text-gray-700">
                  <span className="text-yellow-600 text-xl mr-3 mt-0.5">
                    &bull;
                  </span>
                  <p className="flex-1">{benefit}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* 2. Contact Block and CTA */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold border-b-2 border-yellow-600 pb-2 mb-6 text-yellow-600">
              सीधा संपर्क
            </h2>

            {/* Contact Details Cards */}
            <div className="space-y-5">
              
              {/* Phone - Background changed to subtle gray-100 */}
              <div className="flex items-center p-4 bg-gray-100 rounded-lg shadow-sm border border-gray-200">
                <icons.Phone className="w-6 h-6 text-yellow-600 flex-shrink-0 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">कॉल या SMS करें</p>
                  <a href={`tel:${adData.phone}`} className="text-xl font-semibold text-gray-800 hover:text-yellow-500 transition-colors">
                    +91 {adData.phone}
                  </a>
                </div>
              </div>

              {/* Email - Background changed to subtle gray-100 */}
              <div className="flex items-center p-4 bg-gray-100 rounded-lg shadow-sm border border-gray-200">
                <icons.Mail className="w-6 h-6 text-yellow-600 flex-shrink-0 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">ईमेल भेजें</p>
                  <a href={`mailto:${adData.email}`} className="text-xl font-semibold text-gray-800 hover:text-yellow-500 transition-colors break-words">
                    {adData.email}
                  </a>
                </div>
              </div>
              
            </div>
            
            {/* WhatsApp CTA (Color remains for high contrast) */}
            <a 
              href={adData.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-lg font-bold rounded-xl shadow-lg text-gray-900 bg-yellow-600 hover:bg-yellow-500 transition-all transform hover:scale-[1.01] duration-300 group"
              aria-label="Send message on WhatsApp"
            >
              <icons.WhatsApp className="w-6 h-6 mr-3 text-gray-900 group-hover:animate-pulse" />
              WhatsApp पर तुरंत बात करें
            </a>

            {/* Address */}
            <div className="pt-4 border-t border-gray-200">
                <div className="flex items-start text-gray-600">
                    <icons.MapPin className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1 mr-3" />
                    <p className="text-sm leading-relaxed">
                        <span className="font-semibold text-yellow-600">कार्यालय:</span><br/>
                        {adData.address}
                    </p>
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdContactPage;
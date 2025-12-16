// app/payment/page.jsx
'use client';

import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'digital'; // default digital
  const [showSuccess, setShowSuccess] = useState(false);

  const plans = {
    print: { name: 'प्रिंट न्यूज़पेपर', monthly: 260, yearly: 3120 },
    digital: { name: 'डिजिटल न्यूज़पेपर', monthly: 130, yearly: 1560 },
  };

  const currentPlan = plans[plan];

  // WhatsApp पर स्क्रीनशॉट भेजने का लिंक
  const whatsappMessage = encodeURIComponent(
    `नमस्ते मुंबई प्लस!\n` +
    `मैंने ${currentPlan.name} की सदस्यता के लिए भुगतान कर दिया है।\n` +
    `राशि: ₹${plan === 'print' ? '3120 (वार्षिक)' : '1560 (वार्षिक)'}\n` +
    `कृपया मेरी सदस्यता एक्टिवेट करें 🙏\n\n` +
    `धन्यवाद,\n[आपका नाम यहाँ लिखें]`
  );

  const whatsappLink = `https://wa.me/919594939595?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 md:py-16 font-mumbai">
      <div className="container mx-auto px-4 max-w-2xl">

        {/* सफलता मैसेज (क्लिक करने के बाद) */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl ">
              <div className="text-6xl mb-4">Payment Successful</div>
              <p className="text-xl font-bold text-[#ee73c4] mb-4">
                आपकी सदस्यता लगभग सक्रिय हो गई!
              </p>
              <p className="text-gray-700 mb-6">
                कृपया पेमेंट का स्क्रीनशॉट WhatsApp पर भेजें ताकि हम तुरंत आपकी सदस्यता शुरू कर सकें।
              </p>
              <Link
                href={whatsappLink}
                target="_blank"
                className="bg-green-500 text-white px-8 py-4 rounded-full text-xl font-bold hover:bg-green-600 inline-flex items-center gap-3 shadow-lg"
              >
                WhatsApp पर भेजें
              </Link>
              <button
                onClick={() => setShowSuccess(false)}
                className="mt-4 text-gray-500 underline"
              >
                बंद करें
              </button>
            </div>
          </div>
        )}

        {/* मुख्य पेमेंट कार्ड */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* टॉप पिंक बार */}
          <div className="bg-[#ee73c4] text-white text-center py-6">
            <h1 className="text-2xl md:text-3xl font-bold">
              सदस्यता भुगतान – QR कोड
            </h1>
            <p className="mt-2 text-lg">सुरक्षित और तुरंत भुगतान</p>
          </div>

          <div className="p-8 md:p-12 text-center">

            {/* प्लान डिटेल */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {currentPlan.name}
              </h2>
              <div className="text-5xl font-bold text-[#ee73c4]">
                ₹{plan === 'print' ? '3120' : '1560'}
              </div>
              <p className="text-gray-600 mt-2">वार्षिक सदस्यता (सबसे किफायती)</p>
              <p className="text-sm text-gray-500 mt-4">
                मासिक विकल्प भी उपलब्ध: ₹{currentPlan.monthly}/माह
              </p>
            </div>

            {/* QR कोड */}
            <div className="mb-10">
              <div className="bg-gray-100 border-4 border-dashed border-gray-300 rounded-2xl p-8 inline-block">
                <Image
                  src="/qr-code.jpg"   
                  alt="Mumbai Plus Payment QR Code"
                  width={320}
                  height={320}
                  className="rounded-xl shadow-2xl"
                  priority
                />
              </div>
              <p className="text-sm text-gray-600 mt-4">
                UPI ID: mumbaiplus@upi (या QR स्कैन करें)
              </p>
            </div>

            {/* स्टेप्स */}
            <div className="bg-blue-50 rounded-2xl p-6 mb-10 text-left">
              <h3 className="font-bold text-lg text-blue-900 mb-4 text-center">
                भुगतान कैसे करें?
              </h3>
              <ol className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-[#ee73c4] font-bold text-xl">1</span>
                  ऊपर दिया QR कोड स्कैन करें या UPI ID डालें
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ee73c4] font-bold text-xl">2</span>
                  सही राशि डालें: ₹{plan === 'print' ? '3120' : '1560'}
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ee73c4] font-bold text-xl">3</span>
                  भुगतान पूरा करें और स्क्रीनशॉट लें
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ee73c4] font-bold text-xl">4</span>
                  नीचे बटन दबाकर WhatsApp पर भेजें
                </li>
              </ol>
            </div>

            {/* मुख्य CTA बटन */}
            <button
              onClick={() => setShowSuccess(true)}
              className="bg-[#ee73c4] text-white px-12 py-5 rounded-full text-xl md:text-2xl font-bold hover:bg-pink-600 transition shadow-2xl w-full md:w-auto"
            >
              Payment Successful मैंने भुगतान कर दिया है
            </button>

            <p className="text-sm text-gray-500 mt-8">
              भुगतान के 10 मिनट के अंदर आपकी सदस्यता सक्रिय हो जाएगी<br />
              सपोर्ट: <span className="font-bold text-[#ee73c4]">9594939595</span>
            </p>
          </div>
        </div>

        {/* बैक बटन */}
        <div className="text-center mt-8">
          <Link href="/member" className="text-[#ee73c4] hover:underline font-bold">
            ← वापस सदस्यता पेज पर
          </Link>
        </div>
      </div>
    </div>
  );
}
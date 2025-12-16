import React from 'react';
// Removed: import Header, Footer, Link, Image as they are either unused or incompatible with the standalone environment.

export default function ContactPage () {
  return (
    // Main container with light background and Inter font for a professional look
    <div className="min-h-screen bg-gray-50 font-inter py-8">
      <main className="py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* 1. हीरो सेक्शन: शीर्षक और परिचय */}
          <section className="text-center mb-16 bg-white p-10 rounded-3xl shadow-xl border-t-8 border-yellow-600">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-6">
              हमसे संपर्क करें
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              आपकी खबर, आपकी शिकायत, आपकी आवाज़ — हमें तुरंत भेजें।<br />
              हमारा प्रयास है कि हम 24 घंटे के अंदर आपकी हर बात का जवाब दें!
            </p>
          </section>

          {/* 2. मुख्य कॉन्टैक्ट कार्ड्स - तीन स्पष्ट विभाग */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">

            {/* 2.1 खबर भेजें (News Tip) */}
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl transition duration-300 border border-gray-100">
              <div className="text-5xl mb-4 text-yellow-600">📰</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">खबर भेजें</h3>
              <p className="text-gray-600 mb-6 font-medium">
                अपने वार्ड की लोकल खबर, फोटो, वीडियो या घटना हमारे साथ गोपनीय तरीके से शेयर करें।
              </p>
              <div className="space-y-4">
                <a
                  href="https://wa.me/919594939595?text=नमस्ते%20मुंबई%20प्लस!%20मैं%20अपने%20इलाके%20की%20खबर%20भेज%20रहा/रही%20हूँ..."
                  target="_blank"
                  className="block bg-green-600 text-white py-4 rounded-full font-bold text-lg hover:bg-green-700 transition shadow-lg transform hover:scale-[1.02]"
                >
                  व्हाट्सएप पर भेजें (9594939595)
                </a>
                <a
                  href="mailto:mumbaiplusnews@gmail.com?subject=खबर%20भेजी%20गई"
                  className="block bg-gray-700 text-white py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition shadow-lg transform hover:scale-[1.02]"
                >
                  ईमेल करें (mumbaiplusnews@gmail.com)
                </a>
              </div>
            </div>

            {/* 2.2 शिकायत / भ्रष्टाचार (Complaint) - हाइलाइटेड */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center hover:shadow-3xl transition duration-300 border-4 border-yellow-600/70">
              <div className="text-5xl mb-4 text-red-600">🚨</div>
              <h3 className="text-2xl font-bold text-yellow-600 mb-4 border-b pb-2">शिकायत दर्ज करें</h3>
              <p className="text-gray-600 mb-6 font-medium">
                पानी, सड़क, कचरा, अवैध निर्माण, भ्रष्टाचार — आपकी हर समस्या को हम प्रमुखता से उठाएंगे।
              </p>
              <div className="space-y-4">
                <a
                  href="https://wa.me/919594939595?text=नमस्ते!%20मैं%20अपने%20इलाके%20में%20हो%20रही%20समस्या%20की%20शिकायत%20करना%20चाहता/चाहती%20हूँ..."
                  target="_blank"
                  className="block bg-red-600 text-white py-4 rounded-full font-bold text-lg hover:bg-red-700 transition shadow-lg transform hover:scale-[1.02]"
                >
                  शिकायत के लिए व्हाट्सएप करें
                </a>
                <p className="text-3xl font-extrabold text-gray-800 pt-4">
                  9594939595
                </p>
              </div>
            </div>

            {/* 2.3 सदस्यता / विज्ञापन (Subscription / Advertisement) */}
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl transition duration-300 border border-gray-100">
              <div className="text-5xl mb-4 text-yellow-600">💰</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">सदस्यता / विज्ञापन</h3>
              <p className="text-gray-600 mb-6 font-medium">
                प्रिंट या डिजिटल मेंबरशिप लें या अपने व्यवसाय के लिए विज्ञापन बुक करें।
              </p>
              <div className="space-y-4">
                <a
                  href="/member"
                  className="block bg-yellow-600 text-gray-900 py-4 rounded-full font-bold text-lg hover:bg-yellow-700 transition shadow-lg transform hover:scale-[1.02]"
                >
                  सदस्यता लें / विज्ञापन पूछताछ
                </a>
                <a
                  href="tel:9594939595"
                  className="block bg-gray-500 text-white py-4 rounded-full font-bold text-lg hover:bg-gray-600 transition shadow-lg transform hover:scale-[1.02]"
                >
                  कॉल करें (9594939595)
                </a>
              </div>
            </div>
          </div>

          {/* 3. कार्यालय पता और संपर्क विवरण (Simplified and Professional) */}
          <section className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-3xl shadow-2xl p-10 md:p-14 mb-16 border-l-8 border-yellow-600">
            <div className="text-left">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6">
                हमारा कार्यालय
                </h2>
                <div className="text-lg text-gray-700 space-y-4">
                    <p className="flex items-center space-x-3">
                        <span className="text-xl text-yellow-600">📍</span>
                        <span className="font-bold">मुंबई प्लस न्यूज़</span>
                    </p>
                    <p className="leading-relaxed pl-6">
                        ओम शिव साई सीएचएस, ए-06, नियर रुनवाल एंड ओमकार एस्क्वायर,
                        सायन (पूर्व), मुंबई - 400022, महाराष्ट्र, भारत
                    </p>
                    <p className="flex items-center space-x-3 pt-2">
                        <span className="text-xl text-yellow-600">📧</span>
                        <span className="font-bold">ईमेल:</span> mumbaiplusnews@gmail.com
                    </p>
                    <p className="flex items-center space-x-3">
                        <span className="text-xl text-yellow-600">📞</span>
                        <span className="font-bold">फ़ोन:</span> 9594939595
                    </p>
                    <p className="text-sm text-gray-500 pt-4">
                        <span className="font-semibold">RNI:</span> MAHHI/2009/28028
                    </p>
                </div>
            </div>
            
            {/* संपादकीय टीम */}
            <div className="bg-gray-50 p-6 rounded-2xl shadow-inner h-full flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">संपादकीय टीम</h2>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white rounded-xl p-4 shadow-md border-b-4 border-yellow-600">
                        <p className="text-sm font-semibold text-gray-600">संपादक</p>
                        <p className="text-xl font-bold text-gray-900">मोहम्मद फारुख मेवाती</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-md border-b-4 border-gray-400">
                        <p className="text-sm font-semibold text-gray-600">कार्यकारी संपादक</p>
                        <p className="text-xl font-bold text-gray-900">राजेश यू. जायसवाल</p>
                    </div>
                </div>
            </div>
          </section>

          {/* 4. अंतिम CTA */}
          <section className="text-center mt-16 bg-yellow-600 text-gray-900 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
              हम सिर्फ खबर नहीं, समाधान लाते हैं!
            </h2>
            <p className="text-xl font-medium mb-8">
              हमारा लक्ष्य: मुंबई के हर नागरिक की समस्या को सही मंच तक पहुंचाना।
            </p>
            <a
              href="https://wa.me/919594939595"
              target="_blank"
              className="bg-gray-900 text-yellow-400 px-12 py-5 rounded-full text-2xl font-bold hover:bg-gray-800 transition shadow-lg inline-block transform hover:scale-105"
            >
              WhatsApp पर बात करें
            </a>
          </section>

        </div>
      </main>

      {/* Assuming Header and Footer components are imported and available */}
      {/* <Header /> */}
      {/* <Footer /> */} 
    </div>
  );
}
import React from 'react';
// Removed: import Header, Footer, Link, Image as they are either unused or incompatible with the standalone environment.

export default  function MemberPage()  {
  return (
    // Main container with light background and Inter font for a professional look
    <div className="min-h-screen bg-gray-50 font-inter py-8">
      <main className="py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* 1. हीरो सेक्शन: शीर्षक और परिचय */}
          <section className="text-center mb-12 md:mb-16 bg-white p-8 rounded-2xl shadow-lg border-t-8 border-yellow-600">
            
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-4">
              📢 मुंबई प्लस न्यूज़ – आपकी आवाज़ अब और भी मज़बूत!
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mt-4">
              मुंबई की सच्ची पत्रकारिता का समर्थन करें। आपकी सदस्यता से हमारी आवाज़ को शक्ति मिलती है, ताकि हम सच्चाई को निडरता से सामने ला सकें।
            </p>
          </section>

          {/* 2. लाभों की लिस्ट: क्यों जुड़ें? */}
          <section className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-yellow-600 mb-8 text-center border-b-2 border-yellow-100 pb-4">
              क्यों जुड़ें मुंबई प्लस न्यूज़ से?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                'आपके वार्ड की हर खबर – सड़क, पानी, सफ़ाई, स्कैम, विकास कार्य, स्कूल–कॉलेज, सब पर हमारी पैनी नज़र।',
                'भ्रष्टाचार के खिलाफ निडर आवाज़ – आपकी छोटी शिकायत भी हम सही मंच तक पहुँचाते हैं।',
                'स्थानीय प्रशासन तक सीधी पहुँच – आपकी समस्या को हल करवाने के लिए हमारी टीम लगातार फॉलो-अप करती है।',
                'बिना डर, बिना दबाव – निष्पक्ष और प्रमाणिक पत्रकारिता का समर्थन करें।',
                'आम लोगों की कहानी, आम लोगों की लड़ाई – हम आपके हक़ की बात करते हैं।',
                'हर सुबह ई-पेपर/प्रिंट कॉपी प्राप्त करें और जागरूक नागरिक बनें।',
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-yellow-50 transition duration-300">
                  <span className="text-2xl font-bold text-yellow-600 mt-0.5 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                  </span>
                  <p className="text-gray-700 leading-relaxed font-medium">{benefit}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 3. महत्वपूर्ण पैराग्राफ: आपका साथ क्यों जरूरी है? */}
          <section className="bg-gradient-to-r from-yellow-600/10 to-yellow-50 rounded-3xl p-8 md:p-12 mb-12 text-center shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-yellow-600 mb-6">
              आपका साथ क्यों जरूरी है?
            </h2>
            <p className="text-lg text-gray-800 leading-relaxed max-w-3xl mx-auto mb-8">
              आज के समय में एक मजबूत और निर्भीक मीडिया ही भ्रष्टाचार को चुनौती दे सकता है और जनता की आवाज़ सरकार तक पहुँचा सकता है।<br />
              आपकी एक सदस्यता हमें और मजबूत बनाती है ताकि हम आपके इलाके की हर सच्चाई पूरे दमदार अंदाज़ में सामने ला सकें।
            </p>
            <div className="bg-white rounded-xl p-4 shadow-xl inline-block border-2 border-yellow-600/50">
              <p className="text-xl font-bold text-gray-900">हमारी ताकत बनें – आज ही सदस्य बनें!</p>
            </div>
          </section>

          {/* 4. सदस्यता प्लान्स */}
          <section className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">
              सदस्यता प्लान्स
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* प्रिंट प्लान */}
              <div className="border-4 border-yellow-600/30 rounded-2xl p-6 text-center shadow-2xl bg-white hover:bg-yellow-50 transition duration-300 transform hover:-translate-y-1">
                <h3 className="text-2xl font-extrabold text-yellow-600 mb-4 flex justify-center items-center">
                  <span className="text-3xl mr-2">📰</span> प्रिंट न्यूज़पेपर
                </h3>
                <p className="text-lg text-gray-700 mb-2 font-medium">घरेलू सदस्यता (मुंबई)</p>
                <div className="bg-yellow-600 text-gray-900 rounded-lg p-4 mb-4">
                  <p className="text-4xl font-bold">₹260</p>
                  <p className="text-sm font-medium">प्रति माह (26 दिन × ₹10)</p>
                </div>
                <p className="text-sm text-gray-600 mb-6 font-medium">वार्षिक सदस्यता: ₹3120</p>
                <a // Replaced Link with a
                  href="/payment?plan=print"
                  className="bg-yellow-600 text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-700 hover:text-white transition shadow-md inline-block transform hover:scale-105"
                >
                  प्रिंट सदस्यता लें
                </a>
              </div>

              {/* डिजिटल प्लान */}
              <div className="border-4 border-gray-300 rounded-2xl p-6 text-center shadow-xl bg-white hover:bg-gray-100 transition duration-300 transform hover:-translate-y-1">
                <h3 className="text-2xl font-extrabold text-gray-700 mb-4 flex justify-center items-center">
                  <span className="text-3xl mr-2">🌐</span> डिजिटल ई-पेपर
                </h3>
                <p className="text-lg text-gray-700 mb-2 font-medium">मोबाइल/ऑनलाइन सदस्यता (पूरे भारत के लिए)</p>
                <div className="bg-gray-200 text-gray-900 rounded-lg p-4 mb-4">
                  <p className="text-4xl font-bold">₹130</p>
                  <p className="text-sm font-medium">प्रति माह (26 दिन × ₹5)</p>
                </div>
                <p className="text-sm text-gray-600 mb-6 font-medium">वार्षिक सदस्यता: ₹1560</p>
                <a // Replaced Link with a
                  href="/payment?plan=digital"
                  className="bg-gray-700 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition shadow-md inline-block transform hover:scale-105"
                >
                  डिजिटल सदस्यता लें
                </a>
              </div>
            </div>
          </section>
          
          {/* 5. अंतिम CTA */}
          <section className="text-center p-8 bg-yellow-600 text-gray-900 rounded-3xl shadow-2xl mt-12">
             <h2 className="text-3xl font-bold mb-6">
              📌 सदस्यता लें, और सच की इस लड़ाई में हमारे साथ खड़े हों।
            </h2>
            <p className="text-xl font-medium mb-8">
              आपका साथ… हमारी आवाज़… यही बदलाव की शुरुआत है।
            </p>
            <a
              href="/payment" // पेमेंट पेज पर ले जाएँ
              className="bg-gray-900 text-yellow-400 px-12 py-4 rounded-full text-xl font-extrabold hover:bg-gray-800 transition shadow-lg inline-block transform hover:scale-105"
            >
              अभी सदस्य बनें और भुगतान करें
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
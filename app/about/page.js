import React from 'react';
// Removed: import Image from 'next/image'; as it was unused.
// Replaced 'next/link' with standard 'a' tag for standalone environment compatibility.

// NOTE: Components like Header and Footer are assumed to be defined elsewhere in a real Next.js environment.
// For this standalone file, we will focus only on the AboutPage content.

const AboutPage = () => {
  return (
    // Light, professional background
    <div className="min-h-screen bg-gray-50 font-inter">

      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-5xl">

          {/* 1. हीरो सेक्शन: शीर्षक और परिचय */}
          <section className="text-center mb-16">
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-yellow-600 mb-6">
              मुंबई प्लस — मुंबई की सच्ची आवाज़,<br />
              अब हर दिन आपके साथ!
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              मुंबई जैसे महानगर में हर दिन सैकड़ों घटनाएँ घटती हैं — कोई सड़क टूटी मिलती है,<br />
              कहीं विकास कार्य अधूरा रह जाता है, तो कहीं जनता की आवाज़ अनसुनी रह जाती है।
            </p>
          </section>

          {/* 2. हमारी यात्रा: पृष्ठभूमि और परिवर्तन */}
          <section className="bg-white rounded-3xl shadow-xl p-10 md:p-14 mb-12 border-t-4 border-yellow-600/50">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
              हमारी यात्रा — 2009 से आज तक
            </h2>
            <div className="text-lg md:text-xl text-gray-700 leading-relaxed space-y-6 flex flex-col items-center text-center max-w-4xl mx-auto">
              <p>
                “मुंबई प्लस” की स्थापना साल <strong>2009</strong> में एक साप्ताहिक लोकल अख़बार के रूप में हुई थी।<br />
                हमारा उद्देश्य साफ था — मुंबई की स्थानीय समस्याओं, जनता की आवाज़ और जमीनी हकीकत को सामने लाना।
              </p>
              <p>
                समय के साथ यह अख़बार मुंबई के लोकल मीडिया में अपनी अलग पहचान बना चुका है।
              </p>
              <div className="text-2xl font-bold text-gray-800 py-8 px-6 bg-yellow-50 rounded-2xl border-l-8 border-yellow-600 w-full md:max-w-xl">
                <p>पाठकों और समाजसेवियों की मांग पर</p>
                <p className="mt-2">
                  <span className="text-4xl">अब “मुंबई प्लस” दैनिक समाचार पत्र बन गया है!</span>
                </p>
              </div>
            </div>
          </section>

          {/* 3. हमारा मिशन: मुख्य उद्देश्य */}
          <section className="bg-white rounded-3xl shadow-xl p-10 md:p-14 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-yellow-600 mb-10 text-center">
              हमारा मिशन — जनता की आवाज़, जनता तक
            </h2>
            <div className="grid md:grid-cols-2 gap-8 text-lg text-gray-800">
              {[
                'मुंबई के हर वार्ड और हर क्षेत्र की स्थानीय खबरों को उजागर करना।',
                'आम जनता की समस्याओं को सरकारी अधिकारियों तक पहुँचाना।',
                'भ्रष्टाचार, अवैध निर्माण और अन्याय के खिलाफ जनजागृति फैलाना।',
                'आम नागरिकों को पत्रकारिता में भागीदार बनाना — हर व्यक्ति “लोकल रिपोर्टर” बन सके।',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-md transition duration-300">
                  <span className="text-2xl text-yellow-600 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <p className="leading-relaxed font-medium">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 4. कॉल टू एक्शन: रिपोर्टर बनें CTA */}
          <section className="text-center bg-yellow-600 text-gray-900 rounded-3xl p-12 md:p-16 mb-12 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-8">
              रिपोर्टर बनें — अपने क्षेत्र की सच्ची आवाज़ उठाएँ!
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto mb-10 font-medium">
              “मुंबई प्लस” अब मुंबई के हर वार्ड में फ्रीलांसर रिपोर्टर और कैमरा मैन नियुक्त कर रहा है।<br />
              मेंबर बनकर आप हमारी टीम का हिस्सा बन सकते हैं और अपनी खबरें प्रकाशित करवा सकते हैं।
            </p>
            <a
              href="/member" // Replaced Link with a
              className="bg-gray-900 text-yellow-400 px-12 py-5 rounded-full text-2xl font-bold hover:bg-gray-800 transition shadow-2xl inline-block transform hover:scale-105"
              aria-label="Become a Member"
            >
              अभी मेंबर बनें
            </a>
          </section>

          {/* 5. मुंबई प्लस क्यों खास है? */}
          <section className="bg-white rounded-3xl shadow-xl p-10 md:p-14 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10 text-center border-b border-gray-200 pb-4">
              मुंबई प्लस क्यों खास है?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg">
              {[
                '2009 से लगातार जनता का विश्वास और सेवा।',
                'लोकल समस्याओं से सिटी-लेवल तक की सशक्त उपस्थिति।',
                'निष्पक्ष, निर्भीक और प्रमाणिक पत्रकारिता की प्रतिबद्धता।',
                'डिजिटल युग में भी ग्राउंड रिपोर्टिंग पर ज़ोर और प्रामाणिकता।',
                'सोशल मीडिया, वेबसाइट और दैनिक ई-पेपर के साथ सम्पूर्ण कवरेज।',
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl text-yellow-600">★</div>
                  <p className="text-gray-700 font-medium flex-1">{point}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 6. अंतिम मिशन स्टेटमेंट */}
          <section className="text-center p-12 md:p-16 border-t-8 border-yellow-600 rounded-3xl bg-white shadow-2xl">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8">
              हमारा वादा है — हम सिर्फ खबरें नहीं,<br />
              जनता की सच्ची आवाज़ पहुँचाएँगे!
            </h2>
            
            {/* Simplified CTA to Contact Page */}
            <div className="mt-10">
                <a // Replaced Link with a
                  href="/advertise"
                  className="bg-yellow-600 text-gray-900 px-10 py-4 rounded-xl text-xl font-bold hover:bg-yellow-500 transition shadow-lg inline-block"
                  aria-label="Contact for Advertisement"
                >
                  विज्ञापन के लिए संपर्क करें
                </a>
            </div>

            <p className="mt-10 text-xl font-bold text-gray-600 italic">
              मुंबई प्लस — सच्ची पत्रकारिता, सशक्त मुंबई के लिए।
            </p>
          </section>

        </div>
      </main>

      {/* Assuming Footer component is imported and available */}
      {/* <Footer /> */} 
    </div>
  );
};

export default AboutPage;
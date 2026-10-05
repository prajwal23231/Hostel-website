import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// Force manual scroll restoration so any reload/refresh immediately starts at the top
if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Authentic project assets located under public/
const VIDEO_SRC = '/videos/khaosan-tropical.mp4';
const POSTER_SRC = '/images/poster.jpg';
const STATIC_HERO_BG = '/images/gallery-palm-breeze.jpg';
const LOGO_SRC = '/images/khaosan-logo.png';
const ARTWORK_CARD_SRC = '/images/khaosan-artwork-card.jpg';

// Video timing constants:
// 0.0s - 3.5s: Opening reveal of tropical beach scene (played once on initial entry).
// 3.8s - 7.0s: Smooth rhythmic swaying palm leaves loop (looped between 3.8s and 7.0s as requested).
const LOOP_START = 3.8;
const LOOP_END = 7.0;

// Comprehensive Bilingual Content Dictionary (English and Thai)
const TRANSLATIONS = {
  en: {
    // Header & Brand
    brandSubtitle: 'Bangkok · Boutique Hostel',
    about: 'About',
    stay: 'Stay',
    experience: 'Experience',
    location: 'Location',
    bookStay: 'Book Your Stay',

    // Opening Loader
    loaderLoading: 'Loading Sanctuary · ',
    loaderReady: 'Enter The Poshtel →',
    loaderSubtitlePrep: 'Preparing your tropical retreat',
    loaderSubtitleClick: 'Click anywhere to begin',

    // Hero Section
    heroTag: 'Soi Rambuttri · Bangkok',
    heroHeading: 'A Tropical Sanctuary in Old Town Bangkok',
    heroHeadingLine1: 'A Tropical Sanctuary in',
    heroHeadingLine2: 'Old Town Bangkok',
    heroSubheading:
      'Where island serenity meets Bangkok’s historic pulse. Experience thoughtful boutique comfort, lush palm-framed relaxation, and vibrant community steps from Khaosan Road.',
    explorePoshtel: 'Explore The Poshtel',

    // About Section
    aboutTag: 'Boutique Hospitality & Island Ease',
    aboutHeading: 'Where Bangkok’s Historic Soul Meets Tropical Serenity',
    aboutCardTitle: 'The Khaosan Poshtel Brand Artwork',
    aboutCardDesc: 'Celebrating tropical travel, freedom, and communal warmth in Phra Nakhon.',
    aboutP1:
      'Nestled along tree-lined Soi Rambuttri, steps from Khaosan Road, The Khaosan Poshtel offers a tranquil boutique sanctuary with warm sand tones and natural greenery to recharge between Bangkok adventures.',
    aboutP2:
      'Operated by RK Hospitality Co., Ltd., we combine boutique comfort with vibrant communal spaces where travelers meet, unwind, and feel right at home.',
    pillar1Title: 'Tropical Calm',
    pillar1Desc: 'Warm woods, sand palettes, and airy spaces designed for peaceful restoration.',
    pillar2Title: 'Social Spirit',
    pillar2Desc: 'Inviting communal spaces that inspire connection and shared exploration.',
    pillar3Title: 'Old Town Heart',
    pillar3Desc: 'Prime Rambuttri address steps from cultural landmarks, street food, and river ferries.',

    // Stay Section
    stayTag: 'Accommodation',
    stayHeading: 'Thoughtfully Designed Rest',
    staySubheading:
      'Every space at The Khaosan Poshtel is crafted to balance restful privacy with a welcoming social atmosphere. Natural textures, crisp linens, and modern boutique amenities ensure restorative sleep in the center of Bangkok.',
    privateTag: 'Private Sanctuary',
    privateTitle: 'Boutique Private Rooms',
    privateDesc:
      'Serene private rooms curated for couples, solo travelers, and digital wanderers seeking calm solitude after days exploring Bangkok. Finished with warm sand tones, clean lines, and peaceful natural light.',
    privateFeat1: 'Individual climate control & air-conditioning',
    privateFeat2: 'Ensuite private bathroom with hot rain shower',
    privateFeat3: 'Crisp hotel-grade linens and plush pillows',
    privateFeat4: 'High-speed Wi-Fi and dedicated charging points',
    privateBtn: 'Inquire for Private Rooms',

    dormTag: 'Social & Connected',
    dormTitle: 'Curated Pod Dormitories',
    dormDesc:
      'Thoughtfully designed shared dorms engineered for comfort, security, and quiet rest. Each pod provides personal space with dedicated privacy curtains and lockable storage.',
    dormFeat1: 'Custom pod beds with blackout privacy curtains',
    dormFeat2: 'Personal reading light and universal power outlets',
    dormFeat3: 'Secure under-bed luggage lockers',
    dormFeat4: 'Spotless shared bathrooms maintained continuously',
    dormBtn: 'Inquire for Dorm Beds',

    // Experience Section
    expTag: 'Life at the Poshtel',
    expHeading: 'Warm Hospitality & Everyday Ease',
    expSubheading:
      'Designed around effortless travel: relaxed communal spaces, friendly assistance, and the essentials you need to explore Bangkok comfortably.',
    amen1Title: 'Tropical Courtyard',
    amen1Desc: 'Breezy open spaces surrounded by natural greenery to read, enjoy morning coffee, or work remotely with reliable Wi-Fi.',
    amen2Title: 'Social Community',
    amen2Desc: 'A naturally welcoming vibe where solo travelers and friends meet, share itineraries, and explore the city together.',
    amen3Title: 'Secure Storage',
    amen3Desc: 'Safe baggage storage prior to check-in or post checkout so you can discover Bangkok unencumbered by bags.',
    amen4Title: 'Local Travel Tips',
    amen4Desc: 'Authentic neighborhood recommendations for canal boats, street food stalls, quiet riverside temples, and night strolls.',

    // Location Section
    locationTag: 'Location & Map',
    locationHeading: 'Find Us on Soi Rambuttri, Bangkok',
    locationSubheading:
      'Located at 92 Soi Rambutri in historic Phra Nakhon, Bangkok. Explore the interactive street-level map below for our exact pinpoint and transit routes.',
    openGoogleMaps: 'Open in Google Maps',
    propEntityTag: 'Property Address & Entity',
    propName: 'The Khaosan Poshtel',
    addressLabel: 'Address',
    addressText: '92 Soi Rambutri, Talat Yot, Phra Nakhon, Bangkok 10200',
    addressSub: '(Talat Yot Subdistrict, Phra Nakhon District)',
    entityLabel: 'Operating Entity',
    entityName: 'RK Hospitality Company Limited',
    entitySub: '(RK Hospitality Co., Ltd.)',
    arrivalLabel: 'Arrival Note',
    arrivalText: 'Show the address in Thai to taxi drivers: 92 ซอยรามบุตรี แขวงตลาดยอด เขตพระนคร กรุงเทพมหานคร 10200',
    copyAddress: 'Copy Address for Taxi',
    addressCopied: 'Address Copied!',
    getDirections: 'Get Directions →',

    // Booking Section
    bookTag: 'Plan Your Bangkok Adventure',
    bookHeading: 'Book Your Stay at The Khaosan Poshtel',
    bookSubheading:
      'Experience our tropical boutique haven on Soi Rambuttri. Select your preferred dates below to check availability for private rooms and social pods.',
    bookFormTitle: 'Reservation Inquiry',
    bookDemoBadge: 'Demo Booking System',
    bookCheckIn: 'Check-In Date',
    bookCheckOut: 'Check-Out Date',
    bookRoomType: 'Accommodation Type',
    bookPrivateOption: 'Boutique Private Room',
    bookDormOption: 'Curated Social Pod Dorm',
    bookGuests: 'Guests',
    bookGuest1: '1 Guest',
    bookGuest2: '2 Guests',
    bookGuest3: '3+ Group Inquiry',
    bookNote: '* Note: This is an interactive demo of the booking flow.',
    bookSubmitBtn: 'Check Availability (Demo)',
    bookSuccessTitle: 'Inquiry Received',
    bookSuccessDesc:
      'Thank you for your interest! In the production release, this action connects directly to The Khaosan Poshtel live reservation engine.',
    bookAnotherBtn: 'Make Another Inquiry',

    // Footer Section
    footerDesc: 'A refined tropical boutique poshtel nestled along Soi Rambuttri in historic Phra Nakhon, Bangkok.',
    footerEntityLabel: 'Operating Entity:',
    footerAddressLabel: 'Address:',
    footerNavTitle: 'Navigation',
    footerReservationsTitle: 'Reservations',
    footerResNotice: 'Online bookings for The Khaosan Poshtel will launch through RK Hospitality Co., Ltd.',
    footerResLink: 'Inquire About Availability →',
    footerCopyright: '© 2026 The Khaosan Poshtel. All rights reserved.',
    footerFullAddress: '92 Soi Rambutri, Talat Yot Subdistrict, Phra Nakhon District, Bangkok 10200',
  },
  th: {
    // Header & Brand
    brandSubtitle: 'กรุงเทพฯ · บูทีคโฮสเทล',
    about: 'เกี่ยวกับเรา',
    stay: 'ห้องพัก',
    experience: 'ประสบการณ์',
    location: 'ที่ตั้งและแผนที่',
    bookStay: 'จองห้องพัก',

    // Opening Loader
    loaderLoading: 'กำลังเตรียมพื้นที่พักผ่อน · ',
    loaderReady: 'เข้าสู่ เดอะ ข้าวสาร พอชเทล →',
    loaderSubtitlePrep: 'จัดเตรียมโอเอซิสสไตล์ทรอปิคอลของคุณ',
    loaderSubtitleClick: 'คลิกที่ใดก็ได้เพื่อเริ่มต้น',

    // Hero Section
    heroTag: 'ซอยรามบุตรี · กรุงเทพมหานคร',
    heroHeading: 'สถานที่พักผ่อนสไตล์ทรอปิคอล ใจกลางพระนคร',
    heroHeadingLine1: 'สถานที่พักผ่อนสไตล์ทรอปิคอล',
    heroHeadingLine2: 'ใจกลางพระนคร',
    heroSubheading:
      'สัมผัสความสงบผ่อนคลายท่ามกลางธรรมชาติอันร่มรื่น ผสานเสน่ห์แห่งย่านประวัติศาสตร์กรุงเทพฯ เพียงไม่กี่ก้าวจากถนนข้าวสาร',
    explorePoshtel: 'สำรวจที่พัก',

    // About Section
    aboutTag: 'การต้อนรับระดับบูทีค & ความผ่อนคลายสไตล์เกาะ',
    aboutHeading: 'จุดบรรจบของจิตวิญญาณประวัติศาสตร์กรุงเทพฯ และความสงบสไตล์ทรอปิคอล',
    aboutCardTitle: 'งานศิลปะแบรนด์ เดอะ ข้าวสาร พอชเทล',
    aboutCardDesc: 'เฉลิมฉลองการเดินทางสไตล์ทรอปิคอล อิสรภาพ และมิตรภาพอันอบอุ่นในย่านพระนคร',
    aboutP1:
      'ณ ซอยรามบุตรีอันร่มรื่น ใกล้ถนนข้าวสารเพียงไม่กี่ก้าว เดอะ ข้าวสาร พอชเทล มอบโอเอซิสแห่งความสงบด้วยดีไซน์บูทีคและโทนสีทรายอบอุ่น เพื่อการพักผ่อนอย่างแท้จริงระหว่างการเดินทางในกรุงเทพฯ',
    aboutP2:
      'ดำเนินการโดย บริษัท อาร์เค ฮอสพิทอลลิตี้ จำกัด เราผสานความสะดวกสบายและพื้นที่ส่วนกลางอันอบอุ่น เพื่อให้นักเดินทางได้พบปะ ผ่อนคลาย และรู้สึกเหมือนอยู่บ้าน',
    pillar1Title: 'ความสงบสไตล์ทรอปิคอล',
    pillar1Desc: 'งานไม้โทนอุ่น พาเลตต์สีทรายธรรมชาติ และพื้นที่โปร่งสบายเพื่อการพักผ่อนอย่างแท้จริง',
    pillar2Title: 'จิตวิญญาณแห่งมิตรภาพ',
    pillar2Desc: 'พื้นที่ส่วนกลางที่อบอุ่นและเชื้อเชิญ เชื่อมโยงและแบ่งปันการเดินทางร่วมกัน',
    pillar3Title: 'ใจกลางย่านเมืองเก่า',
    pillar3Desc: 'ทำเลทองบนซอยรามบุตรี ใกล้สถานที่สำคัญทางประวัติศาสตร์ สตรีทฟู้ด และท่าเรือข้ามฟาก',

    // Stay Section
    stayTag: 'ห้องพักและที่พัก',
    stayHeading: 'การพักผ่อนที่ออกแบบอย่างพิถีพิถัน',
    staySubheading:
      'ทุกพื้นที่ของ เดอะ ข้าวสาร พอชเทล ได้รับการสร้างสรรค์ขึ้นเพื่อสร้างสมดุลระหว่างความเป็นส่วนตัวอันเงียบสงบและบรรยากาศชุมชนที่อบอุ่น เส้นใยธรรมชาติ เครื่องนอนคุณภาพ และสิ่งอำนวยความสะดวกสไตล์บูทีคทันสมัย ช่วยให้คุณหลับสบายใจกลางกรุงเทพฯ',
    privateTag: 'พื้นที่ส่วนตัวอันเงียบสงบ',
    privateTitle: 'ห้องพักส่วนตัวสไตล์บูทีค',
    privateDesc:
      'ห้องพักส่วนตัวที่เงียบสงบ ออกแบบสำหรับคู่รัก นักเดินทางเดี่ยว และคนทำงานดิจิทัลที่มองหาความสงบหลังสำรวจกรุงเทพฯ ตกแต่งด้วยโทนสีทรายอบอุ่น เส้นสายเรียบหรู และแสงธรรมชาติที่สบายตา',
    privateFeat1: 'ระบบปรับอากาศและควบคุมอุณหภูมิแยกเฉพาะห้อง',
    privateFeat2: 'ห้องน้ำส่วนตัวในตัวพร้อมฝักบัวเรนชาวเวอร์น้ำอุ่น',
    privateFeat3: 'เครื่องนอนระดับโรงแรมและหมอนนุ่มพิเศษ',
    privateFeat4: 'Wi-Fi ความเร็วสูงและจุดชาร์จอุปกรณ์เฉพาะ',
    privateBtn: 'สอบถามห้องพักส่วนตัว',

    dormTag: 'มิตรภาพและการพบปะ',
    dormTitle: 'ห้องพักรวมสไตล์พ็อด (Pod Dormitories)',
    dormDesc:
      'ห้องพักรวมที่ออกแบบอย่างพิถีพิถันเพื่อความสะดวกสบาย ความปลอดภัย และการพักผ่อนที่เงียบสงบ แต่ละพ็อดมีม่านทึบแสงเพื่อความเป็นส่วนตัวและที่เก็บสัมภาระพร้อมกุญแจล็อค',
    dormFeat1: 'เตียงพ็อดดีไซน์พิเศษพร้อมม่านกั้นเพิ่มความเป็นส่วนตัว',
    dormFeat2: 'ไฟอ่านหนังสือส่วนตัวและเต้ารับไฟฟ้าสากล',
    dormFeat3: 'ตู้ล็อคเกอร์เก็บสัมภาระใต้เตียงที่ปลอดภัย',
    dormFeat4: 'ห้องน้ำรวมที่สะอาดสะอ้าน ดูแลสุขอนามัยอย่างต่อเนื่อง',
    dormBtn: 'สอบถามเตียงพักรวม',

    // Experience Section
    expTag: 'ชีวิตในพอชเทล',
    expHeading: 'การต้อนรับอันอบอุ่น & ความสะดวกสบายในทุกวัน',
    expSubheading:
      'ออกแบบมาเพื่อการเดินทางที่ราบรื่น: พื้นที่ส่วนกลางที่ผ่อนคลาย ความช่วยเหลืออย่างเป็นมิตร และสิ่งอำนวยความสะดวกที่คุณต้องการในการสำรวจกรุงเทพฯ อย่างสบายใจ',
    amen1Title: 'ลานพักผ่อนสไตล์ทรอปิคอล',
    amen1Desc: 'พื้นที่เปิดโล่งรับลมธรรมชาติ ท่ามกลางแมกไม้ร่มรื่น สำหรับอ่านหนังสือ จิบกาแฟยามเช้า หรือนั่งทำงานพร้อม Wi-Fi เสถียร',
    amen2Title: 'ชุมชนนักเดินทาง',
    amen2Desc: 'บรรยากาศที่เป็นกันเองที่นักเดินทางเดี่ยวและกลุ่มเพื่อนได้พบปะ แลกเปลี่ยนแผนการเดินทาง และสำรวจเมืองไปด้วยกัน',
    amen3Title: 'ที่เก็บสัมภาระปลอดภัย',
    amen3Desc: 'บริการรับฝากกระเป๋าอย่างปลอดภัยก่อนเช็คอินหรือหลังเช็คเอาท์ เพื่อให้คุณเดินเที่ยวกรุงเทพฯ ได้อย่างคล่องตัว',
    amen4Title: 'คำแนะนำการเดินทางท้องถิ่น',
    amen4Desc: 'คำแนะนำจากคนในพื้นที่สำหรับเรือคลองแสนแสบ ร้านสตรีทฟู้ดเด็ด วัดริมน้ำอันเงียบสงบ และจุดเดินเล่นยามค่ำคืน',

    // Location Section
    locationTag: 'ที่ตั้งและแผนที่',
    locationHeading: 'การเดินทางมายัง ซอยรามบุตรี กรุงเทพฯ',
    locationSubheading:
      'ตั้งอยู่ ณ เลขที่ 92 ซอยรามบุตรี แขวงตลาดยอด เขตพระนคร กรุงเทพฯ ดูแผนที่ซอยรามบุตรีและถนนข้าวสารอย่างละเอียดด้านล่าง',
    openGoogleMaps: 'เปิดใน Google Maps',
    propEntityTag: 'ที่อยู่และนิติบุคคลของที่พัก',
    propName: 'เดอะ ข้าวสาร พอชเทล',
    addressLabel: 'ที่อยู่',
    addressText: '92 ซอยรามบุตรี แขวงตลาดยอด เขตพระนคร กรุงเทพมหานคร 10200',
    addressSub: '(แขวงตลาดยอด เขตพระนคร)',
    entityLabel: 'นิติบุคคลผู้ดำเนินงาน',
    entityName: 'บริษัท อาร์เค ฮอสพิทอลลิตี้ จำกัด',
    entitySub: '(RK Hospitality Company Limited)',
    arrivalLabel: 'คำแนะนำสำหรับการเดินทาง',
    arrivalText: 'แสดงที่อยู่นี้แก่คนขับแท็กซี่: 92 ซอยรามบุตรี แขวงตลาดยอด เขตพระนคร กรุงเทพมหานคร 10200',
    copyAddress: 'คัดลอกที่อยู่สำหรับแท็กซี่',
    addressCopied: 'คัดลอกที่อยู่แล้ว!',
    getDirections: 'ขอเส้นทางเดินทาง →',

    // Booking Section
    bookTag: 'วางแผนการเดินทางในกรุงเทพฯ ของคุณ',
    bookHeading: 'จองการเข้าพักที่ เดอะ ข้าวสาร พอชเทล',
    bookSubheading:
      'สัมผัสสถานที่พักผ่อนสไตล์ทรอปิคอลบูทีคบนซอยรามบุตรี เลือกวันที่คุณต้องการเพื่อตรวจสอบห้องว่างสำหรับห้องพักส่วนตัวและเตียงพ็อด',
    bookFormTitle: 'สอบถามการสำรองห้องพัก',
    bookDemoBadge: 'ระบบจองจำลอง (Demo)',
    bookCheckIn: 'วันที่เช็คอิน',
    bookCheckOut: 'วันที่เช็คเอาท์',
    bookRoomType: 'ประเภทห้องพัก',
    bookPrivateOption: 'ห้องพักส่วนตัวสไตล์บูทีค',
    bookDormOption: 'ห้องพักรวมสไตล์พ็อด',
    bookGuests: 'จำนวนผู้เข้าพัก',
    bookGuest1: '1 ท่าน',
    bookGuest2: '2 ท่าน',
    bookGuest3: '3 ท่านขึ้นไป (สอบถามกลุ่ม)',
    bookNote: '* หมายเหตุ: นี่คือการจำลองขั้นตอนการจองห้องพัก',
    bookSubmitBtn: 'ตรวจสอบห้องว่าง (Demo)',
    bookSuccessTitle: 'ได้รับข้อมูลการสอบถามแล้ว',
    bookSuccessDesc:
      'ขอขอบคุณสำหรับความสนใจของคุณ! ในระบบจริง ขั้นตอนนี้จะเชื่อมต่อไปยังระบบจองห้องพักของ เดอะ ข้าวสาร พอชเทล โดยตรง',
    bookAnotherBtn: 'ส่งคำสอบถามใหม่อีกครั้ง',

    // Footer Section
    footerDesc: 'พอชเทลสไตล์ทรอปิคอลบูทีคอันประณีต ตั้งอยู่บนซอยรามบุตรี ในย่านประวัติศาสตร์พระนคร กรุงเทพมหานคร',
    footerEntityLabel: 'นิติบุคคลผู้ดำเนินงาน:',
    footerAddressLabel: 'ที่อยู่:',
    footerNavTitle: 'เมนูหลัก',
    footerReservationsTitle: 'การสำรองห้องพัก',
    footerResNotice: 'การจองออนไลน์สำหรับ เดอะ ข้าวสาร พอชเทล จะเปิดให้บริการผ่าน บริษัท อาร์เค ฮอสพิทอลลิตี้ จำกัด',
    footerResLink: 'สอบถามเกี่ยวกับห้องว่าง →',
    footerCopyright: '© 2026 เดอะ ข้าวสาร พอชเทล สงวนลิขสิทธิ์',
    footerFullAddress: 'เลขที่ 92 ซอยรามบุตรี แขวงตลาดยอด เขตพระนคร กรุงเทพมหานคร 10200',
  },
};

export default function App() {
  const [language, setLanguage] = useState('en');
  const t = TRANSLATIONS[language];
  const [isTransitionDone, setIsTransitionDone] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  // References for animation coordination
  const floatingLogoRef = useRef(null);
  const headerLogoTargetRef = useRef(null);
  const videoRef = useRef(null);
  const introPassedRef = useRef(false);

  // Coordinated Logo, Navigation, and Hero Opening Sequence - Initiated immediately on mount
  useEffect(() => {
    if (isTransitionDone) return;

    const floatingEl = floatingLogoRef.current;
    const targetEl = headerLogoTargetRef.current;
    const video = videoRef.current;

    // Respect reduced-motion preference: instant dock into final layout
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsTransitionDone(true);
      if (video) gsap.set(video, { opacity: 1 });
      gsap.to(['.header-nav-reveal', '.hero-fade-in', '.hero-address-reveal'], {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: 'none',
      });
      return;
    }

    if (!floatingEl || !targetEl) {
      setIsTransitionDone(true);
      if (video) gsap.set(video, { opacity: 1 });
      gsap.fromTo(
        ['.hero-fade-in', '.hero-address-reveal'],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power2.out' }
      );
      return;
    }

    const ctx = gsap.context(() => {
      // Set initial visible state on floating logo immediately so it is 100% visible at t = 0
      gsap.set(floatingEl, { opacity: 1, scale: 1 });
      if (video) {
        gsap.set(video, { opacity: 0 });
        video.pause();
        video.currentTime = 0;
      }

      // Measure exact geometry to the stable header target slot
      const targetRect = targetEl.getBoundingClientRect();
      const currentRect = floatingEl.getBoundingClientRect();

      const targetCenterX = targetRect.left + targetRect.width / 2;
      const targetCenterY = targetRect.top + targetRect.height / 2;
      const currentCenterX = currentRect.left + currentRect.width / 2;
      const currentCenterY = currentRect.top + currentRect.height / 2;

      const deltaX = targetCenterX - currentCenterX;
      const deltaY = targetCenterY - currentCenterY;
      const scaleFactor = targetRect.width / currentRect.width;

      const tl = gsap.timeline({ delay: 0.1 });

      // 1. Brief pause (0.15s) so the emblem is registered centered
      tl.to({}, { duration: 0.15 })
        // 2. Logo initiates the experience: video starts and fades in smoothly as logo starts flight
        .add(() => {
          if (video) {
            video.currentTime = 0;
            video.play().catch(console.warn);
            gsap.to(video, { opacity: 1, duration: 0.85, ease: 'power2.out' });
          }
        }, 0.15)
        // 3. Logo glides majestically into the header slot across 2.2s (synchronized with leaf entry)
        .to(
          floatingEl,
          {
            x: deltaX,
            y: deltaY,
            scale: scaleFactor,
            duration: 2.2,
            ease: 'power2.inOut',
            force3D: true,
            onComplete: () => {
              // Seamlessly dock into header slot at exact moment logo finishes flight
              setIsTransitionDone(true);
            },
          },
          0.15
        )
        // 4. Reveal navbar links as logo is about to dock
        .to(
          '.header-nav-reveal',
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.04,
            ease: 'power2.out',
          },
          '-=0.7'
        )
        // 5. Hero text and bottom-right black address badge glide in together as leaves complete entrance
        .to(
          ['.hero-fade-in', '.hero-address-reveal'],
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.06,
            ease: 'power2.out',
          },
          '<+=0.05'
        )
        // Fade out floating copy right as header copy is locked in
        .to(
          floatingEl,
          {
            opacity: 0,
            duration: 0.08,
            ease: 'none',
          },
          '-=0.08'
        );
    });

    return () => {
      ctx.revert();
    };
  }, []);

  // Video looping coordination and visibility management
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;

    // Helper: Seek back to loop start and continue playing
    const loopVideo = () => {
      video.currentTime = LOOP_START;
      if (video.paused) {
        video.play().catch(console.warn);
      }
    };

    const handleTimeUpdate = () => {
      if (video.currentTime >= LOOP_START) {
        introPassedRef.current = true;
      }
      if (video.currentTime >= LOOP_END) {
        loopVideo();
      } else if (introPassedRef.current && video.currentTime < (LOOP_START - 0.5) && video.currentTime > 0) {
        loopVideo();
      }
    };

    const handleEnded = () => {
      introPassedRef.current = true;
      loopVideo();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    // Visibility change handling
    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
      } else {
        if (video.currentTime < LOOP_START || video.currentTime >= LOOP_END) {
          video.currentTime = LOOP_START;
        }
        video.play().catch(console.warn);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (floatingLogoRef.current) {
        gsap.killTweensOf(floatingLogoRef.current);
      }
      gsap.killTweensOf('.hero-address-reveal');
      gsap.killTweensOf('.header-nav-reveal');
      gsap.killTweensOf('.hero-fade-in');
    };
  }, []);

  // Prevent any scrolling during opening animation without changing overflow or causing layout shift
  useEffect(() => {
    if (isTransitionDone) return;

    window.scrollTo(0, 0);

    const preventScroll = (e) => {
      e.preventDefault();
    };

    const preventKeys = (e) => {
      const keys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', 'Space', ' '];
      if (keys.includes(e.key)) {
        e.preventDefault();
      }
    };

    const handleScrollLock = () => {
      if (!isTransitionDone && window.scrollY > 0) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', preventKeys, { passive: false });
    window.addEventListener('scroll', handleScrollLock, { passive: true });

    return () => {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', preventKeys);
      window.removeEventListener('scroll', handleScrollLock);
    };
  }, [isTransitionDone]);

  // Track scroll position to ensure sticky header displays beautifully on manual scroll
  useEffect(() => {
    // Reset to top immediately on mount
    window.scrollTo(0, 0);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Copy address to clipboard helper for travelers
  const handleCopyAddress = () => {
    const addressText = '92 Soi Rambutri, Talat Yot, Phra Nakhon, Bangkok 10200';
    navigator.clipboard.writeText(addressText).then(() => {
      setAddressCopied(true);
      setTimeout(() => setAddressCopied(false), 3000);
    });
  };

  // Scroll-triggered fading reveal motion for sections and elements below the hero
  useEffect(() => {
    const handleScrollReveal = () => {
      const elements = document.querySelectorAll('.reveal-on-scroll, .reveal-scale-on-scroll');
      if (!elements.length) return null;

      if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
        elements.forEach((el) => el.classList.add('is-revealed'));
        return null;
      }

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              obs.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.01,
          rootMargin: '0px 0px 180px 0px',
        }
      );

      elements.forEach((el) => {
        if (!el.classList.contains('is-revealed')) {
          observer.observe(el);
        }
      });

      return observer;
    };

    const obs = handleScrollReveal();
    return () => {
      if (obs) obs.disconnect();
    };
  }, [language, bookingSubmitted]);

  return (
    <div className="min-h-screen w-full bg-[#F8F5EE] text-[#16373F] font-sans antialiased selection:bg-[#E7D4B3] selection:text-[#16373F] overflow-x-hidden">
      {/* =========================================================================
          1. HEADER (Appears after logo scale-down; translucent bar on scroll; ENG/THAI language toggle)
          ========================================================================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 pointer-events-auto ${
          isScrolled || mobileMenuOpen
            ? 'bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E7D4B3]/50 shadow-sm shadow-[#2D2319]/5 py-0'
            : 'bg-gradient-to-b from-[#0A1012]/45 via-[#0A1012]/18 to-transparent border-transparent shadow-none py-1.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
          {/* Header Brand Area (Target for opening logo animation) */}
          <a
            href="#top"
            className="flex items-center gap-3 sm:gap-3.5 group cursor-pointer min-w-0"
            aria-label="The Khaosan Poshtel - Back to top"
          >
            {/* Target logo container slot */}
            <div
              ref={headerLogoTargetRef}
              className="relative w-12 h-12 sm:w-13 sm:h-13 flex-shrink-0 flex items-center justify-center"
            >
              {/* Actual image asset revealed once transition completes without any delay or blink */}
              <img
                src={LOGO_SRC}
                alt="The Khaosan Poshtel"
                className={`w-full h-full object-contain ${
                  isTransitionDone ? 'opacity-100' : 'opacity-0'
                }`}
                draggable={false}
              />
            </div>

            {/* Brand Typography */}
            <div className={`flex flex-col min-w-0 header-nav-reveal ${!isTransitionDone ? 'opacity-0 -translate-y-1' : 'opacity-100 translate-y-0'}`}>
              <span
                className={`font-display font-bold tracking-wider text-base sm:text-lg leading-tight truncate transition-colors duration-200 ${
                  isScrolled || mobileMenuOpen
                    ? 'text-[#2D2319] group-hover:text-[#8C6D3B]'
                    : 'text-[#FAF8F5] drop-shadow-[0_1px_2px_rgba(0,0,0,0.30)] group-hover:text-[#E7D4B3]'
                }`}
              >
                THE KHAOSAN POSHTEL
              </span>
              <span
                className={`font-sans text-[10px] tracking-widest uppercase font-semibold truncate transition-colors duration-200 ${
                  isScrolled || mobileMenuOpen
                    ? 'text-[#7A6A5C]'
                    : 'text-[#E7D4B3] drop-shadow-[0_1px_2px_rgba(0,0,0,0.40)]'
                }`}
              >
                {t.brandSubtitle}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav
            className={`hidden md:flex items-center gap-7 header-nav-reveal ${!isTransitionDone ? 'opacity-0 -translate-y-1' : 'opacity-100 translate-y-0'}`}
            aria-label="Main Navigation"
          >
            {[
              { id: 'about', label: t.about },
              { id: 'stay', label: t.stay },
              { id: 'experience', label: t.experience },
              { id: 'location', label: t.location },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`font-medium text-sm tracking-wide transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#2A5542] hover:after:w-full after:transition-all after:duration-300 ${
                  isScrolled
                    ? 'text-[#2D2319] hover:text-[#2A5542]'
                    : 'text-[#FAF8F5] drop-shadow-[0_1px_2px_rgba(0,0,0,0.22)] hover:text-[#E7D4B3]'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Header Action Area: Language Switcher (ENG | THAI) + Primary CTA */}
          <div className={`hidden md:flex items-center gap-4 header-nav-reveal ${!isTransitionDone ? 'opacity-0 -translate-y-1' : 'opacity-100 translate-y-0'}`}>
            {/* Language Switcher */}
            <div className="flex items-center rounded-full bg-[#FAF8F5]/85 backdrop-blur-sm p-0.5 border border-[#2A5542]/30 shadow-xs">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#2A5542] text-[#FAF8F5] shadow-xs'
                    : 'text-[#6A5A4D] hover:text-[#2A5542]'
                }`}
                aria-label="Switch language to English"
                title="English"
              >
                ENG
              </button>
              <button
                type="button"
                onClick={() => setLanguage('th')}
                className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  language === 'th'
                    ? 'bg-[#2A5542] text-[#FAF8F5] shadow-xs'
                    : 'text-[#6A5A4D] hover:text-[#2A5542]'
                }`}
                aria-label="Switch language to Thai"
                title="ภาษาไทย"
              >
                THAI
              </button>
            </div>

            {/* Header CTA Button */}
            <a
              href="#book"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#2A5542] text-[#FAF8F5] text-sm font-semibold tracking-wide shadow-sm hover:bg-[#1E3E30] hover:shadow-md active:scale-98 transition-all duration-200"
            >
              {t.bookStay}
            </a>
          </div>

          {/* Mobile Right Controls: Prominent Menu Toggle */}
          <div className={`md:hidden flex items-center header-nav-reveal ${!isTransitionDone ? 'opacity-0 -translate-y-1' : 'opacity-100 translate-y-0'}`}>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2.5 rounded-xl transition-colors cursor-pointer min-w-[42px] min-h-[42px] flex items-center justify-center ${
                isScrolled || mobileMenuOpen
                  ? 'text-[#2D2319] hover:bg-[#E7D4B3]/30 active:bg-[#E7D4B3]/50'
                  : 'text-[#FAF8F5] hover:bg-white/10 active:bg-white/20'
              }`}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="w-6 h-6 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.2">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-[#0A1012]/45 backdrop-blur-xs z-30 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <div className="relative z-40 md:hidden bg-[#FAF8F5]/98 backdrop-blur-xl border-b border-[#E7D4B3]/60 px-6 py-6 shadow-2xl animate-in slide-in-from-top-4 duration-200">
              <div className="flex flex-col space-y-4">
                {/* Language Switcher inside hamburger drawer */}
                <div className="flex items-center justify-between pb-4 border-b border-[#E7D4B3]/40">
                  <span className="text-xs uppercase tracking-widest text-[#7A6A5C] font-semibold">
                    {language === 'en' ? 'Language / ภาษา' : 'ภาษา / Language'}
                  </span>
                  <div className="flex items-center rounded-full bg-[#FAF8F5] p-1 border border-[#2A5542]/30 shadow-xs">
                    <button
                      type="button"
                      onClick={() => setLanguage('en')}
                      className={`px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                        language === 'en'
                          ? 'bg-[#2A5542] text-[#FAF8F5] shadow-xs'
                          : 'text-[#6A5A4D] hover:text-[#2A5542]'
                      }`}
                    >
                      ENG
                    </button>
                    <button
                      type="button"
                      onClick={() => setLanguage('th')}
                      className={`px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                        language === 'th'
                          ? 'bg-[#2A5542] text-[#FAF8F5] shadow-xs'
                          : 'text-[#6A5A4D] hover:text-[#2A5542]'
                      }`}
                    >
                      THAI
                    </button>
                  </div>
                </div>
                {[
                  { id: 'about', label: t.about },
                  { id: 'stay', label: t.stay },
                  { id: 'experience', label: t.experience },
                  { id: 'location', label: t.location },
                ].map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-display font-medium text-base text-[#2D2319] hover:text-[#2A5542] py-2 border-b border-[#E7D4B3]/30 flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    <span className="text-[#2A5542]/40 text-base">→</span>
                  </a>
                ))}
                <div className="pt-2">
                  <a
                    href="#book"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full inline-flex items-center justify-center px-5 py-3.5 rounded-full bg-[#2A5542] text-[#FAF8F5] text-sm font-semibold tracking-wide shadow-md hover:bg-[#1E3E30] active:scale-98 transition-all"
                  >
                    {t.bookStay}
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      {/* =========================================================================
          OPENING FLOATING LOGO
          Appears centered immediately on page load, initiates the animation,
          then smoothly glides and scales into the navigation bar
          ========================================================================= */}
      {!isTransitionDone && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <div
            ref={floatingLogoRef}
            className="w-[200px] sm:w-[225px] md:w-[245px] max-w-[62vw] h-auto will-change-transform opacity-100"
            style={{
              filter: 'drop-shadow(0 10px 24px rgba(45, 35, 25, 0.18)) drop-shadow(0 2px 6px rgba(0, 0, 0, 0.08))',
            }}
          >
            <img
              src={LOGO_SRC}
              alt="The Khaosan Poshtel Emblem"
              className="w-full h-auto object-contain select-none"
              draggable={false}
            />
          </div>
        </div>
      )}

      {/* =========================================================================
          2. HERO SECTION
          (Vertically centered composition so text never drifts downward on large screens)
          ========================================================================= */}
      <section
        id="top"
        className="relative w-full h-[100dvh] min-h-[580px] max-h-[1100px] flex items-center justify-center overflow-hidden bg-[#EFE7D8] pt-20 pb-10"
      >
        {/* Full-bleed background video - fades in and begins playback when logo initiates motion */}
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          muted
          playsInline
          webkit-playsinline="true"
          x5-playsinline="true"
          preload="auto"
          onEnded={() => {
            if (videoRef.current) {
              videoRef.current.currentTime = LOOP_START;
              videoRef.current.play().catch(console.warn);
            }
          }}
          className="hero-video absolute inset-0 z-0 pointer-events-none select-none opacity-0 brightness-115 contrast-[1.02] saturate-[1.08]"
        />

        {/* Localized very light feathered darkspot & gentle smooth blur over the bottom-right watermark - hidden on smaller screens */}
        <div
          className="hidden sm:block hero-address-reveal opacity-0 absolute bottom-0 right-0 z-15 pointer-events-none w-44 h-28 sm:w-60 sm:h-36"
          style={{
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            maskImage: 'radial-gradient(ellipse at 100% 100%, black 25%, rgba(0,0,0,0.5) 55%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 100% 100%, black 25%, rgba(0,0,0,0.5) 55%, transparent 80%)',
            background:
              'radial-gradient(ellipse at 100% 100%, rgba(16, 26, 23, 0.22) 0%, rgba(16, 26, 23, 0.09) 45%, transparent 75%)',
          }}
          aria-hidden="true"
        />

        {/* Bottom-right on-brand venue location pill - sleek black glass aesthetic, animated with hero sequence, hidden on smaller screens */}
        <div className="hidden sm:block absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 pointer-events-none select-none">
          <div className="hero-address-reveal opacity-0 translate-y-3 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#11262B]/90 backdrop-blur-md border border-[#E7D4B3]/35 shadow-lg text-[#E7D4B3]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
            <span className="font-sans text-[11px] tracking-wider uppercase font-semibold text-[#E7D4B3]">
              Soi Rambuttri · Bangkok
            </span>
          </div>
        </div>

        {/* Static poster fallback for reduced motion preference */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none hidden motion-reduce:block brightness-115"
          style={{ backgroundImage: `url(${STATIC_HERO_BG})` }}
        />

        {/* Clean, bright sunny scrim overlay - reduced top darkness for maximum daylight ambiance */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(16, 35, 38, 0.11) 0%, rgba(16, 35, 38, 0.03) 16%, transparent 35%, transparent 65%, rgba(16, 35, 38, 0.08) 82%, rgba(16, 35, 38, 0.22) 100%)',
          }}
        />

        {/* Hero Foreground Content - Optically centered on all display heights */}
        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="hero-fade-in opacity-0 translate-y-8 will-change-transform inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#FAF8F5]/85 backdrop-blur-sm border border-[#E7D4B3]/60 mb-3.5 sm:mb-5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#2A5542] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#16373F]">
              {t.heroTag}
            </span>
          </div>

          <h1
            className="hero-fade-in opacity-0 translate-y-8 will-change-transform font-display text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white max-w-3xl leading-[1.18] sm:leading-[1.15]"
            style={{
              textShadow: '0 0 1px rgba(42, 85, 66, 0.55), 1px 0 1px rgba(42, 85, 66, 0.30), -1px 0 1px rgba(42, 85, 66, 0.30), 0 1px 1px rgba(42, 85, 66, 0.30), 0 -1px 1px rgba(42, 85, 66, 0.30)',
            }}
          >
            {t.heroHeading}
          </h1>

          <p
            className="hero-fade-in opacity-0 translate-y-8 will-change-transform mt-3 sm:mt-5 text-sm sm:text-lg text-white max-w-2xl font-medium leading-relaxed px-2 sm:px-0"
            style={{
              textShadow: '0 0 1px rgba(42, 85, 66, 0.40), 1px 0 1px rgba(42, 85, 66, 0.20), -1px 0 1px rgba(42, 85, 66, 0.20), 0 1px 6px rgba(0, 0, 0, 0.18)',
            }}
          >
            {t.heroSubheading}
          </p>

          <div className="hero-fade-in opacity-0 translate-y-8 will-change-transform mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
            <a
              href="#book"
              className="w-full sm:w-auto px-7 py-3 sm:px-8 sm:py-3.5 rounded-full bg-[#E7D4B3] text-[#16373F] font-semibold text-sm tracking-wide shadow-lg hover:bg-[#F2ECE1] active:scale-98 transition-all duration-200 text-center cursor-pointer"
            >
              {t.bookStay}
            </a>
            <a
              href="#about"
              className="w-full sm:w-auto px-6 py-2.5 sm:px-7 sm:py-3.5 rounded-full bg-white/20 backdrop-blur-md text-[#F8F5EE] border border-white/40 font-medium text-sm tracking-wide hover:bg-white/30 active:scale-98 transition-all duration-200 text-center cursor-pointer"
            >
              {t.explorePoshtel}
            </a>
          </div>
        </div>

        {/* Autoplay fallback control */}
        {autoplayBlocked && (
          <div className="absolute top-28 right-6 z-30">
            <button
              onClick={startPlayback}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#16373F]/90 text-[#F8F5EE] border border-[#E7D4B3]/40 text-xs font-medium shadow-md hover:bg-[#16373F]"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Play Video</span>
            </button>
          </div>
        )}

        {/* Downward scroll indicator */}
        <a
          href="#about"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-[#F8F5EE]/70 hover:text-[#F8F5EE] transition-colors p-2"
          aria-label="Scroll to About section"
        >
          <svg className="w-5 h-5 animate-bounce stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </section>

      {/* =========================================================================
          3. ABOUT SECTION (Full Bilingual English / Thai Support)
          ========================================================================= */}
      <section id="about" className="py-16 sm:py-24 bg-[#F8F5EE] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Visual Column: Authentic Artwork Card */}
            <div className="lg:col-span-5 order-2 lg:order-1 reveal-scale-on-scroll">
              <div className="relative rounded-2xl overflow-hidden shadow-elevated bg-[#F2ECE1] border border-[#E7D4B3]/60 group">
                <img
                  src={ARTWORK_CARD_SRC}
                  alt="The Khaosan Poshtel Emblem on textured paper"
                  className="w-full h-auto object-cover transform group-hover:scale-102 transition-transform duration-500"
                />
                <div className="p-6 bg-[#FFFFFF]/90 backdrop-blur-xs border-t border-[#E7D4B3]/40">
                  <p className="font-display font-semibold text-sm text-[#16373F]">
                    {t.aboutCardTitle}
                  </p>
                  <p className="text-xs text-[#63787D] mt-1">
                    {t.aboutCardDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Text Narrative Column */}
            <div className="lg:col-span-7 order-1 lg:order-2 reveal-on-scroll">
              <span className="text-xs font-bold tracking-widest uppercase text-[#2A5542] block mb-3">
                {t.aboutTag}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#16373F] leading-tight">
                {t.aboutHeading}
              </h2>
              <div className="w-16 h-1 bg-[#E7D4B3] mt-4 mb-6 sm:mt-5 sm:mb-8 rounded-full" />

              <p className="text-sm sm:text-base md:text-lg text-[#16373F]/85 leading-relaxed font-normal mb-4 sm:mb-6">
                {t.aboutP1}
              </p>

              <p className="text-sm sm:text-base text-[#16373F]/75 leading-relaxed font-normal mb-6 sm:mb-8">
                {t.aboutP2}
              </p>

              {/* Three Core Brand Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#E7D4B3]/50">
                <div className="reveal-on-scroll reveal-delay-1">
                  <h3 className="font-display font-semibold text-base text-[#16373F] mb-1.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E7D4B3]" />
                    {t.pillar1Title}
                  </h3>
                  <p className="text-xs text-[#63787D] leading-relaxed">
                    {t.pillar1Desc}
                  </p>
                </div>
                <div className="reveal-on-scroll reveal-delay-2">
                  <h3 className="font-display font-semibold text-base text-[#16373F] mb-1.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#2A5542]" />
                    {t.pillar2Title}
                  </h3>
                  <p className="text-xs text-[#63787D] leading-relaxed">
                    {t.pillar2Desc}
                  </p>
                </div>
                <div className="reveal-on-scroll reveal-delay-3">
                  <h3 className="font-display font-semibold text-base text-[#16373F] mb-1.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D96B50]" />
                    {t.pillar3Title}
                  </h3>
                  <p className="text-xs text-[#63787D] leading-relaxed">
                    {t.pillar3Desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. STAY SECTION (Full Bilingual Support)
          ========================================================================= */}
      <section id="stay" className="py-24 sm:py-32 bg-[#F2ECE1] border-y border-[#E7D4B3]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16 reveal-on-scroll">
            <span className="text-xs font-bold tracking-widest uppercase text-[#2A5542] block mb-3">
              {t.stayTag}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#16373F]">
              {t.stayHeading}
            </h2>
            <div className="w-16 h-1 bg-[#16373F] mx-auto mt-4 mb-6 rounded-full" />
            <p className="text-base text-[#16373F]/80 leading-relaxed font-normal">
              {t.staySubheading}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {/* Private Room Card */}
            <div className="bg-[#FFFFFF] rounded-2xl p-8 sm:p-10 shadow-soft border border-[#E7D4B3]/50 flex flex-col justify-between reveal-on-scroll reveal-delay-1">
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#E7D4B3]/40 text-[#16373F] text-xs font-semibold mb-6">
                  {t.privateTag}
                </div>
                <h3 className="font-display text-2xl font-bold text-[#16373F] mb-3">
                  {t.privateTitle}
                </h3>
                <p className="text-sm text-[#16373F]/75 leading-relaxed mb-6 font-normal">
                  {t.privateDesc}
                </p>
                <ul className="space-y-3 mb-8 text-xs text-[#16373F]/85 font-medium">
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-[#2A5542] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {t.privateFeat1}
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-[#2A5542] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {t.privateFeat2}
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-[#2A5542] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {t.privateFeat3}
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-[#2A5542] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {t.privateFeat4}
                  </li>
                </ul>
              </div>
              <a
                href="#book"
                className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#16373F] text-[#F8F5EE] text-sm font-medium hover:bg-[#2A5542] transition-colors"
              >
                {t.privateBtn}
              </a>
            </div>

            {/* Social Pod Dormitory Card */}
            <div className="bg-[#FFFFFF] rounded-2xl p-8 sm:p-10 shadow-soft border border-[#E7D4B3]/50 flex flex-col justify-between reveal-on-scroll reveal-delay-2">
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#2A5542]/15 text-[#2A5542] text-xs font-semibold mb-6">
                  {t.dormTag}
                </div>
                <h3 className="font-display text-2xl font-bold text-[#16373F] mb-3">
                  {t.dormTitle}
                </h3>
                <p className="text-sm text-[#16373F]/75 leading-relaxed mb-6 font-normal">
                  {t.dormDesc}
                </p>
                <ul className="space-y-3 mb-8 text-xs text-[#16373F]/85 font-medium">
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-[#2A5542] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {t.dormFeat1}
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-[#2A5542] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {t.dormFeat2}
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-[#2A5542] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {t.dormFeat3}
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-[#2A5542] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {t.dormFeat4}
                  </li>
                </ul>
              </div>
              <a
                href="#book"
                className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#E7D4B3] text-[#16373F] text-sm font-semibold hover:bg-[#D4BF9A] transition-colors"
              >
                {t.dormBtn}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. EXPERIENCE AND AMENITIES (Full Bilingual Support)
          ========================================================================= */}
      <section id="experience" className="py-24 sm:py-32 bg-[#F8F5EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16 reveal-on-scroll">
            <span className="text-xs font-bold tracking-widest uppercase text-[#2A5542] block mb-3">
              {t.expTag}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#16373F]">
              {t.expHeading}
            </h2>
            <div className="w-16 h-1 bg-[#E7D4B3] mx-auto mt-4 mb-6 rounded-full" />
            <p className="text-base text-[#16373F]/80 leading-relaxed font-normal">
              {t.expSubheading}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Amenity 1 */}
            <div className="bg-[#FFFFFF] p-7 rounded-2xl border border-[#E7D4B3]/40 shadow-soft reveal-on-scroll reveal-delay-1">
              <div className="w-10 h-10 rounded-full bg-[#E7D4B3]/40 flex items-center justify-center mb-5 text-[#16373F]">
                <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-lg text-[#16373F] mb-2">
                {t.amen1Title}
              </h3>
              <p className="text-xs text-[#63787D] leading-relaxed font-normal">
                {t.amen1Desc}
              </p>
            </div>

            {/* Amenity 2 */}
            <div className="bg-[#FFFFFF] p-7 rounded-2xl border border-[#E7D4B3]/40 shadow-soft reveal-on-scroll reveal-delay-2">
              <div className="w-10 h-10 rounded-full bg-[#2A5542]/15 flex items-center justify-center mb-5 text-[#2A5542]">
                <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-lg text-[#16373F] mb-2">
                {t.amen2Title}
              </h3>
              <p className="text-xs text-[#63787D] leading-relaxed font-normal">
                {t.amen2Desc}
              </p>
            </div>

            {/* Amenity 3 */}
            <div className="bg-[#FFFFFF] p-7 rounded-2xl border border-[#E7D4B3]/40 shadow-soft reveal-on-scroll reveal-delay-3">
              <div className="w-10 h-10 rounded-full bg-[#E7D4B3]/40 flex items-center justify-center mb-5 text-[#16373F]">
                <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-lg text-[#16373F] mb-2">
                {t.amen3Title}
              </h3>
              <p className="text-xs text-[#63787D] leading-relaxed font-normal">
                {t.amen3Desc}
              </p>
            </div>

            {/* Amenity 4 */}
            <div className="bg-[#FFFFFF] p-7 rounded-2xl border border-[#E7D4B3]/40 shadow-soft reveal-on-scroll reveal-delay-4">
              <div className="w-10 h-10 rounded-full bg-[#D96B50]/15 flex items-center justify-center mb-5 text-[#D96B50]">
                <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-lg text-[#16373F] mb-2">
                {t.amen4Title}
              </h3>
              <p className="text-xs text-[#63787D] leading-relaxed font-normal">
                {t.amen4Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. LOCATION SECTION (Interactive Street-Level Google Map & Full Bilingual Info)
          ========================================================================= */}
      <section id="location" className="py-24 sm:py-32 bg-[#F2ECE1] border-t border-[#E7D4B3]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 reveal-on-scroll">
            <span className="text-xs font-bold tracking-widest uppercase text-[#2A5542] block mb-3">
              {t.locationTag}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#16373F]">
              {t.locationHeading}
            </h2>
            <div className="w-16 h-1 bg-[#E7D4B3] mt-4 mb-4 rounded-full" />
            <p className="text-base text-[#16373F]/80 leading-relaxed font-normal">
              {t.locationSubheading}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Interactive Google Map Embed - Detailed Street Level View (z=19) */}
            <div className="lg:col-span-7 flex flex-col reveal-scale-on-scroll">
              <div className="relative w-full h-[400px] sm:h-[480px] rounded-2xl overflow-hidden border border-[#E7D4B3]/60 shadow-elevated group bg-[#E4D0AD]">
                <iframe
                  title="The Khaosan Poshtel Location Map - Soi Rambuttri"
                  src="https://maps.google.com/maps?q=92+Soi+Rambutri,+Talat+Yot,+Phra+Nakhon,+Bangkok+10200&t=&z=19&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0 filter saturate-95 contrast-105"
                  allowFullScreen=""
                  loading="eager"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                {/* Floating Map Action Badge */}
                <div className="absolute bottom-4 right-4 z-10">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=92+Soi+Rambutri,+Talat+Yot,+Phra+Nakhon,+Bangkok+10200"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#16373F]/90 backdrop-blur-md text-[#E7D4B3] hover:text-[#FAF8F5] text-xs font-semibold shadow-lg hover:bg-[#16373F] active:scale-98 transition-all"
                  >
                    <span>{t.openGoogleMaps}</span>
                    <svg className="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Address & Credentials Info Column */}
            <div className="lg:col-span-5 flex flex-col justify-between reveal-on-scroll reveal-delay-2">
              <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 shadow-elevated border border-[#E7D4B3]/60 h-full flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold tracking-widest uppercase text-[#2A5542] block mb-2">
                    {t.propEntityTag}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-[#16373F] mb-6">
                    {t.propName}
                  </h3>

                  <div className="space-y-5 text-sm text-[#16373F]/85 border-t border-[#E7D4B3]/40 pt-5">
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-full bg-[#E7D4B3]/35 flex items-center justify-center flex-shrink-0 text-[#16373F] mt-0.5">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-[#16373F] text-base">{t.addressLabel}</p>
                        <p className="text-sm text-[#63787D] mt-0.5 font-normal leading-relaxed">
                          {t.addressText}
                        </p>
                        <p className="text-xs text-[#63787D] mt-0.5">
                          {t.addressSub}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 pt-2 border-t border-[#E7D4B3]/30">
                      <div className="w-9 h-9 rounded-full bg-[#E7D4B3]/35 flex items-center justify-center flex-shrink-0 text-[#16373F] mt-0.5">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-[#16373F] text-base">{t.entityLabel}</p>
                        <p className="text-sm text-[#63787D] mt-0.5 font-normal leading-relaxed">
                          {t.entityName}
                        </p>
                        <p className="text-xs text-[#63787D]">
                          {t.entitySub}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 pt-2 border-t border-[#E7D4B3]/30">
                      <div className="w-9 h-9 rounded-full bg-[#E7D4B3]/35 flex items-center justify-center flex-shrink-0 text-[#16373F] mt-0.5">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-[#16373F]">{t.arrivalLabel}</p>
                        <p className="text-xs text-[#63787D] mt-0.5 font-normal leading-relaxed">
                          {t.arrivalText}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#E7D4B3]/40 flex flex-wrap gap-3">
                  <button
                    onClick={handleCopyAddress}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#16373F] text-[#F8F5EE] hover:bg-[#2A5542] text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-98"
                  >
                    <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <span>{addressCopied ? t.addressCopied : t.copyAddress}</span>
                  </button>

                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=92+Soi+Rambutri,+Talat+Yot,+Phra+Nakhon,+Bangkok+10200"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E7D4B3] text-[#16373F] hover:bg-[#FAF8F5] text-xs font-semibold transition-all shadow-xs active:scale-98"
                  >
                    <span>{t.getDirections}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. BOOKING INQUIRY SECTION (Full Bilingual English / Thai Support)
          ========================================================================= */}
      <section id="book" className="py-24 sm:py-32 bg-[#16373F] text-[#F8F5EE] relative overflow-hidden">
        {/* Subtle background ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle at 50% 30%, #E7D4B3 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal-on-scroll">
          <span className="text-xs font-bold tracking-widest uppercase text-[#E7D4B3] block mb-3">
            {t.bookTag}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F8F5EE]">
            {t.bookHeading}
          </h2>
          <div className="w-16 h-1 bg-[#E7D4B3] mx-auto mt-5 mb-6 rounded-full" />
          <p className="text-base text-[#F8F5EE]/80 max-w-2xl mx-auto font-normal leading-relaxed mb-12">
            {t.bookSubheading}
          </p>

          {/* Interactive Demo Reservation Box */}
          <div className="bg-[#FFFFFF] text-[#16373F] rounded-2xl p-5 sm:p-10 shadow-2xl text-left border border-[#E7D4B3]/30 reveal-scale-on-scroll reveal-delay-1 max-w-full overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-[#E7D4B3]/40">
              <div className="min-w-0">
                <h3 className="font-display font-bold text-lg sm:text-xl text-[#16373F] truncate">
                  {t.bookFormTitle}
                </h3>
                <p className="text-xs text-[#63787D] mt-0.5">
                  92 Soi Rambutri, Talat Yot, Phra Nakhon, Bangkok 10200
                </p>
              </div>
              <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-[#E7D4B3]/40 text-[#16373F] text-xs font-semibold whitespace-nowrap">
                {t.bookDemoBadge}
              </span>
            </div>

            {bookingSubmitted ? (
              <div className="py-8 text-center bg-[#F8F5EE] rounded-xl border border-[#2A5542]/30 p-6">
                <div className="w-12 h-12 rounded-full bg-[#2A5542] text-[#F8F5EE] mx-auto flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="font-display font-bold text-xl text-[#16373F] mb-2">
                  {t.bookSuccessTitle}
                </h4>
                <p className="text-sm text-[#63787D] max-w-md mx-auto mb-6">
                  {t.bookSuccessDesc}
                </p>
                <button
                  type="button"
                  onClick={() => setBookingSubmitted(false)}
                  className="px-6 py-2.5 rounded-full bg-[#16373F] text-[#F8F5EE] text-xs font-medium hover:bg-[#2A5542] transition-colors cursor-pointer"
                >
                  {t.bookAnotherBtn}
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setBookingSubmitted(true);
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="min-w-0">
                    <label className="block text-xs font-semibold text-[#16373F] mb-1.5">
                      {t.bookCheckIn}
                    </label>
                    <input
                      type="date"
                      defaultValue="2026-10-15"
                      className="w-full min-w-0 max-w-full px-3.5 py-2.5 rounded-xl border border-[#E7D4B3] text-sm text-[#16373F] focus:outline-none focus:ring-2 focus:ring-[#16373F]/30 bg-[#F8F5EE]"
                      required
                    />
                  </div>

                  <div className="min-w-0">
                    <label className="block text-xs font-semibold text-[#16373F] mb-1.5">
                      {t.bookCheckOut}
                    </label>
                    <input
                      type="date"
                      defaultValue="2026-10-18"
                      className="w-full min-w-0 max-w-full px-3.5 py-2.5 rounded-xl border border-[#E7D4B3] text-sm text-[#16373F] focus:outline-none focus:ring-2 focus:ring-[#16373F]/30 bg-[#F8F5EE]"
                      required
                    />
                  </div>

                  <div className="min-w-0">
                    <label className="block text-xs font-semibold text-[#16373F] mb-1.5">
                      {t.bookRoomType}
                    </label>
                    <select
                      className="w-full min-w-0 max-w-full px-3.5 py-2.5 rounded-xl border border-[#E7D4B3] text-sm text-[#16373F] focus:outline-none focus:ring-2 focus:ring-[#16373F]/30 bg-[#F8F5EE]"
                    >
                      <option>{t.bookPrivateOption}</option>
                      <option>{t.bookDormOption}</option>
                    </select>
                  </div>

                  <div className="min-w-0">
                    <label className="block text-xs font-semibold text-[#16373F] mb-1.5">
                      {t.bookGuests}
                    </label>
                    <select
                      className="w-full min-w-0 max-w-full px-3.5 py-2.5 rounded-xl border border-[#E7D4B3] text-sm text-[#16373F] focus:outline-none focus:ring-2 focus:ring-[#16373F]/30 bg-[#F8F5EE]"
                    >
                      <option>{t.bookGuest1}</option>
                      <option>{t.bookGuest2}</option>
                      <option>{t.bookGuest3}</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                  <p className="text-xs text-[#63787D] text-center sm:text-left">
                    {t.bookNote}
                  </p>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#16373F] text-[#F8F5EE] text-sm font-semibold tracking-wide hover:bg-[#2A5542] shadow-md transition-colors cursor-pointer text-center"
                  >
                    {t.bookSubmitBtn}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. FOOTER (Brand name, address, operating company, full bilingual copy)
          ========================================================================= */}
      <footer className="bg-[#0D242A] text-[#F8F5EE]/80 py-16 border-t border-[#E7D4B3]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#F8F5EE]/10">
            {/* Brand column */}
            <div className="md:col-span-6 space-y-4 reveal-on-scroll">
              <div className="flex items-center gap-3">
                <img
                  src={LOGO_SRC}
                  alt="The Khaosan Poshtel Logo"
                  className="w-10 h-10 object-contain"
                />
                <span className="font-display font-bold text-lg text-[#F8F5EE] tracking-wide">
                  THE KHAOSAN POSHTEL
                </span>
              </div>
              <p className="text-xs text-[#F8F5EE]/70 max-w-md leading-relaxed font-normal">
                {t.footerDesc}
              </p>
              <div className="pt-2 text-xs text-[#E7D4B3] space-y-1">
                <p>
                  <strong className="text-[#F8F5EE]">{t.footerEntityLabel}</strong> RK Hospitality Company Limited
                </p>
                <p>
                  <strong className="text-[#F8F5EE]">{t.footerAddressLabel}</strong> 92 Soi Rambutri, Talat Yot, Phra Nakhon, Bangkok 10200
                </p>
              </div>
            </div>

            {/* Quick in-page navigation anchors */}
            <div className="md:col-span-3 space-y-3 reveal-on-scroll reveal-delay-1">
              <h4 className="font-display font-semibold text-xs tracking-widest uppercase text-[#E7D4B3]">
                {t.footerNavTitle}
              </h4>
              <ul className="space-y-2 text-xs">
                {[
                  { id: 'about', label: t.about },
                  { id: 'stay', label: t.stay },
                  { id: 'experience', label: t.experience },
                  { id: 'location', label: t.location },
                ].map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="hover:text-[#F8F5EE] transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Inquiries */}
            <div className="md:col-span-3 space-y-3 reveal-on-scroll reveal-delay-2">
              <h4 className="font-display font-semibold text-xs tracking-widest uppercase text-[#E7D4B3]">
                {t.footerReservationsTitle}
              </h4>
              <p className="text-xs text-[#F8F5EE]/70 leading-relaxed font-normal">
                {t.footerResNotice}
              </p>
              <a
                href="#book"
                className="inline-block mt-2 text-xs font-semibold text-[#E7D4B3] hover:text-[#F8F5EE] underline underline-offset-4 transition-colors"
              >
                {t.footerResLink}
              </a>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#F8F5EE]/50 gap-4 reveal-on-scroll reveal-delay-1">
            <p>{t.footerCopyright}</p>
            <p>{t.footerFullAddress}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

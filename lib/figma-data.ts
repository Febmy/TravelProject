// Structured content extracted directly from Figma File Y972VugHKmG7IGi5jqbRhj (Node 0:1)

export interface HotelItem {
  id: string;
  name: string;
  location: string;
  fullLocation: string;
  pricePerNight: number;
  priceFormatted: string;
  rating: number;
  reviewsCount: number;
  ratingText: string;
  tag?: string;
  image: string;
  gallery: string[];
  description: string;
  amenities: string[];
  rooms: {
    name: string;
    description: string;
    bed: string;
    guests: string;
    features: string;
    price: number;
    priceFormatted: string;
    image?: string;
  }[];
}

export interface UmrahPackage {
  id: string;
  title: string;
  tag: string;
  duration: string;
  departureDate: string;
  airline: string;
  makkahHotel: string;
  madinahHotel: string;
  rating: number;
  price: number;
  priceFormatted: string;
  seatsLeft: number;
  image: string;
  description: string;
  highlights: string[];
  itinerary: {
    day: string;
    title: string;
    description: string;
  }[];
  terms: string[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  comment: string;
  avatar: string;
  rating: number;
}

export interface PromoCoupon {
  id: string;
  code: string;
  title: string;
  discount: string;
  validUntil: string;
  description: string;
  category: 'hotel' | 'umrah' | 'flight' | 'all';
  tag?: string;
}

export const figmaAssets = {
  heroBanner: 'https://s3-alpha-sig.figma.com/img/8059/a577/f88a78f7b39dfe827ef9a7ff01ce2b89?Expires=1791158400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Q0R9QdApgv1v927xFOuNEpaTVUUgnp6A9~kZ4okyx2wL8J~In17DUFb5xP1k4BR2xxxdIFY2hLZ~huCn6fN0FxggFarAfqtmzI-GHGx82A0Ej4MWRUjUR7CEYiATMpjX8u7V7Y7XN1G2t~zCQ6XsEah7DVGvbZLeIDr-tQ7U07p3qaJ4YggoKrVfLnEh5hXLkjfBB7qskNKqvIB5qDMCfpRquCixsFUw17UbffsXZUc6Pp5dcL~mZcRMYf5CCRfXUOTLjdWaTRzo5fKacQRNCOGHpBfZ~RnWiYveBjWlpeQUoKjW1ajhoF8ayd62JzxlrmJSV8h2Uz9NBZtBFAfRjQ__',
  kaabaImage: 'https://s3-alpha-sig.figma.com/img/82e3/ee17/0dba7f9825f16e3078005bf4c3f596bb?Expires=1791158400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=TkdId6uUuLLy6B~3CwrrAU8uPcqsKofvMgKxOy-qFQNCC7TZEOMVOw674YF3~X2OY7YEvHiuNcAIEJGSmdOHytF6LvZvYHfOsdwrJE-CfcvTLv~6JjgG8PyVlojVPlt2S797dPilON0ni5HnNojlUjO~~Tse9aqSOwmIkXWYCQbJ5tjhtukEXxGlnoX9C-krJahfB-XsVkEtP3KT81tHA4FQcotXbIuE6a3BKmOezRHUOTlZIarkRawaHO29C~f4kwYiFp9eW5sjhl02uMf3BeddJibOtQo7h9LuXhj-8QCKQtLGXtrih4FHIfLR8KVnEEEgEgpcORgSy-rLuMB5JA__',
  alilaSeminyak: 'https://s3-alpha-sig.figma.com/img/31e1/86cd/f3513ca778fa94169bb261277a696df5?Expires=1791158400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=D3Lv3A~IJ5Wl3i6DjazpkGXuGQLQkbLpdlNErTj7wOxVhSXJq9SxzQ697M5KbMCaS~ZYx6x-QiZCuO4H9XrzHB0a5NyLDdnqueLC-Tq4wzf63SS~i0stxzXL3Ufp2k-S6cE1f64WYApz-tzesA2UdHwwouBpGqkBanPPP3U8~8qOvkp5lzaUWtcuIRvZZeGtj30ryRNeUZHFoYUjBpqr~sfgTMG48YcrVBZtqOWf6rdV1qLKDZhuyyAxx4Wrf6~Xx1JyxQwwHIpU~yNQGd-tWm3uRa9SPVpoI9Gk1UDiRV0rh7HxOajnIkqUkGreNNpLy1rTni7JCmadrlBvYbJ9mA__',
  mandapaRitz: 'https://s3-alpha-sig.figma.com/img/ed37/000e/0f0341f81bbdb5ea2dbef0e1d55e660a?Expires=1791158400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=LF22fY9pfhTwjBMLNaan5GFXg956qHWP4SsLzlJKQjBayT9V0yN5a2HzxfbUgskSmSy9Uch4JK~gxAz-tOOpbxS~x5D-U9n6KWg-t7rKh2QRdg0Fa3789-v1goiPDmbt5CvadXSOjFu3Do4Fnfq6UyTml5JfSl0VPzuzoz4FAzI2zzTW3iz0HgsUuxYMPthdeavYoQXZRB5BWwc91i-IRd1JbR6COEt5DN-~p6wahua7Zlf5PScLj4BrFMu8fmNn0AFF2OfE2ctZrk~ZoLbvjKf9nMw5Qil3EFYRl3-6SoZmFoJJAUoleQ75y7hm3wYTAmMd6wIO5qbeewgBhUjr4w__',
  amanjiwo: 'https://s3-alpha-sig.figma.com/img/bb81/18b4/669257bd89673fc54d0f631c881e1002?Expires=1791158400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=n1Y5NuuYi84aQ6yL7Ki6G2AnMmyBQNJp34QPD85ctHpF3ZtH~IFBjy46dTNHU85IiEaqsMP7uiBQfUF-diiypd29GCJ~OD6kyajNyJ5yKvzzF~3P~VYKiVq4YqFfIa4z1XNkLOyVqv7eJpgZew8urCCb7FXt1xRd4Pf4u7IvWlloGFWDHmV3-GOk1XgePTOZt0Tui3bNls~5zVvPlguEpgfxi2JMUbZU1SNSADcLWAzC1cV0DJMH0hwVITukgSXRSWDjQp5rkONx5xSSbKyHip2VVPP~diWtHDpwChGCKOLMJJuEw3NSIHYIVSqF2qHXVkF4OqI1ozpMVwYFEGDxFg__',
  mulakNusaDua: 'https://s3-alpha-sig.figma.com/img/a9d5/e1be/13afda51430f1a90bc343942c7e8243e?Expires=1791158400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=hX99B-8k1WJvX23hMvXp3T~7q0o6aJ83k2f8J0q~p1bU28cZ9013',
  avatarAhmad: 'https://s3-alpha-sig.figma.com/img/f791/8f6c/dbe4b87972df5fe6ae478538a9b4a0cf?Expires=1791158400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Bmsu4xJqR6g8s6108139',
  avatarSarah: 'https://s3-alpha-sig.figma.com/img/e237/db20/c9888a23f5a0fd3602587848a055f521?Expires=1791158400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Dklm2890x10398',
  avatarRidwan: 'https://s3-alpha-sig.figma.com/img/deb5/361a/7951f0b7d8116340394fd393f4929134?Expires=1791158400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Xkml10928301',
  adminAvatar: 'https://s3-alpha-sig.figma.com/img/83cb/2aee/f978da221bca10ab4b4f75d2e4d527c7?Expires=1791158400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Kjsm0192830129',
  loginBg: 'https://s3-alpha-sig.figma.com/img/9e37/3a0a/54f805d6b1ec2fbc0f5e27120eaa9263?Expires=1791158400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=cJZH6w4au1m7qQQagCF20ecm3UYH437De1r5evkp4pB3Eq7jh5aUCNKJsKfh-SDbCSagBkmuXv9lFT2Wc~1XbiSaazfH~tkliEKQYY4noz13-1sfrF~7pM6BnZ6VCWI7Tpp-at33Fr8174WXaYqNU~HLADhPdckVLZZVIDb~OWyIXyZA81SKkuaZ6KHVSyDsFBpt4t-oLsDNCIfMv~m~J4n1Cz5SolhgHs~HWkS9RaqgaccxnUWEiCPNgVwXjF5iaqnerbxcBsGVt03LrHOY9NDUAxf1Hnlpuq5ScGSNUs8bE1Ngh6o9jqusanOmPycQcRLGPzarGWOOXwA1Di1qPw__',
  registerBg: 'https://s3-alpha-sig.figma.com/img/921d/a698/51d1786fde3ee2456a942d9bd1307b31?Expires=1791158400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=PonqS1cT3fNEBKQOIuGTNn4NPAz9xJfahglPTR8FPYRNauIPnW9GcFNQ3MlgYr8lOZBmnZnIIIAcsWlyra2VCxAQQ3DFOmf2WYBC03MROyOEVqHUAE64-fArhMZFKvTMVmRos9JfftgOpMC4ODYcuLqsxpX8aw9oC1YMKZIsD9oCw2QHVZfAiqDjh8h~UVkKmulyyikgJjhf6KB~-1h-V0dddvjqOdM-vVRRWJzv91jhN2-o0HlGKo31nXhcV7udOzEf6ihXFeKfMz7kIjToPZTSUUPgKQgxXC9Ko13QaFEaQV0HZ9ZCypmcHmPgkpeMxFwkc-C5aILN3yALTpFAQ__',
};

export const figmaHotels: HotelItem[] = [
  {
    id: 'the-alila-seminyak',
    name: 'The Alila Seminyak Resort',
    location: 'Seminyak, Bali',
    fullLocation: 'Jl. Raya Seminyak No. 100, Seminyak, Bali, Indonesia',
    pricePerNight: 4500000,
    priceFormatted: 'Rp 4.500.000 / malam',
    rating: 4.9,
    reviewsCount: 324,
    ratingText: 'Sangat Luar Biasa',
    tag: 'Akses Pantai Langsung',
    image: figmaAssets.alilaSeminyak,
    gallery: [
      figmaAssets.alilaSeminyak,
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=85',
    ],
    description:
      'The Alila Seminyak memadukan arsitektur kontemporer ultra-chic dengan suasana alam pantai tropis yang memukau. Berada di lokasi premium Seminyak, hotel ini menawarkan akses langsung ke pantai berpasir halus, bar kolam renang yang menakjubkan, serta pusat kuliner dan hiburan premium di sekitarnya.',
    amenities: [
      'Kolam Renang Infinity',
      'Akses Pantai Langsung',
      'Pusat Kebugaran Bintang 5',
      'Spa & Massage Center',
      'Restoran Internasional',
      'Akses Internet Super Cepat',
    ],
    rooms: [
      {
        name: 'Deluxe Ocean View Room',
        description: 'Kamar luas dengan pemandangan langsung ke Samudera Hindia dari balkon pribadi.',
        bed: '1 King Bed / 2 Twin Beds',
        guests: '2 Dewasa',
        features: 'Sarapan Gratis · WiFi Gratis · Bathtub',
        price: 4500000,
        priceFormatted: 'Rp 4.500.000',
      },
      {
        name: 'Alila Signature Terrace Suite',
        description: 'Kemewahan luas ekstra dengan akses langsung ke dek taman dan semi-private pool.',
        bed: '1 King Bed Super',
        guests: '2 Dewasa · 1 Anak',
        features: 'Sarapan & Makan Malam Gratis · Akses VIP lounge',
        price: 6800000,
        priceFormatted: 'Rp 6.800.000',
      },
    ],
  },
  {
    id: 'mandapa-ritz-carlton',
    name: 'Mandapa, a Ritz-Carlton Reserve',
    location: 'Ubud, Bali',
    fullLocation: 'Jl. Kedewatan, Banjar Kedewatan, Ubud, Gianyar, Bali',
    pricePerNight: 8200000,
    priceFormatted: 'Rp 8.200.000 / malam',
    rating: 4.95,
    reviewsCount: 288,
    ratingText: 'Sempurna & Istimewa',
    tag: 'Pemandangan Lembah & Sungai',
    image: figmaAssets.mandapaRitz,
    gallery: [
      figmaAssets.mandapaRitz,
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85',
    ],
    description:
      'Suaka tersembunyi yang eksklusif di sepanjang Sungai Ayung Ubud, dikelilingi hutan hujan asri dengan ketenangan spiritual khas Bali.',
    amenities: [
      'Private Butler Service 24 Jam',
      'Ayung River View Pool',
      'Organic Fine Dining',
      'Holistic Wellness Spa',
      'Yoga Pavilion',
    ],
    rooms: [
      {
        name: 'Reserve Suite Valley View',
        description: 'Suite bergaya arsitektur Bali klasik dengan teras privat menghadap lembah.',
        bed: '1 King Bed',
        guests: '2 Dewasa',
        features: 'Patiho Butler · Sarapan Signature · Afternoon Tea',
        price: 8200000,
        priceFormatted: 'Rp 8.200.000',
      },
    ],
  },
  {
    id: 'amanjiwo-borobudur',
    name: 'Amanjiwo Borobudur',
    location: 'Magelang, Jawa Tengah',
    fullLocation: 'Desa Majaksingi, Borobudur, Magelang, Jawa Tengah',
    pricePerNight: 9500000,
    priceFormatted: 'Rp 9.500.000 / malam',
    rating: 5.0,
    reviewsCount: 194,
    ratingText: 'Mahakarya Terbaik',
    tag: 'Pemandangan Candi Borobudur',
    image: figmaAssets.amanjiwo,
    gallery: [figmaAssets.amanjiwo],
    description:
      'Menghadap kemegahan candi Borobudur abad ke-9 dan perbukitan Menoreh, Amanjiwo menghadirkan peristirahatan magis berbalut batu andesit lokal.',
    amenities: [
      'Borobudur Sunset Tour',
      'Private Plunge Pool',
      'Javanese Spa Treatment',
      'Perpustakaan Seni',
    ],
    rooms: [
      {
        name: 'Borobudur Suite',
        description: 'Paviliun terpusat dengan tiang batu kapur dan panorama candi tanpa batas.',
        bed: '1 Four-poster King Bed',
        guests: '2 Dewasa',
        features: 'Sarapan Tradisional · Daily Canapes · Airport Transfer',
        price: 9500000,
        priceFormatted: 'Rp 9.500.000',
      },
    ],
  },
];

export const figmaUmrahPackages: UmrahPackage[] = [
  {
    id: 'umrah-syawal-9hari',
    title: 'Paket Umrah Eksklusif Syawal 9 Hari Terdekat Masjidil Haram',
    tag: 'Paket Premium Bintang 5',
    duration: '9 Hari 8 Malam',
    departureDate: '14 Oktober 2026',
    airline: 'Garuda Indonesia (Direct Jakarta - Jeddah)',
    makkahHotel: 'Fairmont Makkah Clock Royal Tower',
    madinahHotel: 'The Oberoi Madinah',
    rating: 5.0,
    price: 44200000,
    priceFormatted: 'Rp 44.200.000 / pax',
    seatsLeft: 6,
    image: figmaAssets.kaabaImage,
    description:
      'Menginap di Fairmont Clock Tower Makkah & Oberoi Madinah dengan bimbingan asatidz tepercaya sesuai sunnah. Rasakan pengalaman ibadah khusyuk di pelataran Kaaba tanpa lelah jarak.',
    highlights: [
      'Akomodasi Bintang 5: Fairmont Makkah & Oberoi Madinah',
      'Penerbangan Langsung Saudi Airlines / Garuda Indonesia tanpa transit',
      'Visa Umrah, Asuransi Perjalanan & Manasik Lengkap',
      'Bimbingan Muthawwif Asatidz berpengalaman sesuai Sunnah',
      'Perlengkapan Umrah Eksklusif & City Tour Kota Suci',
    ],
    itinerary: [
      {
        day: 'Hari 1',
        title: 'Keberangkatan Jakarta - Jeddah - Makkah',
        description:
          'Berkumpul di Bandara Soekarno-Hatta Terminal 3. Penerbangan langsung menuju Jeddah. Tiba di Bandara Jeddah, proses imigrasi, dilanjutkan perjalanan bus VIP menuju Makkah untuk ibadah Umrah pertama.',
      },
      {
        day: 'Hari 2',
        title: 'Ibadah Mandiri & Pemantapan Manasik',
        description:
          'Memperbanyak ibadah di Masjidil Haram (Thawaf sunnah, tadarus Al-Quran, dan kajian keagamaan bersama asatidz pembimbing di ruang pertemuan hotel).',
      },
      {
        day: 'Hari 3',
        title: 'Ziarah Kota Makkah Al-Mukarramah',
        description:
          'Mengunjungi tempat bersejarah di Makkah: Jabal Thaur, Jabal Rahmah (Arafah), Muzdalifah, Mina, dan Jabal Nur. Ziarah diakhiri di Masjid Ji’ranah untuk mengambil miqat Umrah kedua.',
      },
      {
        day: 'Hari 4-6',
        title: 'Perjalanan ke Madinah & Ziarah Raudhah',
        description:
          'Menuju Madinah via Kereta Cepat Haramain (High Speed Train). Check-in di The Oberoi Madinah. Beribadah di Masjid Nabawi dan ziarah makam Rasulullah SAW serta Raudhah Syarifah.',
      },
      {
        day: 'Hari 7-9',
        title: 'City Tour Madinah & Kepulangan ke Tanah Air',
        description:
          'Ziarah Masjid Quba, Jabal Uhud, Kebun Kurma. Persiapan kepulangan menuju Bandara Prince Mohammad Bin Abdulaziz Madinah menuju Jakarta.',
      },
    ],
    terms: [
      '1. Paspor berlaku minimal 8 bulan sebelum jadwal keberangkatan.',
      '2. Pembayaran DP sebesar Rp 10.000.000 / pax saat pendaftaran sebagai tanda komitmen seat.',
      '3. Pelunasan biaya paket wajib diselesaikan maksimal 45 hari kalender sebelum keberangkatan.',
      '4. Pembatalan sepihak dikenakan ketentuan administrasi maskapai dan pihak hotel.',
    ],
  },
  {
    id: 'umrah-musim-gugur',
    title: 'Umrah Premium Bintang 5 Musim Gugur',
    tag: 'Best Seller',
    duration: '9 Hari 8 Malam',
    departureDate: '22 September 2026',
    airline: 'Saudi Airlines (Direct)',
    makkahHotel: 'Swissotel Al Maqam Makkah',
    madinahHotel: 'Pullman Zamzam Madinah',
    rating: 4.9,
    price: 39500000,
    priceFormatted: 'Rp 39.500.000 / pax',
    seatsLeft: 12,
    image: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=900&q=85',
    description:
      'Paket Umrah berkelas dengan harga terjangkau di musim gugur yang sejuk, hotel bintang 5 nol meter dari pelataran masjid.',
    highlights: [
      'Hotel Bintang 5 Nol Meter',
      'Penerbangan Saudi Airlines',
      'Free Kereta Cepat Haramain',
      'Fullboard Buffet Hotel',
    ],
    itinerary: [],
    terms: [],
  },
  {
    id: 'umrah-turki-akbar',
    title: 'Umrah Akbar Akhir Tahun Plus Turki 12 Hari',
    tag: 'Paket Spesial Liburan',
    duration: '12 Hari 11 Malam',
    departureDate: '05 November 2026',
    airline: 'Turkish Airlines',
    makkahHotel: 'Raffles Makkah Palace',
    madinahHotel: 'Dar Al Taqwa Madinah',
    rating: 4.98,
    price: 52800000,
    priceFormatted: 'Rp 52.800.000 / pax',
    seatsLeft: 4,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=85',
    description:
      'Perpaduan ibadah umrah khusyuk bintang 5 dan ziarah jejak peradaban Islam di Istanbul, Blue Mosque, Hagia Sophia, dan Bosphorus Cruise.',
    highlights: [
      'Istanbul City Tour & Bosphorus Cruise',
      'Raffles Makkah Palace View Kaaba',
      'Private VIP Bus & Guide Bahasa Indonesia',
      'Makan 3x Fullboard',
    ],
    itinerary: [],
    terms: [],
  },
];

export const figmaTestimonials: TestimonialItem[] = [
  {
    id: 'test-1',
    name: 'H. Ahmad Fauzi',
    role: 'Jamaah Umrah Akbar 2025',
    comment:
      'Pelayanan sangat profesional dari awal pendaftaran, manasik, hingga bimbingan di tanah suci. Hotel sangat dekat dengan Masjidil Haram, benar-benar memudahkan orang tua saya beribadah.',
    avatar: figmaAssets.avatarAhmad,
    rating: 5,
  },
  {
    id: 'test-2',
    name: 'Sarah Kirana',
    role: 'Liburan Keluarga ke Bali',
    comment:
      'Proses booking hotel di Safara mudah sekali dan harganya transparan tanpa biaya tersembunyi. Resort di Seminyak yang direkomendasikan betul-betul melebihi ekspektasi!',
    avatar: figmaAssets.avatarSarah,
    rating: 5,
  },
  {
    id: 'test-3',
    name: 'Dr. Ridwan Salim',
    role: 'Pelesir & Staycation Rutin',
    comment:
      'Safara mengerti definisi kemewahan yang tenang. Rekomendasi properti kurasinya selalu berkelas dengan standar keramahan terbaik. Selalu jadi pilihan utama saya.',
    avatar: figmaAssets.avatarRidwan,
    rating: 5,
  },
];

export const figmaPromos: PromoCoupon[] = [
  {
    id: 'p1',
    code: 'SAFARAHEMAT15',
    title: 'Spesial Staycation Akhir Pekan Bali',
    discount: 'DISKON 15%',
    validUntil: '30 Apr 2026',
    description:
      'Nikmati potongan harga spesial untuk pemesanan Alila, Ritz-Carlton, dan resort bintang 5 pilihan lainnya di Pulau Dewata.',
    category: 'hotel',
    tag: 'Hampir Habis!',
  },
  {
    id: 'p2',
    code: 'UMRAHBERKAH25',
    title: 'Cashback Tabungan Umrah Berkah',
    discount: 'POTONGAN RP 2.500.000',
    validUntil: '15 Mei 2026',
    description:
      'Potongan langsung per jemaah untuk seluruh pendaftaran Paket Umrah Syawal dan Musim Gugur Bintang 5.',
    category: 'umrah',
    tag: 'Terpopuler',
  },
  {
    id: 'p3',
    code: 'FIRSTSAFARA',
    title: 'Selamat Datang di Safara Travel',
    discount: 'DISKON RP 500.000',
    validUntil: '31 Des 2026',
    description:
      'Kupon potongan untuk pengguna pertama yang baru mendaftar di aplikasi web Safara Travel.',
    category: 'all',
  },
];

export const figmaInvoiceData = {
  invoiceNo: 'INV/2026/0312-89',
  bookingCode: 'SFR-2026-8941',
  date: '12 Maret 2026',
  dueDate: '13 Maret 2026, 10:15 WIB',
  status: 'LUNAS / DIKONFIRMASI',
  company: {
    name: 'PT Safara Global Travel',
    address: 'Jl. Sudirman No. 45, Senayan, Jakarta Selatan, 12190',
    npwp: '42.129.401.0-120.000',
    phone: '+62 21-5544-7890',
    email: 'billing@safaratravel.com',
  },
  customer: {
    name: 'H. Ahmad Fauzi',
    email: 'ahmad.fauzi@gmail.com',
    phone: '+62 812-3456-7890',
    address: 'DKI Jakarta, Indonesia',
  },
  item: {
    product: 'The Alila Seminyak Resort',
    room: 'Deluxe Ocean View Room',
    checkin: '12 Mar 2026',
    checkout: '15 Mar 2026',
    duration: '3 Malam',
    guests: '2 Tamu, 1 Kamar',
    pricePerNight: 4500000,
    subtotal: 13500000,
    serviceFee: 150000,
    discount: 500000,
    tax: 1350000, // 10%
    total: 14500000,
  },
  payment: {
    method: 'Transfer Bank BCA (Virtual Account)',
    vaNumber: '8277 0812 3456 7890',
    paidAt: '12 Mar 2026, 10:45 WIB',
  },
};

export const figmaBackoffice = {
  adminUser: {
    name: 'Faisal Hadi',
    role: 'Super Admin',
    email: 'faisal.hadi@safaratravel.com',
    avatar: figmaAssets.adminAvatar,
  },
  stats: [
    { label: 'TOTAL BOOKING', value: '1,482', change: '+12,4% dari bulan lalu', positive: true },
    { label: 'PENDAPATAN BULANAN', value: 'Rp 42,5 Miliar', change: '+8,2% dari bulan lalu', positive: true },
    { label: 'BOOKING PENDING', value: '34', change: '34 butuh verifikasi segera', positive: false, alert: true },
    { label: 'BOOKING SUKSES', value: '1,208', change: 'Tingkat konversi 94,8%', positive: true },
  ],
  weeklyRevenue: [
    { day: 'Sen', amount: 'Rp 5.2M', height: 45 },
    { day: 'Sel', amount: 'Rp 6.8M', height: 60 },
    { day: 'Rab', amount: 'Rp 8.4M', height: 75 },
    { day: 'Kam', amount: 'Rp 7.1M', height: 62 },
    { day: 'Jum', amount: 'Rp 11.2M', height: 95 },
    { day: 'Sab', amount: 'Rp 12.8M', height: 100 },
    { day: 'Min', amount: 'Rp 9.5M', height: 80 },
  ],
  recentBookings: [
    {
      id: 'SFR-98441',
      customer: 'Elena Rostova',
      email: 'elena.rostova@mail.com',
      product: 'The Safara Desert Lodge',
      date: '12 Mar 2026',
      amount: '$1,280.00',
      status: 'Confirmed',
      statusColor: 'success',
    },
    {
      id: 'SFR-98440',
      customer: 'H. Ahmad Fauzi',
      email: 'ahmad.fauzi@gmail.com',
      product: 'The Alila Seminyak Resort',
      date: '12 Mar 2026',
      amount: 'Rp 14.500.000',
      status: 'Confirmed',
      statusColor: 'success',
    },
    {
      id: 'SFR-98439',
      customer: 'Sarah Kirana',
      email: 'sarah.kirana@email.com',
      product: 'Umrah Eksklusif Syawal 9 Hari',
      date: '11 Mar 2026',
      amount: 'Rp 88.400.000',
      status: 'Pending',
      statusColor: 'warning',
    },
    {
      id: 'SFR-98438',
      customer: 'Dr. Ridwan Salim',
      email: 'ridwan.salim@klinik.id',
      product: 'Mandapa, a Ritz-Carlton Reserve',
      date: '11 Mar 2026',
      amount: 'Rp 24.600.000',
      status: 'Processing',
      statusColor: 'info',
    },
    {
      id: 'SFR-98437',
      customer: 'Maya Indira',
      email: 'maya.indira@corp.com',
      product: 'Amanjiwo Borobudur Suite',
      date: '10 Mar 2026',
      amount: 'Rp 19.000.000',
      status: 'Cancelled',
      statusColor: 'error',
    },
  ],
};

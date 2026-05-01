import { FcAdvertising, FcComboChart, FcHome, FcParallelTasks, FcSettings } from "react-icons/fc";
import { FcLineChart } from "react-icons/fc";
import { FcFeedIn } from "react-icons/fc";


const rentPayment = "../public/images/rentpayment.png";

export const CardData = [
  {
    imageLink:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1713863386/rentpayment_qo3i0e.png",
    title: "Rent Payments",
    content:
      "Rent payments on NaijaRentVerify offer flexibility—choose monthly, quarterly, or annual options seamlessly. Clear invoices and secure transactions ensure transparency and peace of mind. Receive timely reminders for upcoming payments, keeping you organized effortlessly. No hidden fees—just straightforward, secure rent management. Experience hassle-free payments, managing all transactions conveniently within our platform.",
  },
  {
    imageLink:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1713863387/maintenancereceipts_fdhczc.png",
    title: "Property Photos",
    content:
      "Showcase your property in its best light with high-quality photos on NaijaRentVerify. Post your rental properties with captivating images to attract potential tenants effortlessly.",
  },
  {
    imageLink:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1713863387/tenantrecord_hv6gon.png",
    title: "Maintenance Receipts",
    content:
      "Track and manage maintenance receipts hassle-free with NaijaRentVerify. Organize and store all maintenance-related receipts conveniently within our platform, ensuring easy access and transparent record-keeping for landlords and tenants.",
  },
  {
    imageLink:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1713863388/propertyphotos_ucoo2s.png",
    title: "Tenant Records",
    content:
      "Simplify tenant record-keeping with NaijaRentVerify. Easily manage and access comprehensive tenant records, including contact details, lease agreements, payment history, and screening reports, all in one secure and organized platform.",
  },
];

export const carouselData = [
  {
    image:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1713868624/man-showing-house-icon-couch_1_uy6gsr.png",
    text: "Effortlessly verify your tenant’s background and ensure a secure rental process.",
  },
  {
    image:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1713882551/african-american-man-having-video-call-holding-book_1_1_gxajjr.png",
    text: "Streamline your tenant selection process with our comprehensive screening tools.",
  },
  {
    image:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1713882609/Frame_x5lzjr.png",
    text: "Organise and showcase your properties with essential details for potential tenants.",
  },
  // Add more items as needed
];

export const onboardingOptions = [
  {
    imageLink:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1714472980/mn9p85chmr1up9gszsrj.jpg",
    title: "Marketing",
    description:
      "Effortlessly advertise your rental on multiple platforms, reaching potential tenants without any cost.",
  },
  {
    imageLink:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1714472980/m51bmb5onvp2rhdy97rm.png",
    title: "Application",
    description:
      "Access the information you need to make informed decisions about potential tenants.",
  },
  {
    imageLink:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1714472980/wy4fq24vgn8tgfavcnsd.png",
    title: "Screening",
    description:
      "Request a detailed report covering credit, criminal history, and eviction records.",
  },
  {
    imageLink:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1714472980/gefw7v9qiee9so9usnza.png",
    title: "Rent Collection",
    description:
      "Make rent collection effortless and convenient for all parties involved, ensuring a smooth process.",
  }
];

export const enquiryData = [
  {
    title: "Looking for the perfect tenants to move in",
    description:
      "Advertise your rental and screen potential tenants all for free.",
  },
  {
    title: "Have existing or upcoming tenants to set",
    description:
      "Get started with lease details, collecting rents, maintenance, and more.",
  },
  {
    title: "Just want to explore NaijaRentVerify",
    description: "Get a quick overview before exploring on your own.",
  },
];

export const processData = [
  {
    title: "1. Build your own lease agreement or add current one.",
    description:
      "Watch the lease agreement video to see how customising your own lease works.",
  },
  {
    title: "2. Add your tenants",
    description:
      "Invite them to the tenant portal to view & sign docs, pay rent, request maintenance, send you message, and more.",
  },
  {
    title: "3. Set up rent payments.",
    description:
      "Receipts, reminders, & more - learn about the professional ways to collect rent.",
  },
  {
    title: "4. Efficiently manage the entire rental process",
    description:
      "From tracking renters insurance to amending your lease agreements, systematically manage your tenants.",
  },
];

export const dashboardMetrics = [
  {
    imageLink: <FcAdvertising size={24} />,
    title: "Marketing",
    number: 0,
  },
  {
    imageLink: <FcLineChart  size={24} />,
    title: "Leads",
    number: 0,
  },
  {
    imageLink: <FcFeedIn  size={24} />,
    title: "Applicants",
    number: 0,
  },
];

export const tenantDashboardMetrics = [
  {
    imageLink:
    <FcHome color="#004B95"  size={35} />,
    title: "Apartments",
    number: 1,
    link: '/dashboard/tenant/rented-properties'
  },
  {
    imageLink:
    <FcComboChart color="#004B95"  size={35} />,
    title: "Applications",
    number: 20,
    link: '/dashboard/tenant/properties/applications'
  },
  {
    imageLink:
    <FcParallelTasks color="#004B95"  size={35} />,
    title: "Maintenance",
    number: 20,
    link: '/dashboard/tenant/properties/maintenance'
  },
];

export const dashboardNavLinks = [
  {
    imageLink:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1714472980/mn9p85chmr1up9gszsrj.jpg",
    title: "Manage Marketing",
    number: 0,
  },
  {
    imageLink:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1714472980/m51bmb5onvp2rhdy97rm.png",
    title: "Screen a Tenant",
    number: 0,
  },
  {
    imageLink:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1714472980/wy4fq24vgn8tgfavcnsd.png",
    title: "Invite to Apply",
    number: 0,
  },
  {
    imageLink:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1714472980/mn9p85chmr1up9gszsrj.jpg",
    title: "Get a Lease Agreement",
    number: 0,
  },
  // {
  //   imageLink:
  //     "https://res.cloudinary.com/dzv98o7ds/image/upload/v1714472980/m51bmb5onvp2rhdy97rm.png",
  //   title: "Build a Lease Addendum",
  //   number: 0,
  // },
  {
    imageLink:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1714472980/wy4fq24vgn8tgfavcnsd.png",
    title: "E-Sign a Document",
    number: 0,
  },
  // {
  //   imageLink:
  //     "https://res.cloudinary.com/dzv98o7ds/image/upload/v1714472980/mn9p85chmr1up9gszsrj.jpg",
  //   title: "Get Landlord Forms",
  //   number: 0,
  // },
  {
    imageLink:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1714472980/m51bmb5onvp2rhdy97rm.png",
    title: "Record an Expense",
    number: 0,
  }
];

export const dashboardTenantNavLinks = [
  {
    imageLink:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1714472980/mn9p85chmr1up9gszsrj.jpg",
    title: "Manage Marketing",
    number: 0,
  },
  {
    imageLink:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1714472980/m51bmb5onvp2rhdy97rm.png",
    title: "Screen a Tenant",
    number: 0,
  },
  {
    imageLink:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1714472980/wy4fq24vgn8tgfavcnsd.png",
    title: "Invite to Apply",
    number: 0,
  },
  {
    imageLink:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1714472980/mn9p85chmr1up9gszsrj.jpg",
    title: "Get a Lease Agreement",
    number: 0,
  },
  {
    imageLink:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1714472980/m51bmb5onvp2rhdy97rm.png",
    title: "Build a Lease Addendum",
    number: 0,
  },
  {
    imageLink:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1714472980/wy4fq24vgn8tgfavcnsd.png",
    title: "E-Sign a Document",
    number: 0,
  },
  {
    imageLink:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1714472980/mn9p85chmr1up9gszsrj.jpg",
    title: "Get Landlord Forms",
    number: 0,
  },
  {
    imageLink:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1714472980/m51bmb5onvp2rhdy97rm.png",
    title: "Record an Expense",
    number: 0,
  }
];

export const tenantPropertyMetrics = [
  {
    imageLink:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1714472980/mn9p85chmr1up9gszsrj.jpg",
    title: "Rent Due",
    number: 1,
  },
  {
    imageLink:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1714472980/wy4fq24vgn8tgfavcnsd.png",
    title: "Maintenance Issued",
    number: 0,
  },
];

export const rentMetricsData= [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
]

export const propertyTypeData =[
  { value: "office", label: "Office" },
  { value: "duplex", label: "Duplex" },
  { value: "flat", label: "Flat" },
  { value: "bungalow", label: "Bungalow" },
  { value: "warehouse", label: "Warehouse" },
  { value: "2_bedroom_flat", label: "2-Bedroom Flat" },
  { value: "3_bedroom_flat", label: "3-Bedroom Flat" },
  { value: "2_bedroom_duplex", label: "2-Bedroom Duplex" },
  { value: "3_bedroom_duplex", label: "3-Bedroom Duplex" },
]

export const nigerianStatesAndLGAs = {
  abia: [
    "Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North", 
    "Isiala Ngwa South", "Isuikwuato", "Obingwa", "Ohafia", "Osisioma", "Ugwunagbo", 
    "Ukwa East", "Ukwa West", "Umuahia North", "Umuahia South"
  ],
  adamawa: [
    "Demsa", "Fufore", "Ganye", "Girei", "Guyuk", "Hong", "Jada", "Lamurde", "Madagali", 
    "Maiha", "Mayo Belwa", "Michika", "Mubi North", "Mubi South", "Numan", "Shelleng", 
    "Song", "Toungo", "Yola North", "Yola South"
  ],
  akwaIbom: [
    "Abak", "Eastern Obolo", "Eket", "Esit Eket", "Essien Udim", "Etim Ekpo", "Etinan", 
    "Ibeno", "Ibesikpo Asutan", "Ibiono Ibom", "Ikono", "Ikot Abasi", "Ikot Ekpene", "Ini", 
    "Itu", "Mbo", "Mkpat Enin", "Nsit Atai", "Nsit Ibom", "Nsit Ubium", "Obot Akara", "Okobo", 
    "Onna", "Oron", "Oruk Anam", "Uruan", "Uyo"
  ],
  anambra: [
    "Aguata", "Akwa", "Anambra East", "Anambra West", "Anaocha", "Dunukofia", "Ekwusigo", 
    "Idemili North", "Idemili South", "Ihiala", "Njikoka", "Nnewi North", "Nnewi South", 
    "Ogbaru", "Onitsha North", "Onitsha South", "Oyi"
  ],
  bauchi: [
    "Alkaleri", "Bauchi", "Bogoro", "Damban", "Darazo", "Dass", "Gamawa", "Ganjuwa", "Giade", 
    "Itas/Gadau", "Jama'are", "Katagum", "Kirfi", "Misau", "Ningi", "Shira", "Tafawa Balewa", 
    "Toro", "Zaki"
  ],
  bayelsa: [
    "Brass", "Ekeremor", "Kolokuma/Opokuma", "Nembe", "Ogbia", "Sagbama", "Southern Ijaw", 
    "Yenagoa"
  ],
  benue: [
    "Ado", "Agatu", "Apa", "Buruku", "Gboko", "Guma", "Gwer East", "Gwer West", "Katsina-Ala", 
    "Konshisha", "Kwande", "Logo", "Makurdi", "Nasarawa", "Obi", "Ogbadibo", "Ohimini", "Oju", 
    "Okpokwu", "Oturkpo", "Tarka", "Ushongo"
  ],
  borno: [
    "Abadam", "Askira/Uba", "Bama", "Bayo", "Biu", "Chibok", "Damboa", "Dikwa", "Gubio", 
    "Guzamala", "Hawul", "Jere", "Kaga", "Kala/Balge", "Konduga", "Kukawa", "Mafa", "Magumeri", 
    "Maiduguri", "Monguno", "Ngala", "Nganzai", "Shani"
  ],
  crossRiver: [
    "Akpabuyo", "Bakassi", "Bekwarra", "Biase", "Boki", "Calabar Municipal", "Calabar South", 
    "Etung", "Ikom", "Odukpani", "Obanliku", "Obubra", "Ogoja", "Yakuur", "Yala"
  ],
  delta: [
    "Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Ethiope East", "Ethiope West", 
    "Ika North East", "Ika South", "Isoko North", "Isoko South", "Ndokwa East", "Ndokwa West", 
    "Okpe", "Oshimili North", "Oshimili South", "Patani", "Sapele", "Udu", "Ughelli North", 
    "Ughelli South", "Ukwuani", "Uvwie", "Warri North", "Warri South", "Warri South West"
  ],
  ebonyi: [
    "Abakaliki", "Afikpo North", "Afikpo South", "Ishielu", "Ivo", "Izzi", "Ohaozara", "Ohaukwu", 
    "Onicha"
  ],
  edo: [
    "Akoko-Edo", "Esan Central", "Esan North-East", "Esan South-East", "Esan West", "Egor", "Igueben", 
    "Ikpoba-Okha", "Oredo", "Orhionmwon", "Ovia North-East", "Ovia South-West", "Uhunmwonde"
  ],
  ekiti: [
    "Ado Ekiti", "Efon", "Ekiti East", "Ekiti South-West", "Ekiti West", "Emure", 
    "Irepodun/Ifelodun", "Ise/Orun", "Moba", "Oye"
  ],
  enugu: [
    "Aninri", "Awgu", "Enugu East", "Enugu North", "Enugu South", "Ezeagu", "Igbo Etiti", 
    "Igbo Eze North", "Igbo Eze South", "Isi Uzo", "Nkanu East", "Nkanu West", "Nsukka", "Oji River", 
    "Udenu", "Udi", "Uzo Uwani"
  ],
  gombe: [
    "Akko", "Balanga", "Billiri", "Dukku", "Funakaye", "Gombe", "Kaltungo", "Kwami", "Nafada", 
    "Shongom", "Yamaltu/Deba"
  ],
  imo: [
    "Aboh Mbaise", "Ahiazu Mbaise", "Ekiti", "Ezinihitte Mbaise", "Ideato North", "Ideato South", 
    "Ihitte/Uboma", "Isiala Mbano", "Isu", "Mbaitoli", "Ngor Okpala", "Njaba", "Nkwerre", "Nwangele", 
    "Ohaji/Egbema", "Orlu", "Orsu", "Oru East", "Oru West", "Owerri Municipal", "Owerri North", 
    "Owerri West", "Unuimo"
  ],
  jigawa: [
    "Auyo", "Babura", "Birnin Kudu", "Birnin Waje", "Dutse", "Guri", "Gwaram", "Gwiwa", "Hadejia", 
    "Jahun", "Kafin Hausa", "Kaugama", "Kazaure", "Kiri Kasama", "Maigatari", "Miga", "Ringim", 
    "Roni", "Sule Tankarkar", "Taura", "Yankwashi"
  ],
  kaduna: [
    "Birnin Gwari", "Chikun", "Giwa", "Igabi", "Ikara", "Jaba", "Jema'a", "Kachia", "Kaduna North", 
    "Kaduna South", "Kagarko", "Kajuru", "Lere", "Makarfi", "Sabon Gari", "Sanga", "Soba", "Zaria"
  ],
  kano: [
    "Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Dambatta", "Dawakin Kudu", 
    "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garun Mallam", "Gwale", "Kabo", 
    "Kano Municipal", "Karaye", "Kibiya", "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", 
    "Minjibir", "Nasarawa", "Rano", "Rimin Gado", "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa", 
    "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil"
  ],
  katsina: [
    "Batagarawa", "Batsari", "Baure", "Dutsi", "Dutsinma", "Funtua", "Ingawa", "Jibia", "Kaita", 
    "Kankara", "Katsina", "Kurfi", "Mai'adua", "Malumfashi", "Mani", "Mashi", "Matazu", "Musawa", 
    "Rimi", "Sabuwa", "Safana", "Zango"
  ],
  kebbi: [
    "Aleiro", "Arewa", "Bagudo", "Birnin Kebbi", "Bunza", "Dandi", "Gwandu", "Jega", "Kalgo", "Koko/Besse", 
    "Maiyama", "Ngaski", "Sakaba", "Shanga", "Suru", "Wasagu/Danko", "Yauri", "Zuru"
  ],
  kogi: [
    "Adavi", "Ajaokuta", "Ankpa", "Bassa", "Dekina", "Ibaji", "Idah", "Igalamela/Odolu", "Ijumu", "Kabba/Bunu", 
    "Kogi", "Mopa-Muro", "Ofu", "Okehi", "Okene", "Olamaboro", "Omala", "Yagba East", "Yagba West"
  ],
  kwara: [
    "Asa", "Baruten", "Ekiti", "Ifelodun", "Ilorin East", "Ilorin South", "Ilorin West", "Irepodun", 
    "Isin", "Kaiama", "Moro", "Offa", "Oke-Ero", "Oyun", "Patigi"
  ],
  lagos: [
    "Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", "Epe", "Ibeju-Lekki", 
    "Ifako-Ijaiye", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", 
    "Shomolu", "Surulere"
  ],
  nasarawa: [
    "Akwanga", "Alushi", "Doma", "Karu", "Keana", "Keffi", "Kokona", "Lafia", "Nasarawa", "Nasarawa Eggon", 
    "Obi", "Toto", "Wamba"
  ],
  niger: [
    "Agaie", "Agwara", "Bida", "Borgu", "Chanchaga", "Edati", "Gbako", "Gbagyi", "Gurara", "Katcha", 
    "Kontagora", "Lapai", "Lavun", "Mariga", "Mashegu", "Mokwa", "Rafi", "Rijau", "Shiroro", "Suleja", 
    "Tafa", "Wushishi"
  ],
  ogun: [
    "Abeokuta North", "Abeokuta South", "Ado-Odo/Ota", "Ewekoro", "Ifo", "Ijebu East", "Ijebu North", 
    "Ijebu North East", "Ijebu Ode", "Ikenne", "Imeko-Afon", "Ipokia", "Obafemi-Owode", "Ogun Waterside", 
    "Odeda", "Odogbolu", "Ogun East", "Ogun Central", "Yewa North", "Yewa South"
  ],
  ondo: [
    "Akoko North-East", "Akoko North-West", "Akoko South-East", "Akoko South-West", "Akure North", "Akure South", 
    "Ese-Odo", "Idanre", "Ifedore", "Ile-Oluji/Okeigbo", "Irele", "Odigbo", "Okitipupa", "Ondo East", 
    "Ondo West", "Ose", "Owo"
  ],
  osun: [
    "Aiyedade", "Aiyedire", "Atakumosa West", "Atakumosa East", "Boluwaduro", "Boripe", "Ejigbo", "Ifedayo", 
    "Ifelodun", "Ife Central", "Ife East", "Ife North", "Ife South", "Ilesa East", "Ilesa West", "Irepodun", 
    "Isokan", "Iwo", "Obokun", "Odo Otin", "Ola Oluwa", "Olorunda", "Oriade", "Orolu", "Osogbo"
  ],
  oyo: [
    "Akinyele", "Atiba", "Atigun", "Egbeda", "Ibadan North", "Ibadan North East", "Ibadan North West", 
    "Ibadan South East", "Ibadan South West", "Ibarapa Central", "Ibarapa East", "Ibarapa North", 
    "Ido", "Iseyin", "Itesiwaju", "Kajola", "Lagelu", "Ogo Oluwa", "Olorunsogo", "Oluyole", "Ona Ara", 
    "Oorelope", "Oriire", "Oyo East", "Oyo West", "Saki East", "Saki West", "Surulere"
  ],
  plateau: [
    "Barkin Ladi", "Bassa", "Bokkos", "Jos East", "Jos North", "Jos South", "Kanam", "Kanke", "Langtang North", 
    "Langtang South", "Mangu", "Mikang", "Pankshin", "Qua'an Pan", "Riyom", "Shendam", "Wase"
  ],
  rivers: [
    "Abua/Odual", "Ahoada East", "Ahoada West", "Akuku-Toru", "Andoni", "Asari-Toru", "Bonny", "Degema", 
    "Emohua", "Eleme", "Gokana", "Ikwerre", "Khana", "Obio/Akpor", "Ogba/Egbema/Ndoni", "Ogu/Bolo", 
    "Okrika", "Omuma", "Port Harcourt", "Tai"
  ],
  sokoto: [
    "Binji", "Bodinga", "Dange Shuni", "Gada", "Goronyo", "Gudu", "Gwadabawa", "Illela", "Kebbe", "Kware", 
    "Rabah", "Shagari", "Silame", "Sokoto North", "Sokoto South", "Tambuwal", "Tureta", "Wamako", "Wurno", 
    "Yabo"
  ],
  taraba: [
    "Ardo Kola", "Bali", "Donga", "Gashaka", "Gassol", "Ibi", "Jalingo", "Karim Lamido", "Karin", "Kurmi", 
    "Lau", "Sardauna", "Takum", "Ussa", "Wukari", "Yorro", "Zing"
  ],
  yobe: [
    "Bade", "Bursari", "Damaturu", "Fika", "Fune", "Geidam", "Gujba", "Gulani", "Jakusko", "Karasuwa", 
    "Nangere", "Nguru", "Potiskum", "Tarmuwa", "Yunusari", "Yobe East", "Yobe South"
  ],
  zamfara: [
    "Anka", "Bakura", "Birnin Magaji", "Bukkuyum", "Chafe", "Gummi", "Gusau", "Isa", "Kaura Namoda", 
    "Maradun", "Shinkafi", "Talata Mafara", "Zurmi"
  ],
  fct: [
    "Abaji", "Bwari", "Gwagwalada", "Kuje", "Municipal", "Nyanya", "Suleja"
  ]
};

export const nigerianStates = [
  { label: "Abia", value: "Abia" },
  { label: "Adamawa", value: "Adamawa" },
  { label: "Akwa Ibom", value: "Akwa Ibom" },
  { label: "Anambra", value: "Anambra" },
  { label: "Bauchi", value: "Bauchi" },
  { label: "Bayelsa", value: "Bayelsa" },
  { label: "Benue", value: "Benue" },
  { label: "Borno", value: "Borno" },
  { label: "Cross River", value: "Cross River" },
  { label: "Delta", value: "Delta" },
  { label: "Ebonyi", value: "Ebonyi" },
  { label: "Edo", value: "Edo" },
  { label: "Ekiti", value: "Ekiti" },
  { label: "Enugu", value: "Enugu" },
  { label: "Gombe", value: "Gombe" },
  { label: "Imo", value: "Imo" },
  { label: "Jigawa", value: "Jigawa" },
  { label: "Kaduna", value: "Kaduna" },
  { label: "Kano", value: "Kano" },
  { label: "Katsina", value: "Katsina" },
  { label: "Kebbi", value: "Kebbi" },
  { label: "Kogi", value: "Kogi" },
  { label: "Kwara", value: "Kwara" },
  { label: "Lagos", value: "Lagos" },
  { label: "Nasarawa", value: "Nasarawa" },
  { label: "Niger", value: "Niger" },
  { label: "Ogun", value: "Ogun" },
  { label: "Ondo", value: "Ondo" },
  { label: "Osun", value: "Osun" },
  { label: "Oyo", value: "Oyo" },
  { label: "Plateau", value: "Plateau" },
  { label: "Rivers", value: "Rivers" },
  { label: "Sokoto", value: "Sokoto" },
  { label: "Taraba", value: "Taraba" },
  { label: "Yobe", value: "Yobe" },
  { label: "Zamfara", value: "Zamfara" },
  { label: "FCT - Abuja", value: "FCT - Abuja" },
];


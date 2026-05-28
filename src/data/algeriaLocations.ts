// Algeria wilayas and communes data
// Source: official administrative data (48 wilayas + communes)

export interface Commune {
  code: string
  nameAr: string
  nameFr: string
}

export interface Wilaya {
  code: string
  number: number
  nameAr: string
  nameFr: string
  communes: Commune[]
}

export const WILAYAS: Wilaya[] = [
  {
    "code": "0101",
    "number": 1,
    "nameAr": "أدرار",
    "nameFr": "ADRAR",
    "communes": [
      {
        "code": "0102",
        "nameAr": "تأماست",
        "nameFr": "TAMEST"
      },
      {
        "code": "0103",
        "nameAr": "شروين",
        "nameFr": "CHAROUINE"
      },
      {
        "code": "0104",
        "nameAr": "رقان",
        "nameFr": "REGGANE"
      },
      {
        "code": "0105",
        "nameAr": "ان زغمير",
        "nameFr": "IN ZGHMIR"
      },
      {
        "code": "0106",
        "nameAr": "تيت",
        "nameFr": "TIT"
      },
      {
        "code": "0107",
        "nameAr": "قصر قدور",
        "nameFr": "KSAR KADDOUR"
      },
      {
        "code": "0108",
        "nameAr": "تسابيت",
        "nameFr": "TSABIT"
      },
      {
        "code": "0109",
        "nameAr": "تيميمون",
        "nameFr": "TIMIMOUN"
      },
      {
        "code": "0110",
        "nameAr": "أولاد السعيد",
        "nameFr": "OULED SAID"
      },
      {
        "code": "0111",
        "nameAr": "زاوية كنتة",
        "nameFr": "ZAOUIET KOUNTA"
      },
      {
        "code": "0112",
        "nameAr": "أولف",
        "nameFr": "AOULEF"
      },
      {
        "code": "0113",
        "nameAr": "تمقتن",
        "nameFr": "TIMOKTEN"
      },
      {
        "code": "0114",
        "nameAr": "تامنطيت",
        "nameFr": "TAMENTIT"
      },
      {
        "code": "0115",
        "nameAr": "فنوغيل",
        "nameFr": "FENOUGHIL"
      },
      {
        "code": "0116",
        "nameAr": "تنيركوك",
        "nameFr": "TINERKOUK"
      },
      {
        "code": "0117",
        "nameAr": "دلدول",
        "nameFr": "DELDOUL"
      },
      {
        "code": "0118",
        "nameAr": "سالى",
        "nameFr": "SALI"
      },
      {
        "code": "0119",
        "nameAr": "أقبلى",
        "nameFr": "AKABLI"
      },
      {
        "code": "0120",
        "nameAr": "الطارفة",
        "nameFr": "METARFA"
      },
      {
        "code": "0121",
        "nameAr": "أولاد أحمد تيمى",
        "nameFr": "OULED AHMED TIMMI"
      },
      {
        "code": "0122",
        "nameAr": "بودة",
        "nameFr": "BOUDA"
      },
      {
        "code": "0123",
        "nameAr": "أوقرت",
        "nameFr": "AOUGROUT"
      },
      {
        "code": "0124",
        "nameAr": "طالمين",
        "nameFr": "TALMINE"
      },
      {
        "code": "0125",
        "nameAr": "برج باجى مختار",
        "nameFr": "BORDJ BADJI MOKHTAR"
      },
      {
        "code": "0126",
        "nameAr": "السبع",
        "nameFr": "SBAA"
      },
      {
        "code": "0127",
        "nameAr": "أولاد عيسى",
        "nameFr": "OULED AISSA"
      },
      {
        "code": "0128",
        "nameAr": "تيمياوين",
        "nameFr": "TIMIAOUINE"
      }
    ]
  },
  {
    "code": "0201",
    "number": 2,
    "nameAr": "الشلف",
    "nameFr": "CHLEF",
    "communes": [
      {
        "code": "0202",
        "nameAr": "تنس",
        "nameFr": "TENES"
      },
      {
        "code": "0203",
        "nameAr": "بنايرية",
        "nameFr": "BENAIRIA"
      },
      {
        "code": "0204",
        "nameAr": "الكريمية",
        "nameFr": "EL KARIMIA"
      },
      {
        "code": "0205",
        "nameAr": "تأجنة",
        "nameFr": "TADJNA"
      },
      {
        "code": "0206",
        "nameAr": "تاوقريت",
        "nameFr": "TAOUGRIT"
      },
      {
        "code": "0207",
        "nameAr": "بنى حواء",
        "nameFr": "BENI HAOUA"
      },
      {
        "code": "0208",
        "nameAr": "صبحة",
        "nameFr": "SOBHA"
      },
      {
        "code": "0209",
        "nameAr": "حرشون",
        "nameFr": "HARCHOUN"
      },
      {
        "code": "0210",
        "nameAr": "أولاد فارس",
        "nameFr": "OULED FARES"
      },
      {
        "code": "0211",
        "nameAr": "سيدى عكاشة",
        "nameFr": "SIDI AKKACHA"
      },
      {
        "code": "0212",
        "nameAr": "بوقادير",
        "nameFr": "BOUKADIR"
      },
      {
        "code": "0213",
        "nameAr": "بنى راشد",
        "nameFr": "BENI RACHED"
      },
      {
        "code": "0214",
        "nameAr": "تلعصة",
        "nameFr": "TALASSA"
      },
      {
        "code": "0215",
        "nameAr": "الھرنفة",
        "nameFr": "HARENFA"
      },
      {
        "code": "0216",
        "nameAr": "وادى قوسين",
        "nameFr": "OUED GOUSINE"
      },
      {
        "code": "0217",
        "nameAr": "الظھرة",
        "nameFr": "DAHRA"
      },
      {
        "code": "0218",
        "nameAr": "أولاد عباس",
        "nameFr": "OULED ABBES"
      },
      {
        "code": "0219",
        "nameAr": "السنجاس",
        "nameFr": "SENDJAS"
      },
      {
        "code": "0220",
        "nameAr": "الزبوجة",
        "nameFr": "ZEBOUDJA"
      },
      {
        "code": "0221",
        "nameAr": "وادى سلى",
        "nameFr": "OUED SLY"
      },
      {
        "code": "0222",
        "nameAr": "أبو الحسن",
        "nameFr": "ABOU EL HASSEN"
      },
      {
        "code": "0223",
        "nameAr": "المرسى",
        "nameFr": "EL MARSA"
      },
      {
        "code": "0224",
        "nameAr": "الشطية",
        "nameFr": "CHETTIA"
      },
      {
        "code": "0225",
        "nameAr": "سيدي عبد الرحمان",
        "nameFr": "SIDI ABDERRAHMANE"
      },
      {
        "code": "0226",
        "nameAr": "مصدق",
        "nameFr": "MOUSSADEK"
      },
      {
        "code": "0227",
        "nameAr": "الحجاج",
        "nameFr": "EL HADJADJ"
      },
      {
        "code": "0228",
        "nameAr": "لأبيض مجاجة",
        "nameFr": "LABIOD MEDJADJA"
      },
      {
        "code": "0229",
        "nameAr": "وادى الفضة",
        "nameFr": "OUED FODDA"
      },
      {
        "code": "0230",
        "nameAr": "أولاد بن عبد القادر",
        "nameFr": "OULED BEN.AEK"
      },
      {
        "code": "0231",
        "nameAr": "بوزغاية",
        "nameFr": "BOUZGHAIA"
      },
      {
        "code": "0232",
        "nameAr": "عين مران",
        "nameFr": "AIN MERANE"
      },
      {
        "code": "0233",
        "nameAr": "أم الذروع",
        "nameFr": "OUM DROU"
      },
      {
        "code": "0234",
        "nameAr": "بريرة",
        "nameFr": "BREIRA"
      },
      {
        "code": "0235",
        "nameAr": "بنى بوعتاب",
        "nameFr": "BENI BOUATEB"
      }
    ]
  },
  {
    "code": "0301",
    "number": 3,
    "nameAr": "الأغواط",
    "nameFr": "LAGHOUAT",
    "communes": [
      {
        "code": "0302",
        "nameAr": "قصر الحيران",
        "nameFr": "KSAR.HIRANE"
      },
      {
        "code": "0303",
        "nameAr": "بن ناصر بن شھرة",
        "nameFr": "MEKHAREG"
      },
      {
        "code": "0304",
        "nameAr": "سيدي مخلوف",
        "nameFr": "SIDI MAKHLOUF"
      },
      {
        "code": "0305",
        "nameAr": "حاسى دالع",
        "nameFr": "HASSI DALAA"
      },
      {
        "code": "0306",
        "nameAr": "حاسى الرمل",
        "nameFr": "HASSI RMEL"
      },
      {
        "code": "0307",
        "nameAr": "عين ماضي",
        "nameFr": "AIN MAHDI"
      },
      {
        "code": "0308",
        "nameAr": "تاجموت",
        "nameFr": "TADJEMOUNT"
      },
      {
        "code": "0309",
        "nameAr": "الخنق",
        "nameFr": "KHENNEG"
      },
      {
        "code": "0310",
        "nameAr": "قلتة سيدي سعد",
        "nameFr": "GUELTAT SIDI SAAD"
      },
      {
        "code": "0311",
        "nameAr": "عين سيدي على",
        "nameFr": "AIN SIDI ALI"
      },
      {
        "code": "0312",
        "nameAr": "بيضاء",
        "nameFr": "BEIDHA"
      },
      {
        "code": "0313",
        "nameAr": "بريدة",
        "nameFr": "BRIDA"
      },
      {
        "code": "0314",
        "nameAr": "الغيشة",
        "nameFr": "EL GHICHA"
      },
      {
        "code": "0315",
        "nameAr": "حاج مشري",
        "nameFr": "HADJ MECHERI"
      },
      {
        "code": "0316",
        "nameAr": "سبقاق",
        "nameFr": "SEBGAG"
      },
      {
        "code": "0317",
        "nameAr": "تاويالة",
        "nameFr": "TAOUILA"
      },
      {
        "code": "0318",
        "nameAr": "تاجرونة",
        "nameFr": "TAJROUNA"
      },
      {
        "code": "0319",
        "nameAr": "آفلو",
        "nameFr": "AFLOU"
      },
      {
        "code": "0320",
        "nameAr": "العسفية",
        "nameFr": "EL ASSAFIA"
      },
      {
        "code": "0321",
        "nameAr": "واد مرة",
        "nameFr": "OUED MORRA"
      },
      {
        "code": "0322",
        "nameAr": "واد مزي",
        "nameFr": "OUED MZI"
      },
      {
        "code": "0323",
        "nameAr": "الحوايطة",
        "nameFr": "EL HOUITA"
      },
      {
        "code": "0324",
        "nameAr": "سيدي بوزيد",
        "nameFr": "SIDI BOUZID"
      }
    ]
  },
  {
    "code": "0401",
    "number": 4,
    "nameAr": "أم البواقي",
    "nameFr": "OUM BOUAGHI",
    "communes": [
      {
        "code": "0402",
        "nameAr": "عين البيضاء",
        "nameFr": "AIN BEIDA"
      },
      {
        "code": "0403",
        "nameAr": "عين مليلة",
        "nameFr": "AIN MLILA"
      },
      {
        "code": "0404",
        "nameAr": "بحير الشرقي",
        "nameFr": "BEHIR CHERGUI"
      },
      {
        "code": "0405",
        "nameAr": "العامرية",
        "nameFr": "EL AMIRIA"
      },
      {
        "code": "0406",
        "nameAr": "سيقوس",
        "nameFr": "SIGUS"
      },
      {
        "code": "0407",
        "nameAr": "الباللة",
        "nameFr": "EL BELALA"
      },
      {
        "code": "0408",
        "nameAr": "عين ببوش",
        "nameFr": "AIN BABOUCHE"
      },
      {
        "code": "0409",
        "nameAr": "بريش",
        "nameFr": "BERRICHE"
      },
      {
        "code": "0410",
        "nameAr": "أولاد حملة",
        "nameFr": "OULED HAMLA"
      },
      {
        "code": "0411",
        "nameAr": "الضلعة",
        "nameFr": "DHALA"
      },
      {
        "code": "0412",
        "nameAr": "عين كرشة",
        "nameFr": "AIN KERCHA"
      },
      {
        "code": "0413",
        "nameAr": "ھنشير تومغانى",
        "nameFr": "HANCHIR TOUMGHANI"
      },
      {
        "code": "0414",
        "nameAr": "الجازية",
        "nameFr": "EL DJAZIA"
      },
      {
        "code": "0415",
        "nameAr": "عين الديس",
        "nameFr": "AIN DISS"
      },
      {
        "code": "0416",
        "nameAr": "فكيرينة",
        "nameFr": "FKIRINA"
      },
      {
        "code": "0417",
        "nameAr": "سوق نعمان",
        "nameFr": "SOUK NAAMANE"
      },
      {
        "code": "0418",
        "nameAr": "الزرق",
        "nameFr": "ZORG"
      },
      {
        "code": "0419",
        "nameAr": "الفجوج بوغرارة سعودى",
        "nameFr": "EL FEDJOUDJ BOUGHARA SAOUDI"
      },
      {
        "code": "0420",
        "nameAr": "أولاد الزوى",
        "nameFr": "OULED ZOUAI"
      },
      {
        "code": "0421",
        "nameAr": "بئر الشھداء",
        "nameFr": "BIR CHOUAHADA"
      },
      {
        "code": "0422",
        "nameAr": "قصر الصباحى",
        "nameFr": "KSAR SBAHI"
      },
      {
        "code": "0423",
        "nameAr": "وادى نينى",
        "nameFr": "OUED NINI"
      },
      {
        "code": "0424",
        "nameAr": "مسكيانة",
        "nameFr": "MESKIANA"
      },
      {
        "code": "0425",
        "nameAr": "عين الفكرون",
        "nameFr": "AIN FAKROUN"
      },
      {
        "code": "0426",
        "nameAr": "الراحية",
        "nameFr": "RAHIA"
      },
      {
        "code": "0427",
        "nameAr": "عين الزيتون",
        "nameFr": "AIN ZITOUN"
      },
      {
        "code": "0428",
        "nameAr": "أولاد قاسم",
        "nameFr": "OULED GACEM"
      },
      {
        "code": "0429",
        "nameAr": "الحرملية",
        "nameFr": "EL HARMALIA"
      }
    ]
  },
  {
    "code": "0501",
    "number": 5,
    "nameAr": "باتنة",
    "nameFr": "BATNA",
    "communes": [
      {
        "code": "0502",
        "nameAr": "غسيرة",
        "nameFr": "GHASSIRA"
      },
      {
        "code": "0503",
        "nameAr": "معافة",
        "nameFr": "MAAFA"
      },
      {
        "code": "0504",
        "nameAr": "مروانة",
        "nameFr": "MEROUANA"
      },
      {
        "code": "0505",
        "nameAr": "سريانة",
        "nameFr": "SERIANA"
      },
      {
        "code": "0506",
        "nameAr": "منعة",
        "nameFr": "MENAA"
      },
      {
        "code": "0507",
        "nameAr": "المعذر",
        "nameFr": "EL MADHER"
      },
      {
        "code": "0508",
        "nameAr": "تازولت",
        "nameFr": "TAZOULT"
      },
      {
        "code": "0509",
        "nameAr": "نقاوس",
        "nameFr": "NGAOUS"
      },
      {
        "code": "0510",
        "nameAr": "قيقبة",
        "nameFr": "GUIGBA"
      },
      {
        "code": "0511",
        "nameAr": "اينوغيسن",
        "nameFr": "INOUGHISENE"
      },
      {
        "code": "0512",
        "nameAr": "عيون العصافير",
        "nameFr": "OUYOUN ASSAFIR"
      },
      {
        "code": "0513",
        "nameAr": "جرمة",
        "nameFr": "DJERMA"
      },
      {
        "code": "0514",
        "nameAr": "بيطام",
        "nameFr": "BITAM"
      },
      {
        "code": "0515",
        "nameAr": "المتكوك",
        "nameFr": "METKOUAK"
      },
      {
        "code": "0516",
        "nameAr": "أريس",
        "nameFr": "ARRIS"
      },
      {
        "code": "0517",
        "nameAr": "كيمل",
        "nameFr": "KIMMEL"
      },
      {
        "code": "0518",
        "nameAr": "تيالطو",
        "nameFr": "TILATOU"
      },
      {
        "code": "0519",
        "nameAr": "عين جاسر",
        "nameFr": "AIN DJASSER"
      },
      {
        "code": "0520",
        "nameAr": "أولاد سالم",
        "nameFr": "OULED SELAM"
      },
      {
        "code": "0521",
        "nameAr": "تغرغار",
        "nameFr": "TIGHERGHAR"
      },
      {
        "code": "0522",
        "nameAr": "عين ياقوت",
        "nameFr": "AIN YAGOUT"
      },
      {
        "code": "0523",
        "nameAr": "فسديس",
        "nameFr": "FESDIS"
      },
      {
        "code": "0524",
        "nameAr": "سفيان",
        "nameFr": "SEFIANE"
      },
      {
        "code": "0525",
        "nameAr": "الرحبات",
        "nameFr": "RAHBAT"
      },
      {
        "code": "0526",
        "nameAr": "تغانمين",
        "nameFr": "TIGHANIMINE"
      },
      {
        "code": "0527",
        "nameAr": "لمسان",
        "nameFr": "LEMSANE"
      },
      {
        "code": "0528",
        "nameAr": "قصر بالزمة",
        "nameFr": "KSAR BELEZMA"
      },
      {
        "code": "0529",
        "nameAr": "رقانة",
        "nameFr": "SEGGANA"
      },
      {
        "code": "0530",
        "nameAr": "إيشمول",
        "nameFr": "ICHMOUL"
      },
      {
        "code": "0531",
        "nameAr": "فم الطوب",
        "nameFr": "FOUM TOUB"
      },
      {
        "code": "0532",
        "nameAr": "بنى فضالة الحقانية",
        "nameFr": "BENI FOUDHALA EL HAKANIA"
      },
      {
        "code": "0533",
        "nameAr": "وادى الماء",
        "nameFr": "OUED EL MA"
      },
      {
        "code": "0534",
        "nameAr": "تالخمت",
        "nameFr": "TALAKHAMET"
      },
      {
        "code": "0535",
        "nameAr": "بوزينة",
        "nameFr": "BOUZINA"
      },
      {
        "code": "0536",
        "nameAr": "شمرة",
        "nameFr": "CHEMORA"
      },
      {
        "code": "0537",
        "nameAr": "وادى الشعبة",
        "nameFr": "OUED CHAABA"
      },
      {
        "code": "0538",
        "nameAr": "تاكسالنت",
        "nameFr": "TAXLENT"
      },
      {
        "code": "0539",
        "nameAr": "القصبات",
        "nameFr": "GOSBAT"
      },
      {
        "code": "0540",
        "nameAr": "أولاد عوف",
        "nameFr": "OULED AOUF"
      },
      {
        "code": "0541",
        "nameAr": "بومقر",
        "nameFr": "BOUMAGUER"
      },
      {
        "code": "0542",
        "nameAr": "بريكة",
        "nameFr": "BARIKA"
      },
      {
        "code": "0543",
        "nameAr": "الجزار",
        "nameFr": "DJEZZAR"
      },
      {
        "code": "0544",
        "nameAr": "تكوت",
        "nameFr": "TKOUT"
      },
      {
        "code": "0545",
        "nameAr": "عين التوتة",
        "nameFr": "AIN TOUTA"
      },
      {
        "code": "0546",
        "nameAr": "حيدوسة",
        "nameFr": "HIDOUSSA"
      },
      {
        "code": "0547",
        "nameAr": "ثنية العابد",
        "nameFr": "TENIET EL ABED"
      },
      {
        "code": "0548",
        "nameAr": "وادى الطاقة",
        "nameFr": "OUED TAGA"
      },
      {
        "code": "0549",
        "nameAr": "أولاد فاضل",
        "nameFr": "OULED FADHEL"
      },
      {
        "code": "0550",
        "nameAr": "تيمقاد",
        "nameFr": "TIMGAD"
      },
      {
        "code": "0551",
        "nameAr": "رأس العيون",
        "nameFr": "RAS EL AIOUN"
      },
      {
        "code": "0552",
        "nameAr": "شير",
        "nameFr": "CHIR"
      },
      {
        "code": "0553",
        "nameAr": "أولاد سى سليمان",
        "nameFr": "OULED SI SLIMANE"
      },
      {
        "code": "0554",
        "nameAr": "زانةالبيضاء",
        "nameFr": "ZANET BEIDA"
      },
      {
        "code": "0555",
        "nameAr": "أمدوكل",
        "nameFr": "MDOUKAL"
      },
      {
        "code": "0556",
        "nameAr": "أولاد عمار",
        "nameFr": "OULED AMAR"
      },
      {
        "code": "0557",
        "nameAr": "الحاسى",
        "nameFr": "EL HASSI"
      },
      {
        "code": "0558",
        "nameAr": "الزرو",
        "nameFr": "LAZROU"
      },
      {
        "code": "0559",
        "nameAr": "بومية",
        "nameFr": "BOUMIA"
      },
      {
        "code": "0560",
        "nameAr": "بوالحيالت",
        "nameFr": "BOULHILET"
      },
      {
        "code": "0561",
        "nameAr": "لرباع",
        "nameFr": "LARBAA"
      }
    ]
  },
  {
    "code": "0601",
    "number": 6,
    "nameAr": "بجاية",
    "nameFr": "BEJAIA",
    "communes": [
      {
        "code": "0602",
        "nameAr": "أميزور",
        "nameFr": "AMIZOUR"
      },
      {
        "code": "0603",
        "nameAr": "فرعون",
        "nameFr": "FERRAOUN"
      },
      {
        "code": "0604",
        "nameAr": "تأوريرت اغيل",
        "nameFr": "TAOURIRT IGHIL"
      },
      {
        "code": "0605",
        "nameAr": "شالطة",
        "nameFr": "CHELLATA"
      },
      {
        "code": "0606",
        "nameAr": "تامقرة",
        "nameFr": "TAMOKRA"
      },
      {
        "code": "0607",
        "nameAr": "تيمزريت",
        "nameFr": "TIMEZRIT"
      },
      {
        "code": "0608",
        "nameAr": "سوق الأثنين",
        "nameFr": "SOUK EL TENINE"
      },
      {
        "code": "0609",
        "nameAr": "مكيسنة",
        "nameFr": "MCISNA"
      },
      {
        "code": "0610",
        "nameAr": "تينبذار",
        "nameFr": "TINEBDAR"
      },
      {
        "code": "0611",
        "nameAr": "تيشي",
        "nameFr": "TICHY"
      },
      {
        "code": "0612",
        "nameAr": "سمعون",
        "nameFr": "SEMAOUN"
      },
      {
        "code": "0613",
        "nameAr": "قنديرة",
        "nameFr": "KENDIRA"
      },
      {
        "code": "0614",
        "nameAr": "تيفرة",
        "nameFr": "TIFRA"
      },
      {
        "code": "0615",
        "nameAr": "إغرم",
        "nameFr": "IGHREM"
      },
      {
        "code": "0616",
        "nameAr": "أمالو",
        "nameFr": "AMALOU"
      },
      {
        "code": "0617",
        "nameAr": "إغيل على",
        "nameFr": "IGHIL ALI"
      },
      {
        "code": "0618",
        "nameAr": "إفالين الماثن",
        "nameFr": "IFLAIN ILMATEN"
      },
      {
        "code": "0619",
        "nameAr": "توجة",
        "nameFr": "TOUDJA"
      },
      {
        "code": "0620",
        "nameAr": "درقينة",
        "nameFr": "DARGUINA"
      },
      {
        "code": "0621",
        "nameAr": "سيدي عياد",
        "nameFr": "SIDI AYAD"
      },
      {
        "code": "0622",
        "nameAr": "أوقاس",
        "nameFr": "AOKAS"
      },
      {
        "code": "0623",
        "nameAr": "بن جليل",
        "nameFr": "BENI DJELIL"
      },
      {
        "code": "0624",
        "nameAr": "أذكار",
        "nameFr": "ADEKAR"
      },
      {
        "code": "0625",
        "nameAr": "أقبو",
        "nameFr": "AKBOU"
      },
      {
        "code": "0626",
        "nameAr": "صدوق",
        "nameFr": "SEDDOUK"
      },
      {
        "code": "0627",
        "nameAr": "تازمالت",
        "nameFr": "TAZMALT"
      },
      {
        "code": "0628",
        "nameAr": "آيت رزين",
        "nameFr": "AIT RIZINE"
      },
      {
        "code": "0629",
        "nameAr": "شميني",
        "nameFr": "CHEMINI"
      },
      {
        "code": "0630",
        "nameAr": "السوق أوفال",
        "nameFr": "SOUK OUFELLA"
      },
      {
        "code": "0631",
        "nameAr": "تاسقريوت",
        "nameFr": "TASKRIOUT"
      },
      {
        "code": "0632",
        "nameAr": "طيبان",
        "nameFr": "TIBANE"
      },
      {
        "code": "0633",
        "nameAr": "ثالة حمزة",
        "nameFr": "TALA HAMZA"
      },
      {
        "code": "0634",
        "nameAr": "برباشة",
        "nameFr": "BARBACHA"
      },
      {
        "code": "0635",
        "nameAr": "نى قسيلة",
        "nameFr": "BENI KSILA"
      },
      {
        "code": "0636",
        "nameAr": "أوزالقن",
        "nameFr": "OUZELAGUEN"
      },
      {
        "code": "0637",
        "nameAr": "بوحمزة",
        "nameFr": "BOUHAMZA"
      },
      {
        "code": "0638",
        "nameAr": "بنى مليكش",
        "nameFr": "BENI MELIKECHE"
      },
      {
        "code": "0639",
        "nameAr": "سيدي عيش",
        "nameFr": "SIDI AICH"
      },
      {
        "code": "0640",
        "nameAr": "القصر",
        "nameFr": "EL KSEUR"
      },
      {
        "code": "0641",
        "nameAr": "ملبو",
        "nameFr": "MELBOU"
      },
      {
        "code": "0642",
        "nameAr": "أكفادو",
        "nameFr": "AKFADOU"
      },
      {
        "code": "0643",
        "nameAr": "لفالى",
        "nameFr": "LEFLAYE"
      },
      {
        "code": "0644",
        "nameAr": "خراطة",
        "nameFr": "KHERRATA"
      },
      {
        "code": "0645",
        "nameAr": "ذراع القايد",
        "nameFr": "DRAA EL KAID"
      },
      {
        "code": "0646",
        "nameAr": "تامريجت",
        "nameFr": "TAMRIDJET"
      },
      {
        "code": "0647",
        "nameAr": "آيت اسماعيل",
        "nameFr": "AIT SMAIL"
      },
      {
        "code": "0648",
        "nameAr": "بوخليفة",
        "nameFr": "BOUKHELIFA"
      },
      {
        "code": "0649",
        "nameAr": "تيزى نبربر",
        "nameFr": "TIZI NBERBER"
      },
      {
        "code": "0650",
        "nameAr": "بنى معوش",
        "nameFr": "BENI MAOUCHE"
      },
      {
        "code": "0651",
        "nameAr": "وادى غير",
        "nameFr": "OUED GHIR"
      },
      {
        "code": "0652",
        "nameAr": "بوجليل",
        "nameFr": "BOUDJELLIL"
      }
    ]
  },
  {
    "code": "0701",
    "number": 7,
    "nameAr": "بسكرة",
    "nameFr": "BISKRA",
    "communes": [
      {
        "code": "0702",
        "nameAr": "أوماس",
        "nameFr": "OUMACHE"
      },
      {
        "code": "0703",
        "nameAr": "البرانس",
        "nameFr": "BRANIS"
      },
      {
        "code": "0704",
        "nameAr": "شتمة",
        "nameFr": "CHETMA"
      },
      {
        "code": "0705",
        "nameAr": "أولاد جالل",
        "nameFr": "OULED DJELLAL"
      },
      {
        "code": "0706",
        "nameAr": "راس الميعاد",
        "nameFr": "RAS EL MIAD"
      },
      {
        "code": "0707",
        "nameAr": "بسبس",
        "nameFr": "BESBES"
      },
      {
        "code": "0708",
        "nameAr": "سيدي خالد",
        "nameFr": "SIDI KHALED"
      },
      {
        "code": "0709",
        "nameAr": "الدوسن",
        "nameFr": "DOUCEN"
      },
      {
        "code": "0710",
        "nameAr": "الشعيبة",
        "nameFr": "ECH CHAIBA"
      },
      {
        "code": "0711",
        "nameAr": "سيدي عقبة",
        "nameFr": "SIDI OKBA"
      },
      {
        "code": "0712",
        "nameAr": "مشونش",
        "nameFr": "MCHOUNECHE"
      },
      {
        "code": "0713",
        "nameAr": "الحوش",
        "nameFr": "EL HAOUCHE"
      },
      {
        "code": "0714",
        "nameAr": "عين الناقة",
        "nameFr": "AIN NAGA"
      },
      {
        "code": "0715",
        "nameAr": "زربية الوادى",
        "nameFr": "ZERIBET EL OUED"
      },
      {
        "code": "0716",
        "nameAr": "الفيض",
        "nameFr": "EL FEIDH"
      },
      {
        "code": "0717",
        "nameAr": "القنطرة",
        "nameFr": "EL KANTARA"
      },
      {
        "code": "0718",
        "nameAr": "عين زعطوط",
        "nameFr": "AIN ZAATOUT"
      },
      {
        "code": "0719",
        "nameAr": "الوطاية",
        "nameFr": "EL OUTAYA"
      },
      {
        "code": "0720",
        "nameAr": "جمورة",
        "nameFr": "DJEMORAH"
      },
      {
        "code": "0721",
        "nameAr": "طولقة",
        "nameFr": "TOLGA"
      },
      {
        "code": "0722",
        "nameAr": "لواء",
        "nameFr": "LIOUA"
      },
      {
        "code": "0723",
        "nameAr": "لشانة",
        "nameFr": "LICHANA"
      },
      {
        "code": "0724",
        "nameAr": "أورالل",
        "nameFr": "OURLAL"
      },
      {
        "code": "0725",
        "nameAr": "مليلى",
        "nameFr": "MLILI"
      },
      {
        "code": "0726",
        "nameAr": "فوغالة",
        "nameFr": "FOUGHALA"
      },
      {
        "code": "0727",
        "nameAr": "برج بن عزوز",
        "nameFr": "BORDJ BENAZZOUZ"
      },
      {
        "code": "0728",
        "nameAr": "المزيرعة",
        "nameFr": "MEZIRAA"
      },
      {
        "code": "0729",
        "nameAr": "بوشقرون",
        "nameFr": "BOUCHAGROUN"
      },
      {
        "code": "0730",
        "nameAr": "مخادمة",
        "nameFr": "MEKHADMA"
      },
      {
        "code": "0731",
        "nameAr": "الغروس",
        "nameFr": "EL GHROUS"
      },
      {
        "code": "0732",
        "nameAr": "الحاجب",
        "nameFr": "EL HADJAB"
      },
      {
        "code": "0733",
        "nameAr": "خنقة سيدي ناجى",
        "nameFr": "KHENGHET SIDI NAJI"
      }
    ]
  },
  {
    "code": "0801",
    "number": 8,
    "nameAr": "بشار",
    "nameFr": "BECHAR",
    "communes": [
      {
        "code": "0802",
        "nameAr": "عرق فراج",
        "nameFr": "ERG FERRADJ"
      },
      {
        "code": "0803",
        "nameAr": "أولاد خدير",
        "nameFr": "OULED KHOUDIR"
      },
      {
        "code": "0804",
        "nameAr": "مريجة",
        "nameFr": "MERIDJA"
      },
      {
        "code": "0805",
        "nameAr": "تيمودى",
        "nameFr": "TIMOUDI"
      },
      {
        "code": "0806",
        "nameAr": "الأحمر",
        "nameFr": "LAHMAR"
      },
      {
        "code": "0807",
        "nameAr": "بنى عباس",
        "nameFr": "BENI ABBES"
      },
      {
        "code": "0808",
        "nameAr": "بنى يخلف",
        "nameFr": "BENI IKHLEF"
      },
      {
        "code": "0809",
        "nameAr": "مشرع ھوارى بومدين",
        "nameFr": "MECHRAA H. BOUMEDIENE"
      },
      {
        "code": "0810",
        "nameAr": "قنادسة",
        "nameFr": "KENADSA"
      },
      {
        "code": "0811",
        "nameAr": "ايقلى",
        "nameFr": "IGLI"
      },
      {
        "code": "0812",
        "nameAr": "تبلبلة",
        "nameFr": "TABALBALA"
      },
      {
        "code": "0813",
        "nameAr": "تاغيت",
        "nameFr": "TAGHIT"
      },
      {
        "code": "0814",
        "nameAr": "الوطاء",
        "nameFr": "EL OUATA"
      },
      {
        "code": "0815",
        "nameAr": "بوقا يس",
        "nameFr": "BOUKAIS"
      },
      {
        "code": "0816",
        "nameAr": "موغل",
        "nameFr": "MOGHUEUL"
      },
      {
        "code": "0817",
        "nameAr": "العبادلة",
        "nameFr": "ABADLA"
      },
      {
        "code": "0818",
        "nameAr": "كرزاز",
        "nameFr": "KERZAZ"
      },
      {
        "code": "0819",
        "nameAr": "قصابى",
        "nameFr": "KSABI"
      },
      {
        "code": "0820",
        "nameAr": "تامترت",
        "nameFr": "TAMERT"
      },
      {
        "code": "0821",
        "nameAr": "بنى و نيف",
        "nameFr": "BENI OUNIF"
      }
    ]
  },
  {
    "code": "0901",
    "number": 9,
    "nameAr": "البليدة",
    "nameFr": "BLIDA",
    "communes": [
      {
        "code": "0902",
        "nameAr": "الشبلي",
        "nameFr": "CHEBLI"
      },
      {
        "code": "0903",
        "nameAr": "بوعينان",
        "nameFr": "BOUINAN"
      },
      {
        "code": "0904",
        "nameAr": "وادى العاليق",
        "nameFr": "OUED ALLEUG"
      },
      {
        "code": "0907",
        "nameAr": "اوالد يعيش",
        "nameFr": "OULED YAICH"
      },
      {
        "code": "0908",
        "nameAr": "الشريعة",
        "nameFr": "CHREA"
      },
      {
        "code": "0910",
        "nameAr": "العفرون",
        "nameFr": "EL AFFROUN"
      },
      {
        "code": "0911",
        "nameAr": "الشفة",
        "nameFr": "CHIFFA"
      },
      {
        "code": "0912",
        "nameAr": "حمام ملوان",
        "nameFr": "HAMMAM MELOUANE"
      },
      {
        "code": "0913",
        "nameAr": "بني خليل",
        "nameFr": "BENKHELIL"
      },
      {
        "code": "0914",
        "nameAr": "صومعة",
        "nameFr": "SOUMAA"
      },
      {
        "code": "0916",
        "nameAr": "موزاية",
        "nameFr": "MOUZAIA"
      },
      {
        "code": "0917",
        "nameAr": "صوحان",
        "nameFr": "SOUHANE"
      },
      {
        "code": "0918",
        "nameAr": "مفتاح",
        "nameFr": "MEFTAH"
      },
      {
        "code": "0919",
        "nameAr": "أولاد سالمة",
        "nameFr": "OULED SLAMA"
      },
      {
        "code": "0920",
        "nameAr": "بوفاريك",
        "nameFr": "BOUFARIK"
      },
      {
        "code": "0921",
        "nameAr": "الأربعاء",
        "nameFr": "LARBAA"
      },
      {
        "code": "0922",
        "nameAr": "وادى جر",
        "nameFr": "OUED DJER"
      },
      {
        "code": "0923",
        "nameAr": "بني تامو",
        "nameFr": "BENI TAMOU"
      },
      {
        "code": "0924",
        "nameAr": "بوعرفة",
        "nameFr": "BOUARFA"
      },
      {
        "code": "0925",
        "nameAr": "بني مراد",
        "nameFr": "BENI MERED"
      },
      {
        "code": "0926",
        "nameAr": "بوقارة",
        "nameFr": "BOUGARA"
      },
      {
        "code": "0927",
        "nameAr": "قرواو",
        "nameFr": "GUEROUAOU"
      },
      {
        "code": "0928",
        "nameAr": "عين الرمانة",
        "nameFr": "AIN ROMANA"
      },
      {
        "code": "0929",
        "nameAr": "جبابرة",
        "nameFr": "DJEBABRA"
      }
    ]
  },
  {
    "code": "1001",
    "number": 10,
    "nameAr": "البويرة",
    "nameFr": "BOUIRA",
    "communes": [
      {
        "code": "1002",
        "nameAr": "الأصنام",
        "nameFr": "EL ASNAM"
      },
      {
        "code": "1003",
        "nameAr": "قرومة",
        "nameFr": "GUERROUMA"
      },
      {
        "code": "1004",
        "nameAr": "سوق الخميس",
        "nameFr": "SOUK EL KHEMIS"
      },
      {
        "code": "1005",
        "nameAr": "القادرية",
        "nameFr": "KADIRIA"
      },
      {
        "code": "1006",
        "nameAr": "الحانيف",
        "nameFr": "HANIF"
      },
      {
        "code": "1007",
        "nameAr": "ديرة",
        "nameFr": "DIRAH"
      },
      {
        "code": "1008",
        "nameAr": "آيت لعزيز",
        "nameFr": "AIT LAAZIZ"
      },
      {
        "code": "1009",
        "nameAr": "تاغزوت",
        "nameFr": "TAGHZOUT"
      },
      {
        "code": "1010",
        "nameAr": "راوراوة",
        "nameFr": "RAOURAOUA"
      },
      {
        "code": "1011",
        "nameAr": "مزدور",
        "nameFr": "MEZDOUR"
      },
      {
        "code": "1012",
        "nameAr": "الحيزر",
        "nameFr": "HAIZER"
      },
      {
        "code": "1013",
        "nameAr": "الأخضرية",
        "nameFr": "LAKHDARIA"
      },
      {
        "code": "1014",
        "nameAr": "المعلمة",
        "nameFr": "MAALA"
      },
      {
        "code": "1015",
        "nameAr": "الھاشمية",
        "nameFr": "EL HACHIMIA"
      },
      {
        "code": "1016",
        "nameAr": "أوعمر",
        "nameFr": "AOMAR"
      },
      {
        "code": "1017",
        "nameAr": "الشرفاء",
        "nameFr": "CHORFA"
      },
      {
        "code": "1018",
        "nameAr": "برج أوخريص",
        "nameFr": "BORDJ OUKHRISS"
      },
      {
        "code": "1019",
        "nameAr": "العجيبة",
        "nameFr": "EL ADJIBA"
      },
      {
        "code": "1020",
        "nameAr": "الحاكمية",
        "nameFr": "EL HAKIMIA"
      },
      {
        "code": "1021",
        "nameAr": "الخبوزية",
        "nameFr": "EL KHABOUZIA"
      },
      {
        "code": "1022",
        "nameAr": "أھل القصر",
        "nameFr": "AHL EL KSAR"
      },
      {
        "code": "1023",
        "nameAr": "بودربالة",
        "nameFr": "BOUDERBALA"
      },
      {
        "code": "1024",
        "nameAr": "زبربر",
        "nameFr": "ZBARBAR"
      },
      {
        "code": "1025",
        "nameAr": "عين الحجار",
        "nameFr": "AIN EL HADJAR"
      },
      {
        "code": "1026",
        "nameAr": "جباحية",
        "nameFr": "DJEBAHIA"
      },
      {
        "code": "1027",
        "nameAr": "أغبالو",
        "nameFr": "AGHBALOU"
      },
      {
        "code": "1028",
        "nameAr": "تاقديت",
        "nameFr": "TAGUEDIT"
      },
      {
        "code": "1029",
        "nameAr": "عين الترك",
        "nameFr": "AIN TURK"
      },
      {
        "code": "1030",
        "nameAr": "الصھاريج",
        "nameFr": "SAHARIDJ"
      },
      {
        "code": "1031",
        "nameAr": "الدشمية",
        "nameFr": "DECHMIA"
      },
      {
        "code": "1032",
        "nameAr": "ريدان",
        "nameFr": "RIDANE"
      },
      {
        "code": "1033",
        "nameAr": "بشلول",
        "nameFr": "BECHLOUL"
      },
      {
        "code": "1034",
        "nameAr": "بوكروم",
        "nameFr": "BOUKRAM"
      },
      {
        "code": "1035",
        "nameAr": "عين بسام",
        "nameFr": "AIN BESSAM"
      },
      {
        "code": "1036",
        "nameAr": "بئر غبالو",
        "nameFr": "BIR GHBALOU"
      },
      {
        "code": "1037",
        "nameAr": "مشدا الله",
        "nameFr": "MCHEDELLAH"
      },
      {
        "code": "1038",
        "nameAr": "صور الغزلان",
        "nameFr": "SOUR GHOZLANE"
      },
      {
        "code": "1039",
        "nameAr": "المعمورة",
        "nameFr": "MAAMORA"
      },
      {
        "code": "1040",
        "nameAr": "أولاد راشد",
        "nameFr": "OULED RACHED"
      },
      {
        "code": "1041",
        "nameAr": "عين العلوى",
        "nameFr": "AIN LALOUI"
      },
      {
        "code": "1042",
        "nameAr": "الحجرة الزرقاء",
        "nameFr": "HADJERA ZERGA"
      },
      {
        "code": "1043",
        "nameAr": "آث منصور",
        "nameFr": "TAOURIRT"
      },
      {
        "code": "1044",
        "nameAr": "المقراني",
        "nameFr": "EL MOKRANI"
      },
      {
        "code": "1045",
        "nameAr": "وادى البردي",
        "nameFr": "OUED EL BERDI"
      }
    ]
  },
  {
    "code": "1101",
    "number": 11,
    "nameAr": "تمنراست",
    "nameFr": "TAMANRASSET",
    "communes": [
      {
        "code": "1102",
        "nameAr": "أباليسا",
        "nameFr": "ABALESSA"
      },
      {
        "code": "1103",
        "nameAr": "ان غار",
        "nameFr": "IN GHAR"
      },
      {
        "code": "1104",
        "nameAr": "أن قزام",
        "nameFr": "IN GUEZZAM"
      },
      {
        "code": "1105",
        "nameAr": "أدلس",
        "nameFr": "IDLES"
      },
      {
        "code": "1106",
        "nameAr": "تازروق",
        "nameFr": "TAZROUK"
      },
      {
        "code": "1107",
        "nameAr": "تين زاوتين",
        "nameFr": "TIN ZOUATINE"
      },
      {
        "code": "1108",
        "nameAr": "ان صالح",
        "nameFr": "IN SALAH"
      },
      {
        "code": "1109",
        "nameAr": "ام أمقل",
        "nameFr": "IN AMGUEL"
      },
      {
        "code": "1110",
        "nameAr": "فقارت الزاوية",
        "nameFr": "FOGGARET EZZAOUIA"
      }
    ]
  },
  {
    "code": "1201",
    "number": 12,
    "nameAr": "تبسة",
    "nameFr": "TEBESSA",
    "communes": [
      {
        "code": "1202",
        "nameAr": "بئر العاتر",
        "nameFr": "BIR EL ATER"
      },
      {
        "code": "1203",
        "nameAr": "الشريعة",
        "nameFr": "CHERIA"
      },
      {
        "code": "1204",
        "nameAr": "سطح قنطيس",
        "nameFr": "STAH GUENTIS"
      },
      {
        "code": "1205",
        "nameAr": "العوينات",
        "nameFr": "EL AOUINET"
      },
      {
        "code": "1206",
        "nameAr": "الحويجبات",
        "nameFr": "LHAOUIDJBET"
      },
      {
        "code": "1207",
        "nameAr": "صفصاف الوسرة",
        "nameFr": "SAFSAF OUESRA"
      },
      {
        "code": "1208",
        "nameAr": "الحمامات",
        "nameFr": "HAMMAMET"
      },
      {
        "code": "1209",
        "nameAr": "نقرين",
        "nameFr": "NEGRINE"
      },
      {
        "code": "1210",
        "nameAr": "بئر المقدم",
        "nameFr": "BIR MOKADEM"
      },
      {
        "code": "1211",
        "nameAr": "الكويف",
        "nameFr": "EL KOUIF"
      },
      {
        "code": "1212",
        "nameAr": "مرسط",
        "nameFr": "MORSOTT"
      },
      {
        "code": "1213",
        "nameAr": "العقلة",
        "nameFr": "EL OGLA"
      },
      {
        "code": "1214",
        "nameAr": "بئر الذھب",
        "nameFr": "BIR DHEHEB"
      },
      {
        "code": "1215",
        "nameAr": "العقلة المالحة",
        "nameFr": "EL OGLA MALHA"
      },
      {
        "code": "1216",
        "nameAr": "قوريقر",
        "nameFr": "GUORRIGUER"
      },
      {
        "code": "1217",
        "nameAr": "بكارية",
        "nameFr": "BEKKARIA"
      },
      {
        "code": "1218",
        "nameAr": "بوخضرة",
        "nameFr": "BOUKHADRA"
      },
      {
        "code": "1219",
        "nameAr": "الونزة",
        "nameFr": "OUENZA"
      },
      {
        "code": "1220",
        "nameAr": "الماء الأبيض",
        "nameFr": "EL MA EL BIOD"
      },
      {
        "code": "1221",
        "nameAr": "أم على",
        "nameFr": "OUM ALI"
      },
      {
        "code": "1222",
        "nameAr": "ثليجان",
        "nameFr": "TLIDJEN"
      },
      {
        "code": "1223",
        "nameAr": "عين الزرقاء",
        "nameFr": "AIN ZERGA"
      },
      {
        "code": "1224",
        "nameAr": "المريج",
        "nameFr": "EL MERIDJ"
      },
      {
        "code": "1225",
        "nameAr": "بولحاف الدير",
        "nameFr": "BOULHAF DIR"
      },
      {
        "code": "1226",
        "nameAr": "بجن",
        "nameFr": "BEDJENE"
      },
      {
        "code": "1227",
        "nameAr": "المزرعة",
        "nameFr": "EL MEZERAA"
      },
      {
        "code": "1228",
        "nameAr": "فركان",
        "nameFr": "FERKANE"
      }
    ]
  },
  {
    "code": "1301",
    "number": 13,
    "nameAr": "تلمسان",
    "nameFr": "TLEMCEN",
    "communes": [
      {
        "code": "1302",
        "nameAr": "بنى مستر",
        "nameFr": "BENI MESTER"
      },
      {
        "code": "1303",
        "nameAr": "عين تالوت",
        "nameFr": "AIN TELLOUT"
      },
      {
        "code": "1304",
        "nameAr": "الرمشى",
        "nameFr": "REMCHI"
      },
      {
        "code": "1305",
        "nameAr": "الفحول",
        "nameFr": "EL FEHOUL"
      },
      {
        "code": "1306",
        "nameAr": "صبرة",
        "nameFr": "SABRA"
      },
      {
        "code": "1307",
        "nameAr": "الغزوات",
        "nameFr": "GHAZAOUET"
      },
      {
        "code": "1308",
        "nameAr": "السوانى",
        "nameFr": "SOUANI"
      },
      {
        "code": "1309",
        "nameAr": "جبالة",
        "nameFr": "DJEBALA"
      },
      {
        "code": "1310",
        "nameAr": "القور",
        "nameFr": "EL GOR"
      },
      {
        "code": "1311",
        "nameAr": "وادى الشولى",
        "nameFr": "OUED CHOULI"
      },
      {
        "code": "1312",
        "nameAr": "عين فزة",
        "nameFr": "AIN FEZZA"
      },
      {
        "code": "1313",
        "nameAr": "أولاد ميمون",
        "nameFr": "OULED MIMOUN"
      },
      {
        "code": "1314",
        "nameAr": "عمير",
        "nameFr": "AMIEUR"
      },
      {
        "code": "1315",
        "nameAr": "عين يوسف",
        "nameFr": "AIN YOUCEF"
      },
      {
        "code": "1316",
        "nameAr": "زناتة",
        "nameFr": "ZENATA"
      },
      {
        "code": "1317",
        "nameAr": "بنى سنوس",
        "nameFr": "BENI SNOUS"
      },
      {
        "code": "1318",
        "nameAr": "باب العسة",
        "nameFr": "BAB EL ASSA"
      },
      {
        "code": "1319",
        "nameAr": "دار يغمراسن",
        "nameFr": "DAR YAGHMORICENE"
      },
      {
        "code": "1320",
        "nameAr": "فالوسن",
        "nameFr": "FELLAOUCENE"
      },
      {
        "code": "1321",
        "nameAr": "لغزايل",
        "nameFr": "AZAILS"
      },
      {
        "code": "1322",
        "nameAr": "السبعة شيوخ",
        "nameFr": "SEBAA CHIOUKH"
      },
      {
        "code": "1323",
        "nameAr": "تيرنى بنى ھديل",
        "nameFr": "TERNI BENI HEDIEL"
      },
      {
        "code": "1324",
        "nameAr": "ابن سكران",
        "nameFr": "BENSEKRANE"
      },
      {
        "code": "1325",
        "nameAr": "عين النحالة",
        "nameFr": "AIN NEHALA"
      },
      {
        "code": "1326",
        "nameAr": "الحناية",
        "nameFr": "HENNAYA"
      },
      {
        "code": "1327",
        "nameAr": "مغنية",
        "nameFr": "MAGHNIA"
      },
      {
        "code": "1328",
        "nameAr": "حمام بوغرارة",
        "nameFr": "HAMMAM BOUGHRARA"
      },
      {
        "code": "1329",
        "nameAr": "السواحلية",
        "nameFr": "SOUAHLIA"
      },
      {
        "code": "1330",
        "nameAr": "مسيردة الفواقة",
        "nameFr": "MSIRDA FOUAGA"
      },
      {
        "code": "1331",
        "nameAr": "عين فتاح",
        "nameFr": "AIN FETAH"
      },
      {
        "code": "1332",
        "nameAr": "العريشة",
        "nameFr": "EL ARICHA"
      },
      {
        "code": "1333",
        "nameAr": "سوق الثالثاء",
        "nameFr": "SOUK THLATA"
      },
      {
        "code": "1334",
        "nameAr": "سيدي عبد اللى",
        "nameFr": "SIDI ABDELLI"
      },
      {
        "code": "1335",
        "nameAr": "سبدو",
        "nameFr": "SEBDOU"
      },
      {
        "code": "1336",
        "nameAr": "بني ورسوس",
        "nameFr": "BENI OUARSOUS"
      },
      {
        "code": "1337",
        "nameAr": "سيدي مجاھد",
        "nameFr": "SIDI MEDJAHED"
      },
      {
        "code": "1338",
        "nameAr": "بنى بوسعيد",
        "nameFr": "BENI BOUSSAID"
      },
      {
        "code": "1339",
        "nameAr": "مرسى بن مھيدي",
        "nameFr": "MARSA BEN MHIDI"
      },
      {
        "code": "1340",
        "nameAr": "ندرومة",
        "nameFr": "NEDROMA"
      },
      {
        "code": "1341",
        "nameAr": "سيدي الجيلالي",
        "nameFr": "SIDI DJILALI"
      },
      {
        "code": "1342",
        "nameAr": "بنى بھدل",
        "nameFr": "BENI BAHDEL"
      },
      {
        "code": "1343",
        "nameAr": "البويھي",
        "nameFr": "EL BOUIHI"
      },
      {
        "code": "1344",
        "nameAr": "حنين",
        "nameFr": "HONAINE"
      },
      {
        "code": "1345",
        "nameAr": "تيانت",
        "nameFr": "TIANET"
      },
      {
        "code": "1346",
        "nameAr": "أولاد رياح",
        "nameFr": "OULED RIYAH"
      },
      {
        "code": "1347",
        "nameAr": "بوحلو",
        "nameFr": "BOUHLOU"
      },
      {
        "code": "1348",
        "nameAr": "سوق الخميس",
        "nameFr": "BENI RACHED"
      },
      {
        "code": "1349",
        "nameAr": "عين الغرابة",
        "nameFr": "AIN GHORABA"
      },
      {
        "code": "1350",
        "nameAr": "شتوان",
        "nameFr": "CHETOUANE"
      },
      {
        "code": "1351",
        "nameAr": "المنصورة",
        "nameFr": "MANSOURAH"
      },
      {
        "code": "1352",
        "nameAr": "بني صميل",
        "nameFr": "BENI SMIEL"
      },
      {
        "code": "1353",
        "nameAr": "العين الكبيرة",
        "nameFr": "AIN KEBIRA"
      }
    ]
  },
  {
    "code": "1401",
    "number": 14,
    "nameAr": "تيارت",
    "nameFr": "TIARET",
    "communes": [
      {
        "code": "1402",
        "nameAr": "مدروسة",
        "nameFr": "MEDROUSSA"
      },
      {
        "code": "1403",
        "nameAr": "عين بوشقيف",
        "nameFr": "AIN BOUCHEKIF"
      },
      {
        "code": "1404",
        "nameAr": "سيدي علي مالل",
        "nameFr": "SIDI ALI MELLAL"
      },
      {
        "code": "1405",
        "nameAr": "عين زاريت",
        "nameFr": "AIN ZAIRIT"
      },
      {
        "code": "1406",
        "nameAr": "عين الذھب",
        "nameFr": "AIN DEHEB"
      },
      {
        "code": "1407",
        "nameAr": "سيدي بختي",
        "nameFr": "SIDI BAKHTI"
      },
      {
        "code": "1408",
        "nameAr": "مدريسة",
        "nameFr": "MEDRISSA"
      },
      {
        "code": "1409",
        "nameAr": "زمالة الأمير عبد القادر",
        "nameFr": "ZMALET EMIR AEK"
      },
      {
        "code": "1410",
        "nameAr": "مادنة",
        "nameFr": "MADNA"
      },
      {
        "code": "1411",
        "nameAr": "السبت",
        "nameFr": "SEBT"
      },
      {
        "code": "1412",
        "nameAr": "مالكو",
        "nameFr": "MELLAKOU"
      },
      {
        "code": "1413",
        "nameAr": "دھمونى",
        "nameFr": "DAHMOUNI"
      },
      {
        "code": "1414",
        "nameAr": "رحوية",
        "nameFr": "RAHOUIA"
      },
      {
        "code": "1415",
        "nameAr": "المھدية",
        "nameFr": "MAHDIA"
      },
      {
        "code": "1416",
        "nameAr": "السوقر",
        "nameFr": "SOUGUEUR"
      },
      {
        "code": "1417",
        "nameAr": "سيدي عبد الغنى",
        "nameFr": "SI ABDELGHANI"
      },
      {
        "code": "1418",
        "nameAr": "عين الحديد",
        "nameFr": "AIN EL HADID"
      },
      {
        "code": "1419",
        "nameAr": "أولاد جراد",
        "nameFr": "DJEBILET ROSFA"
      },
      {
        "code": "1420",
        "nameAr": "النعيمة",
        "nameFr": "NAIMA"
      },
      {
        "code": "1421",
        "nameAr": "مغيلة",
        "nameFr": "MEGHILA"
      },
      {
        "code": "1422",
        "nameAr": "قرطوفة",
        "nameFr": "GUERTOUFA"
      },
      {
        "code": "1423",
        "nameAr": "سيدي الحسني",
        "nameFr": "SIDI HOSNI"
      },
      {
        "code": "1424",
        "nameAr": "جياللي بن عمار",
        "nameFr": "DJILLALI BEN AMAR"
      },
      {
        "code": "1425",
        "nameAr": "سبعين",
        "nameFr": "SEBAINE"
      },
      {
        "code": "1426",
        "nameAr": "توسنينة",
        "nameFr": "TOUSNINA"
      },
      {
        "code": "1427",
        "nameAr": "فرندة",
        "nameFr": "FRENDA"
      },
      {
        "code": "1428",
        "nameAr": "عين كرمس",
        "nameFr": "AIN KERMES"
      },
      {
        "code": "1429",
        "nameAr": "قصر الشلالة",
        "nameFr": "KSAR CHELLALA"
      },
      {
        "code": "1430",
        "nameAr": "الرشايقة",
        "nameFr": "RECHAIGA"
      },
      {
        "code": "1431",
        "nameAr": "الناظورة",
        "nameFr": "NADORAH"
      },
      {
        "code": "1432",
        "nameAr": "تاقدمت",
        "nameFr": "TAGDEMT"
      },
      {
        "code": "1433",
        "nameAr": "وادى ليلى",
        "nameFr": "OUED LILLI"
      },
      {
        "code": "1434",
        "nameAr": "مشرع الصفاء",
        "nameFr": "MECHRAA SAFA"
      },
      {
        "code": "1435",
        "nameAr": "الحمادية",
        "nameFr": "HAMADIA"
      },
      {
        "code": "1436",
        "nameAr": "شحيمة",
        "nameFr": "CHEHAIMA"
      },
      {
        "code": "1437",
        "nameAr": "تاخمرت",
        "nameFr": "TAKHEMARET"
      },
      {
        "code": "1438",
        "nameAr": "سيدي عبد الرحمان",
        "nameFr": "SIDI ABDERRAHMANE"
      },
      {
        "code": "1439",
        "nameAr": "سرغين",
        "nameFr": "SERGHINE"
      },
      {
        "code": "1440",
        "nameAr": "بوقرة",
        "nameFr": "BOUGARA"
      },
      {
        "code": "1441",
        "nameAr": "الفايجة",
        "nameFr": "FAIDJA"
      },
      {
        "code": "1442",
        "nameAr": "تيدة",
        "nameFr": "TIDDA"
      }
    ]
  },
  {
    "code": "1501",
    "number": 15,
    "nameAr": "تيز?وزو",
    "nameFr": "TIZI OUZOU",
    "communes": [
      {
        "code": "1502",
        "nameAr": "عين الحمام",
        "nameFr": "AIN EL HAMMAM"
      },
      {
        "code": "1503",
        "nameAr": "اقبيل",
        "nameFr": "AKBIL"
      },
      {
        "code": "1504",
        "nameAr": "فريحة",
        "nameFr": "FREHA"
      },
      {
        "code": "1505",
        "nameAr": "سوامع",
        "nameFr": "SOUAMAA"
      },
      {
        "code": "1506",
        "nameAr": "مشتراس",
        "nameFr": "MECHTRASS"
      },
      {
        "code": "1507",
        "nameAr": "ارجن",
        "nameFr": "IRDJEN"
      },
      {
        "code": "1508",
        "nameAr": "تيمزارت",
        "nameFr": "TIMIZART"
      },
      {
        "code": "1509",
        "nameAr": "ماكودة",
        "nameFr": "MAKOUDA"
      },
      {
        "code": "1510",
        "nameAr": "ذراع الميزان",
        "nameFr": "DRAA EL MIZAN"
      },
      {
        "code": "1511",
        "nameAr": "تيزى غنيف",
        "nameFr": "TIZI GHENIF"
      },
      {
        "code": "1512",
        "nameAr": "بونوح",
        "nameFr": "BOUNOUH"
      },
      {
        "code": "1513",
        "nameAr": "آيت شفعة",
        "nameFr": "AIT CHAFFAA"
      },
      {
        "code": "1514",
        "nameAr": "فريقات",
        "nameFr": "FRIKAT"
      },
      {
        "code": "1515",
        "nameAr": "بنى عيسى",
        "nameFr": "BENI AISSI"
      },
      {
        "code": "1516",
        "nameAr": "بنى زمنزر",
        "nameFr": "BENI ZMENZER"
      },
      {
        "code": "1517",
        "nameAr": "افرحونن",
        "nameFr": "IFERHOUNENE"
      },
      {
        "code": "1518",
        "nameAr": "عزازقة",
        "nameFr": "AZAZGA"
      },
      {
        "code": "1519",
        "nameAr": "ايلولو أما لو",
        "nameFr": "ILOULA OUMALOU"
      },
      {
        "code": "1520",
        "nameAr": "اعكورن",
        "nameFr": "YAKOUREN"
      },
      {
        "code": "1521",
        "nameAr": "الأربعاء نايت ايراثن",
        "nameFr": "LARBA NAIT IRATHEN"
      },
      {
        "code": "1522",
        "nameAr": "تيزى راشد",
        "nameFr": "TIZI RACHED"
      },
      {
        "code": "1523",
        "nameAr": "زكرى",
        "nameFr": "ZEKRI"
      },
      {
        "code": "1524",
        "nameAr": "وا قنون",
        "nameFr": "OUAGUENOUN"
      },
      {
        "code": "1525",
        "nameAr": "عين الزاوية",
        "nameFr": "AIN ZAOUIA"
      },
      {
        "code": "1526",
        "nameAr": "مكيرة",
        "nameFr": "M’KIRA"
      },
      {
        "code": "1527",
        "nameAr": "آيت يحيى",
        "nameFr": "AIT YAHIA"
      },
      {
        "code": "1528",
        "nameAr": "آيت محمود",
        "nameFr": "AIT MAHMOUD"
      },
      {
        "code": "1529",
        "nameAr": "المعاتقة",
        "nameFr": "MAATKA"
      },
      {
        "code": "1530",
        "nameAr": "آيت بومھدى",
        "nameFr": "AIT BOUMEHDI"
      },
      {
        "code": "1531",
        "nameAr": "أبى يوسف",
        "nameFr": "ABI YOUCEF"
      },
      {
        "code": "1532",
        "nameAr": "بنى دوالة",
        "nameFr": "BENI DOUALA"
      },
      {
        "code": "1533",
        "nameAr": "اليلتين",
        "nameFr": "ILLILTEN"
      },
      {
        "code": "1534",
        "nameAr": "بوزقن",
        "nameFr": "BOUZGUEN"
      },
      {
        "code": "1535",
        "nameAr": "آيت أقواشة",
        "nameFr": "AIT AGGOUACHA"
      },
      {
        "code": "1536",
        "nameAr": "واضية",
        "nameFr": "OUADHIA"
      },
      {
        "code": "1537",
        "nameAr": "أزفون",
        "nameFr": "AZZEFOUN"
      },
      {
        "code": "1538",
        "nameAr": "تقزرت",
        "nameFr": "TIGZIRT"
      },
      {
        "code": "1539",
        "nameAr": "جبل عيسى ميمون",
        "nameFr": "DJEBEL AISSA MIMOUN"
      },
      {
        "code": "1540",
        "nameAr": "بوغنى",
        "nameFr": "BOGHNI"
      },
      {
        "code": "1541",
        "nameAr": "ايفيغاء",
        "nameFr": "IFIGHA"
      },
      {
        "code": "1542",
        "nameAr": "آيت أومالو",
        "nameFr": "AIT OUMALOU"
      },
      {
        "code": "1543",
        "nameAr": "تيرمتين",
        "nameFr": "TIRMIRTINE"
      },
      {
        "code": "1544",
        "nameAr": "أقرو",
        "nameFr": "AKERROU"
      },
      {
        "code": "1545",
        "nameAr": "ياطفان",
        "nameFr": "YATAFENE"
      },
      {
        "code": "1546",
        "nameAr": "بنى زيكى",
        "nameFr": "BENI ZIKI"
      },
      {
        "code": "1547",
        "nameAr": "ذراع بن خدة",
        "nameFr": "DRAA BEN KHEDA"
      },
      {
        "code": "1548",
        "nameAr": "واسيف",
        "nameFr": "OUACIF"
      },
      {
        "code": "1549",
        "nameAr": "آجر",
        "nameFr": "IDJEUR"
      },
      {
        "code": "1550",
        "nameAr": "مقلع",
        "nameFr": "MEKLA"
      },
      {
        "code": "1551",
        "nameAr": "تيزى نثالثة",
        "nameFr": "TIZI N’THLATA"
      },
      {
        "code": "1552",
        "nameAr": "بنى ينى",
        "nameFr": "BENI YENNI"
      },
      {
        "code": "1553",
        "nameAr": "أغريب",
        "nameFr": "AGHRIB"
      },
      {
        "code": "1554",
        "nameAr": "افليسن",
        "nameFr": "IFLISSEN"
      },
      {
        "code": "1555",
        "nameAr": "بوجيمئة",
        "nameFr": "BOUDJIMA"
      },
      {
        "code": "1556",
        "nameAr": "آيت يحى موسى",
        "nameFr": "AIT YAHIA MOU."
      },
      {
        "code": "1557",
        "nameAr": "سوق الإثنين",
        "nameFr": "SOUK EL TENINE"
      },
      {
        "code": "1558",
        "nameAr": "آيت خليل",
        "nameFr": "AIT KHELILI"
      },
      {
        "code": "1559",
        "nameAr": "سيدي نعمان",
        "nameFr": "SIDI NAAMANE"
      },
      {
        "code": "1560",
        "nameAr": "أبودرارن",
        "nameFr": "IBOUDRAREN"
      },
      {
        "code": "1561",
        "nameAr": "آقنى قغران",
        "nameFr": "AGHNI GOUGHRAN"
      },
      {
        "code": "1562",
        "nameAr": "مزرانة",
        "nameFr": "MIZRANA"
      },
      {
        "code": "1563",
        "nameAr": "أمسوحال",
        "nameFr": "IMSOUHAL"
      },
      {
        "code": "1564",
        "nameAr": "تادمايت",
        "nameFr": "TADMAIT"
      },
      {
        "code": "1565",
        "nameAr": "آيت بوعدو",
        "nameFr": "AIT BOUADDOU"
      },
      {
        "code": "1566",
        "nameAr": "أسى يوسف",
        "nameFr": "ASSI YOUCEF"
      },
      {
        "code": "1567",
        "nameAr": "آيت تودرت",
        "nameFr": "AIT TOUDERT"
      }
    ]
  },
  {
    "code": "1601",
    "number": 16,
    "nameAr": "الجزائر الوسطى",
    "nameFr": "ALGER CENTRE",
    "communes": [
      {
        "code": "1602",
        "nameAr": "سيدي امحمد",
        "nameFr": "SIDI MHAMED"
      },
      {
        "code": "1603",
        "nameAr": "المدنية",
        "nameFr": "EL MADANIA"
      },
      {
        "code": "1604",
        "nameAr": "الحامة العناصر",
        "nameFr": "HAMMA ANNASSERS"
      },
      {
        "code": "1605",
        "nameAr": "باب الوادي",
        "nameFr": "BAB EL OUED"
      },
      {
        "code": "1606",
        "nameAr": "بولوغين  إبن زيري",
        "nameFr": "BOLOGHINE"
      },
      {
        "code": "1607",
        "nameAr": "القصبة",
        "nameFr": "CASBAH"
      },
      {
        "code": "1608",
        "nameAr": "وادي قريش",
        "nameFr": "OUED KOREICHE"
      },
      {
        "code": "1609",
        "nameAr": "بئر مراد رايس",
        "nameFr": "BIR MOURAD RAIS"
      },
      {
        "code": "1610",
        "nameAr": "الأبيار",
        "nameFr": "EL BIAR"
      },
      {
        "code": "1611",
        "nameAr": "بوزريعة",
        "nameFr": "BOUZEREAH"
      },
      {
        "code": "1612",
        "nameAr": "بئر خادم",
        "nameFr": "BIRKHADEM"
      },
      {
        "code": "1613",
        "nameAr": "الحراش",
        "nameFr": "EL HARRACH"
      },
      {
        "code": "1614",
        "nameAr": "براقي",
        "nameFr": "BARAKI"
      },
      {
        "code": "1615",
        "nameAr": "وادي سمار",
        "nameFr": "OUED SMAR"
      },
      {
        "code": "1616",
        "nameAr": "بوروبة",
        "nameFr": "BOUBOUBA"
      },
      {
        "code": "1617",
        "nameAr": "حسين داي",
        "nameFr": "HUSSEIN DEY"
      },
      {
        "code": "1618",
        "nameAr": "القبة",
        "nameFr": "KOUBA"
      },
      {
        "code": "1619",
        "nameAr": "باش جراح",
        "nameFr": "BACHDJARAH"
      },
      {
        "code": "1620",
        "nameAr": "الدار البيضاء",
        "nameFr": "DAR EL BEIDA"
      },
      {
        "code": "1621",
        "nameAr": "باب الزوار",
        "nameFr": "BAB EZZOUAR"
      },
      {
        "code": "1622",
        "nameAr": "بن عكنون",
        "nameFr": "BEN AKNOUN"
      },
      {
        "code": "1623",
        "nameAr": "دالي إبرھيم",
        "nameFr": "DELY IBRAHIM"
      },
      {
        "code": "1624",
        "nameAr": "الحمامات",
        "nameFr": "HAMMAMET"
      },
      {
        "code": "1625",
        "nameAr": "الرايس حميدو",
        "nameFr": "RAIS HAMIDOU"
      },
      {
        "code": "1626",
        "nameAr": "جسر قسنطينة",
        "nameFr": "DJASR KASENTINA"
      },
      {
        "code": "1627",
        "nameAr": "المرادية",
        "nameFr": "EL MOURADIA"
      },
      {
        "code": "1628",
        "nameAr": "حيدرة",
        "nameFr": "HYDRA"
      },
      {
        "code": "1629",
        "nameAr": "المحمدية",
        "nameFr": "MOHAMMADIA"
      },
      {
        "code": "1630",
        "nameAr": "برج الكيفان",
        "nameFr": "BORDJ EL KIFFAN"
      },
      {
        "code": "1631",
        "nameAr": "المغارية",
        "nameFr": "EL MAGHARIA"
      },
      {
        "code": "1632",
        "nameAr": "بني مسوس",
        "nameFr": "BENI MESSOUS"
      },
      {
        "code": "1633",
        "nameAr": "الكليتوس",
        "nameFr": "EUCALYPTUS"
      },
      {
        "code": "1634",
        "nameAr": "تسالة المرجى",
        "nameFr": "TESSALA EL MERDJA"
      },
      {
        "code": "1635",
        "nameAr": "أولاد الشبل",
        "nameFr": "OULED CHEBEL"
      },
      {
        "code": "1636",
        "nameAr": "بئر توتة",
        "nameFr": "BIRTOUTA"
      },
      {
        "code": "1637",
        "nameAr": "سيدي موسى",
        "nameFr": "SIDI MOUSSA"
      },
      {
        "code": "1638",
        "nameAr": "الرويبة",
        "nameFr": "ROUIBA"
      },
      {
        "code": "1639",
        "nameAr": "الھراوة",
        "nameFr": "HARRAOUA"
      },
      {
        "code": "1640",
        "nameAr": "رغاية",
        "nameFr": "REGHAIA"
      },
      {
        "code": "1641",
        "nameAr": "عين طاية",
        "nameFr": "AIN TAYA"
      },
      {
        "code": "1642",
        "nameAr": "برج البحري",
        "nameFr": "BORDJ EL BAHRI"
      },
      {
        "code": "1643",
        "nameAr": "المرسى",
        "nameFr": "EL MARSA"
      },
      {
        "code": "1644",
        "nameAr": "زرالدة",
        "nameFr": "ZERALDA"
      },
      {
        "code": "1645",
        "nameAr": "سحاولة",
        "nameFr": "SAOULA"
      },
      {
        "code": "1646",
        "nameAr": "محالمة",
        "nameFr": "MAHELMA"
      },
      {
        "code": "1647",
        "nameAr": "بابا حسن",
        "nameFr": "BABA HASSEN"
      },
      {
        "code": "1648",
        "nameAr": "الدويرة",
        "nameFr": "DOUERA"
      },
      {
        "code": "1649",
        "nameAr": "الدرارية",
        "nameFr": "DRARIA"
      },
      {
        "code": "1650",
        "nameAr": "الرحمانية",
        "nameFr": "RAHMANIA"
      },
      {
        "code": "1651",
        "nameAr": "أولاد فايت",
        "nameFr": "OULED FAYET"
      },
      {
        "code": "1652",
        "nameAr": "الشراقة",
        "nameFr": "CHERAGA"
      },
      {
        "code": "1653",
        "nameAr": "سطاوالي",
        "nameFr": "STAOUELI"
      },
      {
        "code": "1654",
        "nameAr": "العاشور",
        "nameFr": "EL ACHOUR"
      },
      {
        "code": "1655",
        "nameAr": "سويدانية",
        "nameFr": "SOUIDANIA"
      },
      {
        "code": "1656",
        "nameAr": "خراسية",
        "nameFr": "KHRAICIA"
      },
      {
        "code": "1657",
        "nameAr": "عين البنيان",
        "nameFr": "AIN BENIAN"
      }
    ]
  },
  {
    "code": "1701",
    "number": 17,
    "nameAr": "الجلفة",
    "nameFr": "DJELFA",
    "communes": [
      {
        "code": "1702",
        "nameAr": "مجبر",
        "nameFr": "MOUDJEBARA"
      },
      {
        "code": "1703",
        "nameAr": "القديد",
        "nameFr": "EL GUEDID"
      },
      {
        "code": "1704",
        "nameAr": "حاسي بحبح",
        "nameFr": "HASSI BAHBAH"
      },
      {
        "code": "1705",
        "nameAr": "عين معبد",
        "nameFr": "AIN MAABED"
      },
      {
        "code": "1706",
        "nameAr": "سد الرحال",
        "nameFr": "SED RAHAL"
      },
      {
        "code": "1707",
        "nameAr": "فيض البطمة",
        "nameFr": "FEIDH EL BOTMA"
      },
      {
        "code": "1708",
        "nameAr": "بيرين",
        "nameFr": "BIRINE"
      },
      {
        "code": "1709",
        "nameAr": "بويرة الأحدب",
        "nameFr": "BOUIRA LAHDEB"
      },
      {
        "code": "1710",
        "nameAr": "زكار",
        "nameFr": "ZACCAR"
      },
      {
        "code": "1711",
        "nameAr": "الخميس",
        "nameFr": "EL KHEMIS"
      },
      {
        "code": "1712",
        "nameAr": "سيدي بايزيد",
        "nameFr": "SIDI BAIZID"
      },
      {
        "code": "1713",
        "nameAr": "المليليجة",
        "nameFr": "MLILIHA"
      },
      {
        "code": "1714",
        "nameAr": "الإدريسية",
        "nameFr": "EL IDRISSIA"
      },
      {
        "code": "1715",
        "nameAr": "دويس",
        "nameFr": "DOUIS"
      },
      {
        "code": "1716",
        "nameAr": "حاسى العش",
        "nameFr": "HASSI EL EUCH"
      },
      {
        "code": "1717",
        "nameAr": "مسعد",
        "nameFr": "MESSAAD"
      },
      {
        "code": "1718",
        "nameAr": "القطارة",
        "nameFr": "GUETTARA"
      },
      {
        "code": "1719",
        "nameAr": "سيدي لعجال",
        "nameFr": "SIDI LADJEL"
      },
      {
        "code": "1720",
        "nameAr": "حد الصحارى",
        "nameFr": "HAD SAHARY"
      },
      {
        "code": "1721",
        "nameAr": "قرنيني",
        "nameFr": "GUERNINI"
      },
      {
        "code": "1722",
        "nameAr": "سلمانة",
        "nameFr": "SELMANA"
      },
      {
        "code": "1723",
        "nameAr": "عين الشھداء",
        "nameFr": "AIN CHOUHADA"
      },
      {
        "code": "1724",
        "nameAr": "أم العظام",
        "nameFr": "OUM LAADHAM"
      },
      {
        "code": "1725",
        "nameAr": "دار الشيوخ",
        "nameFr": "DAR CHIOUKH"
      },
      {
        "code": "1726",
        "nameAr": "الشارف",
        "nameFr": "CHAREF"
      },
      {
        "code": "1727",
        "nameAr": "بنى يعقوب",
        "nameFr": "BENIYAGOUB"
      },
      {
        "code": "1728",
        "nameAr": "زعفران",
        "nameFr": "ZAAFRANE"
      },
      {
        "code": "1729",
        "nameAr": "دلدول",
        "nameFr": "DELDOUL"
      },
      {
        "code": "1730",
        "nameAr": "عين الإبل",
        "nameFr": "AIN EL IBEL"
      },
      {
        "code": "1731",
        "nameAr": "عين وسارة",
        "nameFr": "AIN OUSSERA"
      },
      {
        "code": "1732",
        "nameAr": "بن ھار",
        "nameFr": "BENHAR"
      },
      {
        "code": "1733",
        "nameAr": "حاسى فدول",
        "nameFr": "HASSI FEDOUL"
      },
      {
        "code": "1734",
        "nameAr": "عمورة",
        "nameFr": "AMOURAH"
      },
      {
        "code": "1735",
        "nameAr": "عين فكة",
        "nameFr": "AIN FEKKA"
      },
      {
        "code": "1736",
        "nameAr": "تاعظميت",
        "nameFr": "TADMIT"
      }
    ]
  },
  {
    "code": "1801",
    "number": 18,
    "nameAr": "جيجل",
    "nameFr": "JIJEL",
    "communes": [
      {
        "code": "1802",
        "nameAr": "أرا قن",
        "nameFr": "ERRAGUENE"
      },
      {
        "code": "1803",
        "nameAr": "العوانة",
        "nameFr": "EL AOUANA"
      },
      {
        "code": "1804",
        "nameAr": "زيامة منصورية",
        "nameFr": "ZIAMMA MANSOURIAH"
      },
      {
        "code": "1805",
        "nameAr": "الطاھير",
        "nameFr": "TAHER"
      },
      {
        "code": "1806",
        "nameAr": "الأمير عبد القادر",
        "nameFr": "EMIR ABDELKADER"
      },
      {
        "code": "1807",
        "nameAr": "الشقفة",
        "nameFr": "CHEKFA"
      },
      {
        "code": "1808",
        "nameAr": "شحنة",
        "nameFr": "CHAHANA"
      },
      {
        "code": "1809",
        "nameAr": "الميلية",
        "nameFr": "EL MILIA"
      },
      {
        "code": "1810",
        "nameAr": "سيدي معروف",
        "nameFr": "SIDI MAAROUF"
      },
      {
        "code": "1811",
        "nameAr": "السطارة",
        "nameFr": "SETTARA"
      },
      {
        "code": "1812",
        "nameAr": "العنصر",
        "nameFr": "EL ANCER"
      },
      {
        "code": "1813",
        "nameAr": "سيدي عبد العزيز",
        "nameFr": "SIDI ABDELAZIZ"
      },
      {
        "code": "1814",
        "nameAr": "قاوس",
        "nameFr": "KAOUS"
      },
      {
        "code": "1815",
        "nameAr": "غبالة",
        "nameFr": "GHEBALA"
      },
      {
        "code": "1816",
        "nameAr": "بوراوى بلھادف",
        "nameFr": "BOURAOUI BELH."
      },
      {
        "code": "1817",
        "nameAr": "جيملة",
        "nameFr": "DJMILA"
      },
      {
        "code": "1818",
        "nameAr": "سلمى بن زيادة",
        "nameFr": "SELMA BENZIADA"
      },
      {
        "code": "1819",
        "nameAr": "بوسيف أولاد عسكر",
        "nameFr": "OULED ASKEUR"
      },
      {
        "code": "1820",
        "nameAr": "القنار نوشفى",
        "nameFr": "EL KENAR NOUCHFI"
      },
      {
        "code": "1821",
        "nameAr": "أولاد يحيى خدروش",
        "nameFr": "OULED YAHIA"
      },
      {
        "code": "1822",
        "nameAr": "بودريعة بن ياجيس",
        "nameFr": "BOUDRIA BENI YADJIS"
      },
      {
        "code": "1823",
        "nameAr": "قمير وادى عجول",
        "nameFr": "KHIRI OUED ADJOUL"
      },
      {
        "code": "1824",
        "nameAr": "تاكسنة",
        "nameFr": "TEXENA"
      },
      {
        "code": "1825",
        "nameAr": "الجمعة بنى حبيبى",
        "nameFr": "DJEMAA BENI HABIBI"
      },
      {
        "code": "1826",
        "nameAr": "برج الطھر",
        "nameFr": "BORDJ TAHER"
      },
      {
        "code": "1827",
        "nameAr": "أولاد رابح",
        "nameFr": "OULED RABAH"
      },
      {
        "code": "1828",
        "nameAr": "وجانة",
        "nameFr": "OUDJANA"
      }
    ]
  },
  {
    "code": "1901",
    "number": 19,
    "nameAr": "سطيف",
    "nameFr": "SETIF",
    "communes": [
      {
        "code": "1902",
        "nameAr": "العين الكبيرة",
        "nameFr": "AIN EL KEBIRA"
      },
      {
        "code": "1903",
        "nameAr": "بنى عزيز",
        "nameFr": "BENI AZIZ"
      },
      {
        "code": "1904",
        "nameAr": "أولادى سي أحمد",
        "nameFr": "OULED SI AHMED"
      },
      {
        "code": "1905",
        "nameAr": "بوطالب",
        "nameFr": "BOUTALEB"
      },
      {
        "code": "1906",
        "nameAr": "عين الروى",
        "nameFr": "AIN ROUA"
      },
      {
        "code": "1907",
        "nameAr": "ذراع قبيلة",
        "nameFr": "DRAA KEBILA"
      },
      {
        "code": "1908",
        "nameAr": "بئر العرش",
        "nameFr": "BIR EL ARCH"
      },
      {
        "code": "1909",
        "nameAr": "بنى شبانة",
        "nameFr": "BENI CHEBANA"
      },
      {
        "code": "1910",
        "nameAr": "أولاد تبان",
        "nameFr": "OULED TEBBEN"
      },
      {
        "code": "1911",
        "nameAr": "الحامة",
        "nameFr": "HAMMA"
      },
      {
        "code": "1912",
        "nameAr": "معاوية",
        "nameFr": "MAAOUIA"
      },
      {
        "code": "1913",
        "nameAr": "عين لقراج",
        "nameFr": "AIN LEGRADJ"
      },
      {
        "code": "1914",
        "nameAr": "عين عباسة",
        "nameFr": "AIN ABESSA"
      },
      {
        "code": "1915",
        "nameAr": "الدھامشة",
        "nameFr": "DEHEMCHA"
      },
      {
        "code": "1916",
        "nameAr": "بابور",
        "nameFr": "BABOR"
      },
      {
        "code": "1917",
        "nameAr": "قجال",
        "nameFr": "GUIDJEL"
      },
      {
        "code": "1918",
        "nameAr": "عين الحجر",
        "nameFr": "AIN LAHDJAR"
      },
      {
        "code": "1919",
        "nameAr": "بوسالم",
        "nameFr": "BOUSSELAM"
      },
      {
        "code": "1920",
        "nameAr": "العلمة",
        "nameFr": "EL EULMA"
      },
      {
        "code": "1921",
        "nameAr": "جميلة",
        "nameFr": "DJEMILA"
      },
      {
        "code": "1922",
        "nameAr": "بنى ورثيالن",
        "nameFr": "BENI OURTILANE"
      },
      {
        "code": "1923",
        "nameAr": "الرصفة",
        "nameFr": "ROSFA"
      },
      {
        "code": "1924",
        "nameAr": "أولاد عدوان",
        "nameFr": "OULED ADDOUANE"
      },
      {
        "code": "1925",
        "nameAr": "بلعة",
        "nameFr": "BELLAA"
      },
      {
        "code": "1926",
        "nameAr": "عين أرنات",
        "nameFr": "AIN ARNAT"
      },
      {
        "code": "1927",
        "nameAr": "عموشة",
        "nameFr": "AMOUCHA"
      },
      {
        "code": "1928",
        "nameAr": "عين أولمان",
        "nameFr": "AIN OULMANE"
      },
      {
        "code": "1929",
        "nameAr": "بيضاء برج",
        "nameFr": "BEIDHA BORDJ"
      },
      {
        "code": "1930",
        "nameAr": "بوعنداس",
        "nameFr": "BOUANDAS"
      },
      {
        "code": "1931",
        "nameAr": "بازر الصخرة",
        "nameFr": "BAZER SAKRA"
      },
      {
        "code": "1932",
        "nameAr": "حمام السخنة",
        "nameFr": "HAMMAM ESSOKHNA"
      },
      {
        "code": "1933",
        "nameAr": "مزلوق",
        "nameFr": "MEZLOUG"
      },
      {
        "code": "1934",
        "nameAr": "بئر حدادة",
        "nameFr": "BIR HADDADA"
      },
      {
        "code": "1935",
        "nameAr": "سرج الغول",
        "nameFr": "SERDJ EL GHOUL"
      },
      {
        "code": "1936",
        "nameAr": "حربيل",
        "nameFr": "HARBIL"
      },
      {
        "code": "1937",
        "nameAr": "الوريسية",
        "nameFr": "EL OURICIA"
      },
      {
        "code": "1938",
        "nameAr": "تيزى نبشار",
        "nameFr": "TIZI NBECHAR"
      },
      {
        "code": "1939",
        "nameAr": "صالح باي",
        "nameFr": "SALAH BEY"
      },
      {
        "code": "1940",
        "nameAr": "عين ازال",
        "nameFr": "AIN AZAL"
      },
      {
        "code": "1941",
        "nameAr": "قنزات",
        "nameFr": "GUENZET"
      },
      {
        "code": "1942",
        "nameAr": "تالة إيفاسن",
        "nameFr": "TALAIFACENE"
      },
      {
        "code": "1943",
        "nameAr": "بوقاعة",
        "nameFr": "BOUGAA"
      },
      {
        "code": "1944",
        "nameAr": "بنى فودة",
        "nameFr": "BENI FOUDA"
      },
      {
        "code": "1945",
        "nameAr": "تاشورة",
        "nameFr": "TACHOUDA"
      },
      {
        "code": "1946",
        "nameAr": "بنى محلى",
        "nameFr": "BENI MOUHLI"
      },
      {
        "code": "1947",
        "nameAr": "أولاد صابر",
        "nameFr": "OULED SABOR"
      },
      {
        "code": "1948",
        "nameAr": "قالل",
        "nameFr": "GUELLAL"
      },
      {
        "code": "1949",
        "nameAr": "عين السبت",
        "nameFr": "AIN SEBT"
      },
      {
        "code": "1950",
        "nameAr": "حمام القرقور",
        "nameFr": "HAMMAM GUERGOUR"
      },
      {
        "code": "1951",
        "nameAr": "آيت نوال مزادة",
        "nameFr": "AIT NAOUAL M."
      },
      {
        "code": "1952",
        "nameAr": "قصر الأبطال",
        "nameFr": "KSAR EL ABTAL"
      },
      {
        "code": "1953",
        "nameAr": "بنى حسين",
        "nameFr": "BENI HOCINE"
      },
      {
        "code": "1954",
        "nameAr": "آيت تيزي",
        "nameFr": "AIT TIZI"
      },
      {
        "code": "1955",
        "nameAr": "موكالن",
        "nameFr": "MAOUAKLANE"
      },
      {
        "code": "1956",
        "nameAr": "القلتة الزرقاء",
        "nameFr": "GUELTA ZERKA"
      },
      {
        "code": "1957",
        "nameAr": "وادي البارد",
        "nameFr": "OUED EL BARAD"
      },
      {
        "code": "1958",
        "nameAr": "الطاية",
        "nameFr": "TAYA"
      },
      {
        "code": "1959",
        "nameAr": "الولجة",
        "nameFr": "EL OULDJA"
      },
      {
        "code": "1960",
        "nameAr": "التلة",
        "nameFr": "TELLA"
      }
    ]
  },
  {
    "code": "2001",
    "number": 20,
    "nameAr": "سعيدة",
    "nameFr": "SAIDA",
    "communes": [
      {
        "code": "2002",
        "nameAr": "دوى ثابت",
        "nameFr": "DOUI THABET"
      },
      {
        "code": "2003",
        "nameAr": "عين الحجر",
        "nameFr": "AIN HADJAR"
      },
      {
        "code": "2004",
        "nameAr": "أولاد خالد",
        "nameFr": "OULED KHALED"
      },
      {
        "code": "2005",
        "nameAr": "مولاي العربي",
        "nameFr": "MOULAY LARBI"
      },
      {
        "code": "2006",
        "nameAr": "يوب",
        "nameFr": "YOUB"
      },
      {
        "code": "2007",
        "nameAr": "حنات",
        "nameFr": "HOUNET"
      },
      {
        "code": "2008",
        "nameAr": "سيدي عمار",
        "nameFr": "SIDI AMAR"
      },
      {
        "code": "2009",
        "nameAr": "سيدي بوبكر",
        "nameFr": "SIDI BOUBEKEUR"
      },
      {
        "code": "2010",
        "nameAr": "الحساسنة",
        "nameFr": "EL HASSASSNA"
      },
      {
        "code": "2011",
        "nameAr": "المعمورة",
        "nameFr": "MAAMORA"
      },
      {
        "code": "2012",
        "nameAr": "سيدي أحمد",
        "nameFr": "SIDI AHMED"
      },
      {
        "code": "2013",
        "nameAr": "العين السخونة",
        "nameFr": "AIN SKHOUNA"
      },
      {
        "code": "2014",
        "nameAr": "أولاد ابراھيم",
        "nameFr": "OULED BRAHIM"
      },
      {
        "code": "2015",
        "nameAr": "تيرسين",
        "nameFr": "TIRCINE"
      },
      {
        "code": "2016",
        "nameAr": "عين السلطان",
        "nameFr": "AIN SOLTANE"
      }
    ]
  },
  {
    "code": "2101",
    "number": 21,
    "nameAr": "سكيكدة",
    "nameFr": "SKIKDA",
    "communes": [
      {
        "code": "2102",
        "nameAr": "عين زويت",
        "nameFr": "AIN ZOUIT"
      },
      {
        "code": "2103",
        "nameAr": "الحدائق",
        "nameFr": "EL HADAIK"
      },
      {
        "code": "2104",
        "nameAr": "عزابة",
        "nameFr": "AZZABA"
      },
      {
        "code": "2105",
        "nameAr": "جندل سيدي محمد",
        "nameFr": "DJENDEL SAADI MED"
      },
      {
        "code": "2106",
        "nameAr": "عين شرشار",
        "nameFr": "AIN CHERCHAR"
      },
      {
        "code": "2107",
        "nameAr": "بكوش الأخضر",
        "nameFr": "BEKKOUCHE LAKHDAR"
      },
      {
        "code": "2108",
        "nameAr": "بن عزوز",
        "nameFr": "BENAZOUZ"
      },
      {
        "code": "2109",
        "nameAr": "السبت",
        "nameFr": "ES SEBT"
      },
      {
        "code": "2110",
        "nameAr": "القل",
        "nameFr": "COLLO"
      },
      {
        "code": "2111",
        "nameAr": "بنى زيد",
        "nameFr": "BENI ZID"
      },
      {
        "code": "2112",
        "nameAr": "الكركرة",
        "nameFr": "KERKERA"
      },
      {
        "code": "2113",
        "nameAr": "أولاد عطية",
        "nameFr": "OULED ATTIA"
      },
      {
        "code": "2114",
        "nameAr": "وادى الزھور",
        "nameFr": "OUED ZEHOUR"
      },
      {
        "code": "2115",
        "nameAr": "الزيتونة",
        "nameFr": "ZITOUNA"
      },
      {
        "code": "2116",
        "nameAr": "الحروش",
        "nameFr": "EL HARROUCH"
      },
      {
        "code": "2117",
        "nameAr": "زردازس",
        "nameFr": "ZERDAZAS"
      },
      {
        "code": "2118",
        "nameAr": "أولاد حبابة",
        "nameFr": "OULED HEBABA"
      },
      {
        "code": "2119",
        "nameAr": "سيدي مزغيش",
        "nameFr": "SIDI MEZGHICHE"
      },
      {
        "code": "2120",
        "nameAr": "مجاز الدشيش",
        "nameFr": "EMDJEZ EDCHICH"
      },
      {
        "code": "2121",
        "nameAr": "بنى ولبان",
        "nameFr": "BENI OULBANE"
      },
      {
        "code": "2122",
        "nameAr": "عين بوزيان",
        "nameFr": "AIN BOUZIANE"
      },
      {
        "code": "2123",
        "nameAr": "رمضان جمال",
        "nameFr": "RAMDANE DJAMEL"
      },
      {
        "code": "2124",
        "nameAr": "بنى بشير",
        "nameFr": "BENI BECHIR"
      },
      {
        "code": "2125",
        "nameAr": "صالح بو الشعور",
        "nameFr": "SALAH BOUCHAOUR"
      },
      {
        "code": "2126",
        "nameAr": "تمالوس",
        "nameFr": "TAMALOUS"
      },
      {
        "code": "2127",
        "nameAr": "عين قشرة",
        "nameFr": "AIN KECHRA"
      },
      {
        "code": "2128",
        "nameAr": "أم الطوب",
        "nameFr": "OUM TOUB"
      },
      {
        "code": "2129",
        "nameAr": "بين الويدان",
        "nameFr": "BIR EL OUIDEN"
      },
      {
        "code": "2130",
        "nameAr": "فليفلة",
        "nameFr": "FIL FILA"
      },
      {
        "code": "2131",
        "nameAr": "الشرائع",
        "nameFr": "CHERAIA"
      },
      {
        "code": "2132",
        "nameAr": "قنوع",
        "nameFr": "KANOUA"
      },
      {
        "code": "2133",
        "nameAr": "الغدير",
        "nameFr": "EL GHEDIR"
      },
      {
        "code": "2134",
        "nameAr": "بوشطاطة",
        "nameFr": "BOUCHTATA"
      },
      {
        "code": "2135",
        "nameAr": "الولجة بو البلوط",
        "nameFr": "OULDJA BOULBALOUT"
      },
      {
        "code": "2136",
        "nameAr": "خنق مايوم",
        "nameFr": "KHENEG MAYOUM"
      },
      {
        "code": "2137",
        "nameAr": "حمادى كرومة",
        "nameFr": "HAMADI KROUMA"
      },
      {
        "code": "2138",
        "nameAr": "المرسى",
        "nameFr": "EL MARSA"
      }
    ]
  },
  {
    "code": "2201",
    "number": 22,
    "nameAr": "سيدي بلعباس",
    "nameFr": "SIDI BEL ABBES",
    "communes": [
      {
        "code": "2202",
        "nameAr": "تسالة",
        "nameFr": "TESSALA"
      },
      {
        "code": "2203",
        "nameAr": "سيدي ابراھيم",
        "nameFr": "SIDI BRAHIM"
      },
      {
        "code": "2204",
        "nameAr": "مصطفى بن ابراھيم",
        "nameFr": "MOSTAFA BEN BRAHIM"
      },
      {
        "code": "2205",
        "nameAr": "تالغ",
        "nameFr": "TELAGH"
      },
      {
        "code": "2206",
        "nameAr": "مزاورو",
        "nameFr": "MEZAOUROU"
      },
      {
        "code": "2207",
        "nameAr": "بو خنيفيس",
        "nameFr": "BOUKHNAFIS"
      },
      {
        "code": "2208",
        "nameAr": "سيدي على بوسيدى",
        "nameFr": "SIDI ALI BOUSSIDI"
      },
      {
        "code": "2209",
        "nameAr": "بدر الدين المقرانى",
        "nameFr": "BADREDINE EL MOKRANI"
      },
      {
        "code": "2210",
        "nameAr": "مرحوم",
        "nameFr": "MARHOUM"
      },
      {
        "code": "2211",
        "nameAr": "تافسون",
        "nameFr": "TAFISSOUR"
      },
      {
        "code": "2212",
        "nameAr": "أمرناس",
        "nameFr": "AMARNAS"
      },
      {
        "code": "2213",
        "nameAr": "تلمونى",
        "nameFr": "TILMOUNI"
      },
      {
        "code": "2214",
        "nameAr": "سيدي لحسن",
        "nameFr": "SIDI LAHCENE"
      },
      {
        "code": "2215",
        "nameAr": "عين الثريد",
        "nameFr": "AIN TRID"
      },
      {
        "code": "2216",
        "nameAr": "مقدرة",
        "nameFr": "MAKHEDRA"
      },
      {
        "code": "2217",
        "nameAr": "تنبرة",
        "nameFr": "TENIRA"
      },
      {
        "code": "2218",
        "nameAr": "موالى سليسن",
        "nameFr": "MOULAY SLISSEN"
      },
      {
        "code": "2219",
        "nameAr": "الحصيبة",
        "nameFr": "EL HACAIBA"
      },
      {
        "code": "2220",
        "nameAr": "حاسى زھانة",
        "nameFr": "HASSI ZAHANA"
      },
      {
        "code": "2221",
        "nameAr": "طابية",
        "nameFr": "TABIA"
      },
      {
        "code": "2222",
        "nameAr": "مرين",
        "nameFr": "MERINE"
      },
      {
        "code": "2223",
        "nameAr": "رأس الماء",
        "nameFr": "RAS EL MA"
      },
      {
        "code": "2224",
        "nameAr": "عين تندمين",
        "nameFr": "AIN TADMINE"
      },
      {
        "code": "2225",
        "nameAr": "عين قادة",
        "nameFr": "AIN KADA"
      },
      {
        "code": "2226",
        "nameAr": "مسيد",
        "nameFr": "MCID"
      },
      {
        "code": "2227",
        "nameAr": "سيدي خالد",
        "nameFr": "SIDI KHALED"
      },
      {
        "code": "2228",
        "nameAr": "عين البرد",
        "nameFr": "AIN EL BERD"
      },
      {
        "code": "2229",
        "nameAr": "سفيزف",
        "nameFr": "SFISEF"
      },
      {
        "code": "2230",
        "nameAr": "عين عدان",
        "nameFr": "AIN ADDEN"
      },
      {
        "code": "2231",
        "nameAr": "وادى تاوريرة",
        "nameFr": "OUED TAOURIA"
      },
      {
        "code": "2232",
        "nameAr": "الضاية",
        "nameFr": "DHAYA"
      },
      {
        "code": "2233",
        "nameAr": "زروالة",
        "nameFr": "ZEROUALA"
      },
      {
        "code": "2234",
        "nameAr": "لمطار",
        "nameFr": "LEMTAR"
      },
      {
        "code": "2235",
        "nameAr": "سيدي شعيب",
        "nameFr": "SIDI CHAIB"
      },
      {
        "code": "2236",
        "nameAr": "سيدي دحو الزاير",
        "nameFr": "SIDI DAHO DE ZAIRS"
      },
      {
        "code": "2237",
        "nameAr": "وادى السبع",
        "nameFr": "OUED SEBAA"
      },
      {
        "code": "2238",
        "nameAr": "بوجبع البرج",
        "nameFr": "BOUDJBAA.B"
      },
      {
        "code": "2239",
        "nameAr": "سحالة ثاورة",
        "nameFr": "SEHALA TAOURA"
      },
      {
        "code": "2240",
        "nameAr": "سيدي يعقوب",
        "nameFr": "SIDI YACOUB"
      },
      {
        "code": "2241",
        "nameAr": "سيدي حمادوش",
        "nameFr": "SIDI HAMADOUCHE"
      },
      {
        "code": "2242",
        "nameAr": "بلعربى",
        "nameFr": "BELARBI"
      },
      {
        "code": "2243",
        "nameAr": "وادى سفيون",
        "nameFr": "OUED SEFIOUN"
      },
      {
        "code": "2244",
        "nameAr": "تغاليمت",
        "nameFr": "TEGHELIMET"
      },
      {
        "code": "2245",
        "nameAr": "ابن باديس",
        "nameFr": "BEN BADIS"
      },
      {
        "code": "2246",
        "nameAr": "سيدي على بن يوب",
        "nameFr": "SIDI ALI BENYOUB"
      },
      {
        "code": "2247",
        "nameAr": "شتوان باليلة",
        "nameFr": "CHETOUANE"
      },
      {
        "code": "2248",
        "nameAr": "بئر الحمام",
        "nameFr": "BIR EL HAMMAM"
      },
      {
        "code": "2249",
        "nameAr": "تاردموت",
        "nameFr": "TAOUDMOUT"
      },
      {
        "code": "2250",
        "nameAr": "رجم دموش",
        "nameFr": "REDJEM DEMOUCHE"
      },
      {
        "code": "2251",
        "nameAr": "بن شيبة شيلية",
        "nameFr": "BENCHIBA"
      },
      {
        "code": "2252",
        "nameAr": "حاسى دحو",
        "nameFr": "HASSI DAHOU"
      }
    ]
  },
  {
    "code": "2301",
    "number": 23,
    "nameAr": "عنابة",
    "nameFr": "ANNABA",
    "communes": [
      {
        "code": "2302",
        "nameAr": "برحال",
        "nameFr": "BERRAHAL"
      },
      {
        "code": "2303",
        "nameAr": "الحجار",
        "nameFr": "EL HADJAR"
      },
      {
        "code": "2304",
        "nameAr": "العلمة",
        "nameFr": "EULMA"
      },
      {
        "code": "2305",
        "nameAr": "البوني",
        "nameFr": "EL BOUNI"
      },
      {
        "code": "2306",
        "nameAr": "وادي العنب",
        "nameFr": "OUED EL ANEB"
      },
      {
        "code": "2307",
        "nameAr": "الشرفة",
        "nameFr": "CHEURFA"
      },
      {
        "code": "2308",
        "nameAr": "سعايدي",
        "nameFr": "SERAIDI"
      },
      {
        "code": "2309",
        "nameAr": "عين بوردة",
        "nameFr": "AIN BERDA"
      },
      {
        "code": "2310",
        "nameAr": "شطايبي",
        "nameFr": "CHETAIBI"
      },
      {
        "code": "2311",
        "nameAr": "سيدي عامر",
        "nameFr": "SIDI AMER"
      },
      {
        "code": "2312",
        "nameAr": "تريت",
        "nameFr": "TREAT"
      }
    ]
  },
  {
    "code": "2401",
    "number": 24,
    "nameAr": "قالمة",
    "nameFr": "GUELMA",
    "communes": [
      {
        "code": "2402",
        "nameAr": "نشماية",
        "nameFr": "NECHMEYA"
      },
      {
        "code": "2403",
        "nameAr": "بوعاطي محمود",
        "nameFr": "BOUATI MAHMOUD"
      },
      {
        "code": "2404",
        "nameAr": "وادي زناتي",
        "nameFr": "OUED ZENATI"
      },
      {
        "code": "2405",
        "nameAr": "تاملوكة",
        "nameFr": "TAMLOUKA"
      },
      {
        "code": "2406",
        "nameAr": "وادي فراغة",
        "nameFr": "OUED FRAGHA"
      },
      {
        "code": "2407",
        "nameAr": "عين صاندل",
        "nameFr": "AIN SANDEL"
      },
      {
        "code": "2408",
        "nameAr": "راس العقبة",
        "nameFr": "RAS EL AGBA"
      },
      {
        "code": "2409",
        "nameAr": "الدھوارة",
        "nameFr": "DAHOURA"
      },
      {
        "code": "2410",
        "nameAr": "بلخير",
        "nameFr": "BELKHIR"
      },
      {
        "code": "2411",
        "nameAr": "بن جراح",
        "nameFr": "BENDJARAH"
      },
      {
        "code": "2412",
        "nameAr": "بوحمدان",
        "nameFr": "BOUHAMDANE"
      },
      {
        "code": "2413",
        "nameAr": "عين مخلوف",
        "nameFr": "AIN MAKHLOUF"
      },
      {
        "code": "2414",
        "nameAr": "عين بن بيضاء",
        "nameFr": "AIN BEN BEIDA"
      },
      {
        "code": "2415",
        "nameAr": "خزارة",
        "nameFr": "KHEZARAS"
      },
      {
        "code": "2416",
        "nameAr": "بنى مزلين",
        "nameFr": "BENI MEZLINE"
      },
      {
        "code": "2417",
        "nameAr": "بوحشانة",
        "nameFr": "BOUHACHANA"
      },
      {
        "code": "2418",
        "nameAr": "قلعة بوسبع",
        "nameFr": "GUELAAT BOU SBAA"
      },
      {
        "code": "2419",
        "nameAr": "حمام المسخوطين",
        "nameFr": "HAMMAM DEBAGH"
      },
      {
        "code": "2420",
        "nameAr": "الفجوج",
        "nameFr": "EL FEDJOUDJ"
      },
      {
        "code": "2421",
        "nameAr": "برج صباط",
        "nameFr": "BORDJ SABAT"
      },
      {
        "code": "2422",
        "nameAr": "حمام النبايل",
        "nameFr": "HAMMAM NBAIL"
      },
      {
        "code": "2423",
        "nameAr": "عين العربى",
        "nameFr": "AIN LARBI"
      },
      {
        "code": "2424",
        "nameAr": "مجاز عمار",
        "nameFr": "MEDJEZ AMAR"
      },
      {
        "code": "2425",
        "nameAr": "بوشقوف",
        "nameFr": "BOUCHEGOUF"
      },
      {
        "code": "2426",
        "nameAr": "ھيليوبوليس",
        "nameFr": "HELIOPOLIS"
      },
      {
        "code": "2427",
        "nameAr": "عين الحساينية",
        "nameFr": "AIN HESSANIA"
      },
      {
        "code": "2428",
        "nameAr": "الركنية",
        "nameFr": "ROKNIA"
      },
      {
        "code": "2429",
        "nameAr": "سالوة عنونة",
        "nameFr": "SELLAOUA ANOUNA"
      },
      {
        "code": "2430",
        "nameAr": "مجاز الصفاء",
        "nameFr": "MEDJEZ SFA"
      },
      {
        "code": "2431",
        "nameAr": "بومھرة أحمد",
        "nameFr": "BOUMAHRA AHMED"
      },
      {
        "code": "2432",
        "nameAr": "عين رقادة",
        "nameFr": "AIN REGADA"
      },
      {
        "code": "2433",
        "nameAr": "وادى الشحم",
        "nameFr": "OUED CHEHAM"
      },
      {
        "code": "2434",
        "nameAr": "جبالة الخميسى",
        "nameFr": "DJEBALA KHEMISSI"
      }
    ]
  },
  {
    "code": "2501",
    "number": 25,
    "nameAr": "قسنطينة",
    "nameFr": "CONSTANTINE",
    "communes": [
      {
        "code": "2502",
        "nameAr": "حامة بوزيان",
        "nameFr": "HAMMA BOUZIANE"
      },
      {
        "code": "2503",
        "nameAr": "الھرية",
        "nameFr": "IBN BADIS"
      },
      {
        "code": "2504",
        "nameAr": "زيغود يوسف",
        "nameFr": "ZIGHOUT YOUCEF"
      },
      {
        "code": "2505",
        "nameAr": "ديدوش مراد",
        "nameFr": "DIDOUCHE MOURAD"
      },
      {
        "code": "2506",
        "nameAr": "الخروب",
        "nameFr": "EL KHROUB"
      },
      {
        "code": "2507",
        "nameAr": "عين عبيد",
        "nameFr": "AIN ABID"
      },
      {
        "code": "2508",
        "nameAr": "بنى حميدان",
        "nameFr": "BENI HAMIDEN"
      },
      {
        "code": "2509",
        "nameAr": "أولاد رحمون",
        "nameFr": "OULED RAHMOUNE"
      },
      {
        "code": "2510",
        "nameAr": "عين سمارة",
        "nameFr": "AIN SMARA"
      },
      {
        "code": "2511",
        "nameAr": "مسعود بوجريوة",
        "nameFr": "MESSAOUD BOUJERIOU"
      },
      {
        "code": "2512",
        "nameAr": "ابن زياد",
        "nameFr": "IBN ZIAD"
      },
      {
        "code": "2524",
        "nameAr": "عمال",
        "nameFr": "AMMAL"
      }
    ]
  },
  {
    "code": "2601",
    "number": 26,
    "nameAr": "المدية",
    "nameFr": "MEDEA",
    "communes": [
      {
        "code": "2602",
        "nameAr": "وزرة",
        "nameFr": "OUZERA"
      },
      {
        "code": "2603",
        "nameAr": "أولاد معرف",
        "nameFr": "OULED MAAREF"
      },
      {
        "code": "2604",
        "nameAr": "عين بوسيف",
        "nameFr": "AIN BOUCIF"
      },
      {
        "code": "2605",
        "nameAr": "العيساوية",
        "nameFr": "AISSAOUIA"
      },
      {
        "code": "2606",
        "nameAr": "اوالد دايد",
        "nameFr": "OULED DEIDE"
      },
      {
        "code": "2607",
        "nameAr": "العمرية",
        "nameFr": "EL OMARIA"
      },
      {
        "code": "2608",
        "nameAr": "دراق",
        "nameFr": "DERRAG"
      },
      {
        "code": "2609",
        "nameAr": "القلب الكبير",
        "nameFr": "EL GUELB EL KEBIR"
      },
      {
        "code": "2610",
        "nameAr": "بوعيش",
        "nameFr": "BOU AICHE"
      },
      {
        "code": "2611",
        "nameAr": "مزغنة",
        "nameFr": "MEZERANA"
      },
      {
        "code": "2612",
        "nameAr": "أولاد ابراھيم",
        "nameFr": "OULED BRAHIM"
      },
      {
        "code": "2613",
        "nameAr": "دميات",
        "nameFr": "TIZI MAHDI"
      },
      {
        "code": "2614",
        "nameAr": "سيدي زيان",
        "nameFr": "SIDI ZIANE"
      },
      {
        "code": "2615",
        "nameAr": "تامسقيدة",
        "nameFr": "TAMESGUIDA"
      },
      {
        "code": "2616",
        "nameAr": "الحمدانية",
        "nameFr": "EL HAMDANIA"
      },
      {
        "code": "2617",
        "nameAr": "الكاف الأخضر",
        "nameFr": "KEF LAKHDAR"
      },
      {
        "code": "2618",
        "nameAr": "شلالة العذاورة",
        "nameFr": "CHELLALET ADHAOURA"
      },
      {
        "code": "2619",
        "nameAr": "بوسكن",
        "nameFr": "BOUSKENE"
      },
      {
        "code": "2620",
        "nameAr": "الربعية",
        "nameFr": "REBAIA"
      },
      {
        "code": "2621",
        "nameAr": "بوشراحيل",
        "nameFr": "BOUCHRAHIL"
      },
      {
        "code": "2622",
        "nameAr": "أولاد ھالل",
        "nameFr": "OULED HELLAL"
      },
      {
        "code": "2623",
        "nameAr": "تفراوت",
        "nameFr": "TAFRAOUT"
      },
      {
        "code": "2624",
        "nameAr": "بعطة",
        "nameFr": "BAATA"
      },
      {
        "code": "2625",
        "nameAr": "بوغار",
        "nameFr": "BOGHAR"
      },
      {
        "code": "2626",
        "nameAr": "سيدي النعمان",
        "nameFr": "SIDI NAAMANE"
      },
      {
        "code": "2627",
        "nameAr": "أولاد بوعشرة",
        "nameFr": "OULED BOUACHRA"
      },
      {
        "code": "2628",
        "nameAr": "سيدي زھار",
        "nameFr": "SIDI ZAHAR"
      },
      {
        "code": "2629",
        "nameAr": "وادى حربيل",
        "nameFr": "OUED HARBIL"
      },
      {
        "code": "2630",
        "nameAr": "بن شكاو",
        "nameFr": "BENCHICAO"
      },
      {
        "code": "2631",
        "nameAr": "سيدى دامد",
        "nameFr": "SIDI DAMED"
      },
      {
        "code": "2632",
        "nameAr": "عزيز",
        "nameFr": "AZIZ"
      },
      {
        "code": "2633",
        "nameAr": "السواقى",
        "nameFr": "SOUAGUI"
      },
      {
        "code": "2634",
        "nameAr": "الزبيرية",
        "nameFr": "ZOUBIRIA"
      },
      {
        "code": "2635",
        "nameAr": "قصر البخارى",
        "nameFr": "KSAR BOUKHARI"
      },
      {
        "code": "2636",
        "nameAr": "الفزيزية",
        "nameFr": "EL AZIZIA"
      },
      {
        "code": "2637",
        "nameAr": "جواب",
        "nameFr": "DJOUAB"
      },
      {
        "code": "2638",
        "nameAr": "الشھبونية",
        "nameFr": "CHAHBOUNIA"
      },
      {
        "code": "2639",
        "nameAr": "مغراوة",
        "nameFr": "MEGHRAOUA"
      },
      {
        "code": "2640",
        "nameAr": "شنيقل",
        "nameFr": "CHENIGUEL"
      },
      {
        "code": "2641",
        "nameAr": "عين القصير",
        "nameFr": "AIN OUKSIR"
      },
      {
        "code": "2642",
        "nameAr": "أم الجليل",
        "nameFr": "OUM DJALIL"
      },
      {
        "code": "2643",
        "nameAr": "عوامرى",
        "nameFr": "OUAMRI"
      },
      {
        "code": "2644",
        "nameAr": "سى المحجوب",
        "nameFr": "SI MAHDJOUB"
      },
      {
        "code": "2645",
        "nameAr": "ثالثة الدوار",
        "nameFr": "TLATET EDDOUAR"
      },
      {
        "code": "2646",
        "nameAr": "بنى سليمان",
        "nameFr": "BENI SLIMANE"
      },
      {
        "code": "2647",
        "nameAr": "البرواقية",
        "nameFr": "BERROUAGHIA"
      },
      {
        "code": "2648",
        "nameAr": "سغوان",
        "nameFr": "SEGHOUANE"
      },
      {
        "code": "2649",
        "nameAr": "مفتاحة",
        "nameFr": "MEFTAHA"
      },
      {
        "code": "2650",
        "nameAr": "ميھوب",
        "nameFr": "MIHOUB"
      },
      {
        "code": "2651",
        "nameAr": "بوغزول",
        "nameFr": "BOUGHEZOUL"
      },
      {
        "code": "2652",
        "nameAr": "تابالط",
        "nameFr": "TABLAT"
      },
      {
        "code": "2653",
        "nameAr": "الحوضان",
        "nameFr": "DEUX BASSINS"
      },
      {
        "code": "2654",
        "nameAr": "ذراع السمار",
        "nameFr": "DRAA ESSAMAR"
      },
      {
        "code": "2655",
        "nameAr": "سيدي الربيع",
        "nameFr": "SIDI ERRABIA"
      },
      {
        "code": "2656",
        "nameAr": "بئر بن العابد",
        "nameFr": "BIR BEN LAABED"
      },
      {
        "code": "2657",
        "nameAr": "العوينات",
        "nameFr": "EL OUINET"
      },
      {
        "code": "2658",
        "nameAr": "أولاد عنتر",
        "nameFr": "OULED ANTAR"
      },
      {
        "code": "2659",
        "nameAr": "بوعيشون",
        "nameFr": "BOUAICHOUNE"
      },
      {
        "code": "2660",
        "nameAr": "حناشة",
        "nameFr": "HANNACHA"
      },
      {
        "code": "2661",
        "nameAr": "صدراية",
        "nameFr": "SEDRAIA"
      },
      {
        "code": "2662",
        "nameAr": "مجبر",
        "nameFr": "MOUDJBAR"
      },
      {
        "code": "2663",
        "nameAr": "خامس بوجمعة",
        "nameFr": "KHAMS DJOUAMAA"
      },
      {
        "code": "2664",
        "nameAr": "سانق",
        "nameFr": "SANEG"
      }
    ]
  },
  {
    "code": "2701",
    "number": 27,
    "nameAr": "مستغانم",
    "nameFr": "MOSTAGANEM",
    "communes": [
      {
        "code": "2702",
        "nameAr": "صيادة",
        "nameFr": "SAYADA"
      },
      {
        "code": "2703",
        "nameAr": "فرناكة",
        "nameFr": "FORNAKA"
      },
      {
        "code": "2704",
        "nameAr": "ستيدية",
        "nameFr": "STIDIA"
      },
      {
        "code": "2705",
        "nameAr": "عين نويسى",
        "nameFr": "AIN NOUISSY"
      },
      {
        "code": "2706",
        "nameAr": "حاسى معاش",
        "nameFr": "HASI MAMECHE"
      },
      {
        "code": "2707",
        "nameAr": "عين تادلس",
        "nameFr": "AIN TEDLES"
      },
      {
        "code": "2708",
        "nameAr": "صور",
        "nameFr": "SOUR"
      },
      {
        "code": "2709",
        "nameAr": "وادى الخير",
        "nameFr": "OUED EL KHEIR"
      },
      {
        "code": "2710",
        "nameAr": "سيدي بلعاتر",
        "nameFr": "SIDI BELATAR"
      },
      {
        "code": "2711",
        "nameAr": "خير الدين",
        "nameFr": "KHEIREDINE"
      },
      {
        "code": "2712",
        "nameAr": "سيدي على",
        "nameFr": "SIDI ALI"
      },
      {
        "code": "2713",
        "nameAr": "عبد المالك رمضان",
        "nameFr": "ABDELMALEK RAMDANE"
      },
      {
        "code": "2714",
        "nameAr": "حجاج",
        "nameFr": "HADJADJ"
      },
      {
        "code": "2715",
        "nameAr": "نقمارية",
        "nameFr": "NEKMARIA"
      },
      {
        "code": "2716",
        "nameAr": "سيدي لخضر",
        "nameFr": "SIDI LAKHDAR"
      },
      {
        "code": "2717",
        "nameAr": "عشعاشة",
        "nameFr": "ACHAACHA"
      },
      {
        "code": "2718",
        "nameAr": "خضراء",
        "nameFr": "KHADRA"
      },
      {
        "code": "2719",
        "nameAr": "بوقيراط",
        "nameFr": "BOUGUIRAT"
      },
      {
        "code": "2720",
        "nameAr": "سيرات",
        "nameFr": "SIRAT"
      },
      {
        "code": "2721",
        "nameAr": "عين سيدي الشريف",
        "nameFr": "AIN S.CHERIF"
      },
      {
        "code": "2722",
        "nameAr": "ماسرة",
        "nameFr": "MESRA"
      },
      {
        "code": "2723",
        "nameAr": "منصورة",
        "nameFr": "MANSOURAH"
      },
      {
        "code": "2724",
        "nameAr": "السوافلية",
        "nameFr": "SOUAFLIA"
      },
      {
        "code": "2725",
        "nameAr": "أولاد بوغالم",
        "nameFr": "OULED BOUGHALEM"
      },
      {
        "code": "2726",
        "nameAr": "أولاد مع ?",
        "nameFr": "OULED MAALEF"
      },
      {
        "code": "2727",
        "nameAr": "مزغران",
        "nameFr": "MAZAGRAN"
      },
      {
        "code": "2728",
        "nameAr": "عين بودينار",
        "nameFr": "AIN BOUDINAR"
      },
      {
        "code": "2729",
        "nameAr": "تزقايت",
        "nameFr": "TAZGAIT"
      },
      {
        "code": "2730",
        "nameAr": "صفصاف",
        "nameFr": "SAF SAF"
      },
      {
        "code": "2731",
        "nameAr": "الطواھيرية",
        "nameFr": "TOUAHRIA"
      },
      {
        "code": "2732",
        "nameAr": "الحسيان",
        "nameFr": "EL HASSIANE"
      }
    ]
  },
  {
    "code": "2801",
    "number": 28,
    "nameAr": "المسيلة",
    "nameFr": "MSILA",
    "communes": [
      {
        "code": "2802",
        "nameAr": "المعاضيد",
        "nameFr": "MAADID"
      },
      {
        "code": "2803",
        "nameAr": "حمام الضلعة",
        "nameFr": "HAMMAM DHALAA"
      },
      {
        "code": "2804",
        "nameAr": "أولاد دراج",
        "nameFr": "OULED DERRADJ"
      },
      {
        "code": "2805",
        "nameAr": "تارمونت",
        "nameFr": "TARMOUNT"
      },
      {
        "code": "2806",
        "nameAr": "المطارفة",
        "nameFr": "MTARFA"
      },
      {
        "code": "2807",
        "nameAr": "خبانة",
        "nameFr": "KHOUBANA"
      },
      {
        "code": "2808",
        "nameAr": "مسيف",
        "nameFr": "MCIF"
      },
      {
        "code": "2809",
        "nameAr": "شالل",
        "nameFr": "CHELLAL"
      },
      {
        "code": "2810",
        "nameAr": "أولاد ماضى",
        "nameFr": "OULED MAHDI"
      },
      {
        "code": "2811",
        "nameAr": "مقرة",
        "nameFr": "MAGRA"
      },
      {
        "code": "2812",
        "nameAr": "برھوم",
        "nameFr": "BERHOUM"
      },
      {
        "code": "2813",
        "nameAr": "عين خضراء",
        "nameFr": "AIN KHADRA"
      },
      {
        "code": "2814",
        "nameAr": "أولاد عدى القبالة",
        "nameFr": "OULED ADDI GUEBALA"
      },
      {
        "code": "2815",
        "nameAr": "بلعايبة",
        "nameFr": "BELAIBA"
      },
      {
        "code": "2816",
        "nameAr": "سيدي عيسى",
        "nameFr": "SIDI AISSA"
      },
      {
        "code": "2817",
        "nameAr": "عين الحجل",
        "nameFr": "AIN EL HADJEL"
      },
      {
        "code": "2818",
        "nameAr": "سيدي ھجرس",
        "nameFr": "SIDI HADJERES"
      },
      {
        "code": "2819",
        "nameAr": "ونوغة",
        "nameFr": "OUANOUGHA"
      },
      {
        "code": "2820",
        "nameAr": "بوسعادة",
        "nameFr": "BOUSAADA"
      },
      {
        "code": "2821",
        "nameAr": "أولاد سيدي ابراھيم",
        "nameFr": "OULED SIDI BRAHIM"
      },
      {
        "code": "2822",
        "nameAr": "سيدي عامر",
        "nameFr": "SIDI AMEUR"
      },
      {
        "code": "2823",
        "nameAr": "تامسة",
        "nameFr": "TAMSA"
      },
      {
        "code": "2824",
        "nameAr": "بن سرور",
        "nameFr": "BEN SROUR"
      },
      {
        "code": "2825",
        "nameAr": "أولاد سليمان",
        "nameFr": "OULED SLIMANE"
      },
      {
        "code": "2826",
        "nameAr": "الحوامد",
        "nameFr": "EL HOUAMED"
      },
      {
        "code": "2827",
        "nameAr": "الھامل",
        "nameFr": "EL HAMEL"
      },
      {
        "code": "2828",
        "nameAr": "أولاد منصور",
        "nameFr": "OULED MANSOUR"
      },
      {
        "code": "2829",
        "nameAr": "المعاريف",
        "nameFr": "MAARIF"
      },
      {
        "code": "2830",
        "nameAr": "دھاھنة",
        "nameFr": "DEHAHNA"
      },
      {
        "code": "2831",
        "nameAr": "بوطى السايح",
        "nameFr": "BOUTI SAYAH"
      },
      {
        "code": "2832",
        "nameAr": "خطوطي صجير",
        "nameFr": "KHETTOUTI SED EL DJIR"
      },
      {
        "code": "2833",
        "nameAr": "الزرزور",
        "nameFr": "ZARZOUR"
      },
      {
        "code": "2834",
        "nameAr": "وادى الشعير",
        "nameFr": "MOHAMED BOUDIAF"
      },
      {
        "code": "2835",
        "nameAr": "بن الزوه",
        "nameFr": "BENZOUH"
      },
      {
        "code": "2836",
        "nameAr": "بئر الفضة",
        "nameFr": "BIR FODA"
      },
      {
        "code": "2837",
        "nameAr": "عين فارس",
        "nameFr": "AIN FARES"
      },
      {
        "code": "2838",
        "nameAr": "سيدي محمد",
        "nameFr": "SIDI MHAMED"
      },
      {
        "code": "2839",
        "nameAr": "أولاد عطية",
        "nameFr": "OULED ATIA"
      },
      {
        "code": "2840",
        "nameAr": "الصوامع",
        "nameFr": "SOUAMAA"
      },
      {
        "code": "2841",
        "nameAr": "عين الملح",
        "nameFr": "AIN EL MELH"
      },
      {
        "code": "2842",
        "nameAr": "مجدل",
        "nameFr": "MEDJEDEL"
      },
      {
        "code": "2843",
        "nameAr": "سليم",
        "nameFr": "SLIM"
      },
      {
        "code": "2844",
        "nameAr": "عين الريش",
        "nameFr": "AIN ERRICH"
      },
      {
        "code": "2845",
        "nameAr": "بنى يلمان",
        "nameFr": "BENI ILMANE"
      },
      {
        "code": "2846",
        "nameAr": "ولتام",
        "nameFr": "OULTENE"
      },
      {
        "code": "2847",
        "nameAr": "جبل مسعد",
        "nameFr": "DJEBEL MESSAAD"
      }
    ]
  },
  {
    "code": "2901",
    "number": 29,
    "nameAr": "معسكر",
    "nameFr": "MASCARA",
    "communes": [
      {
        "code": "2902",
        "nameAr": "بوحنيفية",
        "nameFr": "BOU HANIFIA"
      },
      {
        "code": "2903",
        "nameAr": "تيزي",
        "nameFr": "TIZI"
      },
      {
        "code": "2904",
        "nameAr": "حسين",
        "nameFr": "HACINE"
      },
      {
        "code": "2905",
        "nameAr": "معوسة",
        "nameFr": "MAOUSSA"
      },
      {
        "code": "2906",
        "nameAr": "تيغنيف",
        "nameFr": "TEGHENIF"
      },
      {
        "code": "2907",
        "nameAr": "الھاشم",
        "nameFr": "EL HACHEM"
      },
      {
        "code": "2908",
        "nameAr": "سيدي قادة",
        "nameFr": "SIDI KADA"
      },
      {
        "code": "2909",
        "nameAr": "زلماطة",
        "nameFr": "ZELMATA"
      },
      {
        "code": "2910",
        "nameAr": "واد الأبطال",
        "nameFr": "OUED EL ABTAL"
      },
      {
        "code": "2911",
        "nameAr": "عين فراح",
        "nameFr": "AIN FERAH"
      },
      {
        "code": "2912",
        "nameAr": "غريس",
        "nameFr": "GHRISS"
      },
      {
        "code": "2913",
        "nameAr": "فروحة",
        "nameFr": "FROHA"
      },
      {
        "code": "2914",
        "nameAr": "ماتي مور",
        "nameFr": "MATEMORE"
      },
      {
        "code": "2915",
        "nameAr": "مكضة",
        "nameFr": "MAKDHA"
      },
      {
        "code": "2916",
        "nameAr": "سيدي بوسعيد",
        "nameFr": "SIDI BOUSSAID"
      },
      {
        "code": "2917",
        "nameAr": "البرج",
        "nameFr": "EL BORDJ"
      },
      {
        "code": "2918",
        "nameAr": "عين فكان",
        "nameFr": "AIN FEKAN"
      },
      {
        "code": "2919",
        "nameAr": "بنيان",
        "nameFr": "BENIAN"
      },
      {
        "code": "2920",
        "nameAr": "خالوفة",
        "nameFr": "KHALOUIA"
      },
      {
        "code": "2921",
        "nameAr": "المنور",
        "nameFr": "EL MENAOUER"
      },
      {
        "code": "2922",
        "nameAr": "واد التارية",
        "nameFr": "OUED TARIA"
      },
      {
        "code": "2923",
        "nameAr": "عوف",
        "nameFr": "AOUF"
      },
      {
        "code": "2924",
        "nameAr": "عين فارس",
        "nameFr": "AIN FARES"
      },
      {
        "code": "2925",
        "nameAr": "عين فراس",
        "nameFr": "AIN FRASS"
      },
      {
        "code": "2926",
        "nameAr": "سيق",
        "nameFr": "SIG"
      },
      {
        "code": "2927",
        "nameAr": "عقاز",
        "nameFr": "OGGAZ"
      },
      {
        "code": "2928",
        "nameAr": "عاليمية",
        "nameFr": "ALAIMIA"
      },
      {
        "code": "2929",
        "nameAr": "القعدة",
        "nameFr": "EL GAADA"
      },
      {
        "code": "2930",
        "nameAr": "زھانة",
        "nameFr": "ZAHANA"
      },
      {
        "code": "2931",
        "nameAr": "المحمدية",
        "nameFr": "MOHAMMADIA"
      },
      {
        "code": "2932",
        "nameAr": "سيدي عبد المومن",
        "nameFr": "SIDI ABDELMOUMENE"
      },
      {
        "code": "2933",
        "nameAr": "فرقيق",
        "nameFr": "FERRAGUIG"
      },
      {
        "code": "2934",
        "nameAr": "الغمري",
        "nameFr": "EL GHOMRI"
      },
      {
        "code": "2935",
        "nameAr": "سجرارة",
        "nameFr": "SEDJERARA"
      },
      {
        "code": "2936",
        "nameAr": "مقتادوز",
        "nameFr": "MOCTA DOUZ"
      },
      {
        "code": "2937",
        "nameAr": "بوھاتي",
        "nameFr": "BOU HENNI"
      },
      {
        "code": "2938",
        "nameAr": "قتنة",
        "nameFr": "EL GUETTENA"
      },
      {
        "code": "2939",
        "nameAr": "المامونية",
        "nameFr": "EL MAMOUNIA"
      },
      {
        "code": "2940",
        "nameAr": "الكورت",
        "nameFr": "EL KEURT"
      },
      {
        "code": "2941",
        "nameAr": "غروس",
        "nameFr": "GHARROUS"
      },
      {
        "code": "2942",
        "nameAr": "غرجوم",
        "nameFr": "GUERDJOUM"
      },
      {
        "code": "2943",
        "nameAr": "شرفة",
        "nameFr": "CHORFA"
      },
      {
        "code": "2944",
        "nameAr": "راس عين عميروش",
        "nameFr": "RAS AIN AMIROUCHE"
      },
      {
        "code": "2945",
        "nameAr": "نصمت",
        "nameFr": "NESMOT"
      },
      {
        "code": "2946",
        "nameAr": "سيدي عبد الجيار",
        "nameFr": "SIDI ABDELDJEBAR"
      },
      {
        "code": "2947",
        "nameAr": "سحايلية",
        "nameFr": "SEHAILIA"
      }
    ]
  },
  {
    "code": "3001",
    "number": 30,
    "nameAr": "ورقلة",
    "nameFr": "OUARGLA",
    "communes": [
      {
        "code": "3002",
        "nameAr": "عين البيضاء",
        "nameFr": "AIN BEIDA"
      },
      {
        "code": "3003",
        "nameAr": "نقوسة",
        "nameFr": "NGOUSSA"
      },
      {
        "code": "3004",
        "nameAr": "حاسى مسعود",
        "nameFr": "HASSI MESSAOUD"
      },
      {
        "code": "3005",
        "nameAr": "الرويسات",
        "nameFr": "ROUISSET"
      },
      {
        "code": "3006",
        "nameAr": "بليدة عامر",
        "nameFr": "BALIDAT AMEUR"
      },
      {
        "code": "3007",
        "nameAr": "تيبسبست",
        "nameFr": "TEBESBEST"
      },
      {
        "code": "3008",
        "nameAr": "نزلة",
        "nameFr": "NEZLA"
      },
      {
        "code": "3009",
        "nameAr": "الزاوية العابدية",
        "nameFr": "ZAOUIA EL ABIDIA"
      },
      {
        "code": "3010",
        "nameAr": "سيدي سليمان",
        "nameFr": "SIDI SLIMANE"
      },
      {
        "code": "3011",
        "nameAr": "سيدي خويلد",
        "nameFr": "SIDI KHOUILED"
      },
      {
        "code": "3012",
        "nameAr": "حاسي بن عبد ?",
        "nameFr": "HASSI BEN ABDELLAH"
      },
      {
        "code": "3013",
        "nameAr": "توقرت",
        "nameFr": "TOUGGOURT"
      },
      {
        "code": "3014",
        "nameAr": "الحجيرة",
        "nameFr": "EL HADJIRA"
      },
      {
        "code": "3015",
        "nameAr": "الطيبات",
        "nameFr": "TAIBET"
      },
      {
        "code": "3016",
        "nameAr": "تماسين",
        "nameFr": "TAMACINE"
      },
      {
        "code": "3017",
        "nameAr": "بن ناصر",
        "nameFr": "BENACEUR"
      },
      {
        "code": "3018",
        "nameAr": "المنقر",
        "nameFr": "MNAGUER"
      },
      {
        "code": "3019",
        "nameAr": "المقارين",
        "nameFr": "MEGARINE"
      },
      {
        "code": "3020",
        "nameAr": "العالية",
        "nameFr": "EL ALLIA"
      },
      {
        "code": "3021",
        "nameAr": "البرمة",
        "nameFr": "EL BORMA"
      }
    ]
  },
  {
    "code": "3101",
    "number": 31,
    "nameAr": "وھران",
    "nameFr": "ORAN",
    "communes": [
      {
        "code": "3102",
        "nameAr": "قديل",
        "nameFr": "GDYEL"
      },
      {
        "code": "3103",
        "nameAr": "بئر الجير",
        "nameFr": "BIR EL DJIR"
      },
      {
        "code": "3104",
        "nameAr": "حاسي بونيف",
        "nameFr": "HASSI BOUNIF"
      },
      {
        "code": "3105",
        "nameAr": "السانية",
        "nameFr": "ES SENIA"
      },
      {
        "code": "3106",
        "nameAr": "أرزيو",
        "nameFr": "ARZEW"
      },
      {
        "code": "3107",
        "nameAr": "بطيوة",
        "nameFr": "BETHIOUA"
      },
      {
        "code": "3108",
        "nameAr": "مرسى الحجاج",
        "nameFr": "MARSAT EL HADJADJ"
      },
      {
        "code": "3109",
        "nameAr": "عين الترك",
        "nameFr": "AIN TURK"
      },
      {
        "code": "3110",
        "nameAr": "العنصر",
        "nameFr": "EL ANCAR"
      },
      {
        "code": "3111",
        "nameAr": "وادى تليالت",
        "nameFr": "OUED TLELAT"
      },
      {
        "code": "3112",
        "nameAr": "طفراوى",
        "nameFr": "TAFRAOUI"
      },
      {
        "code": "3113",
        "nameAr": "سيدي الشحمى",
        "nameFr": "SIDI CHAMI"
      },
      {
        "code": "3114",
        "nameAr": "بوفتيس",
        "nameFr": "BOUFATIS"
      },
      {
        "code": "3115",
        "nameAr": "المرسى الكبير",
        "nameFr": "MERS EL KEBIR"
      },
      {
        "code": "3116",
        "nameAr": "بوصفر",
        "nameFr": "BOUSFER"
      },
      {
        "code": "3117",
        "nameAr": "الكرمة",
        "nameFr": "EL KERMA"
      },
      {
        "code": "3118",
        "nameAr": "البراية",
        "nameFr": "EL BRAYA"
      },
      {
        "code": "3119",
        "nameAr": "حاسى بن عقبة",
        "nameFr": "HASSI BEN OKBA"
      },
      {
        "code": "3120",
        "nameAr": "بن فريحة",
        "nameFr": "BENFREHA"
      },
      {
        "code": "3121",
        "nameAr": "حاسى مفسوخ",
        "nameFr": "HASSI MEFSOUKH"
      },
      {
        "code": "3122",
        "nameAr": "سيدي بن يبقى",
        "nameFr": "SIDI BEN YEBKA"
      },
      {
        "code": "3123",
        "nameAr": "مسرغين",
        "nameFr": "MISSERGHIN"
      },
      {
        "code": "3124",
        "nameAr": "بوتليليس",
        "nameFr": "BOUTLELIS"
      },
      {
        "code": "3125",
        "nameAr": "عين الكرمة",
        "nameFr": "AIN KERMA"
      },
      {
        "code": "3126",
        "nameAr": "عين البية",
        "nameFr": "AIN BIYA"
      }
    ]
  },
  {
    "code": "3201",
    "number": 32,
    "nameAr": "البيض",
    "nameFr": "EL BAYADH",
    "communes": [
      {
        "code": "3202",
        "nameAr": "روقاصة",
        "nameFr": "ROGASSA"
      },
      {
        "code": "3203",
        "nameAr": "ستيتين",
        "nameFr": "STITTEN"
      },
      {
        "code": "3204",
        "nameAr": "بريزينة",
        "nameFr": "BREZINA"
      },
      {
        "code": "3205",
        "nameAr": "غسول",
        "nameFr": "GHASSOUL"
      },
      {
        "code": "3206",
        "nameAr": "بوعالم",
        "nameFr": "BOUALEM"
      },
      {
        "code": "3207",
        "nameAr": "البيض سيدي الشيخ",
        "nameFr": "EL ABIODH SIDI CHEIKH"
      },
      {
        "code": "3208",
        "nameAr": "عين العراك",
        "nameFr": "AIN EL ORAK"
      },
      {
        "code": "3209",
        "nameAr": "عرباوة",
        "nameFr": "ARBAOUAT"
      },
      {
        "code": "3210",
        "nameAr": "بوقطب",
        "nameFr": "BOUGTOUB"
      },
      {
        "code": "3211",
        "nameAr": "الخيثر",
        "nameFr": "EL KHEITER"
      },
      {
        "code": "3212",
        "nameAr": "الكاف الأحمر",
        "nameFr": "KEF LAHMAR"
      },
      {
        "code": "3213",
        "nameAr": "بوسمغون",
        "nameFr": "BOUSSEMGHOUN"
      },
      {
        "code": "3214",
        "nameAr": "شاللة",
        "nameFr": "CHELLALA"
      },
      {
        "code": "3215",
        "nameAr": "كراكدة",
        "nameFr": "KRAKDA"
      },
      {
        "code": "3216",
        "nameAr": "البنود",
        "nameFr": "EL BNOUD"
      },
      {
        "code": "3217",
        "nameAr": "الشقيق",
        "nameFr": "CHEGUIG"
      },
      {
        "code": "3218",
        "nameAr": "سيدي عامر",
        "nameFr": "SIDI AMAR"
      },
      {
        "code": "3219",
        "nameAr": "المھارة",
        "nameFr": "MEHARA"
      },
      {
        "code": "3220",
        "nameAr": "توسمولين",
        "nameFr": "TOUSMOULINE"
      },
      {
        "code": "3221",
        "nameAr": "سيدي سليمان",
        "nameFr": "SIDI SLIMANE"
      },
      {
        "code": "3222",
        "nameAr": "سيدي طيفور",
        "nameFr": "SIDI TIFOUR"
      }
    ]
  },
  {
    "code": "3301",
    "number": 33,
    "nameAr": "ايليزى",
    "nameFr": "ILLIZI",
    "communes": [
      {
        "code": "3302",
        "nameAr": "جانت",
        "nameFr": "DJANET"
      },
      {
        "code": "3303",
        "nameAr": "دبداب",
        "nameFr": "DEB DEB"
      },
      {
        "code": "3304",
        "nameAr": "برج عمر ادريس",
        "nameFr": "BORDJ OMAR DRISS"
      },
      {
        "code": "3305",
        "nameAr": "برج الحواس",
        "nameFr": "BORDJ EL HOUASSE"
      },
      {
        "code": "3306",
        "nameAr": "ان اميناس",
        "nameFr": "IN AMENAS"
      }
    ]
  },
  {
    "code": "3401",
    "number": 34,
    "nameAr": "برج بوعريرج",
    "nameFr": "BBARRERIDJ",
    "communes": [
      {
        "code": "3402",
        "nameAr": "راس الواد",
        "nameFr": "RAS EL OUED"
      },
      {
        "code": "3403",
        "nameAr": "برج زمورة",
        "nameFr": "BORDJ ZEMOURA"
      },
      {
        "code": "3404",
        "nameAr": "منصورة",
        "nameFr": "MANSOURA"
      },
      {
        "code": "3405",
        "nameAr": "المھير",
        "nameFr": "EL MHIR"
      },
      {
        "code": "3406",
        "nameAr": "بن داود",
        "nameFr": "BEN DAOUD"
      },
      {
        "code": "3407",
        "nameAr": "العشير",
        "nameFr": "EL ACHIR"
      },
      {
        "code": "3408",
        "nameAr": "عين تاغروت",
        "nameFr": "AIN TAGHROUT"
      },
      {
        "code": "3409",
        "nameAr": "برج غدير",
        "nameFr": "BORDJ GHEDIR"
      },
      {
        "code": "3410",
        "nameAr": "سيدي مبارك",
        "nameFr": "SIDI EMBAREK"
      },
      {
        "code": "3411",
        "nameAr": "الحمادية",
        "nameFr": "EL HAMADIA"
      },
      {
        "code": "3412",
        "nameAr": "بليمور",
        "nameFr": "BELIMOUR"
      },
      {
        "code": "3413",
        "nameAr": "مجانة",
        "nameFr": "MEDJANA"
      },
      {
        "code": "3414",
        "nameAr": "ثنية النصر",
        "nameFr": "TENIET EN NASR"
      },
      {
        "code": "3415",
        "nameAr": "جعافرة",
        "nameFr": "DJAAFRA"
      },
      {
        "code": "3416",
        "nameAr": "إلماين",
        "nameFr": "EL MAIN"
      },
      {
        "code": "3417",
        "nameAr": "أولاد براھم",
        "nameFr": "OULED BRAHIM"
      },
      {
        "code": "3418",
        "nameAr": "أولاد دحمان",
        "nameFr": "OULED DAHMANE"
      },
      {
        "code": "3419",
        "nameAr": "حسناوة",
        "nameFr": "HASNAOUA"
      },
      {
        "code": "3420",
        "nameAr": "خليل",
        "nameFr": "KHELIL"
      },
      {
        "code": "3421",
        "nameAr": "تقاليت",
        "nameFr": "TAGLAIT"
      },
      {
        "code": "3422",
        "nameAr": "القصور",
        "nameFr": "KSOUR"
      },
      {
        "code": "3423",
        "nameAr": "والد سيدي براھيم",
        "nameFr": "OULED SIDI BRAHIM"
      },
      {
        "code": "3424",
        "nameAr": "تفرق",
        "nameFr": "TAFREG"
      },
      {
        "code": "3425",
        "nameAr": "قلة",
        "nameFr": "COLLA"
      },
      {
        "code": "3426",
        "nameAr": "تقصطر",
        "nameFr": "TIXTER"
      },
      {
        "code": "3427",
        "nameAr": "العش",
        "nameFr": "EL ACH"
      },
      {
        "code": "3428",
        "nameAr": "العنصر",
        "nameFr": "EL ANCEUR"
      },
      {
        "code": "3429",
        "nameAr": "تسمارت",
        "nameFr": "TESMART"
      },
      {
        "code": "3430",
        "nameAr": "عين تسرة",
        "nameFr": "AIN TESRA"
      },
      {
        "code": "3431",
        "nameAr": "بئر قصدالي",
        "nameFr": "BIR KASDALI"
      },
      {
        "code": "3432",
        "nameAr": "الغسالة",
        "nameFr": "GHILASSA"
      },
      {
        "code": "3433",
        "nameAr": "الرابطة",
        "nameFr": "RABTA"
      },
      {
        "code": "3434",
        "nameAr": "الحرازة",
        "nameFr": "HARAZA"
      }
    ]
  },
  {
    "code": "3501",
    "number": 35,
    "nameAr": "بومرداس",
    "nameFr": "BOUMERDES",
    "communes": [
      {
        "code": "3502",
        "nameAr": "بودواو",
        "nameFr": "BOUDOUAOU"
      },
      {
        "code": "3503",
        "nameAr": "أفير",
        "nameFr": "AFIR"
      },
      {
        "code": "3504",
        "nameAr": "برج منايل",
        "nameFr": "BORDJ MENAIEL"
      },
      {
        "code": "3505",
        "nameAr": "بغلية",
        "nameFr": "BAGHLIA"
      },
      {
        "code": "3506",
        "nameAr": "سيدي داود",
        "nameFr": "SIDI DAOUD"
      },
      {
        "code": "3507",
        "nameAr": "الناصرية",
        "nameFr": "NACIRIA"
      },
      {
        "code": "3508",
        "nameAr": "جينات",
        "nameFr": "DJINET"
      },
      {
        "code": "3509",
        "nameAr": "يسر",
        "nameFr": "ISSER"
      },
      {
        "code": "3510",
        "nameAr": "زموري",
        "nameFr": "ZEMMOURI"
      },
      {
        "code": "3511",
        "nameAr": "سي مصطفى",
        "nameFr": "SI MUSTAPHA"
      },
      {
        "code": "3512",
        "nameAr": "تيجلبين",
        "nameFr": "TIDJELABINE"
      },
      {
        "code": "3513",
        "nameAr": "شعبة العامر",
        "nameFr": "CHAABET EL AMEUR"
      },
      {
        "code": "3514",
        "nameAr": "الثنية",
        "nameFr": "THENIA"
      },
      {
        "code": "3515",
        "nameAr": "تمزريت",
        "nameFr": "TIMEZRIT"
      },
      {
        "code": "3516",
        "nameAr": "قورسو",
        "nameFr": "CORSO"
      },
      {
        "code": "3517",
        "nameAr": "أولاد موسى",
        "nameFr": "OULED MOUSSA"
      },
      {
        "code": "3518",
        "nameAr": "الأربعطاش",
        "nameFr": "LARBATACHE"
      },
      {
        "code": "3519",
        "nameAr": "بوزرقزق قدارة",
        "nameFr": "BOUZEGZA KEDARA"
      },
      {
        "code": "3520",
        "nameAr": "تورقة",
        "nameFr": "TAOURGA"
      },
      {
        "code": "3521",
        "nameAr": "أولاد عيسى",
        "nameFr": "OULED AISSA"
      },
      {
        "code": "3522",
        "nameAr": "بن شود",
        "nameFr": "BENCHOUD"
      },
      {
        "code": "3523",
        "nameAr": "دلس",
        "nameFr": "DELLYS"
      },
      {
        "code": "3525",
        "nameAr": "بنى عمران",
        "nameFr": "BENI AMRANE"
      },
      {
        "code": "3526",
        "nameAr": "سوق الحد",
        "nameFr": "SOUK EL HAD"
      },
      {
        "code": "3527",
        "nameAr": "بودواو البحرى",
        "nameFr": "BOUDOUAOU EL BAHRI"
      },
      {
        "code": "3528",
        "nameAr": "أولاد ھداج",
        "nameFr": "OULED HEDADJ"
      },
      {
        "code": "3529",
        "nameAr": "لقاطة",
        "nameFr": "LEGHATA"
      },
      {
        "code": "3530",
        "nameAr": "حمادى",
        "nameFr": "HAMMEDI"
      },
      {
        "code": "3531",
        "nameAr": "خميس الخشنة",
        "nameFr": "KHEMIS EL KHECHNA"
      },
      {
        "code": "3532",
        "nameAr": "الخروبة",
        "nameFr": "EL KHARROUBA"
      }
    ]
  },
  {
    "code": "3601",
    "number": 36,
    "nameAr": "الطارف",
    "nameFr": "EL TARF",
    "communes": [
      {
        "code": "3602",
        "nameAr": "بوحجار",
        "nameFr": "BOU HADJAR"
      },
      {
        "code": "3603",
        "nameAr": "بن مھيدى",
        "nameFr": "BEN MHIDI"
      },
      {
        "code": "3604",
        "nameAr": "بوقوس",
        "nameFr": "BOUGOUS"
      },
      {
        "code": "3605",
        "nameAr": "القالة",
        "nameFr": "EL KALA"
      },
      {
        "code": "3606",
        "nameAr": "عين العسل",
        "nameFr": "AIN EL ASSEL"
      },
      {
        "code": "3607",
        "nameAr": "العيون",
        "nameFr": "EL AIOUN"
      },
      {
        "code": "3608",
        "nameAr": "بوثلجة",
        "nameFr": "BOUTELDJA"
      },
      {
        "code": "3609",
        "nameAr": "السوارخ",
        "nameFr": "SOUAREKH"
      },
      {
        "code": "3610",
        "nameAr": "برحان",
        "nameFr": "BERRIHANE"
      },
      {
        "code": "3611",
        "nameAr": "بحيرة الطيور",
        "nameFr": "LAC DES OISEAUX"
      },
      {
        "code": "3612",
        "nameAr": "الشافية",
        "nameFr": "CHEFIA"
      },
      {
        "code": "3613",
        "nameAr": "الذرعان",
        "nameFr": "DREAN"
      },
      {
        "code": "3614",
        "nameAr": "شھانى",
        "nameFr": "CHIHANI"
      },
      {
        "code": "3615",
        "nameAr": "شبايطة مختار",
        "nameFr": "CHEBAITA MOKHTAR"
      },
      {
        "code": "3616",
        "nameAr": "البسباس",
        "nameFr": "BESBES"
      },
      {
        "code": "3617",
        "nameAr": "عصفور",
        "nameFr": "ASFOUR"
      },
      {
        "code": "3618",
        "nameAr": "الشط",
        "nameFr": "BENI AMAR"
      },
      {
        "code": "3619",
        "nameAr": "زريزر",
        "nameFr": "ZERIZER"
      },
      {
        "code": "3620",
        "nameAr": "الزيتونة",
        "nameFr": "ZITOUNA"
      },
      {
        "code": "3621",
        "nameAr": "عين الكرمة",
        "nameFr": "AIN KERMA"
      },
      {
        "code": "3622",
        "nameAr": "وادى الزيتون",
        "nameFr": "OUED ZITOUN"
      },
      {
        "code": "3623",
        "nameAr": "حمام بنى صالح",
        "nameFr": "HAMMAM BENI SALAH"
      },
      {
        "code": "3624",
        "nameAr": "رمل سوق",
        "nameFr": "RAML SOUK"
      }
    ]
  },
  {
    "code": "3701",
    "number": 37,
    "nameAr": "تندوف",
    "nameFr": "TINDOUF",
    "communes": [
      {
        "code": "3702",
        "nameAr": "أم العسل",
        "nameFr": "OUM EL ASSEL"
      }
    ]
  },
  {
    "code": "3801",
    "number": 38,
    "nameAr": "تيسمسيلت",
    "nameFr": "TISSEMSSILT",
    "communes": [
      {
        "code": "3802",
        "nameAr": "برج بونعامة",
        "nameFr": "BORDJ BOU NAAMA"
      },
      {
        "code": "3803",
        "nameAr": "ثنية الأحد",
        "nameFr": "THENIET HAD"
      },
      {
        "code": "3804",
        "nameAr": "الأزھرية",
        "nameFr": "LAZHARIA"
      },
      {
        "code": "3805",
        "nameAr": "بنى شعيب",
        "nameFr": "BENI CHAIB"
      },
      {
        "code": "3806",
        "nameAr": "الأرجم",
        "nameFr": "LARDJEM"
      },
      {
        "code": "3807",
        "nameAr": "ملعب",
        "nameFr": "MELAAB"
      },
      {
        "code": "3808",
        "nameAr": "سيدي العنترى",
        "nameFr": "SIDI LANTRI"
      },
      {
        "code": "3809",
        "nameAr": "برج الأمير عبد القادر",
        "nameFr": "BORDJ EMIR AEK"
      },
      {
        "code": "3810",
        "nameAr": "العيون",
        "nameFr": "LAAYOUNE"
      },
      {
        "code": "3811",
        "nameAr": "خميستى",
        "nameFr": "KHEMISTI"
      },
      {
        "code": "3812",
        "nameAr": "أولاد بسام",
        "nameFr": "OULED BESSEM"
      },
      {
        "code": "3813",
        "nameAr": "عمارى",
        "nameFr": "AMMARI"
      },
      {
        "code": "3814",
        "nameAr": "اليوسوفية",
        "nameFr": "YOUSSOUFIA"
      },
      {
        "code": "3815",
        "nameAr": "سيدي بوتوشنت",
        "nameFr": "SIDI BOUTOUCHENT"
      },
      {
        "code": "3816",
        "nameAr": "الأربعاء",
        "nameFr": "LARBAA"
      },
      {
        "code": "3817",
        "nameAr": "المعاصم",
        "nameFr": "MAACEM"
      },
      {
        "code": "3818",
        "nameAr": "سيدي عابد",
        "nameFr": "SIDI ABED"
      },
      {
        "code": "3819",
        "nameAr": "تامالحت",
        "nameFr": "TAMELLAHT"
      },
      {
        "code": "3820",
        "nameAr": "سيدي سليمان",
        "nameFr": "SIDI SLIMANE"
      },
      {
        "code": "3821",
        "nameAr": "بوقايد",
        "nameFr": "BOUCAID"
      },
      {
        "code": "3822",
        "nameAr": "بنى لحسن",
        "nameFr": "BENI LAHCENE"
      }
    ]
  },
  {
    "code": "3901",
    "number": 39,
    "nameAr": "الوادى",
    "nameFr": "EL OUED",
    "communes": [
      {
        "code": "3902",
        "nameAr": "ذباح",
        "nameFr": "ROBBAH"
      },
      {
        "code": "3903",
        "nameAr": "وادى العلندة",
        "nameFr": "OUED ALENDA"
      },
      {
        "code": "3904",
        "nameAr": "البياضة",
        "nameFr": "BAYADHA"
      },
      {
        "code": "3905",
        "nameAr": "النخلة",
        "nameFr": "NEKHLA"
      },
      {
        "code": "3906",
        "nameAr": "قمار",
        "nameFr": "GUEMAR"
      },
      {
        "code": "3907",
        "nameAr": "كوينين",
        "nameFr": "KOUININE"
      },
      {
        "code": "3908",
        "nameAr": "الرقيبة",
        "nameFr": "REGUIBA"
      },
      {
        "code": "3909",
        "nameAr": "عمراية",
        "nameFr": "HAMRAYA"
      },
      {
        "code": "3910",
        "nameAr": "تاغزوت",
        "nameFr": "TAGHZOUT"
      },
      {
        "code": "3911",
        "nameAr": "الدبيلة",
        "nameFr": "DEBILA"
      },
      {
        "code": "3912",
        "nameAr": "حسنى عبد الكريم",
        "nameFr": "HASSANI ABDELKRIM"
      },
      {
        "code": "3913",
        "nameAr": "قاسى خليفة",
        "nameFr": "HASI KHELIFA"
      },
      {
        "code": "3914",
        "nameAr": "طالب العربي",
        "nameFr": "TALEB LARBI"
      },
      {
        "code": "3915",
        "nameAr": "دوار الماء",
        "nameFr": "DOUAR EL MA"
      },
      {
        "code": "3916",
        "nameAr": "سيدي عون",
        "nameFr": "SIDI AOUN"
      },
      {
        "code": "3917",
        "nameAr": "تريفاوى",
        "nameFr": "TRIFAOU"
      },
      {
        "code": "3918",
        "nameAr": "مقران",
        "nameFr": "MAGRANE"
      },
      {
        "code": "3919",
        "nameAr": "بنى قشة",
        "nameFr": "BEN GHECHA"
      },
      {
        "code": "3920",
        "nameAr": "أورماس",
        "nameFr": "OURMES"
      },
      {
        "code": "3921",
        "nameAr": "سطيل",
        "nameFr": "STIL"
      },
      {
        "code": "3922",
        "nameAr": "مرارة",
        "nameFr": "MRARA"
      },
      {
        "code": "3923",
        "nameAr": "سيدي خليل",
        "nameFr": "SIDI KHELIL"
      },
      {
        "code": "3924",
        "nameAr": "تندلة",
        "nameFr": "TINDELA"
      },
      {
        "code": "3925",
        "nameAr": "العقلة",
        "nameFr": "EL OGLA"
      },
      {
        "code": "3926",
        "nameAr": "ميه ونسى",
        "nameFr": "MIH OUENSA"
      },
      {
        "code": "3927",
        "nameAr": "المغير",
        "nameFr": "EL MEGHAIR"
      },
      {
        "code": "3928",
        "nameAr": "جامعة",
        "nameFr": "DJAMAA"
      },
      {
        "code": "3929",
        "nameAr": "أم الطيور",
        "nameFr": "OUM TIOUR"
      },
      {
        "code": "3930",
        "nameAr": "سيدي عمران",
        "nameFr": "SIDI AMRANE"
      }
    ]
  },
  {
    "code": "4001",
    "number": 40,
    "nameAr": "خنشلة",
    "nameFr": "KHENCHELA",
    "communes": [
      {
        "code": "4002",
        "nameAr": "متوسة",
        "nameFr": "MTOUSSA"
      },
      {
        "code": "4003",
        "nameAr": "قايس",
        "nameFr": "KAIS"
      },
      {
        "code": "4004",
        "nameAr": "بغاى",
        "nameFr": "BAGHAI"
      },
      {
        "code": "4005",
        "nameAr": "الحامة",
        "nameFr": "EL HAMMA"
      },
      {
        "code": "4006",
        "nameAr": "عين الطويلة",
        "nameFr": "AIN TOUILA"
      },
      {
        "code": "4007",
        "nameAr": "تاوزيانات",
        "nameFr": "TAOUZIANA"
      },
      {
        "code": "4008",
        "nameAr": "بوحمامة",
        "nameFr": "BOUHMAMA"
      },
      {
        "code": "4009",
        "nameAr": "الولجة",
        "nameFr": "EL OULDJA"
      },
      {
        "code": "4010",
        "nameAr": "الرميلة",
        "nameFr": "REMILA"
      },
      {
        "code": "4011",
        "nameAr": "ششار",
        "nameFr": "CHECHAR"
      },
      {
        "code": "4012",
        "nameAr": "جالل",
        "nameFr": "DJELLAL"
      },
      {
        "code": "4013",
        "nameAr": "بابار",
        "nameFr": "BABAR"
      },
      {
        "code": "4014",
        "nameAr": "تامزة",
        "nameFr": "TAMSA"
      },
      {
        "code": "4015",
        "nameAr": "انسيغة",
        "nameFr": "ENSIGHA"
      },
      {
        "code": "4016",
        "nameAr": "أولاد رشاش",
        "nameFr": "OULED RECHACHE"
      },
      {
        "code": "4017",
        "nameAr": "المحمل",
        "nameFr": "MAHMEL"
      },
      {
        "code": "4018",
        "nameAr": "أمصارة",
        "nameFr": "MSARA"
      },
      {
        "code": "4019",
        "nameAr": "يابوس",
        "nameFr": "YABOUS"
      },
      {
        "code": "4020",
        "nameAr": "خيران",
        "nameFr": "KHIRANE"
      },
      {
        "code": "4021",
        "nameAr": "شلية",
        "nameFr": "CHELIA"
      }
    ]
  },
  {
    "code": "4101",
    "number": 41,
    "nameAr": "سوق أھراس",
    "nameFr": "SOUK AHRAS",
    "communes": [
      {
        "code": "4102",
        "nameAr": "سدراتة",
        "nameFr": "SEDRATA"
      },
      {
        "code": "4103",
        "nameAr": "الحنانشة",
        "nameFr": "HANANCHA"
      },
      {
        "code": "4104",
        "nameAr": "المشروخة",
        "nameFr": "MECHROHA"
      },
      {
        "code": "4105",
        "nameAr": "أولاد ادريس",
        "nameFr": "OULED DRISS"
      },
      {
        "code": "4106",
        "nameAr": "تيفاش",
        "nameFr": "TIFFECHE"
      },
      {
        "code": "4107",
        "nameAr": "الزعرورية",
        "nameFr": "ZAAROURIA"
      },
      {
        "code": "4108",
        "nameAr": "تاورة",
        "nameFr": "TAOURA"
      },
      {
        "code": "4109",
        "nameAr": "الدريعة",
        "nameFr": "DREA"
      },
      {
        "code": "4110",
        "nameAr": "الحدادة",
        "nameFr": "HADDADA"
      },
      {
        "code": "4111",
        "nameAr": "لخضارة",
        "nameFr": "KHEDARA"
      },
      {
        "code": "4112",
        "nameAr": "المرھنة",
        "nameFr": "MERAHNA"
      },
      {
        "code": "4113",
        "nameAr": "أولاد مؤمن",
        "nameFr": "OULED MOUMEN"
      },
      {
        "code": "4114",
        "nameAr": "بئر  بوحوش",
        "nameFr": "BIR BOUHOUCHE"
      },
      {
        "code": "4115",
        "nameAr": "مداوروش",
        "nameFr": "MDAOUROUCH"
      },
      {
        "code": "4116",
        "nameAr": "أم الغظائم",
        "nameFr": "OUM EL ADHAIM"
      },
      {
        "code": "4117",
        "nameAr": "عين الزانة",
        "nameFr": "AIN ZANA"
      },
      {
        "code": "4118",
        "nameAr": "عين السلطان",
        "nameFr": "AIN SOLTANE"
      },
      {
        "code": "4119",
        "nameAr": "ويالن",
        "nameFr": "OUILLEN"
      },
      {
        "code": "4120",
        "nameAr": "سيدي فرج",
        "nameFr": "SIDI FREDJ"
      },
      {
        "code": "4121",
        "nameAr": "سافل الويدان",
        "nameFr": "SAFEL EL OUIDEN"
      },
      {
        "code": "4122",
        "nameAr": "الرقوبة",
        "nameFr": "RAGOUBA"
      },
      {
        "code": "4123",
        "nameAr": "خميسة",
        "nameFr": "KHEMISSA"
      },
      {
        "code": "4124",
        "nameAr": "وادى الكبريت",
        "nameFr": "OUED KEBERIT"
      },
      {
        "code": "4125",
        "nameAr": "ترقالت",
        "nameFr": "TERRAGUELIT"
      },
      {
        "code": "4126",
        "nameAr": "الزوابى",
        "nameFr": "ZOUABI"
      }
    ]
  },
  {
    "code": "4201",
    "number": 42,
    "nameAr": "تيبازة",
    "nameFr": "TIPAZA",
    "communes": [
      {
        "code": "4202",
        "nameAr": "مناصرة",
        "nameFr": "MENACEUR"
      },
      {
        "code": "4203",
        "nameAr": "الأرھاط",
        "nameFr": "LARHAT"
      },
      {
        "code": "4204",
        "nameAr": "دواودة",
        "nameFr": "DOUAOUDA"
      },
      {
        "code": "4205",
        "nameAr": "بورقيقة",
        "nameFr": "BOURKIKA"
      },
      {
        "code": "4206",
        "nameAr": "خميستي",
        "nameFr": "KHEMISTI"
      },
      {
        "code": "4210",
        "nameAr": "أغابال",
        "nameFr": "AGHBAL"
      },
      {
        "code": "4212",
        "nameAr": "حجوط",
        "nameFr": "HADJOUT"
      },
      {
        "code": "4213",
        "nameAr": "سيدي عمر",
        "nameFr": "SIDI AMAR"
      },
      {
        "code": "4214",
        "nameAr": "قوراية",
        "nameFr": "GOURAYA"
      },
      {
        "code": "4215",
        "nameAr": "الناظور",
        "nameFr": "NADOR"
      },
      {
        "code": "4216",
        "nameAr": "الشعيبة",
        "nameFr": "CHAIBA"
      },
      {
        "code": "4217",
        "nameAr": "عين تقورايت",
        "nameFr": "AIN TAGOURAIT"
      },
      {
        "code": "4222",
        "nameAr": "شرشال",
        "nameFr": "CHERCHELL"
      },
      {
        "code": "4223",
        "nameAr": "الداموس",
        "nameFr": "DAMOUS"
      },
      {
        "code": "4224",
        "nameAr": "مراد",
        "nameFr": "MERAD"
      },
      {
        "code": "4225",
        "nameAr": "فوكة",
        "nameFr": "FOUKA"
      },
      {
        "code": "4226",
        "nameAr": "بواسماعيل",
        "nameFr": "BOU ISMAIL"
      },
      {
        "code": "4227",
        "nameAr": "أحمر العين",
        "nameFr": "AHMER EL AIN"
      },
      {
        "code": "4230",
        "nameAr": "بوھارون",
        "nameFr": "BOUHAROUN"
      },
      {
        "code": "4232",
        "nameAr": "سيدي غيالس",
        "nameFr": "SIDI GHILES"
      },
      {
        "code": "4233",
        "nameAr": "مسلمون",
        "nameFr": "MESSELMOUN"
      },
      {
        "code": "4234",
        "nameAr": "سيدي راشد",
        "nameFr": "SIDI RACHED"
      },
      {
        "code": "4235",
        "nameAr": "القليعة",
        "nameFr": "KOLEA"
      },
      {
        "code": "4236",
        "nameAr": "الحطاطبة",
        "nameFr": "ATTATBA"
      },
      {
        "code": "4240",
        "nameAr": "سيدي سميان",
        "nameFr": "SIDI SEMIANE"
      },
      {
        "code": "4241",
        "nameAr": "بني ملوك",
        "nameFr": "BENI MILLEUK"
      },
      {
        "code": "4242",
        "nameAr": "حجرة النص",
        "nameFr": "HADJERET ENNOUS"
      }
    ]
  },
  {
    "code": "4301",
    "number": 43,
    "nameAr": "ميلة",
    "nameFr": "MILA",
    "communes": [
      {
        "code": "4302",
        "nameAr": "فرجيوة",
        "nameFr": "FERDJIOUA"
      },
      {
        "code": "4303",
        "nameAr": "شلغوم العيد",
        "nameFr": "CHELGHOUM LAID"
      },
      {
        "code": "4304",
        "nameAr": "وادي العثمانية",
        "nameFr": "OUED ATHMANIA"
      },
      {
        "code": "4305",
        "nameAr": "عين ملوك",
        "nameFr": "AIN MELLOUK"
      },
      {
        "code": "4306",
        "nameAr": "ثالرغمة",
        "nameFr": "TELERGHEMA"
      },
      {
        "code": "4307",
        "nameAr": "وادى سقن",
        "nameFr": "OUED SEGUEN"
      },
      {
        "code": "4308",
        "nameAr": "تاجنانت",
        "nameFr": "TADJENANET"
      },
      {
        "code": "4309",
        "nameAr": "بن يحي .ع. رحمان",
        "nameFr": "BENYAHIA ABDERAHMANE"
      },
      {
        "code": "4310",
        "nameAr": "وادى عنجة",
        "nameFr": "OUED ENDJA"
      },
      {
        "code": "4311",
        "nameAr": "أحمد راشد",
        "nameFr": "AHMED RACHEDI"
      },
      {
        "code": "4312",
        "nameAr": "أولاد خلوف",
        "nameFr": "OULED KHALOUF"
      },
      {
        "code": "4313",
        "nameAr": "تيبرقنت",
        "nameFr": "TIBERGUENT"
      },
      {
        "code": "4314",
        "nameAr": "بوحاتم",
        "nameFr": "BOUHATEM"
      },
      {
        "code": "4315",
        "nameAr": "رواشد",
        "nameFr": "ROUACHED"
      },
      {
        "code": "4316",
        "nameAr": "تسالة لمطاي",
        "nameFr": "TESSALA LEMTAI"
      },
      {
        "code": "4317",
        "nameAr": "قرام قوقة",
        "nameFr": "GRAREM GOUGA"
      },
      {
        "code": "4318",
        "nameAr": "سيدي مروان",
        "nameFr": "SIDI MEROUANE"
      },
      {
        "code": "4319",
        "nameAr": "تسادان حدادة",
        "nameFr": "TASSADANE HADDADA"
      },
      {
        "code": "4320",
        "nameAr": "دراجى بوصالح",
        "nameFr": "DERADJI BOUS."
      },
      {
        "code": "4321",
        "nameAr": "مينار زرزة",
        "nameFr": "MINAR ZARZA"
      },
      {
        "code": "4322",
        "nameAr": "عميرة أراس",
        "nameFr": "AMIRA ARRAS"
      },
      {
        "code": "4323",
        "nameAr": "ترعى بينان",
        "nameFr": "TERAI BAINEN"
      },
      {
        "code": "4324",
        "nameAr": "حمالة",
        "nameFr": "HAMALA"
      },
      {
        "code": "4325",
        "nameAr": "عين التين",
        "nameFr": "AIN TINN"
      },
      {
        "code": "4326",
        "nameAr": "المشيرة",
        "nameFr": "EL MECHIRA"
      },
      {
        "code": "4327",
        "nameAr": "سيدي خليفة",
        "nameFr": "SIDI KHELIFA"
      },
      {
        "code": "4328",
        "nameAr": "الزغاية",
        "nameFr": "ZEGHAIA"
      },
      {
        "code": "4329",
        "nameAr": "العياضى برباس",
        "nameFr": "EL AYADI BARBES"
      },
      {
        "code": "4330",
        "nameAr": "عين البيضاء حريش",
        "nameFr": "AIN BEIDA.HAR"
      },
      {
        "code": "4331",
        "nameAr": "يحيى بنى قشة",
        "nameFr": "YAHIA BENI GUECHA"
      },
      {
        "code": "4332",
        "nameAr": "الشيقارة",
        "nameFr": "CHIGARA"
      }
    ]
  },
  {
    "code": "4401",
    "number": 44,
    "nameAr": "عين الدفلى",
    "nameFr": "AIN DEFLA",
    "communes": [
      {
        "code": "4402",
        "nameAr": "مليانة",
        "nameFr": "MILIANA"
      },
      {
        "code": "4403",
        "nameAr": "بومدفع",
        "nameFr": "BOU MEDFAA"
      },
      {
        "code": "4404",
        "nameAr": "خميس مليانة",
        "nameFr": "KHEMIS MILIANA"
      },
      {
        "code": "4405",
        "nameAr": "حمام ريغة",
        "nameFr": "HAMMAM RIGHA"
      },
      {
        "code": "4406",
        "nameAr": "عريب",
        "nameFr": "ARIB"
      },
      {
        "code": "4407",
        "nameAr": "جليدة",
        "nameFr": "DJELIDA"
      },
      {
        "code": "4408",
        "nameAr": "العامرة",
        "nameFr": "EL AMRA"
      },
      {
        "code": "4409",
        "nameAr": "بوراشد",
        "nameFr": "BOURACHED"
      },
      {
        "code": "4410",
        "nameAr": "العطاف",
        "nameFr": "EL ATTAF"
      },
      {
        "code": "4411",
        "nameAr": "العبادية",
        "nameFr": "EL ABADIA"
      },
      {
        "code": "4412",
        "nameAr": "جندل",
        "nameFr": "DJENDEL"
      },
      {
        "code": "4413",
        "nameAr": "وادى الشرفاء",
        "nameFr": "OUED CHEURFA"
      },
      {
        "code": "4414",
        "nameAr": "عين الأشياخ",
        "nameFr": "AIN LECHIAKH"
      },
      {
        "code": "4415",
        "nameAr": "وادى جمعة",
        "nameFr": "OUED DJEMAA"
      },
      {
        "code": "4416",
        "nameAr": "روينة",
        "nameFr": "ROUINA"
      },
      {
        "code": "4417",
        "nameAr": "زدين",
        "nameFr": "ZEDDINE"
      },
      {
        "code": "4418",
        "nameAr": "الحسنية",
        "nameFr": "HASSANIA"
      },
      {
        "code": "4419",
        "nameAr": "بئر أولاد خليفة",
        "nameFr": "BIR OULED KHELIFA"
      },
      {
        "code": "4420",
        "nameAr": "عين السلطان",
        "nameFr": "AIN SOLTANE"
      },
      {
        "code": "4421",
        "nameAr": "طارق بن زياد",
        "nameFr": "TARIK IBN ZIAD"
      },
      {
        "code": "4422",
        "nameAr": "برج الأمير خالد",
        "nameFr": "BORDJ EMIR KHALED"
      },
      {
        "code": "4423",
        "nameAr": "عين التركى",
        "nameFr": "AIN TORKI"
      },
      {
        "code": "4424",
        "nameAr": "سيدي الأخضر",
        "nameFr": "SIDI LAKHDAR"
      },
      {
        "code": "4425",
        "nameAr": "بن عالل",
        "nameFr": "BEN ALLEL"
      },
      {
        "code": "4426",
        "nameAr": "عين البنيان",
        "nameFr": "AIN BENIAN"
      },
      {
        "code": "4427",
        "nameAr": "حسينية",
        "nameFr": "HOCEINIA"
      },
      {
        "code": "4428",
        "nameAr": "بربوش",
        "nameFr": "BIRBOUCHE"
      },
      {
        "code": "4429",
        "nameAr": "جمعة أولاد الشيخ",
        "nameFr": "DJEMAA OULED CHEIKH"
      },
      {
        "code": "4430",
        "nameAr": "المختارية",
        "nameFr": "MEKHATRIA"
      },
      {
        "code": "4431",
        "nameAr": "بطحية",
        "nameFr": "BATHIA"
      },
      {
        "code": "4432",
        "nameAr": "تاشتة زقاغة",
        "nameFr": "TACHETA ZEGAGHA"
      },
      {
        "code": "4433",
        "nameAr": "عين بويحى",
        "nameFr": "AIN BOUYAHIA"
      },
      {
        "code": "4434",
        "nameAr": "الماين",
        "nameFr": "EL MAINE"
      },
      {
        "code": "4435",
        "nameAr": "تبركانين",
        "nameFr": "TIBERKANINE"
      },
      {
        "code": "4436",
        "nameAr": "بالعاص",
        "nameFr": "BELAAS"
      }
    ]
  },
  {
    "code": "4501",
    "number": 45,
    "nameAr": "النعامة",
    "nameFr": "NAAMA",
    "communes": [
      {
        "code": "4502",
        "nameAr": "مشرية",
        "nameFr": "MECHERIA"
      },
      {
        "code": "4503",
        "nameAr": "عين الصفراء",
        "nameFr": "AIN SEFRA"
      },
      {
        "code": "4504",
        "nameAr": "تيوت",
        "nameFr": "TIOUT"
      },
      {
        "code": "4505",
        "nameAr": "سفيسيفة",
        "nameFr": "SFISSIFA"
      },
      {
        "code": "4506",
        "nameAr": "مغرار",
        "nameFr": "MOGHRAR"
      },
      {
        "code": "4507",
        "nameAr": "عسلة",
        "nameFr": "ASLA"
      },
      {
        "code": "4508",
        "nameAr": "جنين بورزق",
        "nameFr": "DJENIEN BOURZEG"
      },
      {
        "code": "4509",
        "nameAr": "عين بن خليل",
        "nameFr": "AIN BEN KHELIL"
      },
      {
        "code": "4510",
        "nameAr": "مكمن بن عمر",
        "nameFr": "MAK.BEN AMAR"
      },
      {
        "code": "4511",
        "nameAr": "قصدير",
        "nameFr": "KASDIR"
      },
      {
        "code": "4512",
        "nameAr": "البيوض",
        "nameFr": "EL BIODH"
      }
    ]
  },
  {
    "code": "4601",
    "number": 46,
    "nameAr": "عين تموشنت",
    "nameFr": "AIN TEMOUCHENT",
    "communes": [
      {
        "code": "4602",
        "nameAr": "شعبة اللحم",
        "nameFr": "CHAABET EL HAM"
      },
      {
        "code": "4603",
        "nameAr": "عين الكيحل",
        "nameFr": "AIN KIHAL"
      },
      {
        "code": "4604",
        "nameAr": "حمام بو حجر",
        "nameFr": "HAMMAM BOUHADJAR"
      },
      {
        "code": "4605",
        "nameAr": "بوزجار",
        "nameFr": "BOUZEDJAR"
      },
      {
        "code": "4606",
        "nameAr": "وادى برقش",
        "nameFr": "OUED BERKECHE"
      },
      {
        "code": "4607",
        "nameAr": "أغالل",
        "nameFr": "AGHLAL"
      },
      {
        "code": "4608",
        "nameAr": "تارقة",
        "nameFr": "TERGA"
      },
      {
        "code": "4609",
        "nameAr": "عين الأربعاء",
        "nameFr": "AIN EL ARBAA"
      },
      {
        "code": "4610",
        "nameAr": "تامزورة",
        "nameFr": "TAMZOURA"
      },
      {
        "code": "4611",
        "nameAr": "شنتوف",
        "nameFr": "CHENTOUF"
      },
      {
        "code": "4612",
        "nameAr": "سيدي بن عدة",
        "nameFr": "SIDI BEN ADDA"
      },
      {
        "code": "4613",
        "nameAr": "عقب الليل",
        "nameFr": "AOUBELIL"
      },
      {
        "code": "4614",
        "nameAr": "المالح",
        "nameFr": "EL MALAH"
      },
      {
        "code": "4615",
        "nameAr": "سيدي بومدين",
        "nameFr": "SIDI BOUMEDIENE"
      },
      {
        "code": "4616",
        "nameAr": "وادى الصباح",
        "nameFr": "OUED SABAH"
      },
      {
        "code": "4617",
        "nameAr": "أولاد بوجمعة",
        "nameFr": "OULED BOUDJEMAA"
      },
      {
        "code": "4618",
        "nameAr": "عين الطلبة",
        "nameFr": "AIN TOLBA"
      },
      {
        "code": "4619",
        "nameAr": "العامرية",
        "nameFr": "EL AMRIA"
      },
      {
        "code": "4620",
        "nameAr": "حاسى الغلة",
        "nameFr": "HASSI EL GHELLA"
      },
      {
        "code": "4621",
        "nameAr": "الحساسنة",
        "nameFr": "HASSASSNA"
      },
      {
        "code": "4622",
        "nameAr": "أولاد دكجال",
        "nameFr": "OULED KIHAL"
      },
      {
        "code": "4623",
        "nameAr": "بني صاف",
        "nameFr": "BENI SAF"
      },
      {
        "code": "4624",
        "nameAr": "أولحسة",
        "nameFr": "SIDI SAFI"
      },
      {
        "code": "4625",
        "nameAr": "الغرابة",
        "nameFr": "OULHACA GHERABA"
      },
      {
        "code": "4626",
        "nameAr": "تادماى",
        "nameFr": "TADMAYA"
      },
      {
        "code": "4627",
        "nameAr": "الأمير عبد القادر",
        "nameFr": "EL EMIR ABDELKADER"
      },
      {
        "code": "4628",
        "nameAr": "المساعد",
        "nameFr": "EL MESSAID"
      }
    ]
  },
  {
    "code": "4701",
    "number": 47,
    "nameAr": "غرداية",
    "nameFr": "GHARDAIA",
    "communes": [
      {
        "code": "4702",
        "nameAr": "المنيعة",
        "nameFr": "EL MENIAA"
      },
      {
        "code": "4703",
        "nameAr": "ضيعة بن دھاھوة",
        "nameFr": "DHAYET BENDH."
      },
      {
        "code": "4704",
        "nameAr": "بريان",
        "nameFr": "BERRIANE"
      },
      {
        "code": "4705",
        "nameAr": "متليلي",
        "nameFr": "METLILI"
      },
      {
        "code": "4706",
        "nameAr": "القرارة",
        "nameFr": "EL GUERRARA"
      },
      {
        "code": "4707",
        "nameAr": "العطاف",
        "nameFr": "EL ATTEUF"
      },
      {
        "code": "4708",
        "nameAr": "زلفلنة",
        "nameFr": "ZELFANA"
      },
      {
        "code": "4709",
        "nameAr": "سبسب",
        "nameFr": "SEBSEB"
      },
      {
        "code": "4710",
        "nameAr": "بونورة",
        "nameFr": "BOUNOURA"
      },
      {
        "code": "4711",
        "nameAr": "حاسي فحال",
        "nameFr": "HASSI FEHAL"
      },
      {
        "code": "4712",
        "nameAr": "حاسي قارة",
        "nameFr": "HASSI GARA"
      },
      {
        "code": "4713",
        "nameAr": "منصورة",
        "nameFr": "MANSOURA"
      }
    ]
  },
  {
    "code": "4801",
    "number": 48,
    "nameAr": "غليزان",
    "nameFr": "RELIZANE",
    "communes": [
      {
        "code": "4802",
        "nameAr": "وادى رھيو",
        "nameFr": "OUED RHIOU"
      },
      {
        "code": "4803",
        "nameAr": "بلعسل بوزقزة",
        "nameFr": "BELAASEL BOUZEGZA"
      },
      {
        "code": "4804",
        "nameAr": "سيدي سعادة",
        "nameFr": "SIDI SAADA"
      },
      {
        "code": "4805",
        "nameAr": "أولاد يعيش",
        "nameFr": "OULED AICH"
      },
      {
        "code": "4806",
        "nameAr": "سيدي لزرق",
        "nameFr": "SIDI LAZREG"
      },
      {
        "code": "4807",
        "nameAr": "الحمدانة",
        "nameFr": "EL HMADNA"
      },
      {
        "code": "4808",
        "nameAr": "سيدي امحمد بن علي",
        "nameFr": "SIDI MHAMED BEN ALI"
      },
      {
        "code": "4809",
        "nameAr": "مديونة",
        "nameFr": "MEDIOUNA"
      },
      {
        "code": "4810",
        "nameAr": "سيدي خطاب",
        "nameFr": "SIDI KHETAB"
      },
      {
        "code": "4811",
        "nameAr": "عمي موسى",
        "nameFr": "AMMI MOUSSA"
      },
      {
        "code": "4812",
        "nameAr": "زمورة",
        "nameFr": "ZEMMOURA"
      },
      {
        "code": "4813",
        "nameAr": "بني درقون",
        "nameFr": "BENI DERGOUN"
      },
      {
        "code": "4814",
        "nameAr": "جيديوة",
        "nameFr": "DJIDIOUIA"
      },
      {
        "code": "4815",
        "nameAr": "القطارة",
        "nameFr": "EL GUETTAR"
      },
      {
        "code": "4816",
        "nameAr": "الحمري",
        "nameFr": "EL HAMRI"
      },
      {
        "code": "4817",
        "nameAr": "المطمار",
        "nameFr": "EL MATMAR"
      },
      {
        "code": "4818",
        "nameAr": "سيدي بن عودة",
        "nameFr": "SIDI MHAMED BEN AOUDA"
      },
      {
        "code": "4819",
        "nameAr": "عين طارق",
        "nameFr": "AIN TARIK"
      },
      {
        "code": "4820",
        "nameAr": "وادى السالم",
        "nameFr": "OUED ESSALEM"
      },
      {
        "code": "4821",
        "nameAr": "وزيزان",
        "nameFr": "OUARIZANE"
      },
      {
        "code": "4822",
        "nameAr": "مازونة",
        "nameFr": "MAZOUNA"
      },
      {
        "code": "4823",
        "nameAr": "قلعة",
        "nameFr": "KALAA"
      },
      {
        "code": "4824",
        "nameAr": "عين الرحمة",
        "nameFr": "AIN RAHMA"
      },
      {
        "code": "4825",
        "nameAr": "يلل",
        "nameFr": "YELLEL"
      },
      {
        "code": "4826",
        "nameAr": "وادى الجمعة",
        "nameFr": "OUED EL DJEMAA"
      },
      {
        "code": "4827",
        "nameAr": "رمقة",
        "nameFr": "RAMKA"
      },
      {
        "code": "4828",
        "nameAr": "مندس",
        "nameFr": "MENDES"
      },
      {
        "code": "4829",
        "nameAr": "لحلف",
        "nameFr": "LAHLEF"
      },
      {
        "code": "4830",
        "nameAr": "بني زنتيس",
        "nameFr": "BENI ZENTIS"
      },
      {
        "code": "4831",
        "nameAr": "سوق الحد",
        "nameFr": "SOUK EL HAAD"
      },
      {
        "code": "4832",
        "nameAr": "دراع بن عبد الله",
        "nameFr": "DAR BEN ABDELAH"
      },
      {
        "code": "4833",
        "nameAr": "الحاسى",
        "nameFr": "EL HASSI"
      },
      {
        "code": "4834",
        "nameAr": "حد الشقالة",
        "nameFr": "HAD ECHEKALLA"
      },
      {
        "code": "4835",
        "nameAr": "بن داود",
        "nameFr": "BEN DAOUD"
      },
      {
        "code": "4836",
        "nameAr": "العلجة",
        "nameFr": "EL OULDJA"
      },
      {
        "code": "4837",
        "nameAr": "مرجة سيدي عابد",
        "nameFr": "MERDJA SIDI ABED"
      },
      {
        "code": "4838",
        "nameAr": "أولاد سيدي ميھوب",
        "nameFr": "OULED SIDI MIHOUB"
      }
    ]
  }
]

export function getWilayaByCode(code: string): Wilaya | undefined {
  return WILAYAS.find(w => w.code === code)
}

export function getCommuneByCode(wilayaCode: string, communeCode: string): Commune | undefined {
  const wilaya = getWilayaByCode(wilayaCode)
  return wilaya?.communes.find(c => c.code === communeCode)
}

export function getWilayaNames(): string[] {
  return WILAYAS.map(w => w.nameAr)
}

export function getCommunesByWilaya(wilayaCode: string): Commune[] {
  return getWilayaByCode(wilayaCode)?.communes || []
}

export function getCommunesByWilayaName(wilayaName: string): Commune[] {
  const wilaya = WILAYAS.find(w => w.nameAr === wilayaName)
  return wilaya ? [{ code: wilaya.code, nameAr: wilaya.nameAr, nameFr: wilaya.nameFr }, ...wilaya.communes] : []
}

export const WILAYA_NAMES: string[] = WILAYAS.map(w => w.nameAr)

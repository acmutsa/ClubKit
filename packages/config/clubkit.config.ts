export default {
  clubName: "ClubKit",
  icon: {
    svg: "/img/logos/acm.svg",
  },
  schoolUniversityIdName: "ABC123",
  eventTypes: {
    ACM: {
      color: "#179BD5",
    },
    "ACM-W": {
      color: "#7BE9E8",
    },
    "Rowdy Creators": {
      color: "#FFD51E",
    },
    "Coding in Color": {
      color: "#d07cff",
    },
    "ICPC":{
      color: "#16a34a",
    }
  },
  dashPaths: {
    admin: {
      Overview: "/admin",
      Members: "/admin/members",
      Events: "/admin/events",
    },
  },
  userIdentityOptions: {
    ethnicity: [
      "American Indian or Alaska Native",
      "Asian",
      "Black or African American",
      "Hispanic or Latino",
      "Native Hawaiian or Other Pacific Islander",
      "White",
    ],
    gender: [
      "Male",
      "Female",
      "Non-binary",
      "Transgender",
      "Intersex",
      "Prefer not to say",
    ],
  },
} as const;

export const majors = [
  "Accounting",
  "Accounting Technician",
  "Actuarial Science",
  "Aerospace/Aeronautical Engineering",
  "Agricultural Business & Management",
  "Agricultural Economics",
  "Agricultural Mechanization",
  "Agricultural Production",
  "Agricultural/Bioengineering",
  "American/English Literature",
  "Applied Mathematics",
  "Architectural Engineering",
  "Art History, Criticism & Conservation",
  "Art, General",
  "Astronomy",
  "Atmospheric Sciences & Meteorology",
  "Banking & Financial Support Services",
  "Biochemistry & Biophysics",
  "Biology, General",
  "Biomedical Engineering",
  "Business Administration & Management, General",
  "Business/Management Quantitative Methods, General",
  "Business/Managerial Economics",
  "Cell/Cellular Biology",
  "Chemical Engineering",
  "Chemistry",
  "Cinematography/Film/Vide Production",
  "Civil Engineering",
  "Classical/Ancient Languages & Literatures",
  "Comparative Literature",
  "Computer & Information Sciences, General",
  "Computer Engineering",
  "Computer Networking/Telecommunications",
  "Computer Science",
  "Computer Software & Media Applications",
  "Computer System Administration",
  "Construction Engineering/Management",
  "Creative Writing",
  "Criminology",
  "Cyber Security",
  "Data Management Technology",
  "Dental Assisting",
  "Design & Visual Communications, General",
  "Ecology",
  "Economics",
  "Electrical Engineering",
  "Engineering (Pre-Engineering), General",
  "English Language & Literature, General",
  "Finance, General",
  "Financial Planning & Services",
  "Fine/Studio Arts",
  "Food Sciences & Technology",
  "Foreign Languages/Literatures, General",
  "French Language & Literature",
  "Genetics",
  "Geological & Earth Sciences",
  "Graphic Design",
  "Health Services Administration,General",
  "Human Resources Development/Training",
  "Human Resources Management",
  "Industrial Design",
  "Industrial Engineering",
  "Information Science",
  "Information Technology And Systems",
  "Insurance & Risk Management",
  "International Business Management",
  "International Relations & Affairs",
  "Investments & Securities",
  "Labor/Industrial Relations",
  "Law (Pre-Law)",
  "Legal Administrative Assisting/Secretarial",
  "Legal Studies, General",
  "Linguistics",
  "Logistics & Materials Management",
  "Management Information Systems",
  "Marine/Aquatic Biology",
  "Marketing Management & Research",
  "Mathematics, General",
  "Mechanical Engineering",
  "Medical Assisting",
  "Medical Office/Secretarial",
  "Medical Records",
  "Medical/Clinical Assisting, General",
  "Microbiology & Immunology",
  "Music, General",
  "Music, Theory & Composition",
  "Natural Resources Conservation, General",
  "Natural Resources Management",
  "Neuroscience",
  "Nuclear Engineering",
  "Occupational Therapy Assisting",
  "Philosophy",
  "Photography",
  "Physical Sciences, General",
  "Physical Therapy Assisting",
  "Physics",
  "Political Science & Government",
  "Psychology, Clinical & Counseling",
  "Psychology, General",
  "Public Speaking",
  "Sales, Merchandising, & Marketing, General",
  "Secretarial Studies & Office Administration",
  "Small Business Management/Operations",
  "Social Sciences, General",
  "Sociology",
  "Software Engineering",
  "Statistics",
  "Supply Chain Management",
  "Urban Studies/Urban Affairs",
  "Webpage Design",
  "Other",
] as const;

interface orgsType {
  id: string;
  name: string;
  color:string;
}

export interface EventType {
  id:string;
  name: string;
  description: string;
  start: Date;
  end: Date;
  checkinStart: Date;
  checkinEnd: Date;
  location: string;
  isUserCheckinable: boolean; 
  isHidden: boolean;
  orgs:Array<orgsType>;
}

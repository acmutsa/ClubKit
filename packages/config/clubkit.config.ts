const c = {
	clubName: "ClubKit",
	universityName: "UTSA",
	universityID: {
		name: "ABC123",
		maxLength: 6,
		universityIDRegex: new RegExp("\\b[a-zA-Z]{3}\\d{3}\\b"),
	},
	semesters: {
		current: {
			name: "Spring 2025",
			startDate: new Date("2025-01-24"),
			endDate: new Date("2025-05-31"),
			pointsRequired: 7,
		},
	},
	contactEmail: "tech@acmutsa.org",
	membership: {
		activeThreshold: 7,
	},
	events: {
		idLength: 6,
		categoryIDLength: 8,
		checkingInInfo:
			"The membership portal is ACM's new method of tracking member check-ins and awarding points. By simply visiting this page during the event and clicking the Check-in button, you can easily garner points towards your membership for the semester.",
		aboutOrg:
			"ACM is the premier organization on campus for students interested in technology. ACM is dedicated to providing members with opportunities for professional, academic, and social growth outside the classroom in order to prepare students for their career in tech or fuel their interest in the tech field. Anyone who has an interest in technology can join ACM.",
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
			"Non-Binary",
			"Transgender",
			"Intersex",
			"Other",
			"I prefer not to say",
		],
		classification: [
			"Freshman",
			"Sophomore",
			"Junior",
			"Senior",
			"Graduate",
			"Other",
		],
		shirtSize: ["XS", "S", "M", "L", "XL", "XXL"],
		shirtType: ["Unisex", "Women's"],
	},
	calendarLinks: [
		{ title: "Google", functionKey: "google" },
		{ title: "Outlook", functionKey: "outlookMobile" },
		{ title: "iCal", functionKey: "ics" },
	],
	streamingLinks: [
		{ title: "twitch", href: "https://www.twitch.tv/acmutsa" },
		{ title: "youtube", href: "https://www.youtube.com/@acmutsa/streams" },
	],
	maxResumeSizeInBytes: 3670016,
	acceptedResumeMimeTypes: [
		"application/msword",
		"application/pdf",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	] as string[],
	dashPaths: {
		admin: {
			Overview: "/admin",
			Members: "/admin/members",
			Events: "/admin/events",
			Checkins: "/admin/checkins",
			Categories: "/admin/categories",
			Semesters: "/admin/semesters",
		},
	},
	maxCheckinDescriptionLength: 400,
	minEventPoints: 0,
	maxEventPoints: 100,
	icon: {
		svg: "/img/logos/acm.svg",
	},
	thumbnails: {
		default: "/img/thumbnails/default.png",
		maxSizeInBytes: 500000,
	},
	memberRoles: ["member", "admin", "super_admin"] as const,
} as const;

export const defaultTheme = "light";

const bucketBaseUrl = `${c.clubName}-${c.universityName}`;
const bucketEventThumbnailBaseUrl = `${bucketBaseUrl}/event-thumbnails`;

const majors = [
	"Computer Science",
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

export default c;
export { majors, bucketEventThumbnailBaseUrl, bucketBaseUrl };

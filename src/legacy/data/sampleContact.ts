// import { ContactV2 } from "@models/contact.model";

// export const dummyGeneratedContact = {
//     names: [
//         {
//             givenName: "Ankit",
//             familyName: "Sanghvi"
//         }
//     ],
//     emailAddresses: [
//         {
//             value: "ankit.sanghavi87@gmail.com"
//         }
//     ],
//     sexAppeal: 100,
//     phoneNumbers: [
//         {
//             value: "660-664-9945"
//         }
//     ],
//     occupations: [
//         {
//             value: "Student"
//         }
//     ],
//     organizations: [
//         {
//             name: "Carnegie Mellon University",
//             title: "Student"
//         }
//     ],
//     locations: [
//         {
//             value: "Mountain View"
//         }
//     ],
//     events: [
//         {
//             type: "Bay Area Hackathon",
//             formattedType: "Hackathon",
//             date: {
//                 year: 2022,
//                 month: 11,
//                 day: 5
//             },
//             // description: "Discussion about applications of generative AI in healthcare"
//         }
//     ],
//     biographies: [
//         {
//             value: "Met Ankit at the Bay Area Hackathon. He is a student from Carnegie Mellon University. We discussed the applications of generative AI in healthcare. Ankit is now working on a software to help patients understand medical reports better and ask questions."
//         }
//     ],
//     interests: [
//         {
//             value: "Entrepreneurship"
//         },
//         {
//             value: "Software Development"
//         },
//         {
//             value: "Cloud Architecture"
//         }
//     ]
// }

// export const dummyGeneratedContactV2: ContactV2 = {
//     firstName: "Jane",
//     lastName: "Doe",
//     emailAddress: "jane.doe@example.com",
//     phoneNumber: "123-456-7890",
//     occupation: "Software Engineer",
//     organization: "Tech Innovators Inc.",
//     location: "San Francisco, CA",
//     meetingDate: "2021-10-14",
//     event: "Tech Innovators Annual Meetup",
//     biography: "Jane is a passionate software engineer with over 5 years of experience specializing in full-stack development. She has a keen interest in AI and machine learning technologies.",
//     interests: ["AI", "Machine Learning", "Web Development", "Cycling"],
//     onlineSearchResults: [
//         {
//             source: "LinkedIn",
//             link: "https://www.linkedin.com/in/jane-doe",
//             title: "Jane Doe - Software Engineer at Tech Innovators Inc.",
//             snippet: "Jane Doe - Software Engineer at Tech Innovators Inc."
//         },
//         {
//             source: "Twitter",
//             link: "https://twitter.com/jane_doe",
//             title: "Tech enthusiast. Software Engineer. Explorer.",
//             snippet: "Tech enthusiast. Software Engineer. Explorer."
//         }
//     ]
// };



// // const contact1 = {
// //     names: [{ givenName: "Priya", familyName: "Kumar" }],
// //     emailAddresses: [{ value: "priya.kumar@google.com" }],
// //     phoneNumbers: [{ value: "987-654-3210" }],
// //     occupations: [{ value: "ML Engineer" }],
// //     organizations: [{ name: "Google", title: "ML Engineer" }],
// //     locations: [{ value: "Bengaluru" }],
// //     biographies: [{ value: "Priya is a passionate ML Engineer at Google, Bengaluru, specializing in natural language processing and computer vision." }],
// //     interests: [{ value: "Machine Learning" }, { value: "Data Science" }, { value: "AI Ethics" }]
// // };

// // // 2. YC Founder
// // const contact2 = {
// //     names: [{ givenName: "Michael", familyName: "Robinson" }],
// //     emailAddresses: [{ value: "michael@ycstartup.com" }],
// //     phoneNumbers: [{ value: "123-456-7890" }],
// //     occupations: [{ value: "Founder" }],
// //     organizations: [{ name: "YC Startup", title: "Founder" }],
// //     locations: [{ value: "Silicon Valley" }],
// //     biographies: [{ value: "Michael is the founder of a cutting-edge startup in Y Combinator, focusing on revolutionizing educational technology." }],
// //     interests: [{ value: "Entrepreneurship" }, { value: "EdTech" }, { value: "Product Development" }]
// // };

// // // 3. Designer in Mountain View at Figma
// // const contact3 = {
// //     names: [{ givenName: "Jessica", familyName: "Chen" }],
// //     emailAddresses: [{ value: "jessica.chen@figma.com" }],
// //     phoneNumbers: [{ value: "234-567-8901" }],
// //     occupations: [{ value: "Designer" }],
// //     organizations: [{ name: "Figma", title: "Product Designer" }],
// //     locations: [{ value: "Mountain View" }],
// //     biographies: [{ value: "Jessica is a product designer at Figma, where she helps shape the future of design tools." }],
// //     interests: [{ value: "UI/UX Design" }, { value: "Graphic Design" }, { value: "Web Development" }]
// // };

// // // 4. Investor in San Francisco
// // const contact4 = {
// //     names: [{ givenName: "David", familyName: "Johnson" }],
// //     emailAddresses: [{ value: "david.johnson@vcfirm.com" }],
// //     phoneNumbers: [{ value: "345-678-9012" }],
// //     occupations: [{ value: "Investor" }],
// //     organizations: [{ name: "VC Firm", title: "Partner" }],
// //     locations: [{ value: "San Francisco" }],
// //     biographies: [{ value: "David is an investor at a San Francisco-based VC firm, focusing on early-stage tech startups." }],
// //     interests: [{ value: "Venture Capital" }, { value: "Startups" }, { value: "Technology Trends" }]
// // };

// // // 5. Hedge Fund Manager in New York
// // const contact5 = {
// //     names: [{ givenName: "Sarah", familyName: "Williams" }],
// //     emailAddresses: [{ value: "sarah@hedgefundny.com" }],
// //     phoneNumbers: [{ value: "456-789-0123" }],
// //     occupations: [{ value: "Hedge Fund Manager" }],
// //     organizations: [{ name: "Hedge Fund NY", title: "Manager" }],
// //     locations: [{ value: "New York" }],
// //     biographies: [{ value: "Sarah manages a hedge fund in New York, specializing in algorithmic trading strategies." }],
// //     interests: [{ value: "Finance" }, { value: "Investment Strategies" }, { value: "Algorithmic Trading" }]
// // };

// // // 6. Research Scientist in Boston at a Biotech Company
// // const contact6 = {
// //     names: [{ givenName: "Henry", familyName: "Turner" }],
// //     emailAddresses: [{ value: "henry.turner@biotechco.com" }],
// //     phoneNumbers: [{ value: "567-890-1234" }],
// //     occupations: [{ value: "Research Scientist" }],
// //     organizations: [{ name: "Biotech Co", title: "Senior Scientist" }],
// //     locations: [{ value: "Boston" }],
// //     biographies: [{ value: "Henry is a research scientist in Boston, working on groundbreaking therapies in the field of oncology." }],
// //     interests: [{ value: "Biotechnology" }, { value: "Clinical Trials" }, { value: "Oncology" }]
// // };

// // // 1. Content Creator at Netflix, Los Angeles
// // const contact7 = {
// //     names: [{ givenName: "Laura", familyName: "Cruz" }],
// //     emailAddresses: [{ value: "laura.cruz@netflix.com" }],
// //     phoneNumbers: [{ value: "310-987-6543" }],
// //     occupations: [{ value: "Content Creator" }],
// //     organizations: [{ name: "Netflix", title: "Content Creator" }],
// //     locations: [{ value: "Los Angeles" }],
// //     biographies: [{ value: "Laura creates engaging content for Netflix, focusing on documentaries and reality TV shows." }],
// //     interests: [{ value: "Film Making" }, { value: "Documentaries" }, { value: "Creative Writing" }]
// // };

// // // 2. Software Developer at Facebook, Dublin
// // const contact8 = {
// //     names: [{ givenName: "Sean", familyName: "O'Reilly" }],
// //     emailAddresses: [{ value: "sean.oreilly@facebook.com" }],
// //     phoneNumbers: [{ value: "+353-1-234-5678" }],
// //     occupations: [{ value: "Software Developer" }],
// //     organizations: [{ name: "Facebook", title: "Software Developer" }],
// //     locations: [{ value: "Dublin" }],
// //     biographies: [{ value: "Sean is a software developer at Facebook Dublin, specializing in frontend technologies and UX." }],
// //     interests: [{ value: "Web Development" }, { value: "UX Design" }, { value: "Coding" }]
// // };

// // // 3. Marketing Specialist at Coca-Cola, Johannesburg
// // const contact9 = {
// //     names: [{ givenName: "Nina", familyName: "Mbatha" }],
// //     emailAddresses: [{ value: "nina.mbatha@cocacola.com" }],
// //     phoneNumbers: [{ value: "+27-10-123-4567" }],
// //     occupations: [{ value: "Marketing Specialist" }],
// //     organizations: [{ name: "Coca-Cola", title: "Marketing Specialist" }],
// //     locations: [{ value: "Johannesburg" }],
// //     biographies: [{ value: "Nina is a marketing specialist at Coca-Cola Johannesburg, focusing on brand strategies and campaigns." }],
// //     interests: [{ value: "Marketing" }, { value: "Brand Development" }, { value: "Consumer Behavior" }]
// // };

// // // 4. Financial Analyst at Goldman Sachs, Sydney
// // const contact10 = {
// //     names: [{ givenName: "Liam", familyName: "Wong" }],
// //     emailAddresses: [{ value: "liam.wong@goldmansachs.com" }],
// //     phoneNumbers: [{ value: "+61-2-1234-5678" }],
// //     occupations: [{ value: "Financial Analyst" }],
// //     organizations: [{ name: "Goldman Sachs", title: "Financial Analyst" }],
// //     locations: [{ value: "Sydney" }],
// //     biographies: [{ value: "Liam is a financial analyst at Goldman Sachs Sydney, specializing in investment strategies and market analysis." }],
// //     interests: [{ value: "Finance" }, { value: "Investment" }, { value: "Economics" }]
// // };

// // // 5. HR Manager at Toyota, Tokyo
// // const contact11 = {
// //     names: [{ givenName: "Yuki", familyName: "Takahashi" }],
// //     emailAddresses: [{ value: "yuki.takahashi@toyota.com" }],
// //     phoneNumbers: [{ value: "+81-3-1234-5678" }],
// //     occupations: [{ value: "HR Manager" }],
// //     organizations: [{ name: "Toyota", title: "HR Manager" }],
// //     locations: [{ value: "Tokyo" }],
// //     biographies: [{ value: "Yuki is an HR manager at Toyota Tokyo, focusing on talent acquisition and employee relations." }],
// //     interests: [{ value: "Human Resources" }, { value: "Talent Management" }, { value: "Organizational Development" }]
// // };

// // // 6. Product Manager at Amazon, Seattle
// // const contact12 = {
// //     names: [{ givenName: "Oliver", familyName: "Smith" }],
// //     emailAddresses: [{ value: "oliver.smith@amazon.com" }],
// //     phoneNumbers: [{ value: "206-123-4567" }],
// //     occupations: [{ value: "Product Manager" }],
// //     organizations: [{ name: "Amazon", title: "Product Manager" }],
// //     locations: [{ value: "Seattle" }],
// //     biographies: [{ value: "Oliver is a product manager at Amazon Seattle, specializing in ecommerce and customer experience." }],
// //     interests: [{ value: "Product Management" }, { value: "Ecommerce" }, { value: "Customer Experience" }]
// // };


// export default dummyGeneratedContactV2;

export { }
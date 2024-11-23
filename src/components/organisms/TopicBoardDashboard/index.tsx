import { RootState } from '@redux/store';
import { Table } from 'antd';
import { useSelector } from 'react-redux';
import './TopicBoardDashboard.css'

const TopicBoardDashboard = () => {
    const topics = [
        {
            sector: "Healthcare",
            founderName: "John Doe",
            startupName: "Healthify",
            arr: "$100,000",
            usBased: "Yes",
            numFounders: 1,
            currentFundingRaised: "$100,000",
            aiAffiliation: "Yes",
            saasAffiliation: "No",
            finalScore: 80
        },
        {
            sector: "Technology",
            founderName: "Alice Johnson",
            startupName: "TechSphere",
            arr: "$200,000",
            usBased: "No",
            numFounders: 2,
            currentFundingRaised: "$500,000",
            aiAffiliation: "No",
            saasAffiliation: "Yes",
            finalScore: 75
        },
        {
            sector: "Fintech",
            founderName: "Robert Smith",
            startupName: "FinancePlus",
            arr: "$150,000",
            usBased: "Yes",
            numFounders: 3,
            currentFundingRaised: "$1,000,000",
            aiAffiliation: "Yes",
            saasAffiliation: "No",
            finalScore: 90
        },
        {
            sector: "Education",
            founderName: "Emily White",
            startupName: "EduTech",
            arr: "$300,000",
            usBased: "No",
            numFounders: 1,
            currentFundingRaised: "$800,000",
            aiAffiliation: "No",
            saasAffiliation: "Yes",
            finalScore: 85
        },
        {
            sector: "E-commerce",
            founderName: "David Green",
            startupName: "ShopOnline",
            arr: "$400,000",
            usBased: "Yes",
            numFounders: 2,
            currentFundingRaised: "$2,000,000",
            aiAffiliation: "Yes",
            saasAffiliation: "No",
            finalScore: 88
        },
        {
            sector: "Agriculture",
            founderName: "Michelle Tan",
            startupName: "AgriTech",
            arr: "$50,000",
            usBased: "No",
            numFounders: 1,
            currentFundingRaised: "$250,000",
            aiAffiliation: "No",
            saasAffiliation: "Yes",
            finalScore: 70
        },
        {
            sector: "Renewable Energy",
            founderName: "Ethan Brown",
            startupName: "GreenEnergy",
            arr: "$500,000",
            usBased: "Yes",
            numFounders: 3,
            currentFundingRaised: "$3,000,000",
            aiAffiliation: "Yes",
            saasAffiliation: "No",
            finalScore: 95
        },
        {
            sector: "Biotechnology",
            founderName: "Nora K.",
            startupName: "BioInnovate",
            arr: "$250,000",
            usBased: "No",
            numFounders: 2,
            currentFundingRaised: "$750,000",
            aiAffiliation: "No",
            saasAffiliation: "Yes",
            finalScore: 82
        },
        {
            sector: "Virtual Reality",
            founderName: "Chris Lee",
            startupName: "VirtuWorld",
            arr: "$350,000",
            usBased: "Yes",
            numFounders: 1,
            currentFundingRaised: "$1,500,000",
            aiAffiliation: "Yes",
            saasAffiliation: "No",
            finalScore: 77
        },
        {
            sector: "Cybersecurity",
            founderName: "Samantha Fox",
            startupName: "SecureNet",
            arr: "$100,000",
            usBased: "No",
            numFounders: 2,
            currentFundingRaised: "$400,000",
            aiAffiliation: "No",
            saasAffiliation: "Yes",
            finalScore: 78
        }
    ]

    const columns = [
        {
            title: "Sector",
            dataIndex: "sector",
            key: "sector",
        },
        {
            title: "Founder Name",
            dataIndex: "founderName",
            key: "founderName",
        },
        {
            title: "Startup Name",
            dataIndex: "startupName",
            key: "startupName",
        },
        {
            title: "ARR",
            dataIndex: "arr",
            key: "arr",
        },
        {
            title: "US Based (Yes/no)",
            dataIndex: "usBased",
            key: "usBased"
        },
        {
            title: "Number of Founders",
            dataIndex: "numFounders",
            key: "numFounders",
        },
        {
            title: "Current Funding Raised",
            dataIndex: "currentFundingRaised",
            key: "currentFundingRaised",
        },
        {
            title: "AI affiliation",
            dataIndex: "aiAffiliation",
            key: "aiAffiliation",
        },
        {
            title: "SaaS affiliation",
            dataIndex: "saasAffiliation",
            key: "saasAffiliation",
        },
        {
            title: "Final Score",
            dataIndex: "finalScore",
            key: "finalScore",
        },
    ];

    const pagination = {
        pageSize: 10, // Display up to 10 items per page
    };

    return (
        <div className='topicBoardPageDashboardContainer'>
            {topics.length > 0 &&
                <div className="recentNotesContainer">
                    <h2>Startup Due Diligence</h2>
                    <Table dataSource={topics} columns={columns as any} pagination={pagination} />
                </div>
            }
        </div>
    );
}

export default TopicBoardDashboard;

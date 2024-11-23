import { Tabs } from 'antd'
import './HomePageDashboard.css';
import RecentNotesTable from '@components/molecules/RecentNotesTable';
import RecentActionsTable from '@components/molecules/RecentActionsTable';
import WelcomePane from '@components/molecules/WelcomePane';

const { TabPane } = Tabs;


const DashboardContainer = () => {
  return (
    <div className={'dashboardContainer'} >
      {/* <div> */}
      <Tabs defaultActiveKey="1" style={{
        width: '100%',
        margin: '0 24px'
      }}>
        <TabPane tab="Overview" key="1">
          <WelcomePane />
        </TabPane>
        <TabPane tab="Notes" key="2">
          <RecentNotesTable />
        </TabPane>
        {/* <TabPane tab="Actions" key="3">
          <RecentActionsTable />
        </TabPane> */}
      </Tabs>
      {/* {homepageFilter === RecordType.NOTE
            ? <RecentNotesTable />
            : <RecentActionsTable />
          }
          <br /><br /><br /><br /><br /><br /><br /><br /> */}
      {/* </div> */}
      {/* <FloatButton
          type="primary"
          style={{ bottom: 140, right: 20 }}
          icon={<UserAddOutlined />}
          onClick={handleContactAddClick}
        />
        <FloatButton
          icon={<HighlightOutlined />}
          type="default" style={{ right: 20, bottom: 190 }}
          onClick={() => handleNoteAddClick()}
        />
        <FloatButton
          icon={<UploadOutlined />}
          type="default" style={{ right: 20, bottom: 290 }}
          onClick={() => navigate(`/${ActiveRouteKey.UPLOADS}`)}
        />
        <FloatButton
          icon={homepageFilter === RecordType.NOTE
            ? <CheckCircleOutlined />
            : <FormOutlined />
          }
          type="default" style={{ right: 20, bottom: 240 }}
          onClick={() => setHomepageFilter(homepageFilter === RecordType.NOTE ? RecordType.ACTION : RecordType.NOTE)}
        /> */}

      {/* <Footer> P.S. This is a work in progress such as courses being offered in ODD/EVEN semesters and other exclusive course offerings so the accuracy of curriculum planning can be a bit off, but nevertheless it works as a great tool for sharing course roadmaps </Footer> */}
    </div>
  )
}

export default DashboardContainer

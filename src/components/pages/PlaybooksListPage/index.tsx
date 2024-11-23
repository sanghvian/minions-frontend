import { ActiveModalType, ActiveRouteKey, setActivePlaybookId, setActiveQueryString, setActiveRouteKey, setIsModalOpen, setModalType } from '@redux/features/activeEntitiesSlice';
import { AppDispatch, RootState } from '@redux/store';
import { pushEvent } from '@utils/analytics';
import apiService from '@utils/api/api-service';
import { Button, Space, Spin, Table, TableProps, Typography } from 'antd';
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import './PlaybooksDashboard.css'
import toast from 'react-hot-toast';
import { initialContactState, setActiveContacts } from '@redux/features/contactSlice';
import { initialPlaybookState, setActivePlaybook, setPlaybooksList } from '@redux/features/playbookSlice';
import { Template } from '@models/template.model';
import BaseLayout from '@components/templates/BaseLayout';
import DashboardTopActionBar from '@components/organisms/DashboardTopActionBar';
import LeftSider from '@components/templates/LeftSider';
import RightDrawer from '@components/templates/RightDrawer';
import { AddOutline } from 'antd-mobile-icons';
import MasterAIChatBar from '@components/molecules/MasterAIChatBar';
import { Contact } from '@models/contact.model';
import { useNavigate } from "react-router-dom";
import { setUsageCount } from '@redux/features/userSlice';

const { Title } = Typography;


const PlaybooksListPage = () => {
  const navigate = useNavigate()
  const { email, token, usageCount } = useSelector((state: RootState) => state.persisted.user.value);
  const playbooksList = useSelector((state: RootState) => state.playbook.playbooksList);
  const [searchQuery, setSearchQuery] = useState('');
  const { isLoading } = useQuery({
    queryKey: ["getAllUserPlaybooks", email, token],
    queryFn: async ({ queryKey }) => {
      if (!queryKey[1]) return null;
      const playbooksReturned = await apiService.getAllUserTemplates(queryKey[1], queryKey[2]!);
      const playbooks = [...playbooksReturned]?.sort((a: Template, b: Template) => a.name.localeCompare(b.name)) as Template[]
      dispatch(setPlaybooksList(playbooks))
      return;
    },
  });
  const dispatch: AppDispatch = useDispatch();
  const activePlaybookId = useSelector((state: RootState) => state.activeEntities.activePlaybookId);

  const templateNameFilters = playbooksList.map((pb: Template) => ({
    text: pb.name,
    value: pb.name,
  }));

  const columns: TableProps<Template>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      onCell: (record, _) => {
        return {
          onClick: () => {
            dispatch(setUsageCount(usageCount! + 1))
            navigate(`/playbooks/${record._id}`);
          },
        };
      },
      render: (text) => <p>{text}</p>,
      filters: templateNameFilters.filter(
        (obj, index) =>
          index ===
          templateNameFilters.findIndex(
            (other) => other.text === obj.text && other.value === obj.value
          )
      ),
      onFilter: (value: any, template: Template) =>
        template.name.startsWith(value, 0),
      filterSearch: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      onCell: (record, _) => {
        return {
          onClick: () => {
            navigate(`/${ActiveRouteKey.PLAYBOOKS}/${record._id}`);
          },
        };
      }
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() =>
              handleDelete({
                _id: record._id,
                name: record.name,
                description: record.description,
                userId: email,
              } as Template)
            }
          >
            Delete
          </Button>
          {/* <Button
            type="primary"
            onClick={() => {
              dispatch(setActivePlaybookId(record._id!));
              toast.success("Active Playbook Set!");
            }}
          >
            Set Active
          </Button> */}
        </Space>
      ),
    },
  ];


  const handleDelete = async (pb: Template) => {
    toast.promise(
      apiService.deleteTemplate(pb._id!, token),
      {
        loading: '🗑️ Deleting Playbook...',
        success: <b>Playbook deleted!</b>,
        error: <b>Could not delete.</b>,
      }
    )
    pushEvent('DeletePlaybook', { playbook: pb })
    const filteredPlaybooks = (playbooksList as Template[]).filter((pbook: Template) => pbook._id !== pb._id)
    dispatch(setPlaybooksList(filteredPlaybooks))
  }
  useEffect(() => {
    pushEvent('UserPageView', { pageName: 'PlaybooksListPage' });
    dispatch(setActiveRouteKey(ActiveRouteKey.PLAYBOOKS));
    if (playbooksList && playbooksList?.length > 0) {
      dispatch(setPlaybooksList(playbooksList));
    }
  }, [dispatch]);

  // Filter playbooks based on search query
  const filteredPlaybooks = searchQuery === ''
    ? playbooksList
    : (playbooksList as Template[]).filter(pb => pb.name.toLowerCase().includes(searchQuery.toLowerCase()));


  const handleAddClick = () => {
    dispatch(setActiveQueryString(''))
    dispatch(setIsModalOpen(true))
    dispatch(setActiveContacts([]))
    pushEvent('AddPlaybookStart', { email })
    dispatch(setModalType(ActiveModalType.PLAYBOOK_ADD))
    dispatch(setActivePlaybook(initialPlaybookState.activePlaybook))
  }

  const getRowClassName = (record: Template) => {
    return record._id === activePlaybookId
      ? "tableRow activeRow"
      : "tableRow";
  };

  return (
    // Entry to desktop UI
    <BaseLayout
      top={<DashboardTopActionBar />}
      center={
        isLoading ? (
          <Spin />
        ) : (
          <div style={{ padding: "1.2rem" }}>
            <Title level={2}>All Guides</Title>
            <div
              style={{
                justifyContent: "stretch",
                width: "100%",
                display: "grid",
                gridTemplateColumns: "4fr 1fr",
                gridGap: "1rem",
              }}
            >
              <div></div>
              <Button
                type="primary"
                icon={<AddOutline />}
                onClick={handleAddClick}
              >
                Create Guide
              </Button>
            </div>
            <Table
              columns={columns}
              dataSource={filteredPlaybooks}
              rowClassName="tableRow"
            />
          </div>
        )
      }
      left={<LeftSider />}
      right={
        <RightDrawer
          children={
            <MasterAIChatBar
              presetContact={initialContactState.value as unknown as Contact}
            />
          }
        />
      }
    />
  );
}

export default PlaybooksListPage

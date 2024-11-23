import Icon from "@ant-design/icons/lib/components/Icon";
import { ResponseContentBlock } from "@models/contentBlock.model";
import { RootState } from "@redux/store";
import apiService from "@utils/api/api-service";
import {
  Spin,
  Table,
  Input,
  Button,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import Highlighter from "react-highlight-words";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const { Text, Title } = Typography;

const TopicsPageDashboard = () => {
  const { email, token } = useSelector(
    (state: RootState) => state.persisted.user.value
  );
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [totalContentBlocks, setTotalContentBlocks] = useState(0);
  const [topics, setTopics] = useState<ResponseContentBlock[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Use useNavigate hook for navigation

  const fetchTopics = async (page: number) => {
    setIsLoading(true);
    const { contentBlocks, count: totalContentBlocks } =
      await apiService.getPaginatedContentBlocksForUser(email, token, page, 10); // Adjust this line to correctly call your API
    setTopics(contentBlocks);
    setTotalContentBlocks(totalContentBlocks);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTopics(currentPage);
  }, [currentPage]);
  let searchInput: any;

  const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleReset = (clearFilters: any) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered: any) => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    // onFilter: (value: any, record: any) =>
    //     record[dataIndex]
    //         ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
    //         : '',
    onFilterDropdownVisibleChange: (visible: any) => {
      if (visible) {
        setTimeout(() => searchInput.select());
      }
    },
    render: (text: any) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const titleFilters = topics.map((topic) => ({
    text: topic.blockTitle,
    value: topic.blockTitle,
  }));
  const templateNameFilters = topics.map((topic) => ({
    text: topic.templateId.name,
    value: topic.templateId.name,
  }));

  const columns = [
    {
      title: "Topic Name",
      dataIndex: "blockTitle",
      key: "blockTitle",
      filters: titleFilters.filter(
        (obj, index) =>
          index ===
          titleFilters.findIndex(
            (other) => other.text === obj.text && other.value === obj.value
          )
      ),
      onFilter: (value: string, topic: ResponseContentBlock) =>
        topic.blockTitle.startsWith(value, 0),
      filterSearch: true,
      width: "20%",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ...getColumnSearchProps("description"),
      width: "60%",
    },
    {
      title: "Guide Name",
      dataIndex: "templateName",
      key: "templateName",
      filters: templateNameFilters.filter(
        (obj, index) =>
          index ===
          templateNameFilters.findIndex(
            (other) => other.text === obj.text && other.value === obj.value
          )
      ),
      onFilter: (value: string, topic: ResponseContentBlock) =>
        topic.templateId.name.startsWith(value, 0),
      filterSearch: true,
      width: "20%",
    },
    {
      title: "No. of Responses",
      dataIndex: "responseCount",
      key: "responseCount",
      sorter: (a: ResponseContentBlock, b: ResponseContentBlock) =>
        a.responseCount! - b.responseCount!,
      sortDirections: ["descend", "ascend"],
      width: "20%",
    },
  ];

  const topicsWithTemplateName = topics.map((topic) => {
    // console.log(topic);
    return {
      ...topic,
      templateName: topic.templateId.name,
      templateObjective: topic.templateId.description,
      responseCount: +topic.responseCount!,
    };
  });
  const pageSize = 10; // Number of documents per page

  return isLoading && !topicsWithTemplateName.length ? (
    <Spin />
  ) : (
    <div>
      {topicsWithTemplateName.length > 0 && (
        <div style={{ padding: "1.2rem 2rem" }}>
          <Title level={2}>All Topics</Title>
          {totalContentBlocks > 0 && (
            <Text>
              Showing {currentPage === 1 ? 1 : (currentPage - 1) * pageSize + 1}{" "}
              to{" "}
              {currentPage * pageSize > totalContentBlocks
                ? totalContentBlocks
                : currentPage * pageSize}{" "}
              of {totalContentBlocks} topics
            </Text>
          )}
          <Table
            dataSource={topicsWithTemplateName}
            columns={columns as any}
            pagination={{
              current: currentPage,
              pageSize: 10,
              total: totalContentBlocks,
              onChange: (page) => setCurrentPage(page),
            }}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  navigate(`/topics/${record._id}`);
                }, // Navigate on row click
              };
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TopicsPageDashboard;

import { PlusOutlined } from "@ant-design/icons";
import apiService from "@utils/api/api-service";
import { Button, Table, Typography, Modal, Radio, Drawer, Progress, Input, Form } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store'; // adjust the path according to your project structure

const { Title } = Typography;

interface Call {
  id: string;
  callerName: string;
  callerNumber: string;
  loanAmount: number;
  riskPercentage: number;
  assignedAgent: string;
  status: string;
}

const initialCalls: Call[] = [
  {
    id: "1",
    callerName: "Ankit Sanghvi",
    callerNumber: "+16506649945",
    loanAmount: 5000,
    riskPercentage: Math.floor(Math.random() * 100),
    assignedAgent: "",
    status: "pending",
  },
  {
    id: "2",
    callerName: "Abhishek Gupta",
    callerNumber: "+918530081736",
    loanAmount: 15000,
    riskPercentage: Math.floor(Math.random() * 100),
    assignedAgent: "",
    status: "pending",
  },
  {
    id: "3",
    callerName: "Jayanth Krishnaprakash",
    callerNumber: "3456789012",
    loanAmount: 10000,
    riskPercentage: Math.floor(Math.random() * 100),
    assignedAgent: "",
    status: "pending",
  },
  {
    id: "4",
    callerName: "Bob Brown",
    callerNumber: "4567890123",
    loanAmount: 20000,
    riskPercentage: Math.floor(Math.random() * 100),
    assignedAgent: "",
    status: "pending",
  },
  {
    id: "5",
    callerName: "Charlie Davis",
    callerNumber: "5678901234",
    loanAmount: 25000,
    riskPercentage: Math.floor(Math.random() * 100),
    assignedAgent: "",
    status: "pending",
  },
];

const CallsPageDashboard = () => {
  const [calls, setCalls] = useState<Call[]>(initialCalls);
  const [isAutoDialerRunning, setIsAutoDialerRunning] = useState(false);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isAddContactModalVisible, setIsAddContactModalVisible] = useState(false);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [language, setLanguage] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [newContact, setNewContact] = useState<{ name: string; phone: string; loan: number; risk: number }>({
    name: "",
    phone: "",
    loan: 0,
    risk: 0,
  });

  const voiceAgents = useSelector((state: RootState) => state.persisted.voiceAgents.voiceAgents);

  const navigate = useNavigate();

  const showLanguageModal = (call: Call) => {
    setSelectedCall(call);
    setIsLanguageModalVisible(true);
  };

  const handleOk = async () => {
    if (selectedCall) {
      await handleCallNow(selectedCall, language);
      setIsLanguageModalVisible(false);
      setSelectedCall(null);
      setLanguage("");
    }
  };

  const handleCancel = () => {
    setIsLanguageModalVisible(false);
    setSelectedCall(null);
    setLanguage("");
  };

  const handleCallNow = async (call: Call, language: string) => {
    const assignedAgent = selectVoiceAgent(call.loanAmount);
    try {
      await apiService.callViaVoiceAgent({
        phoneNumber: call.callerNumber,
        customerName: call.callerName,
        loanAmount: call.loanAmount.toString(),
        language,
      });
      updateCallStatus(call.id, "completed", assignedAgent);
    } catch (error) {
      updateCallStatus(call.id, "failed", assignedAgent);
    }
  };

  const updateCallStatus = (id: string, status: string, assignedAgent: string) => {
    setCalls((prevCalls) =>
      prevCalls.map((call) =>
        call.id === id ? { ...call, status, assignedAgent } : call
      )
    );
  };

  const handleAutoDialer = async () => {
    setIsDrawerVisible(true);
    setIsAutoDialerRunning(true);
    let completedCalls = 0;
    for (const call of calls) {
      if (call.status === "pending") {
        await showLanguageModal(call);
        await new Promise((resolve) => {
          const interval = setInterval(() => {
            if (!isLanguageModalVisible) {
              clearInterval(interval);
              resolve(undefined);
            }
          }, 100);
        });
        completedCalls += 1;
        setProgress(Math.round((completedCalls / calls.length) * 100));
      }
    }
    setIsAutoDialerRunning(false);
  };

  const handleAddContact = () => {
    const newCall: Call = {
      id: (calls.length + 1).toString(),
      callerName: newContact.name,
      callerNumber: newContact.phone,
      loanAmount: newContact.loan,
      riskPercentage: newContact.risk,
      assignedAgent: "",
      status: "pending",
    };
    setCalls([...calls, newCall]);
    setIsAddContactModalVisible(false);
    setNewContact({ name: "", phone: "", loan: 0, risk: 0 });
  };

  const selectVoiceAgent = (loanAmount: number): string => {
    if (loanAmount > 4000) return voiceAgents[3].name;
    else if (loanAmount < 4000 && loanAmount > 1000) return voiceAgents[0].name;
    if (loanAmount < 1000) return voiceAgents[3].name;
    return voiceAgents[0].name;
  };

  const columns = [
    {
      title: "Caller ID Name",
      dataIndex: "callerName",
      key: "callerName",
      width: "15%",
    },
    {
      title: "Caller ID Number",
      dataIndex: "callerNumber",
      key: "callerNumber",
      width: "15%",
    },
    {
      title: "Loan Amount",
      dataIndex: "loanAmount",
      key: "loanAmount",
      width: "10%",
    },
    {
      title: "Risk Percentage",
      dataIndex: "riskPercentage",
      key: "riskPercentage",
      width: "10%",
    },
    {
      title: "Assigned Voice Agent",
      dataIndex: "assignedAgent",
      key: "assignedAgent",
      width: "15%",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "15%",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Call) => (
        <Button
          type="primary"
          onClick={() => showLanguageModal(record)}
          disabled={isAutoDialerRunning}
        >
          Call Now
        </Button>
      ),
      width: "20%",
    },
  ];

  return (
    <div style={{ padding: "1.2rem 2rem" }}>
      <Title level={2}>All Calls</Title>
      <Button
        icon={<PlusOutlined />}
        style={{ marginRight: "10px" }}
        onClick={() => setIsAddContactModalVisible(true)}
      >
        Add Contact
      </Button>
      <Button
        type="primary"
        onClick={handleAutoDialer}
        disabled={isAutoDialerRunning}
      >
        Auto Dialer
      </Button>
      <Table
        dataSource={calls}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
      <Modal
        title="Select Language"
        visible={isLanguageModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Radio.Group
          onChange={(e) => setLanguage(e.target.value)}
          value={language}
        >
          <Radio value={"Hindi"}>Hindi</Radio>
          <Radio value={"English"}>English</Radio>
        </Radio.Group>
      </Modal>
      <Drawer
        title="Auto Dialer Progress"
        placement="right"
        closable={false}
        onClose={() => setIsDrawerVisible(false)}
        visible={isDrawerVisible}
      >
        <Progress type="circle" percent={progress} />
      </Drawer>
      <Modal
        title="Add New Contact"
        visible={isAddContactModalVisible}
        onOk={handleAddContact}
        onCancel={() => setIsAddContactModalVisible(false)}
      >
        <Form layout="vertical">
          <Form.Item label="Name">
            <Input
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Phone Number">
            <Input
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Loan Amount">
            <Input
              type="number"
              value={newContact.loan}
              onChange={(e) => setNewContact({ ...newContact, loan: Number(e.target.value) })}
            />
          </Form.Item>
          <Form.Item label="Risk Percentage">
            <Input
              type="number"
              min={0}
              max={100}
              value={newContact.risk}
              onChange={(e) => setNewContact({ ...newContact, risk: Number(e.target.value) })}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CallsPageDashboard;

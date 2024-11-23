import { useLocation, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";
import apiService from "@utils/api/api-service";
import { useState } from "react";
import { setActiveDocument } from "@redux/features/documentSlice";
import { Button, Card, Spin } from "antd";
import { AlignLeftOutlined } from "@ant-design/icons";

const SummaryDocument = () => {
  const activeDocument = useSelector(
    (state: RootState) => state.document.activeDocument
  );
  const [isSummaryGenerating, setIsSummaryGenerating] = useState(false);
  const dispatch: AppDispatch = useDispatch();


  const handleSummaryClick = async () => {
    setIsSummaryGenerating(true);
    const response = await apiService.generateDocumentSummary(
      activeDocument?._id as string,
      activeDocument?.documentTranscript as string
    );
    const actionItems: string[] = response.updatedDocument.actionItems ?? [];
    const keyInsights: string[] = response.updatedDocument.keyInsights ?? [];
    const summary: string = response.updatedDocument.summary ?? "";
    dispatch(
      setActiveDocument({
        ...activeDocument,
        actionItems,
        keyInsights,
        summary,
      })
    );
    setIsSummaryGenerating(false);
  };


  if (isSummaryGenerating) return <Spin />;
  else if (
    activeDocument?.documentTranscript &&
    !activeDocument?.summary &&
    activeDocument?.keyInsights?.length === 0 &&
    activeDocument?.actionItems?.length === 0
  )
    return (
      <div>
        <Button icon={<AlignLeftOutlined />} onClick={handleSummaryClick}>
          Generate Summary
        </Button>
      </div>
    );
  else if (
    activeDocument?.summary ||
    (activeDocument?.keyInsights?.length ?? 0) > 0 ||
    (activeDocument?.actionItems?.length ?? 0) > 0
  )
    return (
      <Card className="summary-component-card">
        <div>
          <h3>Summary</h3>
          <p>{activeDocument?.summary}</p>
        </div>
        <div>
          <h3>Key Insights</h3>
          <div>
            {activeDocument?.keyInsights?.map((insight, index) => (
              <div key={index}>&nbsp;&nbsp;→&nbsp;&nbsp;{insight}</div>
            ))}
          </div>
        </div>
        <div>
          <h3>Action Items</h3>
          <div>
            {activeDocument?.actionItems?.map((item, index) => (
              <div key={index}>&nbsp;&nbsp;→&nbsp;&nbsp;{item}</div>
            ))}
          </div>
        </div>
      </Card>
    );
  else return <div>No summary found</div>;
};

export default SummaryDocument;

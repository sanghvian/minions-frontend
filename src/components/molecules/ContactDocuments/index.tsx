import { CompleteDocument } from "@models/document.model"
import { Button, Card } from "antd";
import { format } from "date-fns";
import "./ContactDocuments.css";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ActiveRouteKey } from "@redux/features/activeEntitiesSlice";

const ContactDocuments: React.FC<{ documents: CompleteDocument[] }> = ({ documents }) => {
  const navigate = useNavigate();
  const allDocuments = documents.map((document: CompleteDocument) => {
    return (
      <Card title={document.templateId.name}
        extra={
          <Button icon={<EyeOutlined />} onClick={() => navigate(`/${ActiveRouteKey.DOCUMENTS}/${document._id}`)} />
        }
        className="document-card-item">
        <span className="document-date">
          {format(new Date(document.createdAt), "h:mma, do MMM yyyy")}
        </span>
        <div className="document-notes-div">
          {document.contentResponses
            ?.sort(
              (a, b) => a.contentBlockId.order - b.contentBlockId.order
            )
            .map((response) => {
              return (
                <div className="note-item">
                  <div className="note-item-heading" onClick={() => navigate(`/topics/${response.contentBlockId._id}`)}>
                    {response.contentBlockId.blockTitle}
                  </div>
                  <div>{response.answerText}</div>
                </div>
              );
            })}
        </div>
      </Card>
    );
  });
  return (
    <div style={{ paddingTop: "1rem" }}>
      {allDocuments.length > 0 ? (
        <div className="all-documents-grid">{allDocuments}</div>
      ) : (
        "No documents found"
      )}
    </div>
  );
}


export default ContactDocuments
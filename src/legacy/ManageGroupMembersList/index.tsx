
import { Contact } from "@models/contact.model";
import { List } from "antd";
import GroupMemberListItem from "../GroupMemberListItem";

const ManageGroupMembersList: React.FC<{ results: Contact[] }> = ({ results }) => {
    return (
        <List
            itemLayout="vertical"
            size="small"
            dataSource={results}
            renderItem={(item: Contact, i: number) => (
                <GroupMemberListItem item={item} />
            )}
        />
    )
}
export default ManageGroupMembersList;
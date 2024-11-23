import InternalSearchItem from "@components/atoms/InternalSearchItem"
import { Contact } from "@models/contact.model"
import { List } from "antd"

const InternalSearchItemsList: React.FC<{ results: Contact[] }> = ({ results }) => {
    return (
        <List
            itemLayout="vertical"
            size="small"
            dataSource={results}
            renderItem={(item: Contact, i: number) => (
                <InternalSearchItem item={item} />
            )}
        />
    )
}

export default InternalSearchItemsList
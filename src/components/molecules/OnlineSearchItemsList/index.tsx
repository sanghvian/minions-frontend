import OnlineSearchResultItem from "@components/atoms/OnlineSearchResultItem"
import { ContactOnlineSearchResult } from "@models/contact.model"
import { List } from "antd"

const OnlineSearchItemsList: React.FC<{ results: ContactOnlineSearchResult[] }> = ({ results }) => {
    return (
        <List
            itemLayout="vertical"
            size="small"
            dataSource={results}
            renderItem={(item: ContactOnlineSearchResult) => (
                <OnlineSearchResultItem {...item} />
            )}
        />
    )
}

export default OnlineSearchItemsList
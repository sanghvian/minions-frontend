import { Template } from "@models/template.model";
import { setActivePlaybookId } from "@redux/features/activeEntitiesSlice";
import { AppDispatch, RootState } from "@redux/store";
import { Checkbox, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import './PlaybookItem.css'


export const PlaybookItem = ({ item, key }: { item: Template, key: number, handleDelete: (item: any) => void }) => {
    const activePlaybookId = useSelector((state: RootState) => state.activeEntities.activePlaybookId);
    const navigate = useNavigate();
    const isActivePlaybook = activePlaybookId === item._id;
    const dispatch: AppDispatch = useDispatch();
    return (
        <div key={key} className={`pbItemContainerWrapper  ${isActivePlaybook ? 'active' : 'inactive'}`} onClick={(e) => {
            // navigate(`/${ActiveRouteKey.PLAYBOOKS}/${item._id}`)
            e.stopPropagation();
            dispatch(setActivePlaybookId(item._id!));
        }}>
            <div className='pbItemContainer'  >
                <h4 className='pb-title'>{item?.name}</h4>
                <div>{item.description}</div>
                {isActivePlaybook && <Tag color="blue">Active</Tag>}
            </div>
            <Checkbox
                checked={isActivePlaybook}
                onChange={(e) => {
                    e.stopPropagation();
                    dispatch(setActivePlaybookId(item._id!))
                }}
            />
        </div>
    )
}
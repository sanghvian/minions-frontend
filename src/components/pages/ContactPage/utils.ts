import { Action } from "@models/action.model";
import { compareDesc, parseISO } from "date-fns";

export const sortAndTransformActions = (actions: Action[]) => {
    // Sorting the notes in descending order (latest first)
    const sortedActions = [...actions].sort((a: Action, b: Action) =>
        compareDesc(parseISO(b.timestamp), parseISO(a.timestamp))
    );

    // Transforming the sorted notes into the required format
    return sortedActions
}
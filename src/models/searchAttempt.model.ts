import { CompleteAction } from "./action.model";
import { Contact } from "./contact.model";
import { CompleteContentResponse } from "./contentResponse.model";
import { CompleteHistory } from "./history.model";
import { LinkedinContact } from "./linkedinContact.model";
import { CompleteNote } from "./note.model";
import { CompleteRelationship } from "./relationship.model";
import { User } from "./user.model";

type PossibleSearchResponseType = CompleteNote | CompleteAction | CompleteRelationship | Contact | LinkedinContact | CompleteHistory | CompleteContentResponse;

type SearchResultType = (PossibleSearchResponseType & { isLiked?: boolean })

export interface SearchAttempt {
    id?: string,
    user: Partial<User>,
    isLiked?: boolean,
    query: string,
    answer: string,
    // TODO: Improve this flow as well, after a point
    // mostRecommendedContacts: Contact[],
    searchResults: SearchResultType[],
}
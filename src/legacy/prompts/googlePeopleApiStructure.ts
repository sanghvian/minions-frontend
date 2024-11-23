const googlePeopleApiString = `Method: people.createContact

bookmark_border
Create a new contact and return the person resource for that contact.

The request returns a 400 error if more than one field is specified on a field that is a singleton for contact sources:

biographies
birthdays
genders
names
Mutate requests for the same user should be sent sequentially to avoid increased latency and failures.

Query parameters
Parameters
personFields	
string (FieldMask format)

Required. A field mask to restrict which fields on each person are returned. Multiple fields can be specified by separating them with commas. Defaults to all fields if not set. Valid values are:

addresses
ageRanges
biographies
birthdays
calendarUrls
clientData
coverPhotos
emailAddresses
events
externalIds
genders
imClients
interests
locales
locations
memberships
metadata
miscKeywords
names
nicknames
occupations
organizations
phoneNumbers
photos
relations
sipAddresses
skills
urls
userDefined
sources[]	
enum (ReadSourceType)

Optional. A mask of what source types to return. Defaults to READ_SOURCE_TYPE_CONTACT and READ_SOURCE_TYPE_PROFILE if not set.

Request body
The request body contains an instance of Person.

Response body
If successful, the response body contains an instance of Person

REST Resource: people

bookmark_border
Resource: Person
Information about a person merged from various data sources such as the authenticated user's contacts and profile data.

Most fields can have multiple items. The items in a field have no guaranteed order, but each non-empty field is guaranteed to have exactly one field with metadata.primary set to true.

JSON representation

{
  "resourceName": string,
  "etag": string,
  "metadata": {
    object (PersonMetadata)
  },
  "addresses": [
    {
      object (Address)
    }
  ],
  "ageRange": enum (AgeRange),
  "ageRanges": [
    {
      object (AgeRangeType)
    }
  ],
  "biographies": [
    {
      object (Biography)
    }
  ],
  "birthdays": [
    {
      object (Birthday)
    }
  ],
  "braggingRights": [
    {
      object (BraggingRights)
    }
  ],
  "calendarUrls": [
    {
      object (CalendarUrl)
    }
  ],
  "clientData": [
    {
      object (ClientData)
    }
  ],
  "coverPhotos": [
    {
      object (CoverPhoto)
    }
  ],
  "emailAddresses": [
    {
      object (EmailAddress)
    }
  ],
  "events": [
    {
      object (Event)
    }
  ],
  "externalIds": [
    {
      object (ExternalId)
    }
  ],
  "fileAses": [
    {
      object (FileAs)
    }
  ],
  "genders": [
    {
      object (Gender)
    }
  ],
  "imClients": [
    {
      object (ImClient)
    }
  ],
  "interests": [
    {
      object (Interest)
    }
  ],
  "locales": [
    {
      object (Locale)
    }
  ],
  "locations": [
    {
      object (Location)
    }
  ],
  "memberships": [
    {
      object (Membership)
    }
  ],
  "miscKeywords": [
    {
      object (MiscKeyword)
    }
  ],
  "names": [
    {
      object (Name)
    }
  ],
  "nicknames": [
    {
      object (Nickname)
    }
  ],
  "occupations": [
    {
      object (Occupation)
    }
  ],
  "organizations": [
    {
      object (Organization)
    }
  ],
  "phoneNumbers": [
    {
      object (PhoneNumber)
    }
  ],
  "photos": [
    {
      object (Photo)
    }
  ],
  "relations": [
    {
      object (Relation)
    }
  ],
  "relationshipInterests": [
    {
      object (RelationshipInterest)
    }
  ],
  "relationshipStatuses": [
    {
      object (RelationshipStatus)
    }
  ],
  "residences": [
    {
      object (Residence)
    }
  ],
  "sipAddresses": [
    {
      object (SipAddress)
    }
  ],
  "skills": [
    {
      object (Skill)
    }
  ],
  "taglines": [
    {
      object (Tagline)
    }
  ],
  "urls": [
    {
      object (Url)
    }
  ],
  "userDefined": [
    {
      object (UserDefined)
    }
  ]
}
Fields
resourceName	
string

The resource name for the person, assigned by the server. An ASCII string in the form of people/{person_id}.

etag	
string

The HTTP entity tag of the resource. Used for web cache validation.

metadata	
object (PersonMetadata)

Output only. Metadata about the person.

addresses[]	
object (Address)

The person's street addresses.

ageRange
(deprecated)	
enum (AgeRange)

This item is deprecated!

Output only. DEPRECATED (Please use person.ageRanges instead)

The person's age range.

ageRanges[]	
object (AgeRangeType)

Output only. The person's age ranges.

biographies[]	
object (Biography)

The person's biographies. This field is a singleton for contact sources.

birthdays[]	
object (Birthday)

The person's birthdays. This field is a singleton for contact sources.

braggingRights[]
(deprecated)	
object (BraggingRights)

This item is deprecated!

DEPRECATED: No data will be returned The person's bragging rights.

calendarUrls[]	
object (CalendarUrl)

The person's calendar URLs.

clientData[]	
object (ClientData)

The person's client data.

coverPhotos[]	
object (CoverPhoto)

Output only. The person's cover photos.

emailAddresses[]	
object (EmailAddress)

The person's email addresses. For people.connections.list and otherContacts.list the number of email addresses is limited to 100. If a Person has more email addresses the entire set can be obtained by calling people.getBatchGet.

events[]	
object (Event)

The person's events.

externalIds[]	
object (ExternalId)

The person's external IDs.

fileAses[]	
object (FileAs)

The person's file-ases.

genders[]	
object (Gender)

The person's genders. This field is a singleton for contact sources.

imClients[]	
object (ImClient)

The person's instant messaging clients.

interests[]	
object (Interest)

The person's interests.

locales[]	
object (Locale)

The person's locale preferences.

locations[]	
object (Location)

The person's locations.

memberships[]	
object (Membership)

The person's group memberships.

miscKeywords[]	
object (MiscKeyword)

The person's miscellaneous keywords.

names[]	
object (Name)

The person's names. This field is a singleton for contact sources.

nicknames[]	
object (Nickname)

The person's nicknames.

occupations[]	
object (Occupation)

The person's occupations.

organizations[]	
object (Organization)

The person's past or current organizations.

phoneNumbers[]	
object (PhoneNumber)

The person's phone numbers. For people.connections.list and otherContacts.list the number of phone numbers is limited to 100. If a Person has more phone numbers the entire set can be obtained by calling people.getBatchGet.

photos[]	
object (Photo)

Output only. The person's photos.

relations[]	
object (Relation)

The person's relations.

relationshipInterests[]
(deprecated)	
object (RelationshipInterest)

This item is deprecated!

Output only. DEPRECATED: No data will be returned The person's relationship interests.

relationshipStatuses[]
(deprecated)	
object (RelationshipStatus)

This item is deprecated!

Output only. DEPRECATED: No data will be returned The person's relationship statuses.

residences[]
(deprecated)	
object (Residence)

This item is deprecated!

DEPRECATED: (Please use person.locations instead) The person's residences.

sipAddresses[]	
object (SipAddress)

The person's SIP addresses.

skills[]	
object (Skill)

The person's skills.

taglines[]
(deprecated)	
object (Tagline)

This item is deprecated!

Output only. DEPRECATED: No data will be returned The person's taglines.

urls[]	
object (Url)

The person's associated URLs.

userDefined[]	
object (UserDefined)

The person's user defined data.

PersonMetadata
The metadata about a person.

JSON representation

{
  "sources": [
    {
      object (Source)
    }
  ],
  "previousResourceNames": [
    string
  ],
  "linkedPeopleResourceNames": [
    string
  ],
  "deleted": boolean,
  "objectType": enum (ObjectType)
}
Fields
sources[]	
object (Source)

The sources of data for the person.

previousResourceNames[]	
string

Output only. Any former resource names this person has had. Populated only for people.connections.list requests that include a sync token.

The resource name may change when adding or removing fields that link a contact and profile such as a verified email, verified phone number, or profile URL.

linkedPeopleResourceNames[]	
string

Output only. Resource names of people linked to this resource.

deleted	
boolean

Output only. True if the person resource has been deleted. Populated only for people.connections.list and otherContacts.list sync requests.

objectType
(deprecated)	
enum (ObjectType)

This item is deprecated!

Output only. DEPRECATED (Please use person.metadata.sources.profileMetadata.objectType instead)

The type of the person object.

Source
The source of a field.

JSON representation

{
  "type": enum (SourceType),
  "id": string,
  "etag": string,
  "updateTime": string,
  "profileMetadata": {
    object (ProfileMetadata)
  }
}
Fields
type	
enum (SourceType)

The source type.

id	
string

The unique identifier within the source type generated by the server.

etag	
string

Only populated in person.metadata.sources.

The HTTP entity tag of the source. Used for web cache validation.

updateTime	
string (Timestamp format)

Output only. Only populated in person.metadata.sources.

Last update timestamp of this source.

A timestamp in RFC3339 UTC "Zulu" format, with nanosecond resolution and up to nine fractional digits. Examples: "2014-10-02T15:01:23Z" and "2014-10-02T15:01:23.045123456Z".

profileMetadata	
object (ProfileMetadata)

Output only. Only populated in person.metadata.sources.

Metadata about a source of type PROFILE.

SourceType
The type of a source.

Enums
SOURCE_TYPE_UNSPECIFIED	Unspecified.
ACCOUNT	Google Account.
PROFILE	Google profile. You can view the profile at https://profiles.google.com/{id}, where {id} is the source id.
DOMAIN_PROFILE	Google Workspace domain profile.
CONTACT	Google contact. You can view the contact at https://contact.google.com/{id}, where {id} is the source id.
OTHER_CONTACT	Google "Other contact".
DOMAIN_CONTACT	Google Workspace domain shared contact.
ProfileMetadata
The metadata about a profile.

JSON representation

{
  "objectType": enum (ObjectType),
  "userTypes": [
    enum (UserType)
  ]
}
Fields
objectType	
enum (ObjectType)

Output only. The profile object type.

userTypes[]	
enum (UserType)

Output only. The user types.

ObjectType
The type of a person object.

Enums
OBJECT_TYPE_UNSPECIFIED	Unspecified.
PERSON	Person.
PAGE	Currents Page.
UserType
The type of the user.

Enums
USER_TYPE_UNKNOWN	The user type is not known.
GOOGLE_USER	The user is a Google user.
GPLUS_USER	The user is a Currents user.
GOOGLE_APPS_USER	The user is a Google Workspace user.
Address
A person's physical address. May be a P.O. box or street address. All fields are optional.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "formattedValue": string,
  "type": string,
  "formattedType": string,
  "poBox": string,
  "streetAddress": string,
  "extendedAddress": string,
  "city": string,
  "region": string,
  "postalCode": string,
  "country": string,
  "countryCode": string
}
Fields
metadata	
object (FieldMetadata)

Metadata about the address.

formattedValue	
string

The unstructured value of the address. If this is not set by the user it will be automatically constructed from structured values.

type	
string

The type of the address. The type can be custom or one of these predefined values:

home
work
other
formattedType	
string

Output only. The type of the address translated and formatted in the viewer's account locale or the Accept-Language HTTP header locale.

poBox	
string

The P.O. box of the address.

streetAddress	
string

The street address.

extendedAddress	
string

The extended address of the address; for example, the apartment number.

city	
string

The city of the address.

region	
string

The region of the address; for example, the state or province.

postalCode	
string

The postal code of the address.

country	
string

The country of the address.

countryCode	
string

The ISO 3166-1 alpha-2 country code of the address.

FieldMetadata
Metadata about a field.

JSON representation

{
  "primary": boolean,
  "sourcePrimary": boolean,
  "verified": boolean,
  "source": {
    object (Source)
  }
}
Fields
primary	
boolean

Output only. True if the field is the primary field for all sources in the person. Each person will have at most one field with primary set to true.

sourcePrimary	
boolean

True if the field is the primary field for the source. Each source must have at most one field with sourcePrimary set to true.

verified	
boolean

Output only. True if the field is verified; false if the field is unverified. A verified field is typically a name, email address, phone number, or website that has been confirmed to be owned by the person.

source	
object (Source)

The source of the field.

AgeRange
This item is deprecated!

DEPRECATED (Please use person.ageRanges instead)

An age range of a person.

Enums
AGE_RANGE_UNSPECIFIED	Unspecified.
LESS_THAN_EIGHTEEN	Younger than eighteen.
EIGHTEEN_TO_TWENTY	Between eighteen and twenty.
TWENTY_ONE_OR_OLDER	Twenty-one and older.
AgeRangeType
A person's age range.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "ageRange": enum (AgeRange)
}
Fields
metadata	
object (FieldMetadata)

Metadata about the age range.

ageRange	
enum (AgeRange)

The age range.

Biography
A person's short biography.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "value": string,
  "contentType": enum (ContentType)
}
Fields
metadata	
object (FieldMetadata)

Metadata about the biography.

value	
string

The short biography.

contentType	
enum (ContentType)

The content type of the biography.

ContentType
The type of content.

Enums
CONTENT_TYPE_UNSPECIFIED	Unspecified.
TEXT_PLAIN	Plain text.
TEXT_HTML	HTML text.
Birthday
A person's birthday. At least one of the date and text fields are specified. The date and text fields typically represent the same date, but are not guaranteed to. Clients should always set the date field when mutating birthdays.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "date": {
    object (Date)
  },
  "text": string
}
Fields
metadata	
object (FieldMetadata)

Metadata about the birthday.

date	
object (Date)

The structured date of the birthday.

text
(deprecated)	
string

This item is deprecated!

Prefer to use the date field if set.

A free-form string representing the user's birthday. This value is not validated.

Date
Represents a whole or partial calendar date, such as a birthday. The time of day and time zone are either specified elsewhere or are insignificant. The date is relative to the Gregorian Calendar. This can represent one of the following:

A full date, with non-zero year, month, and day values.
A month and day, with a zero year (for example, an anniversary).
A year on its own, with a zero month and a zero day.
A year and month, with a zero day (for example, a credit card expiration date).
Related types:

google.type.TimeOfDay
google.type.DateTime
google.protobuf.Timestamp
JSON representation

{
  "year": integer,
  "month": integer,
  "day": integer
}
Fields
year	
integer

Year of the date. Must be from 1 to 9999, or 0 to specify a date without a year.

month	
integer

Month of a year. Must be from 1 to 12, or 0 to specify a year without a month and day.

day	
integer

Day of a month. Must be from 1 to 31 and valid for the year and month, or 0 to specify a year by itself or a year and month where the day isn't significant.

BraggingRights
This item is deprecated!

DEPRECATED: No data will be returned A person's bragging rights.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "value": string
}
Fields
metadata	
object (FieldMetadata)

Metadata about the bragging rights.

value	
string

The bragging rights; for example, climbed mount everest.

CalendarUrl
A person's calendar URL.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "url": string,
  "type": string,
  "formattedType": string
}
Fields
metadata	
object (FieldMetadata)

Metadata about the calendar URL.

url	
string

The calendar URL.

type	
string

The type of the calendar URL. The type can be custom or one of these predefined values:

home
freeBusy
work
formattedType	
string

Output only. The type of the calendar URL translated and formatted in the viewer's account locale or the Accept-Language HTTP header locale.

ClientData
Arbitrary client data that is populated by clients. Duplicate keys and values are allowed.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "key": string,
  "value": string
}
Fields
metadata	
object (FieldMetadata)

Metadata about the client data.

key	
string

The client specified key of the client data.

value	
string

The client specified value of the client data.

CoverPhoto
A person's cover photo. A large image shown on the person's profile page that represents who they are or what they care about.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "url": string,
  "default": boolean
}
Fields
metadata	
object (FieldMetadata)

Metadata about the cover photo.

url	
string

The URL of the cover photo.

default	
boolean

True if the cover photo is the default cover photo; false if the cover photo is a user-provided cover photo.

EmailAddress
A person's email address.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "value": string,
  "type": string,
  "formattedType": string,
  "displayName": string
}
Fields
metadata	
object (FieldMetadata)

Metadata about the email address.

value	
string

The email address.

type	
string

The type of the email address. The type can be custom or one of these predefined values:

home
work
other
formattedType	
string

Output only. The type of the email address translated and formatted in the viewer's account locale or the Accept-Language HTTP header locale.

displayName	
string

The display name of the email.

Event
An event related to the person.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "date": {
    object (Date)
  },
  "type": string,
  "formattedType": string
}
Fields
metadata	
object (FieldMetadata)

Metadata about the event.

date	
object (Date)

The date of the event.

type	
string

The type of the event. The type can be custom or one of these predefined values:

anniversary
other
formattedType	
string

Output only. The type of the event translated and formatted in the viewer's account locale or the Accept-Language HTTP header locale.

ExternalId
An identifier from an external entity related to the person.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "value": string,
  "type": string,
  "formattedType": string
}
Fields
metadata	
object (FieldMetadata)

Metadata about the external ID.

value	
string

The value of the external ID.

type	
string

The type of the external ID. The type can be custom or one of these predefined values:

account
customer
loginId
network
organization
formattedType	
string

Output only. The type of the event translated and formatted in the viewer's account locale or the Accept-Language HTTP header locale.

FileAs
The name that should be used to sort the person in a list.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "value": string
}
Fields
metadata	
object (FieldMetadata)

Metadata about the file-as.

value	
string

The file-as value

Gender
A person's gender.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "value": string,
  "formattedValue": string,
  "addressMeAs": string
}
Fields
metadata	
object (FieldMetadata)

Metadata about the gender.

value	
string

The gender for the person. The gender can be custom or one of these predefined values:

male
female
unspecified
formattedValue	
string

Output only. The value of the gender translated and formatted in the viewer's account locale or the Accept-Language HTTP header locale. Unspecified or custom value are not localized.

addressMeAs	
string

Free form text field for pronouns that should be used to address the person. Common values are:

he/him
she/her
they/them
ImClient
A person's instant messaging client.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "username": string,
  "type": string,
  "formattedType": string,
  "protocol": string,
  "formattedProtocol": string
}
Fields
metadata	
object (FieldMetadata)

Metadata about the IM client.

username	
string

The user name used in the IM client.

type	
string

The type of the IM client. The type can be custom or one of these predefined values:

home
work
other
formattedType	
string

Output only. The type of the IM client translated and formatted in the viewer's account locale or the Accept-Language HTTP header locale.

protocol	
string

The protocol of the IM client. The protocol can be custom or one of these predefined values:

aim
msn
yahoo
skype
qq
googleTalk
icq
jabber
netMeeting
formattedProtocol	
string

Output only. The protocol of the IM client formatted in the viewer's account locale or the Accept-Language HTTP header locale.

Interest
One of the person's interests.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "value": string
}
Fields
metadata	
object (FieldMetadata)

Metadata about the interest.

value	
string

The interest; for example, stargazing.

Locale
A person's locale preference.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "value": string
}
Fields
metadata	
object (FieldMetadata)

Metadata about the locale.

value	
string

The well-formed IETF BCP 47 language tag representing the locale.

Location
A person's location.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "value": string,
  "type": string,
  "current": boolean,
  "buildingId": string,
  "floor": string,
  "floorSection": string,
  "deskCode": string
}
Fields
metadata	
object (FieldMetadata)

Metadata about the location.

value	
string

The free-form value of the location.

type	
string

The type of the location. The type can be custom or one of these predefined values:

desk
grewUp
current	
boolean

Whether the location is the current location.

buildingId	
string

The building identifier.

floor	
string

The floor name or number.

floorSection	
string

The floor section in floor_name.

deskCode	
string

The individual desk location.

Membership
A person's membership in a group. Only contact group memberships can be modified.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },

  // Union field membership can be only one of the following:
  "contactGroupMembership": {
    object (ContactGroupMembership)
  },
  "domainMembership": {
    object (DomainMembership)
  }
  // End of list of possible types for union field membership.
}
Fields
metadata	
object (FieldMetadata)

Metadata about the membership.

Union field membership. The membership. membership can be only one of the following:
contactGroupMembership	
object (ContactGroupMembership)

The contact group membership.

domainMembership	
object (DomainMembership)

Output only. The domain membership.

ContactGroupMembership
A Google contact group membership.

JSON representation

{
  "contactGroupId": string,
  "contactGroupResourceName": string
}
Fields
contactGroupId
(deprecated)	
string

This item is deprecated!

Output only. The contact group ID for the contact group membership.

contactGroupResourceName	
string

The resource name for the contact group, assigned by the server. An ASCII string, in the form of contactGroups/{contactGroupId}. Only contactGroupResourceName can be used for modifying memberships. Any contact group membership can be removed, but only user group or "myContacts" or "starred" system groups memberships can be added. A contact must always have at least one contact group membership.

DomainMembership
A Google Workspace Domain membership.

JSON representation

{
  "inViewerDomain": boolean
}
Fields
inViewerDomain	
boolean

True if the person is in the viewer's Google Workspace domain.

MiscKeyword
A person's miscellaneous keyword.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "value": string,
  "type": enum (KeywordType),
  "formattedType": string
}
Fields
metadata	
object (FieldMetadata)

Metadata about the miscellaneous keyword.

value	
string

The value of the miscellaneous keyword.

type	
enum (KeywordType)

The miscellaneous keyword type.

formattedType	
string

Output only. The type of the miscellaneous keyword translated and formatted in the viewer's account locale or the Accept-Language HTTP header locale.

KeywordType
Type of miscellaneous keyword.

Enums
TYPE_UNSPECIFIED	Unspecified.
OUTLOOK_BILLING_INFORMATION	Outlook field for billing information.
OUTLOOK_DIRECTORY_SERVER	Outlook field for directory server.
OUTLOOK_KEYWORD	Outlook field for keyword.
OUTLOOK_MILEAGE	Outlook field for mileage.
OUTLOOK_PRIORITY	Outlook field for priority.
OUTLOOK_SENSITIVITY	Outlook field for sensitivity.
OUTLOOK_SUBJECT	Outlook field for subject.
OUTLOOK_USER	Outlook field for user.
HOME	Home.
WORK	Work.
OTHER	Other.

Name
A person's name. If the name is a mononym, the family name is empty.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "displayName": string,
  "displayNameLastFirst": string,
  "unstructuredName": string,
  "familyName": string,
  "givenName": string,
  "middleName": string,
  "honorificPrefix": string,
  "honorificSuffix": string,
  "phoneticFullName": string,
  "phoneticFamilyName": string,
  "phoneticGivenName": string,
  "phoneticMiddleName": string,
  "phoneticHonorificPrefix": string,
  "phoneticHonorificSuffix": string
}
Fields
metadata	
object (FieldMetadata)

Metadata about the name.

displayName	
string

Output only. The display name formatted according to the locale specified by the viewer's account or the Accept-Language HTTP header.

displayNameLastFirst	
string

Output only. The display name with the last name first formatted according to the locale specified by the viewer's account or the Accept-Language HTTP header.

unstructuredName	
string

The free form name value.

familyName	
string

The family name.

givenName	
string

The given name.

middleName	
string

The middle name(s).

honorificPrefix	
string

The honorific prefixes, such as Mrs. or Dr.

honorificSuffix	
string

The honorific suffixes, such as Jr.

phoneticFullName	
string

The full name spelled as it sounds.

phoneticFamilyName	
string

The family name spelled as it sounds.

phoneticGivenName	
string

The given name spelled as it sounds.

phoneticMiddleName	
string

The middle name(s) spelled as they sound.

phoneticHonorificPrefix	
string

The honorific prefixes spelled as they sound.

phoneticHonorificSuffix	
string

The honorific suffixes spelled as they sound.

Nickname
A person's nickname.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "value": string,
  "type": enum (NicknameType)
}
Fields
metadata	
object (FieldMetadata)

Metadata about the nickname.

value	
string

The nickname.

type	
enum (NicknameType)

The type of the nickname.

NicknameType
The type of a nickname.

Enums
DEFAULT	Generic nickname.
MAIDEN_NAME	
Maiden name or birth family name. Used when the person's family name has changed as a result of marriage.

This item is deprecated!

INITIALS	
Initials.

This item is deprecated!

GPLUS	
Google+ profile nickname.

This item is deprecated!

OTHER_NAME	
A professional affiliation or other name; for example, Dr. Smith.

This item is deprecated!

ALTERNATE_NAME	Alternate name person is known by.
SHORT_NAME	
A shorter version of the person's name.

This item is deprecated!

Occupation
A person's occupation.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "value": string
}
Fields
metadata	
object (FieldMetadata)

Metadata about the occupation.

value	
string

The occupation; for example, carpenter.

Organization
A person's past or current organization. Overlapping date ranges are permitted.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "type": string,
  "formattedType": string,
  "startDate": {
    object (Date)
  },
  "endDate": {
    object (Date)
  },
  "current": boolean,
  "name": string,
  "phoneticName": string,
  "department": string,
  "title": string,
  "jobDescription": string,
  "symbol": string,
  "domain": string,
  "location": string,
  "costCenter": string,
  "fullTimeEquivalentMillipercent": integer
}
Fields
metadata	
object (FieldMetadata)

Metadata about the organization.

type	
string

The type of the organization. The type can be custom or one of these predefined values:

work
school
formattedType	
string

Output only. The type of the organization translated and formatted in the viewer's account locale or the Accept-Language HTTP header locale.

startDate	
object (Date)

The start date when the person joined the organization.

endDate	
object (Date)

The end date when the person left the organization.

current	
boolean

True if the organization is the person's current organization; false if the organization is a past organization.

name	
string

The name of the organization.

phoneticName	
string

The phonetic name of the organization.

department	
string

The person's department at the organization.

title	
string

The person's job title at the organization.

jobDescription	
string

The person's job description at the organization.

symbol	
string

The symbol associated with the organization; for example, a stock ticker symbol, abbreviation, or acronym.

domain	
string

The domain name associated with the organization; for example, google.com.

location	
string

The location of the organization office the person works at.

costCenter	
string

The person's cost center at the organization.

fullTimeEquivalentMillipercent	
integer

The person's full-time equivalent millipercent within the organization (100000 = 100%).

PhoneNumber
A person's phone number.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "value": string,
  "canonicalForm": string,
  "type": string,
  "formattedType": string
}
Fields
metadata	
object (FieldMetadata)

Metadata about the phone number.

value	
string

The phone number.

canonicalForm	
string

Output only. The canonicalized ITU-T E.164 form of the phone number.

type	
string

The type of the phone number. The type can be custom or one of these predefined values:

home
work
mobile
homeFax
workFax
otherFax
pager
workMobile
workPager
main
googleVoice
other
formattedType	
string

Output only. The type of the phone number translated and formatted in the viewer's account locale or the Accept-Language HTTP header locale.

Photo
A person's photo. A picture shown next to the person's name to help others recognize the person.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "url": string,
  "default": boolean
}
Fields
metadata	
object (FieldMetadata)

Metadata about the photo.

url	
string

The URL of the photo. You can change the desired size by appending a query parameter sz={size} at the end of the url, where {size} is the size in pixels. Example: https://lh3.googleusercontent.com/-T_wVWLlmg7w/AAAAAAAAAAI/AAAAAAAABa8/00gzXvDBYqw/s100/photo.jpg?sz=50

default	
boolean

True if the photo is a default photo; false if the photo is a user-provided photo.

Relation
A person's relation to another person.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "person": string,
  "type": string,
  "formattedType": string
}
Fields
metadata	
object (FieldMetadata)

Metadata about the relation.

person	
string

The name of the other person this relation refers to.

type	
string

The person's relation to the other person. The type can be custom or one of these predefined values:

spouse
child
mother
father
parent
brother
sister
friend
relative
domesticPartner
manager
assistant
referredBy
partner
formattedType	
string

Output only. The type of the relation translated and formatted in the viewer's account locale or the locale specified in the Accept-Language HTTP header.

RelationshipInterest
This item is deprecated!

DEPRECATED: No data will be returned A person's relationship interest .

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "value": string,
  "formattedValue": string
}
Fields
metadata	
object (FieldMetadata)

Metadata about the relationship interest.

value	
string

The kind of relationship the person is looking for. The value can be custom or one of these predefined values:

friend
date
relationship
networking
formattedValue	
string

Output only. The value of the relationship interest translated and formatted in the viewer's account locale or the locale specified in the Accept-Language HTTP header.

RelationshipStatus
This item is deprecated!

DEPRECATED: No data will be returned A person's relationship status.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "value": string,
  "formattedValue": string
}
Fields
metadata	
object (FieldMetadata)

Metadata about the relationship status.

value	
string

The relationship status. The value can be custom or one of these predefined values:

single
inARelationship
engaged
married
itsComplicated
openRelationship
widowed
inDomesticPartnership
inCivilUnion
formattedValue	
string

Output only. The value of the relationship status translated and formatted in the viewer's account locale or the Accept-Language HTTP header locale.

Residence
This item is deprecated!

DEPRECATED: Please use person.locations instead. A person's past or current residence.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "value": string,
  "current": boolean
}
Fields
metadata	
object (FieldMetadata)

Metadata about the residence.

value	
string

The address of the residence.

current	
boolean

True if the residence is the person's current residence; false if the residence is a past residence.

SipAddress
A person's SIP address. Session Initial Protocol addresses are used for VoIP communications to make voice or video calls over the internet.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "value": string,
  "type": string,
  "formattedType": string
}
Fields
metadata	
object (FieldMetadata)

Metadata about the SIP address.

value	
string

The SIP address in the RFC 3261 19.1 SIP URI format.

type	
string

The type of the SIP address. The type can be custom or or one of these predefined values:

home
work
mobile
other
formattedType	
string

Output only. The type of the SIP address translated and formatted in the viewer's account locale or the Accept-Language HTTP header locale.

Skill
A skill that the person has.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "value": string
}
Fields
metadata	
object (FieldMetadata)

Metadata about the skill.

value	
string

The skill; for example, underwater basket weaving.

Tagline
This item is deprecated!

DEPRECATED: No data will be returned A brief one-line description of the person.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "value": string
}
Fields
metadata	
object (FieldMetadata)

Metadata about the tagline.

value	
string

The tagline.

Url
A person's associated URLs.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "value": string,
  "type": string,
  "formattedType": string
}
Fields
metadata	
object (FieldMetadata)

Metadata about the URL.

value	
string

The URL.

type	
string

The type of the URL. The type can be custom or one of these predefined values:

home
work
blog
profile
homePage
ftp
reservations
appInstallPage: website for a Currents application.
other
formattedType	
string

Output only. The type of the URL translated and formatted in the viewer's account locale or the Accept-Language HTTP header locale.

UserDefined
Arbitrary user data that is populated by the end users.

JSON representation

{
  "metadata": {
    object (FieldMetadata)
  },
  "key": string,
  "value": string
}
Fields
metadata	
object (FieldMetadata)

Metadata about the user defined data.

key	
string

The end user specified key of the user defined data.

value	
string

The end user specified value of the user defined data.

Methods
batchCreateContacts
Create a batch of new contacts and return the PersonResponses for the newly

Mutate requests for the same user should be sent sequentially to avoid increased latency and failures.

batchDeleteContacts
Delete a batch of contacts.
batchUpdateContacts
Update a batch of contacts and return a map of resource names to PersonResponses for the updated contacts.
createContact
Create a new contact and return the person resource for that contact.
deleteContact
Delete a contact person.
deleteContactPhoto
Delete a contact's photo.
get
Provides information about a person by specifying a resource name.
getBatchGet
Provides information about a list of specific people by specifying a list of requested resource names.
listDirectoryPeople
Provides a list of domain profiles and domain contacts in the authenticated user's domain directory.
searchContacts
Provides a list of contacts in the authenticated user's grouped contacts that matches the search query.
searchDirectoryPeople
Provides a list of domain profiles and domain contacts in the authenticated user's domain directory that match the search query.
updateContact
Update contact data for an existing contact person.
updateContactPhoto
Update a contact's photo.`

export default googlePeopleApiString;
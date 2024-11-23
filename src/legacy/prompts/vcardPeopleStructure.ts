const vcardStructureString = `
Here is the fields that you should use for formatting contact data as per vCard format. I am providing this information in .tsv format (Tab Separated Values)

Name	Description	Example
		
ADR	A structured representation of the physical delivery address for the vCard object. for example	ADR;TYPE=home:;;123 Main St.;Springfield;IL;12345;USA
AGENT	Information about another person who will act on behalf of the vCard object. Typically this would be an area administrator, assistant, or secretary for the individual. Can be either a URL or an embedded vCard.	AGENT:http://mi6.gov.uk/007
ANNIVERSARY	Defines the person's anniversary.	ANNIVERSARY:19901021
BDAY	Date of birth of the individual associated with the vCard.	BDAY:19700310
BEGIN	All vCards must start with this property.	BEGIN:VCARD
CALADRURI	A URL to use for sending a scheduling request to the person's calendar.	CALADRURI:http://example.com/calendar/jdoe
CALURI	A URL to the person's calendar.	CALURI:http://example.com/calendar/jdoe
CATEGORIES	A list of "tags" that can be used to describe the object represented by this vCard.	CATEGORIES:swimmer,biker
CLASS	Describes the sensitivity of the information in the vCard.	CLASS:public
CLIENTPIDMAP	Used for synchronizing different revisions of the same vCard.	CLIENTPIDMAP:1;urn:uuid:3df403f4-5924-4bb7-b077-3c711d9eb34b
EMAIL	The address for electronic mail communication with the vCard object.	EMAIL:johndoe@hotmail.com
END	All vCards must end with this property.	END:VCARD
FBURL	Defines a URL that shows when the person is "free" or "busy" on their calendar.	FBURL:http://example.com/fb/jdoe
FN	The formatted name string associated with the vCard object.	FN:Dr. John Doe
GENDER	Defines the person's gender.	GENDER:F
GEO	Specifies a latitude and longitude.	2.1, 3.0: GEO:39.95;-75.1667 4.0: GEO:geo:39.95,-75.1667
IMPP	Defines an instant messenger handle.This property was introduced in a separate RFC when the latest vCard version was 3.0. Therefore, 3.0 vCards might use this property without otherwise declaring it.	IMPP:aim:johndoe@aol.com
KEY	The public encryption key associated with the vCard object. It may point to an external URL, may be plain text, or may be embedded in the vCard as a Base64 encoded block of text.	2.1: KEY;PGP:http://example.com/key.pgp 2.1: KEY;PGP;ENCODING=BASE64:[base64-data] 3.0: KEY;TYPE=PGP:http://example.com/key.pgp 3.0: KEY;TYPE=PGP;ENCODING=b:[base64-data] 4.0: KEY;MEDIATYPE=application/pgp-keys:http://example.com/key.pgp 4.0: KEY:data:application/pgp-keys;base64,[base64-data]
KIND	Defines the type of entity that this vCard represents: 'application', 'individual', 'group', 'location' or 'organization'; 'x-*' values may be used for experimental purposes.[2][3]	KIND:individual
LABEL	Represents the actual text that should be put on the mailing label when delivering a physical package to the person/object associated with the vCard (related to the ADR property).Not supported in version 4.0. Instead, this information is stored in the LABEL parameter of the ADR property. Example: ADR;TYPE=home;LABEL="123 Main St New York, NY 12345":;;123 Main St;New York;NY;12345;USA	LABEL;TYPE=HOME:123 Main St. Springfield, IL 12345 USA
LANG	Defines a language that the person speaks.	LANG:fr-CA
LOGO	An image or graphic of the logo of the organization that is associated with the individual to which the vCard belongs. It may point to an external URL or may be embedded in the vCard as a Base64 encoded block of text.	2.1: LOGO;PNG:http://example.com/logo.png 2.1: LOGO;PNG;ENCODING=BASE64:[base64-data] 3.0: LOGO;TYPE=PNG:http://example.com/logo.png 3.0: LOGO;TYPE=PNG;ENCODING=b:[base64-data] 4.0: LOGO;MEDIATYPE=image/png:http://example.com/logo.png 4.0: LOGO;ENCODING=BASE64;TYPE=PNG:[base64-data]
MAILER	Type of email program used.	MAILER:Thunderbird
MEMBER	Defines a member that is part of the group that this vCard represents. Acceptable values include:a "mailto:" URL containing an email address a UID which references the member's own vCard  The KIND property must be set to "group" in order to use this property.	MEMBER:urn:uuid:03a0e51f-d1aa-4385-8a53-e29025acd8af
N	A structured representation of the name of the person, place or thing associated with the vCard object. Structure recognizes, in order separated by semicolons: Family Name, Given Name, Additional/Middle Names, Honorific Prefixes, and Honorific Suffixes[4]	N:Doe;John;;Dr;
NAME	Provides a textual representation of the SOURCE property.	
NICKNAME	One or more descriptive/familiar names for the object represented by this vCard.	NICKNAME:Jon,Johnny
NOTE	Specifies supplemental information or a comment that is associated with the vCard.	NOTE:I am proficient in Tiger-Crane Style, and I am more than proficient in the exquisite art of the Samurai sword.
ORG	The name and optionally the unit(s) of the organization associated with the vCard object. This property is based on the X.520 Organization Name attribute and the X.520 Organization Unit attribute.	ORG:Google;GMail Team;Spam Detection Squad
PHOTO	An image or photograph of the individual associated with the vCard. It may point to an external URL or may be embedded in the vCard as a Base64 encoded block of text.	2.1: PHOTO;JPEG:http://example.com/photo.jpg 2.1: PHOTO;JPEG;ENCODING=BASE64:[base64-data] 3.0: PHOTO;TYPE=JPEG;VALUE=URI:http://example.com/photo.jpg 3.0: PHOTO;TYPE=JPEG;ENCODING=b:[base64-data] 4.0: PHOTO;MEDIATYPE=image/jpeg:http://example.com/photo.jpg 4.0: PHOTO;ENCODING=BASE64;TYPE=JPEG:[base64-data]
PRODID	The identifier for the product that created the vCard object.	PRODID:-//ONLINE DIRECTORY//NONSGML Version 1//EN
PROFILE	States that the vCard is a vCard.	PROFILE:VCARD
RELATED	Another entity that the person is related to. Acceptable values include:a "mailto:" URL containing an email address a UID which references the person's own vCard	RELATED;TYPE=friend:urn:uuid:03a0e51f-d1aa-4385-8a53-e29025acd8af
REV	A timestamp for the last time the vCard was updated.	REV:20121201T134211Z
ROLE	The role, occupation, or business category of the vCard object within an organization.	ROLE:Executive
SORT-STRING	Defines a string that should be used when an application sorts this vCard in some way.Not supported in version 4.0. Instead, this information is stored in the SORT-AS parameter of the N and/or ORG properties.	SORT-STRING:Doe
SOUND	By default, if this property is not grouped with other properties it specifies the pronunciation of the FN property of the vCard object. It may point to an external URL or may be embedded in the vCard as a Base64 encoded block of text.	2.1: SOUND;OGG:http://example.com/sound.ogg 2.1: SOUND;OGG;ENCODING=BASE64:[base64-data] 3.0: SOUND;TYPE=OGG:http://example.com/sound.ogg 3.0: SOUND;TYPE=OGG;ENCODING=b:[base64-data] 4.0: SOUND;MEDIATYPE=audio/ogg:http://example.com/sound.ogg 4.0: SOUND:data:audio/ogg;base64,[base64-data]
SOURCE	A URL that can be used to get the latest version of this vCard.	SOURCE:http://johndoe.com/vcard.vcf
TEL	The canonical number string for a telephone number for telephony communication with the vCard object.	TEL;TYPE=cell:(123) 555-5832
TITLE	Specifies the job title, functional position or function of the individual associated with the vCard object within an organization.	TITLE:V.P. Research and Development
TZ	The time zone of the vCard object.	2.1, 3.0: TZ:-0500 4.0: TZ:America/New_York
UID	Specifies a value that represents a persistent, globally unique identifier associated with the object.	UID:urn:uuid:da418720-3754-4631-a169-db89a02b831b
URL	A URL pointing to a website that represents the person in some way.	URL:http://www.johndoe.com
VERSION	The version of the vCard specification. In version 4.0, this must come right after the BEGIN property.	VERSION:3.0
XML	Any XML data that is attached to the vCard. This is used if the vCard was encoded in XML (xCard standard) and the XML document contained elements which are not part of the xCard standard.	XML:<b>Not an xCard XML element</b>
`

export const sampleContactString = `
BEGIN:VCARD
VERSION:4.0
N:Gump;Forrest;;Mr.;
FN:Sheri Nom
ORG:Sheri Nom Co.
TITLE:Ultimate Warrior
PHOTO;MEDIATYPE#image/gif:http://www.sherinnom.com/dir_photos/my_photo.gif
TEL;TYPE#work,voice;VALUE#uri:tel:+1-111-555-1212
TEL;TYPE#home,voice;VALUE#uri:tel:+1-404-555-1212
ADR;TYPE#WORK;PREF#1;LABEL#"Normality Baytown , LA 50514 United States of America":;;100 Waters Edge;Baytown;LA;50514;United States of America
ADR;TYPE#HOME;LABEL#"42 Plantation St. Baytown , LA 30314 United States of America":;;42 Plantation St.;Baytown;LA;30314;United States of America
EMAIL:sherinnom@example.com
REV:20080424T195243Z
x-qq:21588891
END:VCARD`

export const sampleContact2String = `
BEGIN:VCARD
VERSION:4.0
N:Jobs;Steve;;Mr.;
FN:Founder
ORG:Apple Computer.
TITLE:CEO
PHOTO;MEDIATYPE#image/gif:http://www.sherinnom.com/dir_photos/my_photo.gif
TEL;TYPE#work,voice;VALUE#uri:tel:+1-111-555-1212
TEL;TYPE#home,voice;VALUE#uri:tel:+1-404-555-1212
ADR;TYPE#WORK;PREF#1;LABEL#"Normality Baytown , LA 50514 United States of America":;;100 Cupertino;Baytown;LA;50514;United States of America
ADR;TYPE#HOME;LABEL#"42 Plantation St. Baytown , LA 30314 United States of America":;;42 Plantation St.;Baytown;LA;30314;United States of America
EMAIL:steve@apple.com
REV:20080424T195243Z
x-qq:21588891
END:VCARD`

export const baseInstructions = `
I want you to convert this text string of contacts' details into the EXACT vCard file form. I want you to particularly capture these 9 things for each INDIVIDUAL contact SEPARATELY - 
1. contact information (such as email address and phone number), 
2. occupation and organization (where this contact works/studies and in what role), 
3. what is the location of this person 
4. name and data of the event, it's location and other context in which we met. 
5. What we discussed and talked about and what this person is now working on 
6. Any labels/tags that I specify regarding interests, skills or traits of this person that I want to save as vCard "CATEGORIES" 
7. Important dates such as when I met them and when their birthday is 
8. Storing 1 important URI/URL for each user properly as vCard "URL". It can be a LinkedIn URL, or university/company website profile or personal website (custom domain)
9. ALL other extra data MUST just be captured as text and stored under the "Note" field as per the vCard format. I repeat "No data must be lost"- all the extra information should be stored as a "Note", including all the important links/URLs for that person should be stored in "Note". Return ONLY the transformed .vcf details as a string (containing 1 or more contacts as vCards) and nothing else.`


export default vcardStructureString;

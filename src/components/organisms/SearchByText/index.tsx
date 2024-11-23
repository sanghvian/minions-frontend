// import React from 'react'

// const SearchByText = () => {
//     return (
//         <>
//             <div
//                 style={{ display: 'flex', flexDirection: 'column' }}
//             >
//                 <Input
//                     ref={inputRef}
//                     placeholder="Search for new contact"
//                     value={query}
//                     defaultValue={activeQueryString}
//                     onChange={(e) => setQuery(e.target.value)}
//                     suffix={
//                         <SearchOutlined
//                             onClick={() => handleSearch()}
//                             style={{ cursor: 'pointer' }}
//                         />
//                     }
//                 />
//                 <br />
//                 <Button
//                     style={{ alignSelf: 'flex-end' }}
//                     loading={isLoading}
//                     icon={<ForwardOutlined />} key="search" type="default" onClick={() => handleSearchTypeSwitch()}
//                 >
//                     Switch to {searchType === SearchType.EXTERNAL ? 'My Network' : 'Online'} Search
//                 </Button>
//             </div>
//             &nbsp;&nbsp;
//             {isLoading ? <Spin /> :
//                 <div style={{ marginBottom: '10rem' }}> {results?.length === 0 &&
//                     <p>Search keywords of the person you want to look up</p>}
//                     {results?.length > 0
//                         ?
//                         isLoading
//                             ? <Spin />
//                             : searchType === SearchType.EXTERNAL
//                                 ? <OnlineSearchItemsList
//                                     results={results as ContactOnlineSearchResult[]}
//                                 />
//                                 : <InternalSearchItemsList
//                                     results={results as Contact[]}
//                                 />
//                         : <p> </p>
//                     }
//                 </div>}
//         </>
//     )
// }

// export default SearchByText
export { }
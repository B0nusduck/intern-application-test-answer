import SearchBar from './search-bar'
import StatusToggle from './status-toggle'

export default function MobileOptions({ menuIsOpen }){
  return(
    <>
      {menuIsOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 shadow-xl transition-all">
          <SearchBar></SearchBar>
          <div className="flex grow relative mx-8 pt-5 pb-6 space-y-1 space-x-8">
            <StatusToggle></StatusToggle>
          </div>
        </div>
      )}
    </>
  )
}
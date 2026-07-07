import SearchBar from './search-bar'
import StatusToggle from './status-toggle'

export default function DesktopLayout(){
  return (
    <div className="hidden md:flex grow">
      <SearchBar></SearchBar>
      <div className="flex max-w-xs space-x-8 items-center">
        <StatusToggle></StatusToggle>
      </div>
    </div>
  )
}
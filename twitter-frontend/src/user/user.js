import './user.css'
import UserProfile from './userProfile'
import Tweet from '../tweet/tweet'
import { useParams } from 'react-router-dom'

function User() {
  const userId = useParams().user_id
  return (
    <div>
      <UserProfile userId={userId} />
      <div className="tweetContainer">
        <Tweet userId={userId} from={'user'} />
      </div>
    </div>
  )
}
export default User

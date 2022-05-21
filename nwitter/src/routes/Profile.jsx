import { authService, /*dbService*/ } from 'fbase';
import { useNavigate } from 'react-router-dom';
import { useState, /*useEffect*/ } from 'react';

const Profile = ({ userObj, refreshUser }) => {
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onLogOutClick = () => {
    authService.signOut();
    navigate('/');
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if(userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({ displayName: newDisplayName });
      refreshUser();
    }
  };

  /* 트윗 필터링 관련 소스
  const getMyNweets = async () => {
    const nweets = await dbService
      .collection('nweet')
      .where('creatorId', '==', userObj.uid)
      .orderBy('createdAt', 'asc')
      .get();

    console.log(nweets.docs.map(doc => doc.data()));
  };

  useEffect(() => {
    getMyNweets();
  }, []);
  */

  return (
    <>
      <form onSubmit={onSubmit}>
        <input onChange={onChange} value={newDisplayName} type='text' placeholder='Display name' />
        <input type='submit' value='Update Profile' />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>);
};

export default Profile;

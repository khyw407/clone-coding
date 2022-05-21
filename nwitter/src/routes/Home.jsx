import { useState, useEffect } from 'react';
import { dbService, storageServie }  from 'fbase';
import Nweet from 'components/Nweet';
import { v4 as uuidv4 } from 'uuid';

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState('');
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState('');

  useEffect(() => {
    //getNweets();
    dbService.collection('nweet').onSnapshot((snapshot) => {
      const newArray = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));
      setNweets(newArray);
    });
  }, []);

  /*
  const getNweets = async () => {
    const dbNweets = await dbService.collection('nweet').get();
    dbNweets.forEach((document) => {
      const nweetObject = { ...document.data(), id: document.id };
      setNweets((prev) => [nweetObject, ...prev]);
    });
  }
  */

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = '';
    
    if(attachment !== '') {
      const attachmentRef = storageServie.ref().child(`${userObj.uid}/${uuidv4()}`);

      //이 부분이 정상동작하기 위해서는 firebase storage rule 설정 변경이 필요함
      /**
       * rules_version = '2';
       * service firebase.storage {
       *   match /b/{bucket}/o {
       *     match /{allPaths=**} {
       *       allow read, write: if request.auth != null;
       *     }
       *   }
       * }
       */
      const response = await attachmentRef.putString(attachment, 'data_url');
      attachmentUrl = await response.ref.getDownloadURL();
    }

    await dbService.collection('nweet').add({
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    });
    setNweet('');
    setAttachment('');
  };

  const onChange = (event) => {
    event.preventDefault();
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  
  const onClearAttachment = () => setAttachment('');

  return (
    <>
      <form onSubmit={onSubmit}>
        <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
        <input type='file' accept='image/*' onChange={onFileChange} />
        <input type="submit" value={"Nweet"} />
        {attachment && (
          <div>
            <img alt='not exist' src={attachment} width='50px' height='50px' />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid}/>
        ))}
      </div>
    </>
  );
};

export default Home;

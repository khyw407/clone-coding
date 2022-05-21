import { useState } from 'react';
import { dbService, storageServie } from "fbase";

const Nweet = ({ nweetObj, isOwner }) =>{
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm('삭제하시겠습니까?');
    
    if(ok) {
      await dbService.doc(`nweet/${nweetObj.id}`).delete();
      
      if(nweetObj.attachmentUrl !== '') {
        await storageServie.refFromURL(nweetObj.attachmentUrl).delete();
      }
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`nweet/${nweetObj.id}`).update({ text: newNweet });
    setEditing(false);
  }

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input onChange={onChange} value={newNweet} required />
            <input type='submit' value='Update Nweet' />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && (
            <img alt='not exist' src={nweetObj.attachmentUrl} width='50px' height='50px' />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Nweet</button>
              <button onClick={toggleEditing}>Edit Nweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;

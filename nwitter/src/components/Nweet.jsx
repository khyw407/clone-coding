import { useState } from 'react';
import { dbService } from "fbase";

const Nweet = ({ nweetObj, isOwner }) =>{
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm('삭제하시겠습니까?');
    
    if(ok) {
      console.log(nweetObj.id);
      const data = await dbService.doc(`nweet/${nweetObj.id}`).delete();
      console.log(data);
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

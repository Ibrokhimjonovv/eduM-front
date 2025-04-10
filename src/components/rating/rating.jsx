import React, { useEffect, useState } from 'react';
import crown from "../../assets/crown.png";
import "./rating.scss";
import BalanceTopUp from '../top-up-balance/top-up-balance';
import { api } from '../../App';

const Rating = ({ userId, allUsers, balance }) => {
  const [userRank, setUserRank] = useState(null);
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    fetch(`${api}/user_rank/${userId.id}/`)
      .then(response => response.json()) 
      .then(data => {
        setUserRank(data); 
        setResults(data.results || []); 
      })
      .catch(error => {
        console.log("");  
        // console.error('Error fetching user rank:', error);  
      });
  }, [userId.id]); 

  console.log(userId.id, "asd")

  const formattedNumber = new Intl.NumberFormat('de-DE').format(balance ? balance : 0);

  return (
    <div id='rating'>
      <div className="ichi">
        {userRank && (
          <>
            <p>{allUsers.user_count} ta foydalanuvchilar ichida</p>
            <p>
              <img src={crown} alt="crown" />
              <span>{userRank.rank}</span>
            </p>
            <p>{userRank.position} O'rindasiz</p>
          </>
        )}
      </div>
      <div className="line"></div>
      <div className="ni">
        <p id='f-p'>Mening balansim</p>
        <div className="results-cont">
          <p>{formattedNumber} so'm</p>
          {/* <button>Balansni oshirish +</button> */}
          <BalanceTopUp user={userId}/>
        </div>
      </div>
    </div>
  );
};

export default Rating;

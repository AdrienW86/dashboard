import React, { useEffect, useState } from 'react';
import Nav from '@/components/Nav/Nav'
import styles from '@/styles/home.module.css';

export default function Home() {
  const [user, setUser] = useState(null)
  const [profil, setProfil] = useState(false);
 
  const [newPassword, setNewPassword] = useState('');

  const [toggle, setToggle] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantityToUpdate, setQuantityToUpdate] = useState(0);
  const [newQuantity, setNewQuantity] = useState('');

  const [monthStats, setMonthStats] = useState(null)
  const [yearStats, setYearStats] = useState(null)

  const date = new Date();
  const currentMonthIndex = date.getMonth();
  const currentYear = date.getFullYear();
  const month = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet",
    "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  const currentMonth = month[currentMonthIndex];


  const updateStockValue = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/update-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quantity: parseInt(newQuantity),
          name: selectedItem.name,
        }),
      });
  
      if (response.ok) {
      
        const updatedStock = await response.json();
        console.log(updatedStock);
  
        const updatedMonth = monthStats.map((el) => {
          if (el.name === selectedItem.name) {
            return { ...el, quantity: parseInt(newQuantity) };
          }
          return el;
        });

        const updatedYear = yearStats.map((el) => {
          if (el.name === selectedItem.name) {
            return { ...el, quantity: parseInt(newQuantity) };
          }
          return el;
        });
  
        setMonthStats(updatedMonth);
        setYearStats(updatedYear)
        setToggle(false);
      } else {
        console.error('Error updating stock:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating stock:', error.message);
    }
  };

  const updateProfil = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!newPassword.trim()) {
          alert('Le champ du mot de passe ne doit pas être vide');
          return;
      }
        const response = await fetch('/api/update-profil', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ newPassword }), 
        });

        if (response.ok) {
            const updatedProfile = await response.json();
            console.log(updatedProfile);

            setProfil(false);
        } else {
            console.error('Error updating profile:', response.statusText);
        }
    } catch (error) {
        console.error('Error updating profile:', error.message);
    }
};


  useEffect(() => {
    const fetchData = async () => {
      try {
       const token =  localStorage.getItem('token')
  
        if (token) {
          const response = await fetch('/api/profil', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            setUser(data)       
          } else {
            console.error('Error fetching user data:', response.statusText);
          }
        } else {
          console.error('Token missing');
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchData();
  }, []); 

  useEffect(() => {
    const fetchStats = async () => {
      try {
       const token =  localStorage.getItem('token')  
        if (token) {
          const response = await fetch('/api/stats', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.ok) {
            const userData = await response.json();
           setMonthStats(userData[0].months)
           setYearStats(userData[0].years)
          
          } else {
            console.error('Error fetching user data:', response.statusText);
          }
        } else {
          console.error('Token missing');
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchStats();
  }, []); 

  const openModal = (item) => {
    setSelectedItem(item);
    console.log(item)
    setQuantityToUpdate(item.quantity);
    setNewQuantity('');
    setToggle(!toggle);
    console.log(quantityToUpdate)
  };

  return (
    <>
    <Nav />   
    {user 
    ?
   <section className={styles.main}>
    <div className={styles.profil} onClick={()=> setProfil(!profil)}> {user.name} </div>
     <h1 className={styles.title}> Statistiques </h1>
    <section className={styles.dashboard}>      
      {monthStats && (        
          <div className={styles.stats}>
            <h2 className={styles.h2}> Mois de {currentMonth} </h2>
            {monthStats.map((el, index) => (
                 <p 
                 key={index} 
                 className={styles.p}
                 onClick={() => openModal(el)}
               >
                 {el.name}: <span  className={`${
                   styles.sales
                 } ${
                   el.name === "Chiffre d'affaires" || el.name === "Bénéfices" ? styles.green : 
                   el.name === "Pub" ? styles.pub : styles.red
                 }`}  > {el.quantity} € </span>{' '}
               </p>
              ))}
          </div>              
      )}
       {yearStats && (      
          <div className={styles.stats}>
            <h2 className={styles.h2}> Année {currentYear} </h2>
            {yearStats.map((el, index) => (
                 <p 
                 key={index} 
                 className={styles.p}
                 onClick={() => openModal(el)}
               >
                 {el.name}: <span  className={`${
                   styles.sales
                 } ${
                   el.name === "Chiffre d'affaire annuel" || el.name === "Bénéfice annuel" ? styles.green : 
                   el.name === "Pub annuelle" ? styles.pub : styles.red
                 }`}  > {el.quantity} € </span>{' '}
               </p>
              ))}
          </div>              
      )}
    </section>

    {toggle && (
        <div className={styles.stat}> 
          <button className={styles.close} onClick={()=> setToggle(!toggle)}> X </button>
          <p> Produit séléctionné : <span className={styles.green}> {selectedItem.name} </span>  </p>
          <p> Quantité actuelle : <span className={styles.red}> {quantityToUpdate} </span> </p> 
          <input 
            className={styles.input} 
            placeholder='Nouvelle valeur'
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
          />
          <button className={styles.validate} onClick={updateStockValue}>Valider</button>
        </div>
      )} 
     {profil && user && (
  <div className={styles.modal}> 
    <button className={styles.close} onClick={()=> setProfil(!profil)}> X </button>
    <p className={styles.name}> Nom : <span className={styles.spanName}> {user.name} </span>  </p>
    <p className={styles.statut}> Statut : <span className={styles.spanStatus}> {user.statut} </span>  </p>
    <p className={styles.email}> Email : {user.email} </p> 
    <p className={styles.password}> Mot de passe : </p> 
    <input 
      className={styles.input} 
      placeholder='Nouveau mot de passe'
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
    />
    <button className={styles.validate} onClick={updateProfil}>Valider</button>
  </div>
)}
   </section>
   :null
  }    
    </>
  );
}
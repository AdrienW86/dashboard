import React, { useEffect, useState } from 'react';
import Nav from '@/components/Nav/Nav'
import styles from '@/styles/stock.module.css';

export default function Stock() {
  const [toggle, setToggle] = useState(false);
  const [balms, setBalms] = useState(null);
  const [sockets, setSockets] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantityToUpdate, setQuantityToUpdate] = useState(0);
  const [newQuantity, setNewQuantity] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');

        if (token) {
          const response = await fetch('/api/stock', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setSockets(userData[0].sockets);
            setBalms(userData[0].balms);
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
    setQuantityToUpdate(item.quantity);
    setNewQuantity('');
    setToggle(!toggle);
    console.log(quantityToUpdate)
  };

  const updateStockValue = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/update-stock', {
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
        // Mettre à jour l'état local après la mise à jour réussie
        const updatedStock = await response.json();
        console.log(updatedStock);
  
        // Mettre à jour les données de stock dans l'état local
        const updatedSockets = sockets.map((el) => {
          if (el.name === selectedItem.name) {
            return { ...el, quantity: parseInt(newQuantity) };
          }
          return el;
        });

        const updatedBalms = balms.map((el) => {
          if (el.name === selectedItem.name) {
            return { ...el, quantity: parseInt(newQuantity) };
          }
          return el;
        });
  
        setSockets(updatedSockets);
        setBalms(updatedBalms)
        setToggle(false);
      } else {
        console.error('Error updating stock:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating stock:', error.message);
    }
  };
  

  return (
    <>
     <Nav />   
      <h1 className={styles.title}> Stock </h1>
      <section className={styles.dashboard}>
        <section>
          {balms && (
            <div className={styles.stats}>
              <h2 className={styles.h2}> Les baumes </h2>
              {balms.map((el, index) => (
                <p key={index} className={styles.p} onClick={() => openModal(el)}>
                  {el.name}: <span className={styles.sales}> {el.quantity}</span>{' '}
                </p>
              ))}
            </div>
          )}
          {sockets && (
            <div className={styles.stats}>
              <h2 className={styles.h2}> Les chaussettes </h2>
              {sockets.map((el, index) => (
                <p key={index} className={styles.p} onClick={() => openModal(el)}>
                  {el.name}: <span className={styles.sales}> {el.quantity}</span>{' '}
                </p>
              ))}
            </div>
          )}
          <div className={styles.stats}>
            <h2 className={styles.h2}> Les maillots </h2>
          </div>
        </section>
      </section>
      {toggle && (
        <div className={styles.modal}> 
          <button className={styles.close} onClick={()=> setToggle(!toggle)}> X </button>
          <p> Produit séléctionné : <span className={styles.spanProduct}> {selectedItem.name} </span> </p>
          <p> Quantité actuelle : <span className={styles.spanQuantity}> {quantityToUpdate} </span>  </p> 
          <input 
            className={styles.input} 
            placeholder='nouvelle valeur'
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
          />
          <button className={styles.validate} onClick={updateStockValue}>Enregistrer</button>
        </div>
      )}
    </>
  );
}


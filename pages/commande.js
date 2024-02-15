import React, { useState, useEffect } from 'react';
import Nav from '@/components/Nav/Nav';
import styles from '@/styles/commande.module.css';

function Commande() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [remainingOrders, setRemainingOrders] = useState(0);
  const [totalPrices, setTotalPrices] = useState(0);

  useEffect(() => {
    fetchSessions();
  }, []);

  async function fetchSessions() {
    setLoading(true);
    try {
      const response = await fetch('/api/session');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des sessions de paiement');
      }
      const data = await response.json();
      setSessions(data.sessionsDetails);
      setStatuses(data.sessionsDetails.map(() => false));
      setLoading(false);
      setRemainingOrders(data.sessionsDetails.length);
      calculateTotalPrices(data.sessionsDetails);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  async function deleteAllOrdersHandler() {
    const confirm = window.confirm("Êtes-vous sûr de vouloir clôturer la journée ?");
    if (confirm) {
      try {
        const response = await fetch('/api/delete-order', { method: 'DELETE' });
        const data = await response.json();
        console.log(data.message);
        setSessions([]);
        setRemainingOrders(0);
        setTotalPrices(0);
      } catch (error) {
        console.error('Erreur lors de la suppression des commandes :', error);
      }
    }
  }
  
  const updateOrderStatus = async (index) => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = !statuses[index];
      const response = await fetch('/api/update-order-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(index),
      });
      const data = await response.json();
      console.log(data);
      setStatuses(prevStatuses => {
        const newStatuses = [...prevStatuses];
        newStatuses[index] = newStatus;
        return newStatuses;
      });
      setRemainingOrders(prevRemainingOrders => newStatus ? prevRemainingOrders - 1 : prevRemainingOrders + 1);
      updateTotalPrices(index, newStatus);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de la commande :', error);
    }
  };
  
  const toggleStatus = (index) => {
    updateOrderStatus(index);
    const newStatuses = [...statuses];
    newStatuses[index] = !newStatuses[index];
    setStatuses(newStatuses);
  };

  const updateTotalPrices = (index, newStatus) => {
    setTotalPrices(prevTotalPrices => {
      const session = sessions[index];
      if (newStatus) {
        return prevTotalPrices + parseFloat(session.totalPrice);
      } else {
        return prevTotalPrices - parseFloat(session.totalPrice);
      }
    });
  };

  const calculateTotalPrices = (sessionsDetails) => {
    const totalPrice = sessionsDetails.reduce((acc, session, index) => {
      if (statuses[index]) {
        if (session.totalPrice) {
          return acc + parseFloat(session.totalPrice);
        } else {
          return acc;
        }
      } else {
        return acc;
      }
    }, 0);
    setTotalPrices(totalPrice);
  };

  if (loading) {
    return <div className={styles.loading}>Chargement en cours...</div>;
  }

  return (
    <>
      <Nav /> 
      <h1 className={styles.title}>Liste des commandes à expédier</h1>
      {sessions.length !== 0 ? (
        <button onClick={deleteAllOrdersHandler} className={styles.cloture}>Clôturer</button>
      ) : (
        <button onClick={fetchSessions} className={styles.cloture}>Ouvrir</button>
      )}
      {sessions.length !== 0 && (
        <section>
          <div className={styles.infos}>
            <h2>Nombre de commandes: <span className={styles.commandeLength}>{remainingOrders}</span></h2>
            <h2>Total des prix: <span className={styles.profit}>{totalPrices.toFixed(2)} €</span></h2>
          </div>
          <div className={styles.category}>
            <h2 className={styles.titleName}>Nom</h2>
            <h2 className={styles.titleAddress}>Adresse</h2>
            <h2 className={styles.titleProduct}>Produits</h2>
            <h2 className={styles.titlePrice}>€</h2>
            <h2 className={styles.titleStatus}>Statut</h2>       
          </div>
          <ul className={styles.ul}>
            {sessions.map((session, index) => (
              <li 
                key={index}
                className={`${styles.row} ${statuses[index] ? styles.readyToSend : styles.notPrepared}`}
                onClick={() => toggleStatus(index)}
              >
                <div className={styles.name}> 
                  <p className={styles.txt}>{session.customerDetails && session.customerDetails.name ? session.customerDetails.name : 'Nom non disponible'}</p> 
                </div>
                <div className={styles.address}> 
                  <div>
                    {session.customerDetails && session.customerDetails.address ? session.customerDetails.address.line1 : 'Adresse non disponible'}
                  </div>
                  <div>                                
                    {session.customerDetails && session.customerDetails.address ? session.customerDetails.address.postal_code : ''}  
                    <span className={styles.city}>{session.customerDetails && session.customerDetails.address ? session.customerDetails.address.city : ''}</span>
                    {session.customerDetails && session.customerDetails.address ? session.customerDetails.address.country : ''}
                  </div>            
                </div>
                <div className={styles.products}>
                  {session.lineItems && session.lineItems.map((item, index) => (
                    <p key={index}>{item}</p>
                  ))}
                </div> 
                <div className={styles.price}>
                  {session.totalPrice && 
                    <p>{session.totalPrice}</p>
                  }
                </div> 
                <div className={styles.status}>
                  {statuses[index] ? (
                    <p className={styles.check}>Prêt à l'envoiement</p>
                  ) : (
                    <p className={styles.noCheck}>Non préparé</p>
                  )}
                </div>          
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

export default Commande;


import React, { createContext, useContext, useEffect, useState } from 'react';

const ClientsContext = createContext();

export const ClientsProvider = ({ children }) => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const trainerId = localStorage.getItem('userId'); // Assuming userId is stored here
        if (trainerId) {
          const response = await fetch(`/api/trainer/clients/${trainerId}`);
          if (response.ok) {
            const data = await response.json();
            setClients(data);
          } else {
            console.error('Failed to fetch clients:', response.statusText);
          }
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchClients();
  }, []);

  return (
    <ClientsContext.Provider value={clients}>
      {children}
    </ClientsContext.Provider>
  );
};

export const useClients = () => useContext(ClientsContext);

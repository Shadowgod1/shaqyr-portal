import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const EventContext = createContext({});

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchEvents();
    } else {
      setEvents([]);
    }
  }, [user]);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (data) setEvents(data);
    setLoading(false);
  };

  const createEvent = async (eventData) => {
    setLoading(true);
    const code = Math.random().toString(36).substr(2, 6).toUpperCase();
    
    const { data, error } = await supabase
      .from('events')
      .insert([
        { 
          ...eventData, 
          code,
          user_id: user.id 
        }
      ])
      .select();

    if (data) {
      setEvents([data[0], ...events]);
    }
    setLoading(false);
    return { data, error };
  };

  const getEventByCode = async (code) => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('code', code)
      .single();
    
    return data;
  };

  return (
    <EventContext.Provider value={{ events, createEvent, getEventByCode, loading }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);

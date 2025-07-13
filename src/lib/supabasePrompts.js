import { supabase } from './supabaseClient';

export const savePrompt = async (userId, title, content) => {
  const { data, error } = await supabase
    .from('prompts')
    .insert([{ user_id: userId, title, content }]);
  if (error) {
    console.error(error);
    throw error;
  }
  return data;
};

export const getUserPrompts = async (userId) => {
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('user_id', userId);
  if (error) {
    console.error(error);
    throw error;
  }
  return data;
}; 
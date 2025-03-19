
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kjvgzmjookgwwydalzde.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqdmd6bWpvb2tnd3d5ZGFsemRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNTI2NjAsImV4cCI6MjA1NjgyODY2MH0.psvDpVE_aCeegzWnIqJiM5adiLKCVD2aTCzhPJ2tNXE';

export const supabase = createClient(supabaseUrl, supabaseKey);

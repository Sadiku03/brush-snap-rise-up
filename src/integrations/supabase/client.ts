// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zwqjqxcvkjumfhmtwwpv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3cWpxeGN2a2p1bWZobXR3d3B2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3ODMxMTgsImV4cCI6MjA2MDM1OTExOH0.AiNF3SwV5X9gHTMp0n1K76l85F3SXELrpQayb1SQiKY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
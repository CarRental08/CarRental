"use client";

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://oyyzbtzfradishekgbms.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95eXpidHpmcmFkaXNoZWtnYm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NDM1ODksImV4cCI6MjA5MTIxOTU4OX0.tr2ub-PG3aqOvkp0vZBUNybykEFcaklSpyzae9tsiVI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
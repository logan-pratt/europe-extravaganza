(function () {
  const SUPABASE_URL = 'https://dyquwyawnueostbegbyg.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5cXV3eWF3bnVlb3N0YmVnYnlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMjk3MTYsImV4cCI6MjA5NDkwNTcxNn0.4Z90rQcEodDZQyR2zJvszOG6kkrepDqMuDDET4TQW_s';
  window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
})();

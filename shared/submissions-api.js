(function () {
  function getClientId() {
    let id = sessionStorage.getItem('trip.clientId');
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem('trip.clientId', id);
    }
    return id;
  }

  async function submitPacket(tripSlug, authorName, packet) {
    try {
      const { error } = await window.supabaseClient
        .from('trip_submissions')
        .insert({
          trip_slug: tripSlug,
          author_name: authorName,
          author_key: authorName.toLowerCase(),
          packet: packet,
          client_id: getClientId()
        });
      if (error) return { ok: false, error };
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err };
    }
  }

  async function upsertReaction(tripSlug, cardId, cardType, authorName, reaction, note) {
    if (!window.supabaseClient) return { ok: false, error: 'no supabase client' };
    try {
      const { error } = await window.supabaseClient
        .from('card_reactions')
        .upsert(
          {
            trip_slug: tripSlug,
            card_id: cardId,
            card_type: cardType,
            author_name: authorName,
            author_key: authorName.toLowerCase(),
            reaction: reaction,
            note: note,
            client_id: getClientId(),
            updated_at: new Date().toISOString()
          },
          { onConflict: 'trip_slug,card_id,author_key' }
        );
      if (error) return { ok: false, error };
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err };
    }
  }

  async function fetchReactions(tripSlug) {
    if (!window.supabaseClient) return { ok: false, error: 'no supabase client', data: [] };
    try {
      const { data, error } = await window.supabaseClient
        .from('card_reactions')
        .select('card_id, card_type, author_name, reaction, note')
        .eq('trip_slug', tripSlug);
      if (error) return { ok: false, error, data: [] };
      return { ok: true, data: data || [] };
    } catch (err) {
      return { ok: false, error: err, data: [] };
    }
  }

  function subscribeReactions(tripSlug, callback) {
    if (!window.supabaseClient) return null;
    return window.supabaseClient
      .channel(`card-reactions:${tripSlug}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'card_reactions', filter: `trip_slug=eq.${tripSlug}` },
        callback
      )
      .subscribe();
  }

  window.submitPacket = submitPacket;
  window.upsertReaction = upsertReaction;
  window.fetchReactions = fetchReactions;
  window.subscribeReactions = subscribeReactions;
})();

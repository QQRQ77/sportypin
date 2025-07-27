CREATE OR REPLACE FUNCTION venues_search_ranked(search_terms text[])
RETURNS TABLE (
  id uuid,
  name text,
  address text,
  city text,
  description text,
  sports text[],
  creator uuid,
  lat numeric,
  lng numeric,
  creator_name text,
  followers text[],
  hits bigint
) LANGUAGE sql STABLE AS $$
  SELECT v.*,
         (
           SELECT count(*)
           FROM unnest(search_terms) w
           WHERE to_tsvector('simple',
                   coalesce(v.name,'')        || ' ' ||
                   coalesce(v.city,'')        || ' ' ||
                   coalesce(v.address,'')     || ' ' ||
                   coalesce(v.description,'') || ' ' ||
                   coalesce(array_to_string(v.sports,' '),'')
                 ) @@ plainto_tsquery('simple', w)
         ) AS hits
  FROM venues v
  WHERE EXISTS (
      SELECT 1
      FROM unnest(search_terms) w
      WHERE to_tsvector('simple',
              coalesce(v.name,'')        || ' ' ||
              coalesce(v.city,'')        || ' ' ||
              coalesce(v.address,'')     || ' ' ||
              coalesce(v.description,'') || ' ' ||
              coalesce(array_to_string(v.sports,' '),'')
            ) @@ plainto_tsquery('simple', w)
  )
  ORDER BY hits DESC;
$$;
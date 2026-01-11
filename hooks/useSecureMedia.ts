import { useState, useEffect } from 'react';
import axios from 'axios';

export const useSecureMedia = (url: string) => {
  const [secureUrl, setSecureUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) return;

    let objectUrl = '';
    const fetchMedia = async () => {
      try {
        const response = await axios.get(url, { responseType: 'blob' });
        objectUrl = URL.createObjectURL(response.data);
        setSecureUrl(objectUrl);
      } catch (error) {
        console.error('Security Protocol Error: Failed to obfuscate media source.', error);
        // Fallback to original URL if blob fetch fails, though in production 
        // you might want to show a placeholder instead.
        setSecureUrl(url);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url]);

  return { secureUrl, loading };
};
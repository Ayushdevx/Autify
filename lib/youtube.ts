import youtubeSearch from 'youtube-api-v3-search';

const YOUTUBE_API_KEY = 'AIzaSyCKZvQBqIJPzQbT9jo4w2Huzp5V7z715QU';

export async function searchYouTube(query: string) {
  try {
    const params = new URLSearchParams({
      part: 'snippet',
      maxResults: '20',
      q: query,
      key: YOUTUBE_API_KEY,
      type: 'video',
      videoCategoryId: '10',
    });

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error('YouTube API request failed');
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error searching YouTube:', error);
    return [];
  }
}

export function getYouTubeVideoId(url: string) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
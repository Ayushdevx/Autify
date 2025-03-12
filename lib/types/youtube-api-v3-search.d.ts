declare module 'youtube-api-v3-search' {
  interface YouTubeSearchOptions {
    q?: string;
    part?: string;
    type?: string;
    maxResults?: string | number;
    pageToken?: string;
    key: string;
    videoCategoryId?: string;
  }

  interface YouTubeSearchResponse {
    kind: string;
    etag: string;
    nextPageToken?: string;
    prevPageToken?: string;
    pageInfo: {
      totalResults: number;
      resultsPerPage: number;
    };
    items: Array<{
      kind: string;
      etag: string;
      id: {
        kind: string;
        videoId: string;
      };
      snippet: {
        publishedAt: string;
        channelId: string;
        title: string;
        description: string;
        thumbnails: {
          default: {
            url: string;
            width: number;
            height: number;
          };
          medium: {
            url: string;
            width: number;
            height: number;
          };
          high: {
            url: string;
            width: number;
            height: number;
          };
        };
        channelTitle: string;
        liveBroadcastContent: string;
        publishTime: string;
      };
    }>;
  }

  function youtubeSearch(
    options: YouTubeSearchOptions
  ): Promise<YouTubeSearchResponse>;

  export default youtubeSearch;
}
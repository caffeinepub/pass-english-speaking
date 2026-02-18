import Text "mo:core/Text";
import Time "mo:core/Time";
import Map "mo:core/Map";
import OutCall "http-outcalls/outcall";

actor {
  type NewsCache = {
    cachedData : Text;
    lastUpdate : Time.Time;
  };

  let newsCaches = Map.empty<Text, NewsCache>();
  let oneDay = 24 * 60 * 60 * 1_000_000_000 : Int;

  // GNews API URLs for each region (with correct West Bengal string)
  let gnewsEndpoints = Map.fromIter(
    [
      ("israel", "https://gnews.io/api/v4/top-headlines?country=il&lang=en&max=10&apikey="),
      ("uae", "https://gnews.io/api/v4/top-headlines?country=ae&lang=en&max=10&apikey="),
      ("india", "https://gnews.io/api/v4/top-headlines?country=in&lang=en&max=10&apikey="),
      ("west_bengal", "https://gnews.io/api/v4/search?q=%27west%20bengal%27&lang=en&max=10&apikey="),
    ].values(),
  );

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func shouldFetchNews(cache : NewsCache) : Bool {
    Time.now() - cache.lastUpdate > oneDay;
  };

  func fetchAndCacheNews(endpoint : Text, region : Text, apiKey : Text) : async Text {
    let url = endpoint # apiKey;
    let response = await OutCall.httpGetRequest(url, [], transform);
    let cacheEntry : NewsCache = { cachedData = response; lastUpdate = Time.now() };
    newsCaches.add(region, cacheEntry);
    response;
  };

  func getOrUpdateNews(region : Text, apiKey : Text) : async Text {
    switch (gnewsEndpoints.get(region)) {
      case (null) {
        "Region not found in supported endpoints.";
      };
      case (?endpoint) {
        switch (newsCaches.get(region)) {
          case (null) {
            // No cache exists, fetch new data
            await fetchAndCacheNews(endpoint, region, apiKey);
          };
          case (?cache) {
            if (shouldFetchNews(cache)) {
              // Cache expired, fetch new data
              await fetchAndCacheNews(endpoint, region, apiKey);
            } else {
              // Return cached data
              cache.cachedData;
            };
          };
        };
      };
    };
  };

  public shared ({ caller }) func getNews(region : Text, apiKey : Text) : async Text {
    await getOrUpdateNews(region, apiKey);
  };

  public shared ({ caller }) func forceRefreshNews(region : Text, apiKey : Text) : async Text {
    switch (gnewsEndpoints.get(region)) {
      case (null) {
        "Region not found in supported endpoints.";
      };
      case (?endpoint) {
        await fetchAndCacheNews(endpoint, region, apiKey);
      };
    };
  };
};

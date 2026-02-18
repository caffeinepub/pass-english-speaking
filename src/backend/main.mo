import Map "mo:core/Map";
import Time "mo:core/Time";
import OutCall "http-outcalls/outcall";
import Migration "migration";

(with migration = Migration.run)
actor {
  type NewsCache = {
    cachedData : Text;
    lastUpdate : Time.Time;
  };

  let newsCaches = Map.empty<Text, NewsCache>();
  let oneDay = 24 * 60 * 60 * 1_000_000_000 : Int;
  let gnewsApiKey = "Authenticator:fb4b063ea97e91be0b5e693df120f3ce";
  let usGeneralEndpoint = "https://gnews.io/api/v4/top-headlines?category=general&country=us&lang=en&max=20";
  let indiaGeneralEndpoint = "https://gnews.io/api/v4/top-headlines?category=general&country=in&lang=en&max=20";

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func shouldFetchNews(cache : NewsCache) : Bool {
    Time.now() - cache.lastUpdate > oneDay;
  };

  func fetchAndCacheNews(endpoint : Text, cacheKey : Text) : async Text {
    let response = await OutCall.httpGetRequest(
      endpoint,
      [{ name = "Authorization"; value = gnewsApiKey }],
      transform,
    );
    let cacheEntry : NewsCache = { cachedData = response; lastUpdate = Time.now() };
    newsCaches.add(cacheKey, cacheEntry);
    response;
  };

  public shared ({ caller }) func getNews() : async Text {
    await getCachedOrFetch("us_general", usGeneralEndpoint);
  };

  public shared ({ caller }) func forceRefreshNews() : async Text {
    await fetchAndCacheNews(usGeneralEndpoint, "us_general");
  };

  public shared ({ caller }) func getIndiaNews() : async Text {
    await getCachedOrFetch("india_general", indiaGeneralEndpoint);
  };

  public shared ({ caller }) func forceRefreshIndiaNews() : async Text {
    await fetchAndCacheNews(indiaGeneralEndpoint, "india_general");
  };

  func getCachedOrFetch(cacheKey : Text, endpoint : Text) : async Text {
    switch (newsCaches.get(cacheKey)) {
      case (null) { await fetchAndCacheNews(endpoint, cacheKey) };
      case (?cache) {
        if (shouldFetchNews(cache)) {
          await fetchAndCacheNews(endpoint, cacheKey);
        } else {
          cache.cachedData;
        };
      };
    };
  };
};

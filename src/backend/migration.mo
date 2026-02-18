import Map "mo:core/Map";

module {
  type NewsCache = {
    cachedData : Text;
    lastUpdate : Int;
  };

  type OldActor = {
    newsCaches : Map.Map<Text, NewsCache>;
  };

  public func run(old : OldActor) : { newsCaches : Map.Map<Text, NewsCache> } {
    let filteredNewsCaches = old.newsCaches.filter(
      func(key, _) { key == "us_general" }
    );
    { newsCaches = filteredNewsCaches };
  };
};

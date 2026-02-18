import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import OutCall "http-outcalls/outcall";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Types
  public type UserProfile = { name : Text };

  public type TestAttempt = {
    user : Principal;
    score : Nat;
    completionTime : Time.Time;
  };

  public type CourseProgress = {
    var currentUnlockedDay : Nat;
    var completedDays : Nat;
  };

  public type NewsCache = {
    cachedData : Text;
    lastUpdate : Time.Time;
  };

  public type InterviewAnalysis = {
    question : Text;
    answer : Text;
    feedback : Text;
    timestamp : Time.Time;
  };

  public type ProgressReport = {
    interviews : [InterviewAnalysis];
  };

  // System State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var userProfiles = Map.empty<Principal, UserProfile>();
  var day1TestAttempts = Map.empty<Principal, TestAttempt>();
  var courseProgress = Map.empty<Principal, CourseProgress>();
  var progressFlags = Map.empty<Principal, Bool>();
  var newsCaches = Map.empty<Text, NewsCache>();
  var progressReports = Map.empty<Principal, ProgressReport>();

  let oneDay = 24 * 60 * 60 * 1_000_000_000 : Int;
  let usGeneralEndpoint = "https://gnews.io/api/v4/top-headlines?category=general&country=us&lang=en&max=20&apikey=YOUR_API_KEY";
  let indiaSearchEndpoint = "https://gnews.io/api/v4/search?q=india&lang=en&apikey=C2ed972df55f15f5e63ce84cdbb65341";

  // ===== User Profile Management =====

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    _requireUserRole(caller);
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    _requireSelfOrAdmin(caller, user);
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    _requireUserRole(caller);
    userProfiles.add(caller, profile);
  };

  // ===== Test Score Handling =====

  public shared ({ caller }) func handleScore(score : Nat) : async Text {
    _requireUserRole(caller);

    let attempt : TestAttempt = {
      user = caller;
      score = score;
      completionTime = Time.now();
    };
    day1TestAttempts.add(caller, attempt);

    if (score >= 150 and score <= 200) {
      progressFlags.add(caller, true);
      switch (courseProgress.get(caller)) {
        case (?progress) {
          progress.currentUnlockedDay := 2;
          progress.completedDays := 1;
        };
        case (null) {
          let newProgress = {
            var currentUnlockedDay = 2;
            var completedDays = 1;
          };
          courseProgress.add(caller, newProgress);
        };
      };
      "Success! Day 2 is now unlocked. Please continue.";
    } else if (score < 50) {
      "Fail! Please review Day 1 stories again.";
    } else {
      "Test incomplete. Score must be 150+ to pass. Try again.";
    };
  };

  // ===== Test Attempts Queries =====

  public query ({ caller }) func getDay1TestAttempts(user : Principal) : async [TestAttempt] {
    _requireSelfOrAdmin(caller, user);
    switch (day1TestAttempts.get(user)) {
      case (?attempt) { [attempt] };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getUserHighScore(user : Principal) : async ?Nat {
    _requireSelfOrAdmin(caller, user);

    switch (day1TestAttempts.get(user)) {
      case (?attempt) { ?attempt.score };
      case (null) { null };
    };
  };

  // ===== Course Progress Functions =====

  public query ({ caller }) func getCourseProgress(user : Principal) : async (Nat, Nat) {
    _requireSelfOrAdmin(caller, user);

    switch (courseProgress.get(user)) {
      case (null) { (1, 0) };
      case (?progress) { (progress.currentUnlockedDay, progress.completedDays) };
    };
  };

  public query ({ caller }) func getAllCompletedDays() : async [Nat] {
    _requireUserRole(caller);

    switch (courseProgress.get(caller)) {
      case (null) { [] };
      case (?progress) {
        if (progress.completedDays >= 1) { [1] } else { [] };
      };
    };
  };

  public query ({ caller }) func isDayUnlocked(user : Principal, day : Nat) : async Bool {
    _requireSelfOrAdmin(caller, user);

    if (day == 1) { return true };

    switch (courseProgress.get(user)) {
      case (null) { false };
      case (?progress) { day <= progress.currentUnlockedDay };
    };
  };

  public query ({ caller }) func getNextLockedDay(user : Principal) : async Nat {
    _requireSelfOrAdmin(caller, user);

    switch (courseProgress.get(user)) {
      case (null) { 2 };
      case (?progress) { progress.currentUnlockedDay + 1 };
    };
  };

  public query ({ caller }) func hasUserPassedTest(day : Nat) : async Bool {
    _requireUserRole(caller);

    if (day == 1) {
      switch (progressFlags.get(caller)) {
        case (?state) { state };
        case (null) { false };
      };
    } else {
      false;
    };
  };

  public query ({ caller }) func isDayLocked(day : Nat) : async Bool {
    _requireUserRole(caller);

    if (day == 1) { return false };

    switch (courseProgress.get(caller)) {
      case (null) { true };
      case (?progress) { day > progress.currentUnlockedDay };
    };
  };

  public query ({ caller }) func getCompletedDaysCount() : async Nat {
    _requireUserRole(caller);

    switch (courseProgress.get(caller)) {
      case (null) { 0 };
      case (?progress) { progress.completedDays };
    };
  };

  public query ({ caller }) func getUnlockedDaysCount() : async Nat {
    _requireUserRole(caller);

    switch (courseProgress.get(caller)) {
      case (null) { 1 };
      case (?progress) { progress.currentUnlockedDay };
    };
  };

  // ===== Admin Functions =====

  public shared ({ caller }) func unlockDayForUser(user : Principal) : async () {
    _requireAdmin(caller);

    switch (courseProgress.get(user)) {
      case (?progress) {
        progress.currentUnlockedDay := progress.currentUnlockedDay + 1;
      };
      case (null) {
        let newProgress = {
          var currentUnlockedDay = 2;
          var completedDays = 0;
        };
        courseProgress.add(user, newProgress);
      };
    };
  };

  public shared ({ caller }) func resetProgress() : async () {
    _requireUserRole(caller);

    progressFlags.add(caller, false);
    let progress = {
      var currentUnlockedDay = 1;
      var completedDays = 0;
    };
    courseProgress.add(caller, progress);
  };

  // ===== News Functions (Public Access) =====

  func shouldFetchNews(cache : NewsCache) : Bool {
    Time.now() - cache.lastUpdate > oneDay;
  };

  func fetchAndCacheNews(endpoint : Text, cacheKey : Text) : async Text {
    let response = await OutCall.httpGetRequest(
      endpoint,
      [],
      transform,
    );
    let cacheEntry : NewsCache = { cachedData = response; lastUpdate = Time.now() };
    newsCaches.add(cacheKey, cacheEntry);
    response;
  };

  func getCachedOrFetch(cacheKey : Text, endpoint : Text) : async Text {
    switch (newsCaches.get(cacheKey)) {
      case (null) { await fetchAndCacheNews(endpoint, cacheKey) };
      case (?cache) {
        if (shouldFetchNews(cache)) {
          await fetchAndCacheNews(cacheKey, endpoint);
        } else {
          cache.cachedData;
        };
      };
    };
  };

  public shared ({ caller }) func getNews() : async Text {
    await getCachedOrFetch("us_general", usGeneralEndpoint);
  };

  public shared ({ caller }) func forceRefreshNews() : async Text {
    _requireAdmin(caller);
    await fetchAndCacheNews(usGeneralEndpoint, "us_general");
  };

  public shared ({ caller }) func getIndiaNews() : async Text {
    await getCachedOrFetch("india_search", indiaSearchEndpoint);
  };

  public shared ({ caller }) func forceRefreshIndiaNews() : async Text {
    _requireAdmin(caller);
    await fetchAndCacheNews(indiaSearchEndpoint, "india_search");
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // ===== Progress Report Functions (NEW) =====

  public shared ({ caller }) func addInterviewAnalysis(question : Text, answer : Text, feedback : Text) : async () {
    _requireUserRole(caller);

    let newEntry : InterviewAnalysis = {
      question;
      answer;
      feedback;
      timestamp = Time.now();
    };

    switch (progressReports.get(caller)) {
      case (null) {
        let newReport : ProgressReport = {
          interviews = [newEntry];
        };
        progressReports.add(caller, newReport);
      };
      case (?report) {
        let updatedEntries = report.interviews.concat([newEntry]);
        let updatedReport : ProgressReport = {
          interviews = updatedEntries;
        };
        progressReports.add(caller, updatedReport);
      };
    };
  };

  public query ({ caller }) func getInterviewAnalysis(user : Principal) : async [InterviewAnalysis] {
    _requireSelfOrAdmin(caller, user);
    switch (progressReports.get(user)) {
      case (null) { [] };
      case (?report) { report.interviews };
    };
  };

  public query ({ caller }) func getMyProgressReport() : async [InterviewAnalysis] {
    _requireUserRole(caller);
    switch (progressReports.get(caller)) {
      case (null) { [] };
      case (?report) { report.interviews };
    };
  };

  public shared ({ caller }) func clearMyProgressReport() : async () {
    _requireUserRole(caller);
    progressReports.remove(caller);
  };

  // ===== Access Control Utility Methods =====
  func _requireUserRole(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
  };

  func _requireAdmin(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  func _requireSelfOrAdmin(caller : Principal, user : Principal) {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only perform this action for yourself");
    };
  };
};

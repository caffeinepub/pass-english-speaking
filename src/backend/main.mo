import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import OutCall "http-outcalls/outcall";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

import Nat "mo:core/Nat";


actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

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

  // Streak info internal persistent type (var fields)
  public type StreakInfoPersistent = {
    var currentStreak : Nat;
    var lastCompletionDate : Nat;
  };

  // Streak info public API type (immutable)
  public type StreakInfo = {
    currentStreak : Nat;
    lastCompletionDate : Nat;
  };

  public type Badge = {
    name : Text;
    description : Text;
    dateAwarded : Nat;
  };

  public type WordEntry = {
    word : Text;
    meaning : Text;
    savedAt : Nat;
  };

  // State variables/persistent data
  var userProfiles = Map.empty<Principal, UserProfile>();
  var day1TestAttempts = Map.empty<Principal, TestAttempt>();
  var courseProgress = Map.empty<Principal, CourseProgress>();
  var progressFlags = Map.empty<Principal, Bool>();
  var newsCaches = Map.empty<Text, NewsCache>();
  var progressReports = Map.empty<Principal, ProgressReport>();
  var dailyStreaks = Map.empty<Principal, StreakInfoPersistent>();
  var userBadges = Map.empty<Principal, [Badge]>();
  var wordBanks = Map.empty<Principal, [WordEntry]>();

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

  // ===== Streak Functionality =====
  public shared ({ caller }) func updateStreak(hasCompletedToday : Bool) : async StreakInfo {
    _requireUserRole(caller);

    let today = 0;

    switch (dailyStreaks.get(caller)) {
      case (null) {
        let newStreak = {
          var currentStreak = if (hasCompletedToday) { 1 } else { 0 };
          var lastCompletionDate = if (hasCompletedToday) { today } else { 0 };
        };
        dailyStreaks.add(caller, newStreak);
        {
          currentStreak = newStreak.currentStreak;
          lastCompletionDate = newStreak.lastCompletionDate;
        };
      };
      case (?existingStreak) {
        if (hasCompletedToday) {
          let daysSince = if (existingStreak.lastCompletionDate > today) {
            0;
          } else {
            assert true;
            today - existingStreak.lastCompletionDate;
          };

          let newStreakValue = if (existingStreak.lastCompletionDate == today) {
            existingStreak.currentStreak
          } else if (daysSince == 1) {
            existingStreak.currentStreak + 1;
          } else {
            1;
          };
          existingStreak.currentStreak := newStreakValue;
          existingStreak.lastCompletionDate := today;
        };
        {
          currentStreak = existingStreak.currentStreak;
          lastCompletionDate = existingStreak.lastCompletionDate;
        };
      };
    };
  };

  public query ({ caller }) func getCurrentStreak() : async Nat {
    _requireUserRole(caller);
    switch (dailyStreaks.get(caller)) {
      case (null) { 0 };
      case (?streak) { streak.currentStreak };
    };
  };

  public query ({ caller }) func getLastStreakCompletionDate() : async Nat {
    _requireUserRole(caller);
    switch (dailyStreaks.get(caller)) {
      case (null) { 0 };
      case (?streak) { streak.lastCompletionDate };
    };
  };

  // ===== Badge System =====
  func _awardBadgesBasedOnStreakInternal(user : Principal, currentStreak : Nat) : [Badge] {
    let today = 0;

    var badgesToAdd : [Badge] = [];

    let streakMilestones = [
      (10, "Bronze Medal", "Awarded for achieving a 10-day streak!"),
      (30, "Silver Medal", "Awarded for sustaining a 30-day streak!"),
      (60, "UPSC Warrior Certificate", "Awarded for an impressive 60-day learning streak!"),
    ];

    for ((threshold, name, description) in streakMilestones.vals()) {
      if (currentStreak >= threshold and not _hasBadgeInternal(user, name)) {
        let newBadge : Badge = {
          name;
          description;
          dateAwarded = today;
        };
        badgesToAdd := badgesToAdd.concat([newBadge]);
      };
    };

    if (badgesToAdd.size() > 0) {
      let existingBadges = switch (userBadges.get(user)) {
        case (null) { [] };
        case (?badges) { badges };
      };
      userBadges.add(user, existingBadges.concat(badgesToAdd));
    };

    badgesToAdd;
  };

  public query ({ caller }) func getUserBadges() : async [Badge] {
    _requireUserRole(caller);
    switch (userBadges.get(caller)) {
      case (null) { [] };
      case (?badges) { badges };
    };
  };

  func _hasBadgeInternal(user : Principal, badgeName : Text) : Bool {
    switch (userBadges.get(user)) {
      case (null) { false };
      case (?badges) {
        badges.find<Badge>(func(b) { b.name == badgeName }) != null;
      };
    };
  };

  // ===== Word Bank/Dictionary Functionality =====
  public shared ({ caller }) func saveWord(word : Text, meaning : Text) : async () {
    _requireUserRole(caller);
    let today = 0;
    let newEntry : WordEntry = {
      word;
      meaning;
      savedAt = today;
    };
    let existingWords = switch (wordBanks.get(caller)) {
      case (null) { [] };
      case (?words) { words };
    };
    wordBanks.add(caller, existingWords.concat([newEntry]));
  };

  public query ({ caller }) func getWordBank() : async [WordEntry] {
    _requireUserRole(caller);
    switch (wordBanks.get(caller)) {
      case (null) { [] };
      case (?words) { words };
    };
  };

  public shared ({ caller }) func removeWord(word : Text) : async () {
    _requireUserRole(caller);

    let existingWords = switch (wordBanks.get(caller)) {
      case (null) { [] };
      case (?words) { words };
    };
    let filtered = existingWords.filter(
      func(entry) { entry.word != word },
    );
    wordBanks.add(caller, filtered);
  };

  // ===== Learning Content Integration =====
  public shared ({ caller }) func updateStreakAndAward(hasCompletedTestToday : Bool) : async StreakInfo {
    _requireUserRole(caller);

    let streak = await updateStreak(hasCompletedTestToday);
    let _ = _awardBadgesBasedOnStreakInternal(caller, streak.currentStreak);
    streak;
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
          await fetchAndCacheNews(endpoint, cacheKey);
        } else {
          cache.cachedData;
        };
      };
    };
  };

  public shared func getNews() : async Text {
    await getCachedOrFetch("us_general", usGeneralEndpoint);
  };

  public shared ({ caller }) func forceRefreshNews() : async Text {
    _requireAdmin(caller);
    await fetchAndCacheNews(usGeneralEndpoint, "us_general");
  };

  public shared func getIndiaNews() : async Text {
    await getCachedOrFetch("india_search", indiaSearchEndpoint);
  };

  public shared ({ caller }) func forceRefreshIndiaNews() : async Text {
    _requireAdmin(caller);
    await fetchAndCacheNews(indiaSearchEndpoint, "india_search");
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // ===== Progress Report Functions =====
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

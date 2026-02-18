import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type TestAttempt = {
    user : Principal.Principal;
    score : Nat;
    completionTime : Int;
  };

  type CourseProgress = {
    var currentUnlockedDay : Nat;
    var completedDays : Nat;
  };

  type NewsCache = {
    cachedData : Text;
    lastUpdate : Int;
  };

  type InterviewAnalysis = {
    question : Text;
    answer : Text;
    feedback : Text;
    timestamp : Int;
  };

  type ProgressReport = { interviews : [InterviewAnalysis] };

  // Old actor state.
  type OldActor = {
    day1TestAttempts : Map.Map<Principal.Principal, TestAttempt>;
    courseProgress : Map.Map<Principal.Principal, CourseProgress>;
    boolMap : Map.Map<Principal.Principal, Bool>;
    newsCaches : Map.Map<Text, NewsCache>;
    progressReports : Map.Map<Principal.Principal, ProgressReport>;
    userProfiles : Map.Map<Principal.Principal, { name : Text }>;
  };

  // New actor state.
  type NewActor = {
    day1TestAttempts : Map.Map<Principal.Principal, TestAttempt>;
    courseProgress : Map.Map<Principal.Principal, CourseProgress>;
    progressFlags : Map.Map<Principal.Principal, Bool>;
    newsCaches : Map.Map<Text, NewsCache>;
    progressReports : Map.Map<Principal.Principal, ProgressReport>;
    userProfiles : Map.Map<Principal.Principal, { name : Text }>;
  };

  // Migration logic.
  public func run(old : OldActor) : NewActor {
    {
      old with
      progressFlags = old.boolMap
    };
  };
};

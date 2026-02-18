import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  type UserProfile = { name : Text };

  type TestAttempt = {
    user : Principal;
    score : Nat;
    completionTime : Time.Time;
  };

  type CourseProgress = {
    var currentUnlockedDay : Nat;
    var completedDays : Nat;
  };

  type NewsCache = {
    cachedData : Text;
    lastUpdate : Time.Time;
  };

  // Old actor type (without InterviewAnalysis/ProgressReport)
  type OldActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    day1TestAttempts : Map.Map<Principal, TestAttempt>;
    courseProgress : Map.Map<Principal, CourseProgress>;
    boolMap : Map.Map<Principal, Bool>;
    newsCaches : Map.Map<Text, NewsCache>;
  };

  // New types for Progress Report feature
  type InterviewAnalysis = {
    question : Text;
    answer : Text;
    feedback : Text;
    timestamp : Time.Time;
  };

  type ProgressReport = {
    interviews : [InterviewAnalysis];
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    day1TestAttempts : Map.Map<Principal, TestAttempt>;
    courseProgress : Map.Map<Principal, CourseProgress>;
    boolMap : Map.Map<Principal, Bool>;
    newsCaches : Map.Map<Text, NewsCache>;
    progressReports : Map.Map<Principal, ProgressReport>;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      progressReports = Map.empty<Principal, ProgressReport>()
    };
  };
};

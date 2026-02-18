import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_header {
    value: string;
    name: string;
}
export interface WordEntry {
    meaning: string;
    word: string;
    savedAt: bigint;
}
export interface TestAttempt {
    completionTime: Time;
    user: Principal;
    score: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface StreakInfo {
    lastCompletionDate: bigint;
    currentStreak: bigint;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Badge {
    name: string;
    description: string;
    dateAwarded: bigint;
}
export interface InterviewAnalysis {
    question: string;
    feedback: string;
    answer: string;
    timestamp: Time;
}
export interface UserProfile {
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addInterviewAnalysis(question: string, answer: string, feedback: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearMyProgressReport(): Promise<void>;
    forceRefreshIndiaNews(): Promise<string>;
    forceRefreshNews(): Promise<string>;
    getAllCompletedDays(): Promise<Array<bigint>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCompletedDaysCount(): Promise<bigint>;
    getCourseProgress(user: Principal): Promise<[bigint, bigint]>;
    getCurrentStreak(): Promise<bigint>;
    getDay1TestAttempts(user: Principal): Promise<Array<TestAttempt>>;
    getIndiaNews(): Promise<string>;
    getInterviewAnalysis(user: Principal): Promise<Array<InterviewAnalysis>>;
    getLastStreakCompletionDate(): Promise<bigint>;
    getMyProgressReport(): Promise<Array<InterviewAnalysis>>;
    getNews(): Promise<string>;
    getNextLockedDay(user: Principal): Promise<bigint>;
    getUnlockedDaysCount(): Promise<bigint>;
    getUserBadges(): Promise<Array<Badge>>;
    getUserHighScore(user: Principal): Promise<bigint | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWordBank(): Promise<Array<WordEntry>>;
    handleScore(score: bigint): Promise<string>;
    hasUserPassedTest(day: bigint): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isDayLocked(day: bigint): Promise<boolean>;
    isDayUnlocked(user: Principal, day: bigint): Promise<boolean>;
    removeWord(word: string): Promise<void>;
    resetProgress(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveWord(word: string, meaning: string): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    unlockDayForUser(user: Principal): Promise<void>;
    updateStreak(hasCompletedToday: boolean): Promise<StreakInfo>;
    updateStreakAndAward(hasCompletedTestToday: boolean): Promise<StreakInfo>;
}

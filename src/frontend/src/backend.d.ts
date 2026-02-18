import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
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
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface UserProfile {
    name: string;
}
export interface http_header {
    value: string;
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    forceRefreshIndiaNews(): Promise<string>;
    forceRefreshNews(): Promise<string>;
    getAllCompletedDays(): Promise<Array<bigint>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCompletedDaysCount(): Promise<bigint>;
    getCourseProgress(user: Principal): Promise<[bigint, bigint]>;
    getDay1TestAttempts(user: Principal): Promise<Array<TestAttempt>>;
    getIndiaNews(): Promise<string>;
    getNews(): Promise<string>;
    getUnlockedDaysCount(): Promise<bigint>;
    getUserHighScore(user: Principal): Promise<bigint | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    handleDayPassed(day: bigint, score: bigint): Promise<void>;
    handleScore(score: bigint): Promise<string>;
    hasTestPassed(day: bigint): Promise<boolean>;
    hasUserPassedTest(day: bigint): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isDayLocked(day: bigint): Promise<boolean>;
    isDayUnlocked(user: Principal, day: bigint): Promise<boolean>;
    isFutureDayLocked(user: Principal): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    unlockDayForUser(user: Principal): Promise<void>;
    updateCourseProgress(): Promise<void>;
}

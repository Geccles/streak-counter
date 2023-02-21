import { describe, it, expect, beforeEach, afterEach } from "vitest"

import { JSDOM } from "jsdom"
import { streakCounter } from "../src/index"

export function formattedDate(date: Date): string {
  return date.toLocaleDateString("en-US")
}

describe("streakCounter", () => {
  let mockLocalStorage: Storage

  beforeEach(() => {
    const mockJSDom = new JSDOM("", { url: "https://localhost" })

    mockLocalStorage = mockJSDom.window.localStorage
  })

  afterEach(() => {
    mockLocalStorage.clear()
  })

  it("should return a streak object with currentCount, startDate and lastLoginDate", () => {
    const date = new Date()
    const streak = streakCounter(mockLocalStorage, date)

    expect(streak.hasOwnProperty("currentCount")).toBe(true)
    expect(streak.hasOwnProperty("startDate")).toBe(true)
    expect(streak.hasOwnProperty("lastLoginDate")).toBe(true)
  })
  it("should return a streak starting at 1 and keep track of lastLoginDate", () => {
    const date = new Date()
    const streak = streakCounter(mockLocalStorage, date)

    const dateFormatted = formattedDate(date)

    expect(streak.currentCount).toBe(1)
    expect(streak.lastLoginDate).toBe(dateFormatted)
  })
  it("should store the steak in localStorage", () => {
    const date = new Date()
    const key = "streak"
    streakCounter(mockLocalStorage, date)

    const streakFromLocalStorage = mockLocalStorage.getItem(key)
    expect(streakFromLocalStorage).not.toBeNull()
  })

  describe("with a pre-populated streak", () => {
    let mockLocalStorage: Storage
    beforeEach(() => {
      const mockJSDom = new JSDOM("", { url: "https://localhost" })

      mockLocalStorage = mockJSDom.window.localStorage

      // Use date in past so it’s always the same
      const date = new Date("2/19/2023")

      const streak = {
        currentCount: 1,
        startDate: formattedDate(date),
        lastLoginDate: formattedDate(date),
      }

      mockLocalStorage.setItem("streak", JSON.stringify(streak))
    })
    afterEach(() => {
      mockLocalStorage.clear()
    })
    it("should return the streak from localStorage", () => {
      const date = new Date("2/19/2023")
      const streak = streakCounter(mockLocalStorage, date)

      expect(streak.startDate).toBe("2/19/2023")
    })
    it("should increment the streak count", () => {
      const date = new Date("2/20/2023")
      const streak = streakCounter(mockLocalStorage, date)
      expect(streak.currentCount).toBe(2)
    })
    it("should not increment the streak when login days not consecutive", () => {
      const date = new Date("2/21/2023")
      const streak = streakCounter(mockLocalStorage, date)

      expect(streak.currentCount).toBe(1)
    })
    it("should save the incremented streak to localStorage", () => {
      const key = "streak"
      const date = new Date("2/20/2023")
      streakCounter(mockLocalStorage, date)

      const streakAsString = mockLocalStorage.getItem("streak")
      const streak = JSON.parse(streakAsString || "")
      expect(streak.currentCount).toBe(2)
    })
    it("should reset if not consecutive", () => {
      const date = new Date("2/20/2023")
      const streak = streakCounter(mockLocalStorage, date)

      expect(streak.currentCount).toBe(2)

      // break the streak
      const updatedDate = new Date("2/22/2023")

      const streakUpdated = streakCounter(mockLocalStorage, updatedDate)

      // starts a new streak
      expect(streakUpdated.currentCount).toBe(1)
    })
    it("should not reset the streak for same-day login", () => {
      const date = new Date("2/19/2023")
      const streakUpdated = streakCounter(mockLocalStorage, date)

      expect(streakUpdated.currentCount).toBe(1)
    })
    it("should save the reset streak to localStorage", () => {
      const key = "streak"
      const date = new Date("2/20/2023")
      streakCounter(mockLocalStorage, date)

      // Skip a day and break the streak
      const dateUpdated = new Date("2/22/2023")
      const streakUpdated = streakCounter(mockLocalStorage, dateUpdated)

      const streakAsString = mockLocalStorage.getItem(key)
      const streak = JSON.parse(streakAsString || "")

      expect(streak.currentCount).toBe(1)
    })
  })
})

import { formattedDate } from "../__tests__/index.test"

interface Streak {
    currentCount: number
    startDate: string
    lastLoginDate: string
}

function differenceInDays(dateLeft: Date, dateRight: Date): number {
    const diffTime = Math.abs(dateLeft.getTime() - dateRight.getTime())
    const differenceInDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return differenceInDays
}

function incrementOrResetStreak(currentDate: Date, lastLoginDate: string): "increment" | "none" | "reset" {
    const difference = differenceInDays(currentDate, new Date(lastLoginDate))
    if (difference === 0) return "none"
    if (difference === 1) return "increment"
    return "reset"
}

export function streakCounter(_localStorage: Storage, date: Date): Streak {
    const resetStreak = {
        currentCount: 1,
        startDate: formattedDate(date),
        lastLoginDate: formattedDate(date)
    }
    const streakInLocalStorage = _localStorage.getItem("streak")
    if (streakInLocalStorage) {
      try {
        const streak = JSON.parse(streakInLocalStorage || "") as Streak
        const streakStatus = incrementOrResetStreak(date, streak.lastLoginDate)
        if (streakStatus === "increment") {
            const updatedStreak: Streak = { ...streak, currentCount: streak.currentCount += 1 }
            _localStorage.setItem("streak", JSON.stringify(updatedStreak))
            return updatedStreak
        }
        if (streakStatus === "reset") {
            _localStorage.setItem("streak", JSON.stringify(resetStreak))
            return resetStreak
        }
        if (streakStatus === "none") return streak
        return streak
      } catch (error) {
        console.error("Failed to parse streak from localStorage")
      }
    }

    _localStorage.setItem("streak", JSON.stringify(resetStreak))

    return resetStreak
}

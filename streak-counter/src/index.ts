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

function incrementOrResetStreak(currentDate: Date, lastLoginDate: string): "increment" | undefined {
    const difference = differenceInDays(currentDate, new Date(lastLoginDate))
    if (difference === 1) return "increment"
    return undefined
}
export function streakCounter(_localStorage: Storage, date: Date): Streak {
    const streakInLocalStorage = _localStorage.getItem("streak")
    if (streakInLocalStorage) {
      try {
        const streak = JSON.parse(streakInLocalStorage || "") as Streak
        const shouldIncrement = incrementOrResetStreak(date, streak.lastLoginDate)
        if (shouldIncrement === "increment") {
            const updatedStreak: Streak = { ...streak, currentCount: streak.currentCount += 1 }
            _localStorage.setItem("streak", JSON.stringify(updatedStreak))
            return updatedStreak
        }
        return streak
      } catch (error) {
        console.error("Failed to parse streak from localStorage")
      }
    }

    const streak = {
        currentCount: 1,
        startDate: formattedDate(date),
        lastLoginDate: formattedDate(date)
    }

    _localStorage.setItem("streak", JSON.stringify(streak))

    return streak
}

import '@testing-library/jest-dom'

// Clear sessionStorage between tests so Zustand persist state doesn't leak
beforeEach(() => {
  sessionStorage.clear()
})

# Testing Structure

This project uses three different testing approaches, each with its own directory:

## 1. Unit Tests (Vue Test Utils)

Located in: `test/vue-test-utils`

These tests focus on testing individual components in isolation. They use Vue Test Utils to mount components and test their behavior.

**Key characteristics:**
- Test individual components in isolation
- Mock dependencies
- Focus on component API and internal logic
- Fast execution

## 2. Integration Tests (Vue Testing Library)

Located in: `test/vue-testing-library`

These tests focus on how components work together and user interactions. They use Vue Testing Library which encourages testing components the way users interact with them.

**Key characteristics:**
- Test component interactions
- Focus on user behavior rather than implementation details
- Test from the user's perspective
- More realistic testing environment

## 3. Functional Tests (Bun)

Located in: `test/bun`

These tests focus on testing complete features from end to end. They use Bun for fast test execution and can test the entire application flow.

**Key characteristics:**
- Test complete features
- Mock API responses
- Test application flow
- End-to-end testing approach

**Run with:**
```bash
bun --bun run test:bun
```

## Running All Tests

To run all tests in sequence:

```bash
bun --bun run test
```


## Test File Naming Convention

- Test files should be named with the `.spec.ts` extension
- Test files should be named after the component or feature they are testing
- Example: `LoginPage.spec.ts` for testing the `LoginPage.vue` component

export const AnswerExperienceConfig = {
    limit:3,
    locale: "en",
    apiKey : "f490c742c95b89f22f991f868d5e161b",
    verticalKey : "locations",
    experienceKey : "turtlehead-tacos-locator",
    experienceVersion: "STAGING",
    locationRadius: 804672,
    sessionTrackingEnabled: true,
    endpoints: {
      universalSearch: "https://liveapi-sandbox.yext.com/v2/accounts/me/answers/query",
      verticalSearch: "https://liveapi-sandbox.yext.com/v2/accounts/me/answers/vertical/query",
      questionSubmission: "https://liveapi-sandbox.yext.com/v2/accounts/me/createQuestion",
      universalAutocomplete: "https://liveapi-sandbox.yext.com/v2/accounts/me/answers/autocomplete",
      verticalAutocomplete: "https://liveapi-sandbox.yext.com/v2/accounts/me/answers/vertical/autocomplete",
      filterSearch: "https://liveapi-sandbox.yext.com/v2/accounts/me/answers/filtersearch",
  
    }
  }
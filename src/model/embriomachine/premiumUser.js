export default class PremiumUser {
  checkPremiumUser(accessCode) {
      return accessCode === "1111111111"
  }

  setPremiumUser() {
    sessionStorage.setItem("embriomachine.isPremiumUser", true);
  }

  isPremiumUser() {
    const isPremiumUser = sessionStorage.getItem("embriomachine.isPremiumUser");

    return isPremiumUser ? true : false;
  }
}

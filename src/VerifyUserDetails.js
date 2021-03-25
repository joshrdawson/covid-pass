export const VerifyUserDetails = (name, NHSNumber, age, postcode) => {
  try {
    // check entered between 1-3 names (forename, middlename, surname)
    var names = name.split(" ");
    if (names.length > 3) {
      throw new Error("Invalid name!");
    }

    // check entered valid NHS Number (3 digits, followed by 3 digits, followed by 4 digits)
    var NHSRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
    var checkNHS = NHSNumber.match(NHSRegex);
    if (checkNHS === null) {
      throw new Error("Invalid NHSNumber!");
    }
    NHSNumber = checkNHS[0];

    // check age is a valid age (1-120)
    if (age < 1 || age > 120) {
      throw new Error("Invalid Age!");
    }

    // check postcode is valid
    var postcodeRegex = /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/;
    var checkPostcode = postcode.match(postcodeRegex);
    if (checkPostcode === null) {
      throw new Error("Invalid postcode!");
    }
    postcode = checkPostcode[0];
    return true;
  } catch (e) {
    console.log("error: ", e);
    window.alert("Error invalid user details: " + e);
    return false;
  }
};

export default VerifyUserDetails;

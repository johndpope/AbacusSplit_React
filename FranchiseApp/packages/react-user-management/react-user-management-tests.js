// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by react-user-management.js.
import { name as packageName } from "meteor/iassureit:react-user-management";

// Write your tests here!
// Here is an example.
Tinytest.add('react-user-management - example', function (test) {
  test.equal(packageName, "react-user-management");
});

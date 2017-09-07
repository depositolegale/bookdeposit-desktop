const fs = require("fs");
const crypto = require("crypto");
var shasum = crypto.createHash("sha256");

exports.calculate_checksum = (file, fn) => {
  var checksum;
  var s = fs.ReadStream(file);
  s.on("data", function(d) {
    shasum.update(d);
  });
  s.on("end", function() {
    checksum = shasum.digest("hex");
    fn(checksum);
  });
};

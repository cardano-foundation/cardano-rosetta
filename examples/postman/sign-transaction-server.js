var express = require("express");
var NaCl = require("tweetnacl");

var app = express();
app.use(express.json({ limit: "1mb" }));

app.post("/sign", function(req, res) {
    let private_key = req.body.private_key
    let public_key = req.body.public_key
    let hex_bytes = req.body.hex_bytes

    const key_pair = NaCl.sign.keyPair.fromSecretKey(Buffer.from(private_key+public_key, "hex"))
    const secret_key = key_pair.secretKey;

    signed_hex_bytes = Buffer.from(
        NaCl.sign.detached(
          Buffer.from(hex_bytes, "hex"),
          secret_key
        )
      ).toString("hex")
    console.log("Successfully signed hex_bytes.")

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({signed_hex_bytes: signed_hex_bytes})
})

app.listen(3773);

const express = require('express');
const { body, validationResult } = require('express-validator');
const NaCl = require('tweetnacl');

const app = express();
app.use(express.json({ limit: "1mb" }));

app.post(
  "/sign",
  body(['private_key', 'public_key', 'hex_bytes']).isString().notEmpty(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { private_key, public_key, hex_bytes } = req.body;
    const key_pair = NaCl.sign.keyPair.fromSecretKey(Buffer.from(private_key+public_key, "hex"));
    const secret_key = key_pair.secretKey;

    const signed_hex_bytes = Buffer.from(
        NaCl.sign.detached(
          Buffer.from(hex_bytes, "hex"),
          secret_key
        )
      ).toString("hex")
    console.log("Successfully signed hex_bytes.");

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({signed_hex_bytes: signed_hex_bytes});
})

app.listen(3773);

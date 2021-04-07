import express from 'express';
import NaCl from 'tweetnacl';

const app = express();
app.use(express.json({ limit: "1mb" }));

app.post("/sign", (req, res) => {

    const private_key = req.body.private_key;
    const public_key = req.body.public_key;
    const hex_bytes = req.body.hex_bytes;

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
